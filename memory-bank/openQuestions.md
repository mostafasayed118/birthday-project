# Open Questions — Romantic Microsite Platform

## Architecture Decisions

### Q1: Real-time on public pages?

**Question**: Should public pages maintain a real-time Convex subscription, or just fetch data on load?

**Option A**: Real-time — Public page reactively updates if admin publishes while visitor is viewing
**Option B**: Fetch-only — Public page loads data once, no WebSocket connection

**Recommendation**: Option B (fetch-only) for MVP. Real-time on public pages wastes resources for visitors. Admin preview already has real-time.

**Status**: OPEN

---

### Q2: SSR vs ISR for public pages?

**Question**: Should public pages be server-side rendered on every request, or statically generated with incremental revalidation?

**Option A**: SSR — Fresh data on every request, higher server load
**Option B**: ISR — Cached pages, revalidate every N seconds, faster for visitors

**Recommendation**: Start with SSR for simplicity, migrate to ISR if performance demands it.

**Status**: OPEN

---

### Q3: Image hosting strategy?

**Question**: Should images be stored in Convex file storage, or an external service (Cloudinary, S3)?

**Option A**: Convex file storage — Simple, integrated, limited free tier
**Option B**: Cloudinary — Image transformations, optimization, CDN, more setup
**Option C**: S3 + CloudFront — Most control, most setup

**Recommendation**: Start with Convex file storage. Migrate to Cloudinary if optimization/CDN needs arise.

**Status**: OPEN

---

### Q4: Rich text editor?

**Question**: What rich text editing approach for message/letter sections?

**Option A**: Simple textarea with markdown support
**Option B**: WYSIWYG editor (TipTap, Slate, ProseMirror)
**Option C**: Limited formatting buttons (bold, italic, link) on a contentEditable div

**Recommendation**: Option C for MVP — simple formatting buttons, store as HTML. Full WYSIWYG in Phase 2.

**Status**: OPEN

---

### Q5: Drag-and-drop library?

**Question**: Which library for section reordering?

**Option A**: dnd-kit — Modern, accessible, performant, TypeScript-first
**Option B**: react-beautiful-dnd — Mature, well-documented, but maintenance mode
**Option C**: @dnd-kit/sortable — Built on dnd-kit, specifically for sortable lists

**Recommendation**: dnd-kit with @dnd-kit/sortable. Best combination of features and maintenance.

**Status**: OPEN

---

### Q6: State management for dashboard?

**Question**: Do we need a global state management library?

**Option A**: React Context + useState — Simple, sufficient for most needs
**Option B**: Zustand — Lightweight, minimal boilerplate
- **Option C**: Jotai — Atomic state, fine-grained updates

**Recommendation**: Start with React Context + useState. Convex handles server state. Add Zustand only if complexity demands it.

**Status**: OPEN

---

## Product Decisions

### Q7: Template system?

**Question**: Should new sites start from predefined templates, or always from a blank slate with default sections?

**Option A**: Template picker — Multiple pre-configured layouts/themes to choose from
**Option B**: Single default — All new sites get the same default sections and theme
**Option C**: Occasion-based — Different defaults based on occasion type (anniversary vs proposal)

**Recommendation**: Option C — occasion-based defaults with the ability to change later. Templates can be added in Phase 2.

**Status**: OPEN

---

### Q8: Section type catalog for MVP?

**Question**: Which section types should be available in the first release?

**Minimum viable**: hero, message, gallery, timeline, quote, countdown, footer
**Nice to have**: divider, stats, map, video, audio, spacer

**Recommendation**: Start with the minimum viable set. Add more types incrementally.

**Status**: OPEN

---

### Q9: Custom CSS/HTML from users?

**Question**: Should users be able to inject custom CSS or HTML blocks?

**Option A**: No custom code — Only predefined options (safer, simpler)
**Option B**: Custom CSS only — Limited styling customization
**Option C**: Custom HTML blocks — Full flexibility but potential security/performance issues

**Recommendation**: Option A for MVP. Option B in a future phase if users request it.

**Status**: OPEN

---

### Q10: Multi-site per user?

**Question**: Should a user be able to create multiple microsites?

**Recommendation**: Yes, architecture already supports it. No limit in MVP. Future: plan limits based on subscription.

**Status**: OPEN (but architecture is ready)

---

## Technical Decisions

### Q11: Google Fonts loading strategy?

**Question**: How should Google Fonts be loaded?

**Option A**: Next.js `next/font` — Optimized, self-hosted, best performance
- **Option B**: `<link>` tag — Simple, relies on Google CDN
- **Option C**: `@import` in CSS — Simplest, worst performance

**Recommendation**: Option A (next/font) for optimal performance and privacy.

**Status**: OPEN

---

### Q12: Form library?

**Question**: Which form library for content editing?

**Option A**: React Hook Form — Performance-first, minimal re-renders
**Option B**: Controlled components — Simple, no extra dependency
**Option C**: Formik — Feature-rich, more overhead

**Recommendation**: Option B for simple forms, Option A for complex forms (timeline editor). Keep it minimal.

**Status**: OPEN

---

## Resolved Questions

_(None yet — add questions here once decided)_
