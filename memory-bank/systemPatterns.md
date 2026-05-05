# System Patterns — Romantic Microsite Platform

## Architectural Patterns

### 1. Data-Driven Rendering

Every visual element on the public page is driven by database content. No hardcoded text, colors, or layouts.

```
Database (Convex) → Query → React Component → DOM
```

**Rule**: If a user can't edit it from the dashboard, it shouldn't be hardcoded in the public page (with the exception of structural HTML scaffolding and CSS utilities).

### 2. Section Composition Pattern

Pages are composed of independent section blocks. Each section:
- Has a unique `type` that maps to a React component
- Has its own content schema (different per type)
- Has its own visibility flag
- Has an ordering index
- Can have optional per-section settings

```
Page = Section[0] + Section[1] + ... + Section[N]
Where each Section = Component(type) + data(content) + config(settings)
```

### 3. Draft-Publish Separation

Data exists in two states:
- **Draft** — The working copy that the editor modifies. Auto-saved on every change.
- **Published** — The version the public sees. Only updated on explicit publish action.

```
Draft state ──(publish action)──> Published state
     ↑                                  ↑
 Dashboard reads                   Public page reads
```

### 4. Real-Time Reactivity

Convex provides real-time queries. When data changes via mutation:
1. Convex server processes mutation
2. Connected clients subscribed to that query receive updates
3. React re-renders with new data

This powers:
- Live preview in dashboard (edit → see immediately)
- Live public page updates (publish → visitors see changes on next query refresh)

### 5. Token-Based Theming

Theme is represented as a set of design tokens stored in the database. These tokens are converted to CSS custom properties and applied at the page level.

```
Database tokens → CSS variables → Tailwind classes / inline styles → Visual output
```

## Code Patterns

### Component Pattern

Every section component follows this interface:

```typescript
interface SectionProps {
  content: SectionContent;    // Type-specific content data
  settings: SectionSettings;  // Type-specific settings
  theme: ThemeTokens;         // Global theme tokens
  isPreview?: boolean;        // Whether rendering in preview mode
}
```

### Hook Pattern

Data hooks wrap Convex queries and provide typed, validated data:

```typescript
// Example: useSite hook
function useSite(siteId: string) {
  const site = useQuery(api.sites.get, { siteId });
  // Returns typed site data or loading/error state
  return { site, isLoading, error };
}
```

### Mutation Pattern

All writes go through Convex mutations with validation:

```typescript
// Example: update content mutation
export const updateContent = mutation({
  args: { siteId, sectionId, content: v.any() },
  handler: async (ctx, args) => {
    // Validate
    // Check authorization
    // Write to draft
    // Return updated data
  },
});
```

### File Upload Pattern

Images are uploaded through Convex file storage:

```
Client → useConvexFileStorage.upload(file) → storageId → 
→ Store storageId in section content → 
→ Render with getFileUrl(storageId)
```

## State Management

### Dashboard State

- **Convex real-time queries** — Primary data source (sites, sections, theme)
- **Local UI state** — Panel open/close, active editor, drag state (React useState/useReducer)
- **Form state** — Content editing forms (React Hook Form or controlled components)
- **No global state library needed** — Convex handles server state, React handles UI state

### Public Page State

- **Convex query** — Site data by slug (read-only)
- **Minimal local state** — Gallery lightbox open/close, countdown timer tick, scroll position
- **No complex state management** — Pages are mostly static once loaded

## Error Handling Patterns

### Dashboard

- Optimistic updates for mutations (show change immediately, rollback on error)
- Toast notifications for mutation success/failure
- Form validation before submission
- Graceful handling of real-time disconnection (show stale data with indicator)

### Public Page

- Fallback UI for missing sections
- Graceful degradation for failed image loads (placeholder)
- 404 page for invalid slugs
- Loading skeleton while data loads

## Security Patterns

1. **Authentication**: Convex Auth required for all dashboard routes
2. **Authorization**: Users can only edit sites they own
3. **Public data**: Published site data is publicly readable (no auth needed for public pages)
4. **Draft data**: Only the site owner can read draft data
5. **No secrets in client**: All sensitive logic runs in Convex functions (server-side)
6. **Slug uniqueness**: Enforced at database level

## Performance Patterns

1. **Public page**: Server-side rendered for fast initial load
2. **Image optimization**: Use Next.js `next/image` with Convex file URLs
3. **Lazy loading**: Below-fold sections load lazily
4. **CSS variables**: Theme tokens applied via CSS custom properties for efficient re-rendering
5. **Minimal JS bundle**: Public page should ship minimal JavaScript (no dashboard code)
6. **Convex caching**: Leverage Convex's built-in caching for repeated queries

## Conventions

### Naming

- **Files**: kebab-case (`hero-section.tsx`)
- **Components**: PascalCase (`HeroSection`)
- **Functions**: camelCase (`updateSectionContent`)
- **Database tables**: camelCase in Convex schema
- **CSS classes**: Tailwind utilities + occasional custom classes in kebab-case

### File Organization

- Group by feature within each directory
- Public page components are separate from dashboard components
- Shared types and utilities in `lib/`
- Convex functions grouped by domain (`sites.ts`, `sections.ts`, `themes.ts`)

### TypeScript

- Strict mode enabled
- All Convex query/mutation return types inferred from schema
- Explicit types for component props
- No `any` types in production code (except Convex JSON fields where necessary)
