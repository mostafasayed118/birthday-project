# Content Model — Romantic Microsite Platform

## Overview

The content model defines how data is structured in the database to represent a microsite, its sections, content, and theme. This is the single source of truth for the Convex schema design.

## Top-Level Entity: Site

A **Site** is the root entity. Each site represents one romantic microsite.

### Site Properties

| Field | Type | Description |
|---|---|---|
| `id` | string (auto) | Unique identifier |
| `ownerId` | string | Auth user ID of the creator |
| `title` | string | Display title (e.g., "Our Love Story") |
| `slug` | string | URL slug (unique, e.g., "sarah-and-james") |
| `description` | string | Optional meta description |
| `occasionType` | enum | Type of occasion (anniversary, proposal, valentine, birthday, love-story, custom) |
| `status` | enum | "draft" / "published" / "archived" |
| `templateId` | string | Reference to template used (if any) |
| `createdAt` | number | Timestamp |
| `updatedAt` | number | Timestamp |
| `publishedAt` | number | Timestamp of last publish |
| `draftData` | object | Full draft content snapshot |
| `publishedData` | object | Full published content snapshot |

### Draft Data Structure

The `draftData` and `publishedData` fields contain the full site state as a JSON snapshot:

```typescript
interface SiteData {
  sections: SectionData[];
  theme: ThemeData;
  settings: SiteSettings;
}
```

This snapshot approach means:
- Draft and published states are fully independent
- Publishing = copying draftData to publishedData
- Rollback = copying publishedData back to draftData
- No complex diffing needed

## Section Entity

Sections are stored within the site's `draftData.sections` and `publishedData.sections` arrays.

### Section Data Structure

```typescript
interface SectionData {
  id: string;                    // Unique within the site
  type: SectionType;             // Maps to a React component
  visible: boolean;              // Toggle visibility
  order: number;                 // Sort order (0-indexed)
  content: SectionContent;       // Type-specific content (varies by type)
  settings: SectionSettings;     // Type-specific settings (varies by type)
}
```

### Section Types

| Type | Description | Content Schema |
|---|---|---|
| `hero` | Full-width hero banner | title, subtitle, backgroundImage, backgroundOverlay, ctaText, ctaLink |
| `message` | Text message/letter | heading, body (rich text), alignment |
| `gallery` | Photo gallery | images[], layout (grid/masonry/carousel), columns |
| `timeline` | Relationship timeline | events[].date, events[].title, events[].description, events[].image |
| `quote` | Featured quote | text, author, style (card/inline/banner) |
| `countdown` | Countdown timer | targetDate, title, subtitle, expiredMessage |
| `map` | Location map | latitude, longitude, label, zoom |
| `divider` | Visual divider | style (line/ornament/gradient), color |
| `spacer` | Empty space | height |
| `stats` | Numbers/milestones | items[].value, items[].label, items[].icon |
| `footer` | Page footer | text, socialLinks[], style |
| `video` | Embedded video | url, autoplay, muted, thumbnail |
| `audio` | Audio player | url, title, showPlayer |
| `rsvp` | RSVP form | title, fields[], submitText (Future) |

## Theme Data Structure

```typescript
interface ThemeData {
  colors: {
    primary: string;          // Main brand color
    secondary: string;        // Secondary accent
    background: string;       // Page background
    surface: string;          // Card/section backgrounds
    text: string;             // Primary text color
    textSecondary: string;    // Secondary/muted text
    accent: string;           // Highlight/accent color
    border: string;           // Border color
    error: string;            // Error state color
    success: string;          // Success state color
  };
  typography: {
    headingFont: string;      // Font family for headings
    bodyFont: string;         // Font family for body text
    headingWeight: string;    // Font weight for headings
    bodyWeight: string;       // Font weight for body
    baseFontSize: number;     // Base font size in px
    lineHeight: number;       // Base line height
    headingScale: number;     // Modular scale for headings
  };
  spacing: {
    sectionPadding: string;   // Vertical padding for sections (e.g., "80px")
    containerWidth: string;   // Max width for content containers
    elementGap: string;       // Gap between elements
    cardPadding: string;      // Inner padding for cards
  };
  borders: {
    radius: string;           // Default border radius
    cardRadius: string;       // Card border radius
    buttonRadius: string;     // Button border radius
    borderWidth: string;      // Default border width
  };
  effects: {
    shadow: string;           // Default box shadow
    cardShadow: string;       // Card shadow
    transition: string;       // Default transition
  };
}
```

## Site Settings

```typescript
interface SiteSettings {
  favicon?: string;           // storageId of favicon image
  customCss?: string;         // Future: custom CSS overrides
  seoTitle?: string;          // Override for <title> tag
  seoDescription?: string;    // Override for meta description
  seoImage?: string;          // Override for OG image
  backgroundColor?: string;   // Override page background
}
```

## Section Content Schemas (Detailed)

### Hero Section

```typescript
interface HeroContent {
  title: string;
  subtitle?: string;
  backgroundImage?: string;    // storageId
  backgroundOverlay?: number;  // 0-100 opacity
  overlayColor?: string;       // hex color
  ctaText?: string;
  ctaLink?: string;
  titleAlignment: 'left' | 'center' | 'right';
  height: 'full' | 'large' | 'medium';
}
```

### Message Section

```typescript
interface MessageContent {
  heading?: string;
  body: string;                 // Rich text (HTML or structured)
  alignment: 'left' | 'center' | 'right';
  fontStyle: 'default' | 'handwritten' | 'elegant';
  maxWidth?: string;
}
```

### Gallery Section

```typescript
interface GalleryContent {
  images: GalleryImage[];
  layout: 'grid' | 'masonry' | 'carousel' | 'stack';
  columns: 2 | 3 | 4;
  showCaptions: boolean;
  gap: string;
}

interface GalleryImage {
  id: string;
  storageId: string;
  caption?: string;
  alt?: string;
}
```

### Timeline Section

```typescript
interface TimelineContent {
  heading?: string;
  events: TimelineEvent[];
  style: 'vertical' | 'horizontal' | 'alternating';
  showDates: boolean;
  showImages: boolean;
}

interface TimelineEvent {
  id: string;
  date: string;                // ISO date string
  title: string;
  description?: string;
  image?: string;              // storageId
}
```

### Quote Section

```typescript
interface QuoteContent {
  text: string;
  author?: string;
  style: 'card' | 'inline' | 'banner' | 'scripture';
  backgroundStyle: 'solid' | 'gradient' | 'image';
  backgroundImage?: string;    // storageId
}
```

### Countdown Section

```typescript
interface CountdownContent {
  title?: string;
  subtitle?: string;
  targetDate: string;          // ISO datetime string
  expiredMessage: string;
  style: 'boxes' | 'flip' | 'minimal';
  showLabels: boolean;
}
```

### Map Section

```typescript
interface MapContent {
  latitude: number;
  longitude: number;
  label?: string;
  zoom?: number;
  mapStyle: 'standard' | 'satellite' | 'terrain';
  showLabel: boolean;
}
```

### Divider Section

```typescript
interface DividerContent {
  style: 'line' | 'ornament' | 'gradient' | 'image';
  ornament?: string;           // Emoji or SVG reference
  color?: string;              // Override from theme
  height?: string;
}
```

### Stats Section

```typescript
interface StatsContent {
  heading?: string;
  items: StatItem[];
  layout: 'row' | 'grid';
  animateOnScroll: boolean;
}

interface StatItem {
  id: string;
  value: string;               // Can be number or text like "3 years"
  label: string;
  icon?: string;               // Emoji or icon reference
}
```

## Content Relationships

```
Site (1) ──has──> (N) Sections [stored as array in site data]
Site (1) ──has──> (1) Theme [stored in site data]
Site (1) ──has──> (1) Settings [stored in site data]
Section (N) ──references──> (M) Images [via storageId]
```

## Content Rules

1. **Section IDs are unique per site** — Generated using `crypto.randomUUID()` or similar
2. **Section order is 0-indexed** — Gaps are not allowed; order is always contiguous
3. **Visible flag defaults to true** — New sections are visible by default
4. **Content is type-specific** — Each section type enforces its own content schema
5. **Theme is global** — One theme per site (future: per-section overrides)
6. **Draft is always the latest** — Every save updates the draft snapshot
7. **Published is a snapshot** — Only changes on explicit publish action
