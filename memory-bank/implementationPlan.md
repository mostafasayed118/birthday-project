# Implementation Plan — Romantic Microsite Platform

## Overview

Phased implementation plan for building the romantic microsite platform. Each phase builds on the previous one and results in a functional, testable increment.

## Phase 0: Project Setup & Foundation

**Goal**: Empty project that builds and runs with all dependencies configured.

### Tasks

- [ ] Initialize Next.js 16 project with TypeScript
- [ ] Configure Tailwind CSS
- [ ] Install and configure shadcn/ui
- [ ] Set up Convex backend (`npx convex dev`)
- [ ] Configure Convex schema (basic `sites` table)
- [ ] Set up ESLint and Prettier
- [ ] Set up Git repository
- [ ] Create basic folder structure
- [ ] Configure path aliases (`@/components`, `@/convex`, etc.)
- [ ] Create root layout with basic styling
- [ ] Create landing page placeholder

### Deliverable

Empty but fully configured project. `npm run dev` works. `npx convex dev` connects to Convex backend.

### Estimated Time

1-2 hours

---

## Phase 1: Authentication & Site CRUD

**Goal**: User can sign in, create a site, and see it in a list.

### Tasks

- [ ] Set up Convex Auth (GitHub or Google provider)
- [ ] Create auth login/signup pages
- [ ] Create dashboard layout with auth protection
- [ ] Implement `sites.ts` Convex functions (create, list, getById, getBySlug)
- [ ] Create "Create New Site" form (title, slug, occasion type)
- [ ] Create sites list page
- [ ] Create site card component
- [ ] Add basic site deletion

### Deliverable

User can sign in, create a site, see it listed, and delete it.

### Estimated Time

4-6 hours

---

## Phase 2: Section System (Core)

**Goal**: Sites have sections that can be added, reordered, and toggled.

### Tasks

- [ ] Define section type constants and default content
- [ ] Implement `sections.ts` Convex functions (add, remove, reorder, toggle visibility)
- [ ] Create section manager UI component (left panel)
- [ ] Implement drag-and-drop reordering (dnd-kit library)
- [ ] Create section type picker (add section dialog)
- [ ] Create visibility toggle UI
- [ ] Implement section deletion with confirmation
- [ ] Create dashboard site editor layout (3-panel)
- [ ] Wire up section manager to Convex mutations

### Deliverable

User can add sections, reorder them, toggle visibility, and delete them from the dashboard.

### Estimated Time

8-10 hours

---

## Phase 3: Content Editing

**Goal**: User can edit the content of each section type.

### Tasks

- [ ] Create generic content editor panel (center)
- [ ] Implement Hero section editor
- [ ] Implement Message section editor
- [ ] Implement Gallery section editor
- [ ] Implement Timeline section editor
- [ ] Implement Quote section editor
- [ ] Implement Countdown section editor
- [ ] Implement Divider section editor
- [ ] Implement Stats section editor
- [ ] Implement Footer section editor
- [ ] Implement Map section editor
- [ ] Wire all editors to `updateSectionContent` mutation
- [ ] Add form validation per section type
- [ ] Implement image upload for sections that need it

### Deliverable

User can edit all content for all section types. Changes save as draft.

### Estimated Time

15-20 hours

---

## Phase 4: Theme System

**Goal**: User can customize all visual aspects of their site.

### Tasks

- [ ] Implement `themes.ts` Convex functions
- [ ] Create theme editor UI (color pickers, font selectors, sliders)
- [ ] Implement theme-to-CSS-variables conversion
- [ ] Apply theme tokens to public page rendering
- [ ] Create theme presets (6+ presets)
- [ ] Create preset selector UI
- [ ] Implement real-time theme preview
- [ ] Configure Tailwind to consume CSS variables

### Deliverable

User can fully customize colors, fonts, spacing, and borders. Changes preview in real-time.

### Estimated Time

10-12 hours

---

## Phase 5: Public Page Rendering

**Goal**: Public pages render dynamically from database content and theme.

### Tasks

- [ ] Create public page route (`/[slug]`)
- [ ] Implement `getBySlug` query (published data only)
- [ ] Create public page root component
- [ ] Create section renderer (component registry)
- [ ] Implement Hero section component
- [ ] Implement Message section component
- [ ] Implement Gallery section component
- [ ] Implement Timeline section component
- [ ] Implement Quote section component
- [ ] Implement Countdown section component
- [ ] Implement Divider section component
- [ ] Implement Stats section component
- [ ] Implement Footer section component
- [ ] Implement Map section component
- [ ] Apply theme CSS variables
- [ ] Add responsive design
- [ ] Add scroll animations
- [ ] Add SEO meta tags
- [ ] Create 404 page for invalid slugs

### Deliverable

Public page renders all section types with correct content and theme. Fully responsive.

### Estimated Time

15-20 hours

---

## Phase 6: Draft/Publish Workflow

**Goal**: Changes are saved as drafts and explicitly published.

### Tasks

- [ ] Implement `publish` mutation (draftData → publishedData)
- [ ] Implement `rollback` mutation (publishedData → draftData)
- [ ] Create publish controls UI
- [ ] Add publish confirmation dialog
- [ ] Show publish status indicator in dashboard
- [ ] Show draft vs published diff indicator
- [ ] Implement "View Live" link
- [ ] Add unsaved changes indicator
- [ ] Auto-save behavior (debounced mutations)

### Deliverable

Full draft/publish workflow. Users can publish, view live, and rollback.

### Estimated Time

6-8 hours

---

## Phase 7: Preview Panel

**Goal**: Dashboard shows a live preview of the public page.

### Tasks

- [ ] Create preview panel component (right panel)
- [ ] Render public page components inside preview
- [ ] Add viewport switcher (desktop/tablet/mobile)
- [ ] Sync preview with current draft data
- [ ] Add click-to-select in preview
- [ ] Handle preview scrolling

### Deliverable

Live preview in dashboard that updates in real-time as user edits.

### Estimated Time

8-10 hours

---

## Phase 8: Polish & Performance

**Goal**: Production-ready quality.

### Tasks

- [ ] Optimize image loading (lazy loading, sizing)
- [ ] Add loading skeletons for all pages
- [ ] Add error boundaries
- [ ] Add toast notifications for all mutations
- [ ] Optimize Convex query performance
- [ ] Add metadata/SEO for public pages
- [ ] Test on all breakpoints
- [ ] Test with large content (many sections, many gallery images)
- [ ] Add keyboard shortcuts in dashboard
- [ ] Final UI polish

### Deliverable

Polished, performant, production-ready application.

### Estimated Time

8-10 hours

---

## Phase Summary

| Phase | Name | Hours (Est.) | Dependencies |
|---|---|---|---|
| 0 | Project Setup | 1-2 | None |
| 1 | Auth & Site CRUD | 4-6 | Phase 0 |
| 2 | Section System | 8-10 | Phase 1 |
| 3 | Content Editing | 15-20 | Phase 2 |
| 4 | Theme System | 10-12 | Phase 2 |
| 5 | Public Page | 15-20 | Phases 3, 4 |
| 6 | Draft/Publish | 6-8 | Phases 2, 3 |
| 7 | Preview Panel | 8-10 | Phases 3, 4, 5 |
| 8 | Polish | 8-10 | All previous |
| **Total** | | **75-98 hours** | |

## Dependency Graph

```
Phase 0 → Phase 1 → Phase 2 → Phase 3 ─┐
                          │              │
                          └──→ Phase 4 ──┤
                                          │
                                          ├──→ Phase 5 ──→ Phase 7
                                          │
                                          └──→ Phase 6 ──┘
                                                           │
                                                           └──→ Phase 8
```

## Parallel Work Opportunities

- **Phase 3 and Phase 4** can be worked on in parallel (content editing + theme system)
- **Phase 5 and Phase 6** can be partially worked on in parallel (public page + draft/publish)
- **Section components** in Phase 5 can be built incrementally, testing each as completed

## Risk Mitigation

| Risk | Mitigation |
|---|---|
| Convex document size limits | Monitor site data sizes; consider splitting to multiple docs if needed |
| Real-time performance on public pages | Default to non-real-time on public; add real-time only for preview |
| Drag-and-drop complexity | Use dnd-kit library (mature, accessible, performant) |
| Image storage limits | Start with Convex file storage; migrate to Cloudinary/S3 if needed |
| Theme CSS variable integration with Tailwind | Prototype early in Phase 0/4 to validate approach |
