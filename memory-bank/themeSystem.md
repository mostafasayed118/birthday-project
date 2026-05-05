# Theme System — Romantic Microsite Platform

## Overview

The theme system stores all visual design decisions as data (tokens) in the database. These tokens are applied to the public page via CSS custom properties and Tailwind utilities, enabling full visual customization without code changes.

## Design Philosophy

1. **Theme as data** — All colors, fonts, spacing, and effects are database-stored tokens
2. **CSS variables first** — Tokens are converted to CSS custom properties for efficient updates
3. **Tailwind integration** — Tokens extend Tailwind's utility classes
4. **Preset-based quick start** — Pre-built themes for instant visual setup
5. **Override hierarchy** — Global tokens → Section-specific overrides → Inline styles

## Token Categories

### 1. Color Tokens

| Token | CSS Variable | Default | Description |
|---|---|---|---|
| `colors.primary` | `--color-primary` | `#e11d48` | Main brand/accent color |
| `colors.secondary` | `--color-secondary` | `#be123c` | Secondary accent |
| `colors.background` | `--color-background` | `#fef2f2` | Page background |
| `colors.surface` | `--color-surface` | `#ffffff` | Card/section backgrounds |
| `colors.text` | `--color-text` | `#1f2937` | Primary text color |
| `colors.textSecondary` | `--color-text-secondary` | `#6b7280` | Muted/secondary text |
| `colors.accent` | `--color-accent` | `#f59e0b` | Highlight/accent color |
| `colors.border` | `--color-border` | `#e5e7eb` | Border color |
| `colors.error` | `--color-error` | `#ef4444` | Error state |
| `colors.success` | `--color-success` | `#22c55e` | Success state |

**Color validation**: All color values must be valid CSS color values (hex, rgb, hsl).

### 2. Typography Tokens

| Token | CSS Variable | Default | Description |
|---|---|---|---|
| `typography.headingFont` | `--font-heading` | `'Playfair Display', serif` | Heading font family |
| `typography.bodyFont` | `--font-body` | `'Inter', sans-serif` | Body font family |
| `typography.headingWeight` | `--font-heading-weight` | `700` | Heading font weight |
| `typography.bodyWeight` | `--font-body-weight` | `400` | Body font weight |
| `typography.baseFontSize` | `--font-size-base` | `16` | Base font size (px) |
| `typography.lineHeight` | `--line-height-base` | `1.6` | Base line height |
| `typography.headingScale` | `--heading-scale` | `1.25` | Modular scale for headings |

**Font loading**: Google Fonts loaded via `<link>` tags in the page head. Font selection restricted to available Google Fonts.

### 3. Spacing Tokens

| Token | CSS Variable | Default | Description |
|---|---|---|---|
| `spacing.sectionPadding` | `--section-padding` | `80px` | Vertical padding per section |
| `spacing.containerWidth` | `--container-width` | `1200px` | Max content width |
| `spacing.elementGap` | `--element-gap` | `24px` | Gap between elements |
| `spacing.cardPadding` | `--card-padding` | `32px` | Inner padding for cards |

### 4. Border Tokens

| Token | CSS Variable | Default | Description |
|---|---|---|---|
| `borders.radius` | `--radius` | `8px` | Default border radius |
| `borders.cardRadius` | `--card-radius` | `12px` | Card border radius |
| `borders.buttonRadius` | `--button-radius` | `8px` | Button border radius |
| `borders.borderWidth` | `--border-width` | `1px` | Default border width |

### 5. Effect Tokens

| Token | CSS Variable | Default | Description |
|---|---|---|---|
| `effects.shadow` | `--shadow` | `0 1px 3px rgba(0,0,0,0.1)` | Default box shadow |
| `effects.cardShadow` | `--card-shadow` | `0 4px 6px rgba(0,0,0,0.1)` | Card box shadow |
| `effects.transition` | `--transition` | `all 0.2s ease` | Default transition |

## Theme Presets

Pre-built themes for quick starting. Each preset is a complete ThemeData object.

### Preset: Romantic Rose

```typescript
const romanticRose: ThemeData = {
  colors: {
    primary: '#e11d48',
    secondary: '#be123c',
    background: '#fef2f2',
    surface: '#ffffff',
    text: '#1f2937',
    textSecondary: '#6b7280',
    accent: '#f59e0b',
    border: '#fce7f3',
    error: '#ef4444',
    success: '#22c55e',
  },
  typography: {
    headingFont: 'Playfair Display',
    bodyFont: 'Inter',
    headingWeight: '700',
    bodyWeight: '400',
    baseFontSize: 16,
    lineHeight: 1.6,
    headingScale: 1.25,
  },
  // ... spacing, borders, effects
};
```

### Preset: Midnight Love

Dark theme with deep blues and gold accents.

### Preset: Garden Romance

Soft greens and blush pinks, nature-inspired.

### Preset: Classic Elegance

Black and white with gold accents, timeless look.

### Preset: Sunset Passion

Warm oranges, reds, and purples, sunset-inspired.

### Preset: Ocean Dreams

Teal, aqua, and white, beach/ocean-inspired.

## Theme Application Pipeline

### Step 1: Fetch Theme Data

```typescript
const theme = site.draftData.theme; // or publishedData.theme
```

### Step 2: Convert to CSS Variables

```typescript
function themeToCSSVariables(theme: ThemeData): Record<string, string> {
  return {
    '--color-primary': theme.colors.primary,
    '--color-secondary': theme.colors.secondary,
    // ... all tokens
  };
}
```

### Step 3: Apply to Root Element

```typescript
// In the page layout component
const cssVars = themeToCSSVariables(theme);
return (
  <div style={cssVars} className="min-h-screen bg-background text-text">
    {children}
  </div>
);
```

### Step 4: Tailwind Consumption

Tailwind config extends with the CSS variables:

```typescript
// tailwind.config.ts (conceptual)
theme: {
  extend: {
    colors: {
      primary: 'var(--color-primary)',
      secondary: 'var(--color-secondary)',
      background: 'var(--color-background)',
      surface: 'var(--color-surface)',
      text: 'var(--color-text)',
      // ...
    },
    fontFamily: {
      heading: 'var(--font-heading)',
      body: 'var(--font-body)',
    },
    // ...
  }
}
```

## Theme Editor UI

### Color Editor

- Color picker for each color token (shadcn/ui compatible)
- Hex input for precise values
- Preview swatch showing current color
- Reset to preset button

### Typography Editor

- Font family dropdown (curated Google Fonts list)
- Font weight selector
- Font size slider with preview text
- Live preview of heading and body text

### Spacing Editor

- Range sliders for padding, gap, container width
- Visual preview showing spacing changes
- Preset spacing values (compact, comfortable, spacious)

### Border Editor

- Border radius slider with visual preview
- Per-element radius controls

### Effects Editor

- Shadow intensity slider
- Transition speed control

### Preset Selector

- Grid of preset thumbnails
- Click to apply entire theme
- "Start from preset" option when creating new site

## Google Fonts List

Curated list of fonts suitable for romantic microsites:

### Heading Fonts

- Playfair Display
- Cormorant Garamond
- Libre Baskerville
- Lora
- Merriweather
- EB Garamond
- Great Vibes (script)
- Dancing Script (script)
- Pacifico (script)
- Satisfy (script)

### Body Fonts

- Inter
- Lato
- Open Sans
- Nunito
- Source Sans Pro
- Roboto
- PT Sans
- Work Sans

## Theme Validation

- All color values must be valid CSS colors
- Font families must be from the approved Google Fonts list
- Font sizes must be between 12px and 32px
- Line heights must be between 1.0 and 2.5
- Border radii must be between 0px and 24px
- Container width must be between 800px and 1400px
- Section padding must be between 20px and 160px

## Assumptions

1. **One theme per site** — No per-section theme overrides in MVP (architecturally supported for future)
2. **Google Fonts only** — No custom font uploads in MVP
3. **No dark/light mode toggle** — Theme is fixed (the preset defines whether it's light or dark)
4. **No CSS injection** — Users select from predefined options, not write custom CSS (Phase 1)
5. **Theme changes are instant** — CSS variable updates cause immediate visual re-render
