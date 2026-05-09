---
name: Festive Air
colors:
  surface: '#fdf8ff'
  surface-dim: '#ded4ff'
  surface-bright: '#fdf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f7f1ff'
  surface-container: '#f1ebff'
  surface-container-high: '#ece4ff'
  surface-container-highest: '#e6deff'
  on-surface: '#1c1149'
  on-surface-variant: '#514345'
  inverse-surface: '#32285f'
  inverse-on-surface: '#f4eeff'
  outline: '#847375'
  outline-variant: '#d6c2c3'
  surface-tint: '#874e58'
  primary: '#874e58'
  on-primary: '#ffffff'
  primary-container: '#f4acb7'
  on-primary-container: '#733d47'
  inverse-primary: '#fcb3be'
  secondary: '#765a05'
  on-secondary: '#ffffff'
  secondary-container: '#ffd87c'
  on-secondary-container: '#795d08'
  tertiary: '#605e56'
  on-tertiary: '#ffffff'
  tertiary-container: '#c2bfb5'
  on-tertiary-container: '#4f4e46'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffd9de'
  primary-fixed-dim: '#fcb3be'
  on-primary-fixed: '#360c17'
  on-primary-fixed-variant: '#6b3741'
  secondary-fixed: '#ffdf96'
  secondary-fixed-dim: '#e7c268'
  on-secondary-fixed: '#251a00'
  on-secondary-fixed-variant: '#5a4400'
  tertiary-fixed: '#e6e2d8'
  tertiary-fixed-dim: '#cac6bc'
  on-tertiary-fixed: '#1c1c15'
  on-tertiary-fixed-variant: '#48473f'
  background: '#fdf8ff'
  on-background: '#1c1149'
  surface-variant: '#e6deff'
typography:
  headline-lg:
    fontFamily: Epilogue
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Epilogue
    fontSize: 32px
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
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  gutter: 24px
  margin: 32px
  container-max: 1200px
---

## Brand & Style

The brand personality of this design system is joyful, intimate, and warm. It is designed to evoke the feeling of a heartfelt invitation or a cherished memory. The target audience includes individuals celebrating personal milestones, prioritizing emotional connection and ease of use.

The aesthetic leans into a **Modern Airy** style with subtle **Glassmorphism** influences. It utilizes heavy whitespace to create a sense of breathability, paired with translucent layers and soft gradients that mimic the delicate nature of confetti and silk ribbons. The result is a UI that feels lightweight, celebratory, and premium without being formal.

## Colors

The palette is anchored by a warm **Blush Pink** (Primary) which provides a soft, emotive base for the interface. **Soft Gold** (Secondary) is used sparingly for highlights, icons, and interactive states to suggest quality and celebration. **Creamy White** (Tertiary) replaces standard stark white for backgrounds to maintain a cozy, organic feel.

For text and high-contrast elements, a deep, desaturated purple-tinted neutral is used to ensure legibility while harmonizing with the warm tones of the primary palette. Use gradients that transition from the Primary Pink to a slightly lighter tint to create a sense of volume on interactive surfaces.

## Typography

This design system uses a two-tier typographic approach. Headlines utilize **Epilogue**, chosen for its distinctive and expressive character that mimics the personality of editorial handwriting. It should be typeset with tight tracking in larger sizes to emphasize its playful geometry.

For all functional and long-form text, **Plus Jakarta Sans** provides a modern, soft, and welcoming feel. Its rounded terminals complement the overall UI shape language. Use larger line heights (1.6) for body text to maintain the airy, low-density layout philosophy.

## Layout & Spacing

This design system employs a **fixed grid** model for desktop views, transitioning to a fluid model for mobile. The layout is built on a 12-column grid with generous 24px gutters to prevent elements from feeling crowded. 

The spacing rhythm is strictly based on an 8px scale. High-level sections should use significant vertical padding (80px to 120px) to reinforce the "airy" brand pillar. Content should be centered within a 1200px container to ensure a focused, intimate reading experience on large displays.

## Elevation & Depth

Hierarchy is established through **Ambient Shadows** and **Tonal Layers**. Rather than using harsh black shadows, this design system uses soft, diffused shadows tinted with the Primary Blush Pink (e.g., 15% opacity, 20px blur, 4px offset).

Depth is further enhanced through semi-transparent surfaces. Modals and floating navigation bars should utilize a background blur (12px to 20px) to create a "frosted glass" effect against the creamy background. This maintains a sense of physical layering while keeping the interface feeling light and luminous.

## Shapes

The shape language is consistently **Rounded**. Standard UI elements like buttons and input fields use a 0.5rem (8px) radius. Larger containers, such as cards and hero sections, should utilize the `rounded-xl` (1.5rem / 24px) setting to emphasize the friendly, soft nature of the brand.

Avoid sharp 90-degree corners entirely. Decorative elements, such as image frames or pull-quotes, can occasionally use asymmetrical rounding (e.g., rounding only the top-left and bottom-right corners) to add a whimsical, playful touch to the layout.

## Components

### Buttons
Primary buttons feature a soft gradient from Blush Pink to a lighter peach tone. They use a subtle shadow that expands slightly on hover to simulate a "lifted" physical effect. Text inside buttons should use the Label-md style in a high-contrast neutral.

### Cards
Cards are the primary content vessel. They feature a Creamy White background, `rounded-xl` corners, and the signature tinted ambient shadow. Borders should be avoided; if necessary, use a very thin (1px) stroke in a slightly darker cream or gold tone.

### Inputs & Form Elements
Input fields use the Creamy White base with a soft 1px border in Blush Pink. When focused, the border weight remains the same but the Soft Gold color is applied, accompanied by a subtle outer glow in the same gold hue.

### Chips & Tags
Used for categories or dates, chips are pill-shaped with a light Gold background and dark Neutral text. They serve as small "charms" within the layout.

### Interactive Feedback
Hover states across all components should feel "bouncy." Use short duration (200ms) spring-based transitions for scale and shadow changes to maintain the playful energy of a celebration.