---
name: Luminous Celebration
colors:
  surface: '#fdf8ff'
  surface-dim: '#ddd5ff'
  surface-bright: '#fdf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f7f1ff'
  surface-container: '#f1ebff'
  surface-container-high: '#ebe4ff'
  surface-container-highest: '#e6deff'
  on-surface: '#1c1149'
  on-surface-variant: '#514345'
  inverse-surface: '#31285f'
  inverse-on-surface: '#f4eeff'
  outline: '#847375'
  outline-variant: '#d6c2c3'
  surface-tint: '#874e58'
  primary: '#6b3741'
  on-primary: '#ffffff'
  primary-container: '#874e58'
  on-primary-container: '#ffccd3'
  inverse-primary: '#fcb3be'
  secondary: '#765a05'
  on-secondary: '#ffffff'
  secondary-container: '#fcd57a'
  on-secondary-container: '#775b06'
  tertiary: '#494740'
  on-tertiary: '#ffffff'
  tertiary-container: '#615f57'
  on-tertiary-container: '#ddd9cf'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffd9de'
  primary-fixed-dim: '#fcb3be'
  on-primary-fixed: '#360c17'
  on-primary-fixed-variant: '#6b3741'
  secondary-fixed: '#ffdf98'
  secondary-fixed-dim: '#e8c269'
  on-secondary-fixed: '#251a00'
  on-secondary-fixed-variant: '#5a4300'
  tertiary-fixed: '#e6e2d8'
  tertiary-fixed-dim: '#cac6bc'
  on-tertiary-fixed: '#1d1c16'
  on-tertiary-fixed-variant: '#48473f'
  background: '#fdf8ff'
  on-background: '#1c1149'
  surface-variant: '#e6deff'
typography:
  headline-lg:
    fontFamily: Epilogue
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Epilogue
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-sm:
    fontFamily: Epilogue
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  unit: 8px
  gutter: 24px
  margin: 32px
  container-max: 1200px
  section-padding: 128px
---

## Brand & Style
The brand personality is **ethereal, romantic, and celebratory**. It aims to evoke deep emotional warmth, nostalgia, and joy. The target audience is personal and intimate, focusing on shared memories and milestones.

The UI follows a **Soft-Glassmorphism** and **Tactile Modern** style. It utilizes frosted glass effects (`backdrop-blur-xl`), vibrant background ambient blurs (blobs), and subtle parallax motion to create a sense of living depth. The aesthetic is "premium-sentimental," using high-quality photography, generous whitespace, and delicate micro-animations to make the digital experience feel like a curated physical scrapbook or a high-end editorial piece.

## Colors
The palette is a sophisticated "Dusty Rose and Gold" theme. 
- **Primary (#874E58):** A muted, warm rose used for headlines and primary actions.
- **Secondary (#765A05):** A golden ochre used for accents, highlights, and status-like countdowns.
- **Backgrounds:** Uses a cool-toned lavender-white (`#FDF8FF`) to provide a fresh contrast to the warm primary tones.
- **Fixed/Containers:** Softer versions of the primary and secondary (like `#F4ACB7` and `#FFDF96`) are used for large surface areas like cards, blobs, and decorative dots to maintain a light, airy feel.

## Typography
The system uses a pairing of **Epilogue** for high-impact editorial headlines and **Plus Jakarta Sans** for clean, legible body text. 
- **Headlines:** Feature tight tracking and a mix of bold weights and occasional "Italic Light" styles for a poetic, magazine-like feel.
- **Body Text:** Focuses on generous line height (1.6) and lighter weights (400) to maintain an airy aesthetic.
- **Labels:** Are often uppercase with increased letter-spacing to act as stylistic markers or metadata.

## Layout & Spacing
The layout follows a **fixed-width container model** (max 1200px) centered on the page, with significant vertical breathing room. 
- **Rhythm:** An 8px base unit drives all dimensions. 
- **Sections:** Vertical separation is aggressive (128px or `py-32`), often bridged by decorative SVG wave dividers to soften transitions between background colors.
- **Grids:** Use a multi-column masonry-style grid for galleries and staggered 2-column layouts for narratives to create a "scrapbook" flow rather than a rigid corporate grid.

## Elevation & Depth
Depth is conveyed through **Atmospheric Layering** rather than traditional heavy shadows:
- **Glassmorphism:** Navigation and players use `backdrop-blur-xl` combined with semi-transparent white backgrounds (`bg-white/80`) to sit atop the content.
- **Ambient Glows:** Soft, blurred blobs (`blur-[100px]`) in primary and secondary colors create an "under-glow" effect that gives the page a dreamy quality.
- **Shadows:** Uses "Luminous Shadows" which are low-opacity but tinted with the primary color (e.g., `rgba(244,172,183,0.1)`) to make cards feel like they are floating in a warm environment.
- **Parallax:** Background elements move at different speeds (`data-speed`) to provide physical depth during scroll.

## Shapes
The shape language is **Ultra-Soft and Organic**.
- **Large Components:** Sections, hero containers, and large cards use extra-large radii (up to `2.5rem` or `rounded-[2.5rem]`).
- **Interactive Elements:** Buttons and tags are always fully "Pill-shaped" (`rounded-full`).
- **Imagery:** Photos often feature circular masks or heavy `rounded-[2rem]` corners to avoid sharp edges entirely, reinforcing the friendly and approachable brand tone.

## Components
- **Buttons:** Primary buttons are pill-shaped with subtle gradients (e.g., `from-primary-container to-primary-fixed`) and high-spread luminous shadows. On hover, they scale up slightly (`1.05`).
- **Cards (Love Notes):** Use white backgrounds with organic corners and a "corner-accent" (a colored circle tucked into the top-right) to add visual interest without clutter.
- **Timeline:** A soft vertical gradient line with "Pulse" dots. Dots expand on hover to draw the eye to specific moments.
- **Photo Gallery:** Uses varied aspect ratios (portrait, landscape, square) with wide gutters (24px) and hover-reveal overlays.
- **Music Player:** Features a large rounded album art cover, a custom-styled progress bar with a tactile "thumb" indicator, and minimalist icon controls.
- **Countdown:** Large display type for numbers, separated by vertical dividers, centered within a glass-morphic container.