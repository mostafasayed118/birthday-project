# Product Context — Romantic Microsite Platform

## Product Goals

### Primary Goals

1. **Enable rapid romantic microsite creation** — Users should be able to go from zero to a published romantic page in under 30 minutes.
2. **Full editorial control** — Every piece of content and every design decision should be editable through the dashboard.
3. **Professional output** — The public page must look polished, responsive, and visually impressive.
4. **Platform scalability** — Architecture must support many independent microsites from a single deployment.

### Secondary Goals

5. **Extensibility** — New section types and theme options should be addable without refactoring core systems.
6. **Performance** — Public pages must load fast and render cleanly even with many sections.
7. **Reliability** — Draft/publish workflow must be bulletproof — no accidental publishes, no lost drafts.

## Core Features

### 1. Public Microsite Page

- Dynamically rendered from database content
- Unique URL per microsite (slug-based routing)
- Sections rendered in configured order
- Theme applied via CSS variables generated from database tokens
- Fully responsive (mobile-first)
- Supports: text, images, galleries, countdowns, maps, quotes, timelines, etc.

### 2. Admin Dashboard

- Authentication (Convex Auth)
- Site selector (if user manages multiple sites)
- Section manager (add/remove/reorder/visibility)
- Content editor (per-section content editing)
- Theme editor (global design tokens)
- Real-time preview panel
- Draft/publish controls

### 3. Section System

- Predefined section types (Hero, Gallery, Timeline, Quote, Message, Countdown, Map, Footer, etc.)
- Each section type has a defined schema for its content
- Sections are reorderable via drag-and-drop
- Sections can be toggled visible/hidden
- Section-specific settings (e.g., gallery layout, countdown target date)
- New section types are extensible

### 4. Theme System

- Global design tokens: primary color, secondary color, background, text color, accent color
- Typography: heading font, body font, font sizes
- Spacing: section padding, element margins
- Border radius, shadows, gradients
- Button styles (variant, size, color)
- Card styles
- Pre-built theme presets for quick start
- Per-section color overrides (optional)

### 5. Content Editing

- Inline-style editing in preview (Phase 2)
- Form-based editing in dashboard (Phase 1)
- Rich text support for paragraphs (bold, italic, links)
- Image upload with preview
- Content validation per section type
- Undo/redo (Phase 3)

### 6. Draft/Publish Workflow

- All changes saved as draft automatically
- Draft is separate from published state
- Preview always shows draft state
- Publish button commits draft to published
- Can view published version independently
- Rollback to last published version
- Version history (Phase 3)

## User Flows

### Flow 1: Create New Microsite

1. User signs in to dashboard
2. Clicks "Create New Site"
3. Enters basic info (title, slug, occasion type)
4. Chooses a starting template/theme preset
5. Dashboard opens with default sections pre-populated
6. User edits content, reorders sections, adjusts theme
7. User previews changes in real-time
8. User clicks "Publish"
9. Public URL is live

### Flow 2: Edit Existing Microsite

1. User signs in to dashboard
2. Selects existing site from list
3. Dashboard loads current draft (or published state if no draft)
4. User makes changes (content, sections, theme)
5. Changes auto-save as draft
6. User previews changes
7. User publishes when satisfied

### Flow 3: View Public Page

1. Visitor opens public URL (e.g., `/us/our-love-story`)
2. Page loads, fetches site data from Convex
3. Sections render in order with theme applied
4. Animations/transitions play
5. Page is fully interactive (gallery lightbox, countdown, etc.)

## Content Types

### Text Content

- Headings (H1-H4)
- Paragraphs (with basic rich text)
- Captions
- Labels / buttons
- Quotes

### Media Content

- Single images (hero, backgrounds)
- Image galleries (grid, masonry, carousel)
- Background videos (future)

### Interactive Content

- Countdown timer (to a specific date)
- Map embed (Google Maps / OpenStreetMap)
- Photo gallery with lightbox
- Animated timeline
- RSVP form (future)

### Structural Content

- Section backgrounds (solid, gradient, image)
- Dividers
- Spacers

## Assumptions

1. **One user per site** — Each microsite has one owner/editor. No multi-user collaboration in MVP.
2. **Single-page** — Each microsite is a single scrollable page, not multi-page.
3. **No e-commerce** — No payments, subscriptions, or transactions in MVP.
4. **No custom domains** — Sites are served from the platform's domain with slug-based routing.
5. **Image hosting via Convex** — Images uploaded and stored through Convex file storage.
6. **English only** — No i18n in MVP.
7. **Romantic context** — While the architecture is generic, the default templates, section types, and themes are romantic-focused.

## Decided vs Open

### Decided

- Section-based page composition
- Database-driven rendering
- Draft/publish workflow
- Theme as data (CSS variables from tokens)
- Convex as sole backend
- Real-time preview in dashboard
- Slug-based public URLs

### Still Open

- Exact section type catalog (see `openQuestions.md`)
- Whether to support custom CSS from users
- Whether to support custom HTML blocks
- Whether to allow per-section theme overrides globally or only per-section-type
- Image optimization strategy (on-the-fly vs pre-processed)
- SEO strategy for public pages (SSR vs SSG vs ISR)
