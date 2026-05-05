# Public Page Architecture — Romantic Microsite Platform

## Overview

The public page is the end-user facing romantic microsite. It renders dynamically from database content and theme tokens, producing a beautiful, responsive single-page experience.

## Route Structure

```
/[slug] → Public microsite page
```

The slug is unique per site. Invalid slugs show a 404 page.

## Rendering Strategy

### Option A: SSR with Real-Time (Recommended for MVP)

```
Request → Next.js Server → Convex query (site by slug) → 
→ Server renders HTML → Send to client → 
→ Client hydrates with Convex real-time subscription
```

**Pros**: Always fresh data, SEO-friendly, fast initial load
**Cons**: Server load, Convex query on every request

### Option B: ISR (Incremental Static Regeneration)

```
First request → SSR → Cache HTML → 
Subsequent requests → Serve cached → 
Revalidate in background
```

**Pros**: Very fast for visitors, reduced server load
**Cons**: Slight delay for published changes to appear

### Decision: Start with SSR (Option A), optimize to ISR if performance demands it.

## Page Structure

```
┌──────────────────────────────────────┐
│           SECTION: Hero              │
│  Full-width hero with background     │
│  Title + Subtitle + CTA              │
├──────────────────────────────────────┤
│           SECTION: Message           │
│  Our story message / letter          │
├──────────────────────────────────────┤
│           SECTION: Gallery           │
│  Photo grid / carousel               │
├──────────────────────────────────────┤
│           SECTION: Timeline          │
│  Key moments in the relationship     │
├──────────────────────────────────────┤
│           SECTION: Quote             │
│  Featured quote                      │
├──────────────────────────────────────┤
│           SECTION: Countdown         │
│  Timer to special date               │
├──────────────────────────────────────┤
│           SECTION: Stats             │
│  Milestone numbers                   │
├──────────────────────────────────────┤
│           SECTION: Map               │
│  Special location                    │
├──────────────────────────────────────┤
│           SECTION: Footer            │
│  Closing message + credits           │
└──────────────────────────────────────┘
```

Sections render in the order defined by `section.order` in the database. Only sections with `visible: true` are rendered.

## Page Component Architecture

### Root Page Component

```typescript
// app/(public)/[slug]/page.tsx
async function PublicPage({ params }: { params: { slug: string } }) {
  // Server-side: fetch site data by slug
  // Render <MicrositePage> with fetched data
}
```

### Microsite Page Component

```typescript
// components/public/public-page.tsx
function PublicPage({ siteData, theme }: PublicPageProps) {
  // Apply theme as CSS custom properties
  // Map through sections in order
  // Render each section with its component
}
```

### Section Renderer

```typescript
// components/public/section-renderer.tsx
function SectionRenderer({ section, theme }: SectionRendererProps) {
  // Switch on section.type
  // Render appropriate section component
  // Pass section.content and section.settings as props
}
```

### Section Component Registry

```typescript
// components/public/sections/index.ts
const SECTION_COMPONENTS: Record<SectionType, React.ComponentType<SectionProps>> = {
  hero: HeroSection,
  message: MessageSection,
  gallery: GallerySection,
  timeline: TimelineSection,
  quote: QuoteSection,
  countdown: CountdownSection,
  map: MapSection,
  divider: DividerSection,
  spacer: SpacerSection,
  stats: StatsSection,
  footer: FooterSection,
  video: VideoSection,
  audio: AudioSection,
};
```

## Section Component Design

Every section component follows this pattern:

```typescript
interface SectionProps {
  content: SectionContent;     // Type-specific content
  settings: SectionSettings;   // Type-specific settings
  theme: ThemeData;            // Global theme tokens
  isPreview?: boolean;         // True when rendered in dashboard preview
}

function SectionComponent({ content, settings, theme, isPreview }: SectionProps) {
  // Apply theme tokens as CSS variables or Tailwind classes
  // Render content based on section data
  // Handle responsive layout
  // Apply animations/transitions
}
```

## Section Implementations

### Hero Section

- Full-viewport or configurable height
- Background image with overlay
- Title and subtitle with configurable alignment
- Optional CTA button
- Parallax scroll effect (subtle)
- Responsive: stacks vertically on mobile

### Message Section

- Centered text block with configurable max-width
- Optional heading
- Rich text body (supports bold, italic, links)
- Configurable alignment and font style
- Handwritten font option for personal touch

### Gallery Section

- Multiple layout modes: grid, masonry, carousel, stacked
- Configurable columns (2, 3, 4)
- Image lazy loading
- Click-to-open lightbox
- Optional captions
- Responsive: reduces columns on smaller screens

### Timeline Section

- Vertical or alternating layout
- Each event has: date, title, description, optional image
- Connected by a visual line
- Scroll-triggered reveal animation
- Responsive: switches to single-column on mobile

### Quote Section

- Configurable style: card (with background), inline, banner
- Large quote text with optional author attribution
- Decorative quotation marks
- Background: solid color, gradient, or image

### Countdown Section

- Real-time countdown to target date
- Shows days, hours, minutes, seconds
- Configurable style: boxes, flip clock, minimal
- Expired state shows custom message
- Uses `setInterval` for live updates

### Map Section

- Embedded map (OpenStreetMap via Leaflet or static image)
- Custom marker at coordinates
- Optional label
- Responsive: full-width on all screens

### Divider Section

- Visual separator between sections
- Styles: simple line, ornamental, gradient fade
- Configurable color and height
- Emoji ornament option

### Stats Section

- Row or grid of milestone numbers
- Animated count-up on scroll (Intersection Observer)
- Icon/emoji for each stat
- Responsive: wraps on mobile

### Footer Section

- Closing message
- Social links (optional)
- Platform attribution (optional)
- Background color from theme

## Theme Application

### CSS Custom Properties

The theme data is converted to CSS custom properties applied at the root level:

```css
:root {
  --color-primary: #e11d48;
  --color-secondary: #be123c;
  --color-background: #fef2f2;
  --color-surface: #ffffff;
  --color-text: #1f2937;
  --color-text-secondary: #6b7280;
  --color-accent: #f59e0b;
  --font-heading: 'Playfair Display', serif;
  --font-body: 'Inter', sans-serif;
  --section-padding: 80px;
  --container-width: 1200px;
  /* ... etc */
}
```

### Tailwind Integration

Tailwind config extends with these CSS variables, enabling utility classes like `bg-primary`, `text-surface`, `font-heading`, etc.

### Per-Section Overrides

Sections can optionally override theme tokens via their settings (e.g., a hero section might override the background color).

## Animations & Transitions

### Scroll Animations

- Sections fade in and slide up on scroll into view
- Implemented with Intersection Observer (no heavy animation library)
- CSS transitions preferred over JS animations
- `prefers-reduced-motion` media query respected

### Section Transitions

- Gallery images have hover effects
- Timeline events animate in sequence
- Stats numbers count up on scroll
- Countdown numbers have flip/transition effect

### Performance Considerations

- Animations use `transform` and `opacity` only (no layout thrashing)
- `will-change` used sparingly
- No animation libraries in production bundle
- Lazy load below-fold sections

## SEO

- Dynamic `<title>` tag from site title
- Meta description from site description
- Open Graph tags with OG image
- Structured data (JSON-LD) for event/love story markup (future)
- Semantic HTML (header, main, section, footer)
- Alt text on all images

## Responsive Design

### Breakpoints (Tailwind defaults)

- `sm`: 640px — Large phones
- `md`: 768px — Tablets
- `lg`: 1024px — Small laptops
- `xl`: 1280px — Desktops
- `2xl`: 1536px — Large screens

### Mobile-First Approach

- Base styles target mobile
- `md:` and `lg:` prefixes for larger screens
- Gallery columns reduce (4→3→2→1)
- Timeline switches to single-column
- Hero height reduces on mobile
- Font sizes scale down
- Section padding reduces

## Performance Targets

- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
- Time to Interactive: < 3s
- Lighthouse Performance score: > 90

## Error States

- **Invalid slug**: 404 page with "This page doesn't exist" message
- **Site not published**: "This page is not yet live" message
- **Missing sections**: Graceful skip (don't break the page)
- **Failed images**: Placeholder with alt text
- **Theme load failure**: Use default theme tokens
