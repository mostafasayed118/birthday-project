# Active Context — Romantic Microsite Platform

## Current Phase

**Phase 0–6 Complete** — Ready for Phase 7 (Preview Panel enhancements or Polish).

## What We're Working On

Phase 6 (Draft/Publish Workflow) has been implemented. The full publish loop is now functional: dashboard edits draft data, public page reads published data, users can publish and rollback.

## Key Decisions Made

1. **Tech stack**: Next.js 16.2.4, TypeScript, Convex 1.37.0, Tailwind CSS v4, shadcn/ui v4
2. **Public route**: Client component using `useQuery(api.sites.getBySlug)` — reads publishedData only
3. **Unpublished state**: Shows "Page Not Found" — never leaks draft data
4. **hasUnpublishedChanges**: Computed via `JSON.stringify(draftData) !== JSON.stringify(publishedData)`
5. **Publish flow**: Button → loading state → Convex publish mutation → success badge → auto-clear after 3s
6. **Rollback flow**: Button → AlertDialog confirmation → Convex rollback mutation → draft replaced with published
7. **Status badges**: "Published" (green), "Unpublished Changes" (amber), "Draft Only" (neutral)
8. **Published date**: Shown in header when site has been published

## Next Steps

1. Connect Convex project (`npx convex dev`)
2. Begin Phase 7: Preview Panel — could enhance with viewport sync, better preview accuracy
3. Or Phase 8: Polish & Performance — loading states, error boundaries, SEO, responsive fixes

## File Tree (Updated for Phase 6)

```
app/(public)/
  [slug]/page.tsx                    # PUBLIC ROUTE (REWRITTEN - reads publishedData via Convex)

app/(dashboard)/dashboard/sites/
  [siteId]/page.tsx                  # EDITOR (UPDATED - integrated PublishControls in header)

components/dashboard/
  publish-controls.tsx               # (REWRITTEN - real shadcn/ui, publish/rollback/status)
  content-editor.tsx                 # (unchanged)
  preview-panel.tsx                  # (unchanged - still renders draft data correctly)
  section-manager.tsx                # (unchanged)
  theme-editor.tsx                   # (unchanged)

components/ui/
  badge.tsx                          # (NEW - shadcn/ui badge for status indicators)

convex/
  sites.ts                           # (unchanged - publish/rollback mutations already existed)
```

## Key Files

| File | Purpose |
|---|---|
| `app/(public)/[slug]/page.tsx` | Public route — reads published data via Convex query |
| `components/dashboard/publish-controls.tsx` | Publish/rollback/status UI |
| `app/(dashboard)/dashboard/sites/[siteId]/page.tsx` | Editor with publish controls in header |
| `convex/sites.ts` | Backend mutations: publish, rollback |
| `components/public/public-page.tsx` | Shared page renderer (used by both preview and public) |
