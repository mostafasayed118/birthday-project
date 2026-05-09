# Technical Blueprint — Romantic Microsite Platform

> A comprehensive engineering guide for clean, scalable, high-performance development.

---

## Table of Contents

1. [Architecture Principles](#1-architecture-principles)
2. [Directory & File Organization](#2-directory--file-organization)
3. [Development Workflow & Page Creation Order](#3-development-workflow--page-creation-order)
4. [Code Quality Best Practices](#4-code-quality-best-practices)
5. [Performance Optimization](#5-performance-optimization)
6. [Testing Strategy](#6-testing-strategy)
7. [Deployment & CI/CD](#7-deployment--cicd)

---

## 1. Architecture Principles

### 1.1 Design Philosophy

This project follows a **Layered Architecture** within a monolithic Next.js application, with Convex serving as the Backend-as-a-Service (BaaS) layer. The architecture is NOT microservices — it's a **modular monolith** optimized for a small team and rapid iteration.

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│  Next.js App Router (Server Components + Client Components) │
│  ┌──────────────┐  ┌───────────────┐  ┌──────────────────┐ │
│  │ Public Pages  │  │ Dashboard     │  │ Auth Pages       │ │
│  │ (SSR/SSG)    │  │ (CSR + RT)    │  │ (Clerk)          │ │
│  └──────┬───────┘  └───────┬───────┘  └────────┬─────────┘ │
├─────────┼──────────────────┼────────────────────┼───────────┤
│                    APPLICATION LAYER                        │
│  ┌──────────────┐  ┌───────────────┐  ┌──────────────────┐ │
│  │ React Hooks   │  │ Section       │  │ Theme Engine     │ │
│  │ (use-* hooks) │  │ Registry      │  │ (token system)   │ │
│  └──────┬───────┘  └───────┬───────┘  └────────┬─────────┘ │
├─────────┼──────────────────┼────────────────────┼───────────┤
│                    DATA ACCESS LAYER                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Convex Queries, Mutations, Actions       │  │
│  │              (schema.ts, *.ts files)                  │  │
│  └──────────────────────┬───────────────────────────────┘  │
├─────────────────────────┼───────────────────────────────────┤
│                    INFRASTRUCTURE LAYER                      │
│  ┌──────────────┐  ┌───────────────┐  ┌──────────────────┐ │
│  │ Convex DB     │  │ Convex Files  │  │ Clerk Auth       │ │
│  │ (real-time)   │  │ (storage)     │  │ (JWT verify)     │ │
│  └──────────────┘  └───────────────┘  └──────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 SOLID Application in This Project

| Principle | Application |
|---|---|
| **S**ingle Responsibility | Each Convex file handles one domain (sites, sections, themes). Each hook handles one data concern. Each component renders one section type. |
| **O**pen/Closed | Section types are registered in `section-registry.ts` — new sections are added by registration, not by modifying the renderer. |
| **L**iskov Substitution | All section components implement the same `SectionRendererProps` interface and can be rendered interchangeably. |
| **I**nterface Segregation | Hooks expose only what consumers need (`useSite()` ≠ `useSiteEditor()`). Convex queries are granular. |
| **D**ependency Inversion | Components depend on hook abstractions, not Convex directly. Hooks abstract the Convex SDK. |

### 1.3 DRY & KISS Application

| Principle | Application |
|---|---|
| **DRY** | Section registry pattern eliminates repetitive switch statements. Theme tokens are computed once, used everywhere. Shared UI components in `components/ui/`. |
| **KISS** | Convex eliminates need for custom API routes. Draft/publish is a boolean flag, not a complex system. Real-time preview uses Convex's built-in reactivity. |

---

## 2. Directory & File Organization

### 2.1 Complete Directory Structure

```
e:\omar_project\
│
├── app/                              # Next.js App Router
│   ├── layout.tsx                    # Root layout (providers, fonts, metadata)
│   ├── page.tsx                      # Landing page / redirect
│   ├── not-found.tsx                 # Custom 404
│   ├── global-error.tsx              # Error boundary
│   ├── globals.css                   # Global styles, CSS variables, Tailwind
│   │
│   ├── (auth)/                       # Auth route group (no layout nesting)
│   │   ├── sign-in/
│   │   │   └── [[...sign-in]]/
│   │   │       └── page.tsx          # Clerk sign-in
│   │   └── sign-up/
│   │       └── [[...sign-up]]/
│   │           └── page.tsx          # Clerk sign-up
│   │
│   ├── (dashboard)/                  # Dashboard route group
│   │   ├── layout.tsx                # Dashboard layout (sidebar, auth guard)
│   │   ├── dashboard/
│   │   │   ├── page.tsx              # Dashboard home (site list)
│   │   │   └── sites/
│   │   │       ├── page.tsx          # Sites list (alt route)
│   │   │       └── [siteId]/
│   │   │           └── page.tsx      # Site editor (main editing interface)
│   │   └── demo/
│   │       └── page.tsx              # Demo/preview page
│   │
│   └── (public)/                     # Public page route group
│       └── [slug]/
│           └── page.tsx              # Public microsite renderer
│
├── components/                       # React components
│   ├── providers.tsx                 # Root providers (Convex, Clerk, Theme)
│   │
│   ├── ui/                           # shadcn/ui primitives (DO NOT edit directly)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── toast.tsx
│   │   └── ...                       # Other shadcn components
│   │
│   ├── shared/                       # Cross-cutting shared components
│   │   ├── error-boundary.tsx
│   │   ├── loading-states.tsx
│   │   ├── empty-states.tsx
│   │   └── image-upload.tsx
│   │
│   ├── public/                       # Public page components
│   │   ├── public-page.tsx           # Main public page orchestrator
│   │   ├── section-renderer.tsx      # Dynamic section dispatch component
│   │   └── sections/                 # Individual section renderers
│   │       ├── hero-section.tsx      # Hero/header section
│   │       ├── gallery-section.tsx   # Photo gallery section
│   │       ├── timeline-section.tsx  # Love timeline section
│   │       ├── quote-section.tsx     # Quote/text section
│   │       ├── message-section.tsx   # Personal message section
│   │       ├── countdown-section.tsx # Countdown timer section
│   │       ├── music-section.tsx     # Embedded music player
│   │       ├── footer-section.tsx    # Footer/closing section
│   │       └── index.ts             # Section component map export
│   │
│   └── dashboard/                    # Dashboard-specific components
│       ├── editor/
│       │   ├── site-editor.tsx       # Main editor container
│       │   ├── section-manager.tsx   # Add/remove/reorder sections
│       │   ├── section-editor.tsx    # Edit individual section content
│       │   ├── content-editor.tsx    # Text/media content fields
│       │   └── layout-editor.tsx     # Section layout options
│       ├── theme/
│       │   ├── theme-editor.tsx      # Theme customization panel
│       │   ├── color-picker.tsx      # Color selection component
│       │   └── font-picker.tsx       # Font selection component
│       ├── preview/
│       │   ├── preview-panel.tsx     # Live preview container
│       │   └── preview-frame.tsx     # Iframe or inline preview
│       ├── publish/
│       │   ├── publish-controls.tsx  # Publish/unpublish buttons
│       │   └── publish-status.tsx    # Draft status indicator
│       └── site-list/
│           ├── site-card.tsx         # Site preview card
│           └── site-grid.tsx         # Grid of site cards
│
├── convex/                           # Convex backend (BaaS)
│   ├── _generated/                   # Auto-generated Convex types
│   ├── schema.ts                     # Database schema definition
│   ├── sites.ts                      # Site CRUD queries/mutations
│   ├── sections.ts                   # Section CRUD queries/mutations
│   ├── occasion-sections.ts          # Occasion-specific section logic
│   ├── themes.ts                     # Theme queries/mutations
│   ├── files.ts                      # File upload/deletion handlers
│   └── validators.ts                 # Shared validation schemas
│
├── hooks/                            # Custom React hooks
│   ├── use-site.ts                   # Site data subscription
│   ├── use-sections.ts               # Sections data subscription
│   ├── use-theme.ts                  # Theme data subscription
│   └── use-draft.ts                  # Draft state management
│
├── lib/                              # Utility & configuration
│   ├── utils.ts                      # General utilities (cn, etc.)
│   ├── constants.ts                  # App constants, section type enums
│   ├── types.ts                      # Shared TypeScript types
│   ├── theme-tokens.ts               # CSS custom property generation
│   ├── section-registry.ts           # Section type registration
│   ├── section-entries.ts            # Section entry helpers
│   └── festive-air-data.ts           # Festive/occasion data
│
├── public/                           # Static assets
│   └── ...                           # Images, icons, fonts
│
├── memory-bank/                      # Project documentation
│   ├── projectbrief.md               # Project overview
│   ├── techContext.md                # Technical context
│   ├── technicalBlueprint.md         # THIS FILE
│   ├── dashboardArchitecture.md      # Dashboard design
│   ├── publicPageArchitecture.md     # Public page design
│   ├── systemPatterns.md             # System patterns
│   ├── themeSystem.md                # Theme system docs
│   ├── contentModel.md               # Content model
│   ├── convexSchemaPlan.md           # Schema plan
│   ├── implementationPlan.md         # Implementation plan
│   ├── progress.md                   # Progress tracker
│   └── openQuestions.md              # Open questions
│
├── middleware.ts                      # Next.js middleware (Clerk auth)
├── next.config.js                    # Next.js configuration
├── postcss.config.mjs                # PostCSS (Tailwind)
├── tsconfig.json                     # TypeScript config
├── package.json                      # Dependencies
└── eslint.config.mjs                 # ESLint config
```

### 2.2 File Naming Conventions

| Type | Convention | Example |
|---|---|---|
| React Components | `kebab-case.tsx` | `hero-section.tsx` |
| React Hooks | `use-*.ts` | `use-site.ts` |
| Convex Functions | `camelCase.ts` | `sites.ts`, `sections.ts` |
| Utility/Config | `kebab-case.ts` | `theme-tokens.ts` |
| Types | `camelCase.ts` or `types.ts` | `types.ts`, `constants.ts` |
| CSS | `globals.css` | `globals.css` |
| Pages | `page.tsx` (Next.js convention) | `page.tsx` |
| Layouts | `layout.tsx` (Next.js convention) | `layout.tsx` |

### 2.3 Separation of Concerns Rules

1. **Components MUST NOT import from `convex/_generated/` directly** — use hooks as the abstraction layer.
2. **Convex functions MUST NOT contain UI logic** — they are pure data operations.
3. **Hooks MUST NOT contain UI rendering** — they return data and action functions.
4. **`lib/` files MUST NOT have side effects** — pure functions and constants only.
5. **Dashboard components MUST NOT be imported in public pages** and vice versa (unless shared).

---

## 3. Development Workflow & Page Creation Order

### 3.1 Phase 1: Foundation (Build First)

These modules have no dependencies and must be built first.

```
Step 1: Schema & Validators
├── convex/schema.ts          ← Define all tables, fields, indexes
├── convex/validators.ts      ← Shared validation schemas
└── lib/types.ts              ← TypeScript interfaces mirroring schema

Step 2: Constants & Registry
├── lib/constants.ts          ← Section type enums, app config
├── lib/utils.ts              ← Utility functions (cn, formatDate, etc.)
└── lib/section-registry.ts   ← Section type → component mapping

Step 3: Theme System
├── lib/theme-tokens.ts       ← CSS custom property generation
└── convex/themes.ts          ← Theme CRUD operations

Step 4: Providers & Root Layout
├── components/providers.tsx   ← ConvexProvider, ClerkProvider
└── app/layout.tsx            ← Root layout with providers
```

### 3.2 Phase 2: Data Layer (Build Second)

Convex backend functions, building from independent to dependent.

```
Step 5: Independent Convex Modules
├── convex/sites.ts           ← Site CRUD (no deps on others)
├── convex/files.ts           ← File upload/delete
└── convex/themes.ts          ← Theme CRUD (if not done in Step 3)

Step 6: Dependent Convex Modules
├── convex/sections.ts        ← Depends on sites
└── convex/occasion-sections.ts ← Depends on sections + sites
```

### 3.3 Phase 3: Auth & Navigation (Build Third)

```
Step 7: Authentication
├── app/(auth)/sign-in/[[...sign-in]]/page.tsx
├── app/(auth)/sign-up/[[...sign-up]]/page.tsx
└── middleware.ts              ← Clerk auth middleware

Step 8: Dashboard Shell
├── app/(dashboard)/layout.tsx ← Sidebar, auth guard
├── app/page.tsx              ← Landing/redirect logic
└── app/not-found.tsx         ← 404 page
```

### 3.4 Phase 4: Hooks (Build Fourth)

React hooks that abstract Convex queries.

```
Step 9: Custom Hooks
├── hooks/use-site.ts         ← Site data subscription
├── hooks/use-theme.ts        ← Theme data subscription
├── hooks/use-sections.ts     ← Sections data subscription
└── hooks/use-draft.ts        ← Draft state management
```

### 3.5 Phase 5: Public Page (Build Fifth)

The public-facing microsite — this is the core product.

```
Step 10: Section Components (Bottom-Up)
├── components/public/sections/hero-section.tsx
├── components/public/sections/gallery-section.tsx
├── components/public/sections/timeline-section.tsx
├── components/public/sections/quote-section.tsx
├── components/public/sections/message-section.tsx
├── components/public/sections/countdown-section.tsx
└── components/public/sections/index.ts    ← Component map

Step 11: Page Assembly
├── components/public/section-renderer.tsx ← Dynamic dispatch
├── components/public/public-page.tsx      ← Page orchestrator
└── app/(public)/[slug]/page.tsx           ← Route handler
```

### 3.6 Phase 6: Dashboard (Build Last)

The dashboard depends on everything else being stable.

```
Step 12: Dashboard Home
├── components/dashboard/site-list/site-card.tsx
├── components/dashboard/site-list/site-grid.tsx
└── app/(dashboard)/dashboard/page.tsx

Step 13: Site Editor
├── components/dashboard/editor/site-editor.tsx
├── components/dashboard/editor/section-manager.tsx
├── components/dashboard/editor/section-editor.tsx
├── components/dashboard/editor/content-editor.tsx
└── app/(dashboard)/dashboard/sites/[siteId]/page.tsx

Step 14: Theme Editor
├── components/dashboard/theme/theme-editor.tsx
├── components/dashboard/theme/color-picker.tsx
└── components/dashboard/theme/font-picker.tsx

Step 15: Preview & Publish
├── components/dashboard/preview/preview-panel.tsx
├── components/dashboard/preview/preview-frame.tsx
├── components/dashboard/publish/publish-controls.tsx
└── components/dashboard/publish/publish-status.tsx
```

### 3.7 Dependency Graph

```
schema.ts ──→ validators.ts ──→ Convex functions ──→ Hooks ──→ Components ──→ Pages
    │                                                                │
    └──→ types.ts ──────────────────────────────────────────────────→│
    │                                                                │
    └──→ constants.ts ──→ section-registry.ts ──→ section-renderer.tsx
```

**Golden Rule**: Never build a module that depends on something that doesn't exist yet.

---

## 4. Code Quality Best Practices

### 4.1 Component Patterns

#### Server Components (Default)
```tsx
// ✅ GOOD: Server Component by default
import { SectionRenderer } from '@/components/public/section-renderer';

export default async function PublicPage({ params }: Props) {
  const { slug } = await params;
  // Server-side data fetching
  return <SectionRenderer sections={sections} />;
}
```

#### Client Components (When Needed)
```tsx
'use client';

// ✅ GOOD: Client Component only when interactivity is required
import { useSections } from '@/hooks/use-sections';

export function SectionManager({ siteId }: Props) {
  const { sections, addSection, reorderSections } = useSections(siteId);
  return <DndContext onDragEnd={reorderSections}>...</DndContext>;
}
```

#### Component Structure Rules
1. **One component per file** — no multi-component files.
2. **Max 150 lines per component** — if longer, extract sub-components or hooks.
3. **Props interface above the component** — always type props explicitly.
4. **No inline styles** — use Tailwind classes only.
5. **No business logic in components** — extract to hooks or lib.

```tsx
// ✅ GOOD: Clean component structure
interface HeroSectionProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
}

export function HeroSection({ title, subtitle, backgroundImage }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center">
      {backgroundImage && <BackgroundImage src={backgroundImage} />}
      <div className="text-center z-10">
        <h1 className="text-4xl font-bold">{title}</h1>
        {subtitle && <p className="text-xl mt-4">{subtitle}</p>}
      </div>
    </section>
  );
}
```

### 4.2 Hook Patterns

```tsx
// ✅ GOOD: Hook with clear responsibility
export function useSite(siteId: string) {
  const site = useQuery(api.sites.get, { siteId });

  const updateSite = useMutation(api.sites.update);
  const publishSite = useMutation(api.sites.publish);

  const handleUpdate = useCallback(async (updates: Partial<Site>) => {
    await updateSite({ siteId, ...updates });
  }, [siteId, updateSite]);

  const handlePublish = useCallback(async () => {
    await publishSite({ siteId });
  }, [siteId, publishSite]);

  return {
    site,
    isLoading: site === undefined,
    updateSite: handleUpdate,
    publishSite: handlePublish,
  };
}
```

### 4.3 Convex Function Patterns

```tsx
// ✅ GOOD: Convex query with validation and error handling
import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const site = await ctx.db
      .query('sites')
      .withIndex('by_slug', (q) => q.eq('slug', slug))
      .unique();

    if (!site) throw new Error('Site not found');
    if (site.status !== 'published') throw new Error('Site not published');

    return site;
  },
});
```

### 4.4 Type Safety Rules

1. **Never use `any`** — use `unknown` and narrow with type guards.
2. **Mirror schema in types** — `lib/types.ts` should mirror `convex/schema.ts`.
3. **Use branded types** for IDs:
   ```tsx
   type SiteId = string & { __brand: 'SiteId' };
   type SectionId = string & { __brand: 'SectionId' };
   ```
4. **Discriminated unions** for section content:
   ```tsx
   type SectionContent =
     | { type: 'hero'; title: string; subtitle?: string }
     | { type: 'gallery'; images: string[] }
     | { type: 'timeline'; events: TimelineEvent[] };
   ```

### 4.5 Error Handling Strategy

| Layer | Strategy |
|---|---|
| **Convex** | Throw descriptive errors; let Convex propagate to client |
| **Hooks** | Check `undefined` (loading) vs `null` (error) from `useQuery` |
| **Components** | Use React Error Boundaries; show fallback UI |
| **Pages** | Use `error.tsx` and `not-found.tsx` for route-level errors |

```tsx
// ✅ GOOD: Error boundary per section
export function SectionRenderer({ section }: { section: Section }) {
  const Component = sectionRegistry[section.type];

  if (!Component) return <UnknownSectionWarning type={section.type} />;

  return (
    <ErrorBoundary fallback={<SectionError type={section.type} />}>
      <Component {...section.content} />
    </ErrorBoundary>
  );
}
```

### 4.6 Code Formatting & Linting

| Tool | Config | Purpose |
|---|---|---|
| **Prettier** | `.prettierrc` | Auto-format on save |
| **ESLint** | `eslint.config.mjs` | Lint rules for Next.js + TypeScript |
| **Tailwind ESLint** | Plugin | Enforce Tailwind class order |

Rules:
- **No manual formatting** — rely on Prettier.
- **No unused imports** — ESLint `no-unused-vars` with auto-fix.
- **Consistent imports** — use `@/` path aliases for all project imports.

---

## 5. Performance Optimization

### 5.1 Frontend Rendering

#### Server Components (Default)
- **90%+ of components should be Server Components** — zero client-side JS shipped.
- Only mark `'use client'` when the component needs:
  - `useState`, `useReducer`, `useEffect`, `useRef`
  - Event handlers (`onClick`, `onChange`)
  - Browser APIs (`window`, `document`)
  - Convex real-time subscriptions (`useQuery`, `useMutation`)

#### Streaming & Suspense
```tsx
// ✅ GOOD: Streaming with Suspense
import { Suspense } from 'react';

export default function PublicPage({ params }: Props) {
  return (
    <main>
      <Suspense fallback={<HeroSkeleton />}>
        <HeroSection slug={params.slug} />
      </Suspense>
      <Suspense fallback={<SectionsSkeleton />}>
        <SectionsList slug={params.slug} />
      </Suspense>
    </main>
  );
}
```

#### Image Optimization
```tsx
// ✅ GOOD: Optimized image loading
import Image from 'next/image';

<Image
  src={imageUrl}
  alt={altText}
  width={800}
  height={600}
  priority={isAboveFold}        // LCP images get priority
  loading={isAboveFold ? 'eager' : 'lazy'}
  placeholder="blur"
  blurDataURL={blurHash}
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

#### Font Optimization
```tsx
// ✅ GOOD: Font optimization with next/font
import { Playfair_Display, Lato } from 'next/font/google';

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',          // FOIT prevention
  variable: '--font-heading', // CSS variable for dynamic use
});

// Use CSS variables in theme tokens for dynamic font switching
```

#### Bundle Optimization
- **Code split by route** — Next.js does this automatically with App Router.
- **Dynamic imports** for heavy components:
  ```tsx
  const ColorPicker = dynamic(() => import('./color-picker'), { ssr: false });
  ```
- **Tree shaking** — import only what you need from libraries:
  ```tsx
  // ✅ GOOD
  import { Heart, Star } from 'lucide-react';
  // ❌ BAD
  import * as LucideIcons from 'lucide-react';
  ```

### 5.2 Data Fetching & Caching

#### Convex Real-time Strategy
| Page Type | Strategy | Reason |
|---|---|---|
| **Public Page** | Static render + hydration | Many visitors, minimize DB load |
| **Dashboard** | Real-time subscription | Admin needs live updates |
| **Preview Panel** | Real-time (draft state) | Must reflect edits instantly |

```tsx
// ✅ GOOD: Conditional real-time subscription
export function useSite(siteId: string, { realtime = false } = {}) {
  // Static fetch for public pages
  const site = useQuery(
    api.sites.get,
    { siteId },
    { enabled: !realtime } // Disable subscription if not needed
  );

  // Real-time for dashboard
  const realtimeSite = useQuery(
    api.sites.get,
    { siteId },
    { enabled: realtime }
  );

  return realtime ? realtimeSite : site;
}
```

#### Cache Strategy for Public Pages
```tsx
// ✅ GOOD: ISR for public pages
export const revalidate = 3600; // Revalidate every hour

export default async function PublicPage({ params }: Props) {
  const { slug } = await params;
  // Server-side fetch with automatic caching
  const site = await getSiteBySlug(slug);
  return <PublicPageContent site={site} />;
}
```

### 5.3 Backend Processing (Convex)

#### Query Optimization
1. **Use indexes** — always define and use Convex indexes:
   ```tsx
   // schema.ts
   sites: defineTable({
     slug: v.string(),
     ownerId: v.string(),
     status: v.union(v.literal('draft'), v.literal('published')),
   })
     .index('by_slug', ['slug'])
     .index('by_owner', ['ownerId'])
     .index('by_status', ['status']);
   ```

2. **Minimize data transfer** — use `.pick()` or `.project()`:
   ```tsx
   // ✅ GOOD: Only fetch what you need
   const siteList = await ctx.db
     .query('sites')
     .filter((q) => q.eq(q.field('ownerId'), userId))
     .collect();
   return siteList.map(({ title, slug, status }) => ({ title, slug, status }));
   ```

3. **Batch operations** — avoid N+1 queries:
   ```tsx
   // ✅ GOOD: Batch fetch sections for a site
   const sections = await ctx.db
     .query('sections')
     .filter((q) => q.eq(q.field('siteId'), siteId))
     .collect();
   ```

#### Mutation Optimization
1. **Validate early** — check inputs before DB writes.
2. **Atomic operations** — use `ctx.db.patch()` instead of read-modify-write.
3. **Minimal writes** — only update changed fields.

### 5.4 Bundle Size Monitoring

Target metrics:
| Metric | Target |
|---|---|
| **First Contentful Paint (FCP)** | < 1.5s |
| **Largest Contentful Paint (LCP)** | < 2.5s |
| **Cumulative Layout Shift (CLS)** | < 0.1 |
| **Time to Interactive (TTI)** | < 3.0s |
| **Total Bundle Size (Public Page)** | < 150KB gzipped |
| **Total Bundle Size (Dashboard)** | < 300KB gzipped |

---

## 6. Testing Strategy

### 6.1 Testing Pyramid

```
        ╱╲
       ╱  ╲        E2E Tests (5%)
      ╱    ╲       - Critical user flows
     ╱──────╲      - Playwright/Cypress
    ╱        ╲
   ╱   Integ  ╲    Integration Tests (25%)
  ╱    Tests    ╲  - Component + hook + Convex
 ╱──────────────╲  - React Testing Library
╱                ╲
╱   Unit Tests    ╲  Unit Tests (70%)
╱──────────────────╲ - Pure functions, utils, validators
                     - Jest/Vitest
```

### 6.2 What to Test

| Layer | Tool | What to Test |
|---|---|---|
| **Utils** | Vitest | `cn()`, formatters, validators, type guards |
| **Hooks** | Vitest + Testing Library | Hook return values, loading states, error handling |
| **Components** | Vitest + Testing Library | Rendering, user interactions, conditional display |
| **Convex** | Vitest + Convex test backend | Query results, mutation side effects, permissions |
| **E2E** | Playwright | Login → Create site → Edit sections → Publish → View public |

### 6.3 File Naming for Tests

```
components/public/sections/hero-section.tsx
components/public/sections/__tests__/hero-section.test.tsx

lib/utils.ts
lib/__tests__/utils.test.ts

hooks/use-site.ts
hooks/__tests__/use-site.test.ts
```

---

## 7. Deployment & CI/CD

### 7.1 Deployment Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   GitHub      │────▶│  Vercel       │────▶│  Production   │
│   (source)    │     │  (build)      │     │  (deploy)     │
└──────────────┘     └──────────────┘     └──────────────┘
       │                                          │
       │              ┌──────────────┐            │
       └─────────────▶│  Convex      │◀───────────┘
                      │  (backend)   │
                      └──────────────┘
```

### 7.2 Environment Variables

| Variable | Environment | Purpose |
|---|---|---|
| `NEXT_PUBLIC_CONVEX_URL` | All | Convex deployment URL |
| `CONVEX_DEPLOY_KEY` | CI/CD only | Convex schema deployment |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | All | Clerk public key |
| `CLERK_SECRET_KEY` | Server only | Clerk secret key |

### 7.3 Git Workflow

```
main ─────────────────────────────────────────▶ (production)
  │
  └── feature/<name> ──▶ PR ──▶ merge ──▶ (preview)
```

Branch naming:
- `feature/<name>` — new features
- `fix/<name>` — bug fixes
- `chore/<name>` — maintenance tasks

### 7.4 Pre-commit Checklist

- [ ] TypeScript compiles without errors
- [ ] ESLint passes without warnings
- [ ] All tests pass
- [ ] No `console.log` in production code
- [ ] No `any` types introduced
- [ ] New components have proper error boundaries
- [ ] New Convex functions have input validation

---

## Appendix A: Import Aliases

Always use `@/` path aliases:

```tsx
// ✅ GOOD
import { useSite } from '@/hooks/use-site';
import { Button } from '@/components/ui/button';
import { SectionRenderer } from '@/components/public/section-renderer';
import { cn } from '@/lib/utils';

// ❌ BAD
import { useSite } from '../../hooks/use-site';
import { Button } from '../components/ui/button';
```

## Appendix B: Git Commit Convention

```
<type>(<scope>): <description>

feat(dashboard): add section reordering with drag-and-drop
fix(public): correct image aspect ratio on mobile
chore(deps): update convex to latest version
refactor(hooks): extract draft logic into custom hook
test(sections): add unit tests for section registry
docs(blueprint): update technical blueprint
```

Types: `feat`, `fix`, `chore`, `refactor`, `test`, `docs`, `style`, `perf`

## Appendix C: Section Extensibility Pattern

To add a new section type:

1. Add type to `lib/constants.ts`:
   ```tsx
   export const SectionType = { ..., MUSIC: 'music' } as const;
   ```

2. Create component in `components/public/sections/music-section.tsx`

3. Register in `lib/section-registry.ts`:
   ```tsx
   import { MusicSection } from '@/components/public/sections/music-section';
   export const sectionRegistry = { ..., music: MusicSection };
   ```

4. Add to Convex schema if needed (section content fields)

5. Add dashboard editor in `components/dashboard/editor/section-editor.tsx`

**No other files need modification** — this is the Open/Closed Principle in action.