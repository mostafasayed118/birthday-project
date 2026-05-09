# Dashboard User Guide

## Getting Started

### First Time Setup
1. Sign in at `/sign-in` using your account
2. Go to `/dashboard/sites`
3. Click **"New Site"** button
4. Enter site title and select occasion type
5. Your site is created with a default Hero section

## Dashboard Layout

```
┌──────────────────────────────────────────────────────────────┐
│ Header: Logo | Site Title | User Menu | Publish Button      │
├──────────┬───────────────────────────────────┬───────────────┤
│ Left     │ Center                            │ Right         │
│ Panel    │ Panel                             │ Panel         │
│          │                                   │               │
│ Sections │ Editor                            │ Live Preview  │
│ List     │ (Content/Form)                    │               │
│          │                                   │               │
│ - Drag   │ - Edit fields                     │ - Desktop     │
│ - Drop   │ - Save automatically              │ - Tablet      │
│ - Toggle │ - Theme colors                    │ - Mobile      │
│          │                                   │               │
└──────────────────────────────────────────────────────────────┘
```

## Step-by-Step Guide

### 1. Adding Sections

**From the left panel:**
1. Click **"Add Section"** button (plus icon)
2. Choose a section type
3. The new section appears in your list
4. Click to edit its content

### 2. Editing Section Content

**Each section has a specific editor:**

| Section | What You Edit |
|---------|--------------|
| Hero | Title, subtitle, background image, CTA button text, Send Love button |
| Message | Heading, paragraph text, alignment (left/center/right) |
| Gallery | Upload images, choose layout (grid/masonry/carousel), set columns |
| Timeline | Add events with dates, titles, descriptions |
| Quote | Quote text, author, visual style |
| Countdown | Target date, celebration animation |
| Audio | Upload tracks, set playlist options |
| Map | Location coordinates, marker label |
| Video | Video URL, autoplay settings |
| Stats | Add statistics with values and labels |
| Memory Highlights | Featured memory with image and text |
| Love Notes | Add guest messages |
| Footer | Copyright text, social media links |

### 3. Customizing Theme

1. Click the **palette icon** in the center panel
2. Adjust colors:
   - **Primary**: Main accent color (buttons, links)
   - **Secondary**: Supporting color
   - **Background**: Page background
   - **Text**: Main text color
3. Adjust typography:
   - Heading and body fonts
   - Font sizes and weights
4. Adjust spacing:
   - Section padding
   - Container width
   - Element gaps

### 4. Adding Animation Effects

1. Select a section in the left panel
2. Click the **clock icon** in the section editor
3. Choose:
   - **Animation Type**: Fade, Slide, Scale, or Bounce
   - **Duration**: Subtle (300ms), Smooth (500ms), or Dramatic (800ms)
   - **Delay**: Timing before animation starts
4. Click **"Apply"** to see in preview

### 5. Using the Preview

- Click **device icons** (📱💻🖥️) to switch viewports
- Scroll in preview to see full page
- Click **"View Live"** after publishing to see public version

### 6. Publishing Your Site

1. Click **"Publish"** button in header
2. Confirm "Publish changes to live site?"
3. Your site is now live at its URL!
4. Share the link with guests

## Feature Reference

### Sending Love (Hero Section)
- Add "Send Love" button text
- Configure animation duration (ms)
- Add custom love messages (array)
- Visitors click button to trigger heart animation

### Audio Player
- Upload MP3 files or provide URLs
- Set cover images for tracks
- Enable/disable: playlist, progress bar, autoplay
- Includes Play/Pause, Skip Back/Next controls

### Countdown Timer
- Set target date
- Choose visual style (boxes, flip, or minimal)
- Optional celebration animation when timer ends
- Animation types: icon (star), image, or GIF

### Image Upload
- Click upload button in any image field
- Supports JPG, PNG, GIF
- Images are stored in Convex
- Copy storageId from upload response

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Preview not updating | Refresh page, check internet connection |
| Image not showing | Verify storageId is copied correctly |
| Animation not working | Enable animation in section settings |
| Publish button disabled | No changes to publish yet |
| Login issues | Verify Clerk credentials in .env.local |

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| **Cmd/Ctrl + S** | Save current changes |
| **Cmd/Ctrl + Enter** | Publish site |
| **Cmd/Ctrl + P** | Preview site |
| **Cmd/Ctrl + Z** | Undo |
| **Cmd/Ctrl + Shift + Z** | Redo |
| **↑ / ↓** | Move between sections in manager |
| **Enter** | Edit selected section |

## Quick Tips

- **Drag sections** in left panel to reorder
- **Toggle visibility** with eye icon
- **Copy animation settings** between sections with clipboard button
- **Delete sections** with trash icon (confirm dialog appears)
- **Save is automatic** - look for green checkmark ✓
- **Keyboard navigation** works in section manager