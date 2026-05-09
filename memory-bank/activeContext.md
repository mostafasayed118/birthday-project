# Active Context — Romantic Microsite Platform

## Current Phase

**CMS Architecture Complete** — Dashboard is the single source of truth. All content CMS-driven.

## What We're Working On

The Festive Air birthday celebration design from `stitch_blush_birthday_celebration` has been fully implemented as a demo page at `/demo`.

## Key Decisions Made

1. **Tech stack**: Next.js 16.2.4, TypeScript, Convex 1.37.0, Tailwind CSS v4, shadcn/ui v4
2. **Demo page**: Standalone `/demo` route implementing the Festive Air design exactly
3. **Theme preset**: Added "festive-air" to theme presets with Epilogue + Plus Jakarta Sans fonts
4. **Animations**: CSS keyframe animations in globals.css (float, shimmer, reveal, bloom, pulse-subtle)
5. **Icons**: Lucide React used instead of Material Symbols for React compatibility
6. **Design fidelity**: All 8 sections implemented: Hero, Quote, Timeline, Countdown, Memory Highlights, Photo Gallery, Love Notes, Music Player
7. **Wave dividers**: SVG wave components between sections
8. **Glassmorphism**: backdrop-blur-xl with semi-transparent backgrounds
9. **Scroll reveal**: IntersectionObserver-based fade-in-up animations

## Next Steps

1. Connect Convex project (`npx convex dev`) for end-to-end testing
2. Deploy to production
3. Optionally: Integrate Festive Air as a template option in the CMS

## File Tree (Final)

```
app/(public)/
  demo/page.tsx                   # Festive Air demo page (NEW - full birthday celebration)
  [slug]/page.tsx                 # Public microsite page
  layout.tsx                      # Public layout

app/globals.css                   # Updated with Festive Air animations and utilities
lib/theme-tokens.ts               # Updated with Festive Air preset + new fonts
app/page.tsx                      # Landing page (updated with /demo link)
```

## Key Files

| File | Purpose |
|---|---|
| `app/(public)/demo/page.tsx` | Full Festive Air birthday celebration page |
| `app/globals.css` | CSS animations (float, shimmer, reveal, bloom) + utilities |
| `lib/theme-tokens.ts` | Festive Air theme preset with exact design tokens |
| `stitch_blush_birthday_celebration/` | Source design files |
