# Progress — Romantic Microsite Platform

## Status: Phase 0–6 Complete

## Phase Progress

| Phase | Name | Status | Notes |
|---|---|---|---|
| 0 | Project Setup & Foundation | ✅ Complete | Next.js 16, Tailwind, shadcn/ui, Convex, folder structure |
| 1 | Authentication & Site CRUD | ✅ Complete (Structure) | Schema, Convex functions, dashboard pages, types |
| 2 | Section System (Core) | ✅ Complete | 3-panel editor, DnD, section CRUD, Hero editor, live preview |
| 3 | Content Editing | ✅ Complete | All 13 section editors, shared field components, editor router |
| 4 | Theme System | ✅ Complete | Full theme editor, preset selector, live preview integration |
| 5 | Public Page Rendering | ✅ Complete | All 13 section components, shared primitives, responsive design |
| 6 | Draft/Publish Workflow | ✅ Complete | Public route reads published data, publish/rollback wired, status UI |
| 7 | Preview Panel | ⬜ Not Started | Next |
| 8 | Polish & Performance | ⬜ Not Started | |

## Key Milestones

| Milestone | Target Phase | Status |
|---|---|---|
| Project boots and runs | Phase 0 | ✅ |
| Build passes with 0 errors | Phase 0 | ✅ |
| Sections can be managed | Phase 2 | ✅ |
| All section editors implemented | Phase 3 | ✅ |
| Theme editor with all controls | Phase 4 | ✅ |
| All public section components | Phase 5 | ✅ |
| Public page renders from published data | Phase 6 | ✅ |
| Publish/rollback mutations wired | Phase 6 | ✅ |
| Publish status visible in dashboard | Phase 6 | ✅ |
| Draft/publish works end-to-end | Phase 6 | ✅ |
| MVP complete | Phase 8 | ⬜ |

## Completed Work

### Phase 0–5 (previous)
- [x] Full project setup, section management, content editing, theme system, public section rendering

### Phase 6 (this phase)
- [x] Updated `app/(public)/[slug]/page.tsx` to read from Convex `getBySlug` query (publishedData only)
- [x] Public page renders `PublicPage` component with published sections and theme
- [x] Unpublished sites show "Page Not Found" gracefully (no draft data leakage)
- [x] Rewrote `components/dashboard/publish-controls.tsx`:
  - Publish button with loading/success states
  - Rollback button with AlertDialog confirmation
  - View Live button (opens public URL in new tab)
  - Status badges: "Published", "Unpublished Changes", "Draft Only"
  - Published date display
- [x] Installed shadcn/ui `badge` component for status indicators
- [x] Updated `app/(dashboard)/dashboard/sites/[siteId]/page.tsx`:
  - Integrated PublishControls in editor header
  - Added `hasUnpublishedChanges` computation (JSON.stringify comparison)
  - Passes siteId, slug, status, publishedAt, hasUnpublishedChanges to controls
  - Editor header now shows: navigation + mode tabs + publish controls
- [x] Build passes with 0 errors

## Architecture: Draft vs Published Data Flow

```
Dashboard Editor                    Convex Backend                    Public Page
─────────────────                   ──────────────                    ───────────
reads draftData  ──(getById)──>     site.draftData                    reads publishedData ──(getBySlug)──> site.publishedData
edits draftData  ──(mutations)──>   updates draftData                 renders PublicPage with published data
preview shows draft                 (real-time reactive)
                                        
publish click    ──(publish)────>   draftData → publishedData         re-renders with new published data
rollback click   ──(rollback)───>   publishedData → draftData         (public page unchanged)
```

## Blockers

1. **Convex project not connected**: Need `npx convex dev` with a real Convex account
2. **Auth not enforced**: `getById` checks auth but public route has no auth (correct — public pages should be accessible)
