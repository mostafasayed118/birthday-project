# Technical Context — Romantic Microsite Platform

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| Next.js | 16.x | App framework, routing, SSR/SSG |
| TypeScript | 5.x | Type safety, developer experience |
| React | 19.x | UI library |
| Tailwind CSS | 4.x | Utility-first CSS |
| shadcn/ui | latest | Component library (buttons, inputs, dialogs, etc.) |

### Backend / Database

| Technology | Version | Purpose |
|---|---|---|
| Convex | latest | Database, real-time sync, server functions, file storage, auth |

### Tooling

| Tool | Purpose |
|---|---|
| ESLint | Code linting |
| Prettier | Code formatting |
| Git | Version control |

## Architecture Overview

```
┌─────────────────────────────────────────────────┐
│                   CLIENTS                        │
│                                                  │
│  ┌──────────────┐       ┌──────────────────┐    │
│  │  Public Page  │       │ Admin Dashboard   │    │
│  │  (SSR/SSG)   │       │ (CSR + Real-time) │    │
│  └──────┬───────┘       └────────┬─────────┘    │
│         │                        │               │
│         │    Convex Client SDK   │               │
│         │    (real-time queries) │               │
│         │                        │               │
│         ▼                        ▼               │
│  ┌──────────────────────────────────────────┐    │
│  │            CONVEX BACKEND                │    │
│  │                                          │    │
│  │  ┌─────────┐  ┌──────────┐  ┌────────┐ │    │
│  │  │Queries  │  │Mutations │  │Actions │ │    │
│  │  │(read)   │  │(write)   │  │(async) │ │    │
│  │  └─────────┘  └──────────┘  └────────┘ │    │
│  │                                          │    │
│  │  ┌──────────────────────────────────┐    │    │
│  │  │         Convex Database          │    │    │
│  │  │  sites, sections, themes, etc.   │    │    │
│  │  └──────────────────────────────────┘    │    │
│  │                                          │    │
│  │  ┌──────────────────────────────────┐    │    │
│  │  │       Convex File Storage        │    │    │
│  │  │       (images, media)            │    │    │
│  │  └──────────────────────────────────┘    │    │
│  │                                          │    │
│  │  ┌──────────────────────────────────┐    │    │
│  │  │       Convex Auth                │    │    │
│  │  │       (authentication)           │    │    │
│  │  └──────────────────────────────────┘    │    │
│  └──────────────────────────────────────────┘    │
└─────────────────────────────────────────────────┘
```

## Key Technical Decisions

### 1. Next.js 16 App Router

- Use App Router (not Pages Router)
- Public pages: Server-side rendering for SEO and initial load performance
- Dashboard: Client-side rendering with Convex real-time subscriptions
- Route groups: `(public)` for public pages, `(dashboard)` for admin pages

### 2. Convex as Sole Backend

- **Database**: All site data, section content, theme tokens, user data
- **Server Functions**: Queries (read), Mutations (write), Actions (async operations like image processing)
- **Real-time**: Convex's built-in reactivity for live preview in dashboard
- **File Storage**: Convex file storage for images and media
- **Auth**: Convex Auth for admin authentication

### 3. Routing Strategy

```
/                           → Landing page or redirect to dashboard
/dashboard                  → Admin dashboard home
/dashboard/sites            → List user's sites
/dashboard/sites/[siteId]   → Edit specific site
/[slug]                     → Public microsite page (dynamic route)
```

### 4. Data Flow

#### Public Page (Read Path)

```
URL hit → Next.js server → Convex query (site by slug) → 
→ Fetch sections (ordered) → Fetch theme tokens → 
→ Render React components with data → HTML sent to client → 
→ Hydrate with Convex real-time (for live updates if admin is editing)
```

#### Dashboard (Write Path)

```
Dashboard loads → Convex query (site by ID) → 
→ Real-time subscription to site data → 
→ User edits content/sections/theme → 
→ Convex mutation → Auto-save draft → 
→ Real-time update in preview panel → 
→ User clicks Publish → Convex mutation (draft → published)
```

### 5. Real-time Preview Strategy

The dashboard and public page both subscribe to the same Convex data. The preview panel in the dashboard renders the public page component with draft data, while the actual public page renders published data.

- **Dashboard preview**: Subscribes to draft state
- **Public page**: Subscribes to published state
- **On publish**: Published state is updated, public page reactively re-renders

### 6. Image Handling

- Upload via Convex file storage
- Store `storageId` in database
- Use Convex's `getFileUrl()` for rendering
- Images are referenced by `storageId` throughout the system
- Future: Image transformations for optimization

## File Structure (Proposed)

```
romantic-microsite/
├── app/
│   ├── (public)/
│   │   ├── [slug]/
│   │   │   └── page.tsx          # Public microsite page
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   │   ├── page.tsx          # Dashboard home
│   │   │   └── sites/
│   │   │       ├── page.tsx      # Sites list
│   │   │       └── [siteId]/
│   │   │           └── page.tsx  # Site editor
│   │   └── layout.tsx            # Dashboard layout with auth
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing / redirect
├── components/
│   ├── public/                   # Public page section renderers
│   │   ├── sections/
│   │   │   ├── hero-section.tsx
│   │   │   ├── gallery-section.tsx
│   │   │   ├── timeline-section.tsx
│   │   │   ├── quote-section.tsx
│   │   │   ├── message-section.tsx
│   │   │   ├── countdown-section.tsx
│   │   │   └── index.ts
│   │   ├── public-page.tsx
│   │   └── section-renderer.tsx
│   ├── dashboard/                # Dashboard UI components
│   │   ├── section-manager.tsx
│   │   ├── content-editor.tsx
│   │   ├── theme-editor.tsx
│   │   ├── preview-panel.tsx
│   │   └── publish-controls.tsx
│   ├── ui/                       # shadcn/ui components
│   └── shared/                   # Shared components
├── convex/
│   ├── schema.ts                 # Database schema
│   ├── sites.ts                  # Site queries/mutations
│   ├── sections.ts               # Section queries/mutations
│   ├── themes.ts                 # Theme queries/mutations
│   ├── drafts.ts                 # Draft management
│   ├── auth.ts                   # Auth configuration
│   └── files.ts                  # File upload handling
├── lib/
│   ├── utils.ts                  # Utility functions
│   ├── constants.ts              # App constants, section type definitions
│   ├── types.ts                  # Shared TypeScript types
│   └── theme-tokens.ts           # Theme token utilities
├── hooks/
│   ├── use-site.ts               # Site data hook
│   ├── use-sections.ts           # Sections data hook
│   ├── use-theme.ts              # Theme data hook
│   └── use-draft.ts              # Draft state hook
├── memory-bank/                  # Project documentation
│   └── ...
├── tailwind.config.ts
├── convex.json
└── package.json
```

## Assumptions

1. **Next.js 16** is assumed to have stable App Router and is the latest stable release available.
2. **Convex SDK** handles real-time subscriptions natively — no extra WebSocket setup needed.
3. **shadcn/ui** components are installed locally and customized as needed.
4. **No separate CMS service** — Convex IS the CMS backend.
5. **Single deployment** — One Next.js app serves both public pages and dashboard.
6. **Tailwind CSS v4** uses the new CSS-based configuration (if available), otherwise v3 config approach.

## Constraints

- Convex has file storage size limits — may need external storage (S3/Cloudinary) for heavy media use in the future
- Convex free tier has limits on database writes and function calls — monitor for production use
- Next.js SSR with Convex requires proper hydration handling to avoid mismatches
- Real-time subscriptions on public pages could be costly if many visitors — consider disabling real-time on public pages and using polling or static rendering instead
