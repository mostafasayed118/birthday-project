# Project Handoff Document

## 1. Overview

**Romantic Microsite Platform** — A Next.js application for creating customizable romantic microsites for anniversaries, proposals, Valentine's Day, birthdays, weddings, and love stories. Users can build, customize, and publish elegant single-page microsites with real-time preview.

## 2. Architecture

- **Frontend**: Next.js 16 (App Router) with React 19
- **Backend**: Convex (realtime database with auth)
- **Authentication**: Clerk (JWT template integration)
- **Data Flow**: Clerk → Convex (via JWT template named "convex")
- **Rendering**: Server-side rendering with client-side hydration
- **Real-time**: Convex reactive queries for live updates

## 3. Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16.2.4 |
| React | 19.2.5 |
| Styling | Tailwind CSS 4 (OKLCH color system) |
| Backend | Convex 1.37.0 |
| Auth | Clerk (clerk/nextjs 7.3.0, clerk/react 6.6.0) |
| UI Components | Radix UI via shadcn/ui + @base-ui/react |
| Icons | lucide-react |
| Charts | Recharts |
| Animation | framer-motion |
| Fonts | next/font (Inter, Playfair Display) |
| Testing | Vitest |
| Language | TypeScript 5 |

## 4. Directory Structure

```
omar_project/
├── app/
│   ├── layout.tsx              # Root layout with providers
│   ├── (dashboard)/           # Protected dashboard routes
│   │   ├── layout.tsx          # Dashboard shell wrapper
│   │   └── dashboard/
│   │       ├── sites/          # Site editor pages
│   │       ├── analytics/      # Analytics dashboard
│   │       └── quotes/         # Quote management
│   ├── (public)/               # Public site routes
│   │   └── [slug]/             # Dynamic public site pages
│   ├── sign-in/                # Clerk sign-in
│   ├── sign-up/                # Clerk sign-up
│   └── page.tsx                # Landing page
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── dashboard/              # Dashboard-specific components
│   │   ├── analytics/          # Chart components
│   │   └── editors/            # Section editors
│   ├── public/                 # Public site components
│   └── shared/                 # Shared utilities
├── convex/
│   ├── schema.ts               # Database schema
│   ├── sites.ts                # Site CRUD operations
│   ├── content.ts              # Translatable content
│   ├── quotes.ts               # Quote management
│   ├── analytics.ts            # Analytics tracking
│   ├── themes.ts               # Theme operations
│   ├── files.ts                # File storage
│   ├── sections.ts             # Section utilities
│   ├── validators.ts           # Zod validators
│   ├── occasion_sections.ts    # Occasion templates
│   └── _generated/             # Auto-generated API
├── i18n/
│   ├── config.ts               # Locale configuration
│   ├── provider.tsx            # I18n context provider
│   └── translations/           # en.ts, ar.ts
├── lib/
│   ├── types.ts                # TypeScript definitions
│   ├── section-registry.ts     # Section registry system
│   ├── section-entries.ts      # Section implementations
│   ├── theme-tokens.ts         # Theme presets
│   ├── dashboard-data.ts       # Analytics helpers
│   └── utils.ts                # Utility functions
├── hooks/
│   ├── use-content.ts          # Content fetching
│   ├── use-site.ts             # Site data hook
│   ├── use-sections.ts         # Section management
│   └── use-keyboard-shortcuts.ts
└── hooks/
```

## 5. Core Product Features

### Section Types (16 total)
- **hero** — Full-width banner with title, subtitle, CTA, and optional background
- **message** — Text block with alignment and font style options
- **gallery** — Photo grid with masonry, carousel, or stack layouts
- **timeline** — Relationship timeline with events
- **quote** — Featured quote styling (card, inline, banner, scripture)
- **countdown** — Timer to a target date with celebration animation
- **map** — Location map with marker
- **divider** — Visual separator (line, ornament, gradient, image)
- **spacer** — Empty vertical space
- **stats** — Milestone numbers with animated counters
- **footer** — Page footer with social links
- **video** — Embedded video player
- **audio** — Playlist player with multiple tracks
- **memory_highlights** — Split layout with image and text
- **love_notes** — Masonry card grid with guest messages

### Site Management
- Draft/publish workflow with version comparison
- Occasion-based templates (anniversary, proposal, valentine, birthday, love-story, wedding, custom)
- Slug-based public URLs
- Archive/delete functionality

### Theme System
- 8 built-in presets (romantic-rose, midnight-love, garden-romance, classic-elegance, sunset-passion, ocean-dreams, festive-air)
- Custom color, typography, spacing, and effects customization
- CSS variable injection for runtime theme changes

### Analytics
- Page view tracking
- Event tracking (link clicks, audio plays, quote shares)
- Device/browser breakdown
- 30-day trend visualization
- Hourly heatmap

## 6. Content and Data Flow

```
User Request → Clerk Auth → JWT Token → Convex Auth → Database Query → React Components
```

- **Public Sites**: Fetched via `api.sites.getBySlug` (published sites only)
- **Draft Sites**: Fetched via `api.sites.getById` (authenticated owner only)
- **Content**: Fetched via `api.content.get` with locale support
- **Files**: Stored in Convex file storage with signed URLs

## 7. Auth and Permissions

- **Provider**: Clerk with JWT template named "convex"
- **Protected Routes**: All `/dashboard/*` routes require authentication
- **Authorization**: Owner-based access control on sites
- **Token Flow**: `clerk.getToken({ template: "convex" })` passed to Convex via `ConvexProviderWithAuth`

### Auth Configuration
- Clerk domain: `oriented-midge-30.clerk.accounts.dev` (configured in convex/auth.config.ts)
- JWT template must be named exactly "convex"

## 8. Localization

- **Languages**: English (default), Arabic
- **Provider**: Custom `I18nProvider` with localStorage persistence
- **Storage**: `localStorage` with key "preferred-locale"
- **RTL Support**: Document direction set to "rtl" for Arabic
- **Content**: Separate content table in Convex with translations for en, ar, es, fr fields
- **Hook**: `useContent` and `useContentKey` for fetching translations

## 9. Theme System

- **Provider**: `next-themes` with class-based strategy
- **Default**: System preference
- **Presets**: 8 predefined themes in `lib/theme-tokens.ts`
- **Variables**: CSS custom properties injected via `themeToCSSVariables()`
- **Editor**: Full customization via `ThemeEditor` component

## 10. Dashboard and Public App Areas

### Dashboard Routes
- `/dashboard` — Overview page
- `/dashboard/sites` — Site list with create/new
- `/dashboard/sites/[siteId]` — Site editor with three-panel layout
- `/dashboard/analytics` — Analytics dashboard with KPI cards
- `/dashboard/quotes` — Quote management

### Public Routes
- `/` — Landing page
- `/[slug]` — Published microsite (dynamic route)
- `/demo` — Demo page

## 11. Important Files

| File | Purpose |
|------|---------|
| `convex/schema.ts` | Database schema definitions |
| `convex/sites.ts` | Site CRUD operations |
| `lib/types.ts` | TypeScript type definitions |
| `lib/section-registry.ts` | Section component registry |
| `lib/section-entries.ts` | Section implementations (16 types) |
| `lib/theme-tokens.ts` | Theme presets and utilities |
| `components/providers.tsx` | Convex-Clerk bridge setup |
| `app/layout.tsx` | Root layout with all providers |
| `hooks/use-content.ts` | Content fetching hooks |
| `convex/auth.config.ts` | Clerk domain configuration |

## 12. Scripts and Environment Variables

### Scripts
```bash
npm run dev          # Start Next.js dev server (port 3000)
npm run dev:convex   # Start Convex dev server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test         # Run Vitest tests
npm run test:ui      # Run Vitest with UI
```

### Environment Variables
```bash
# Convex
NEXT_PUBLIC_CONVEX_URL=https://*.convex.cloud    # Required
CONVEX_DEPLOYMENT=dev:*                          # Required
CONVEX_DEPLOY_KEY=dev:*|*                        # Required

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_*          # Required
CLERK_SECRET_KEY=sk_*                            # Required
CLERK_DOMAIN=*.clerk.accounts.dev              # Required
```

## 13. Current Limitations / Technical Debt

- **Analytics Visualization**: Heatmap data is simulated (randomized) for days/hours without actual tracking
- **File Uploads**: Audio and image uploads require Convex file storage configuration
- **ES/FR Translations**: Schema supports them but no translation files exist in codebase
- **Theme Persistence**: No database persistence for custom themes (only presets)
- **SEO**: Dynamic OG images not implemented
- **Mobile Editor**: Some editor components may need mobile optimization

## 14. Maintenance Notes

### Setup Requirements
1. Create Convex account and deployment
2. Create Clerk application with JWT template named "convex"
3. Configure environment variables per `.env.local` format
4. Run `npx convex dev` to sync schema and generate types

### Key Dependencies to Update
- Next.js 16.x is current (verify compatibility with future releases)
- Convex beta APIs may have breaking changes

### Database Migrations
- Not currently set up; use `npx convex dev` for development
- For production, use `npx convex deploy`

### Testing
- Vitest configured with `@testing-library/react`
- Test files should be placed alongside components