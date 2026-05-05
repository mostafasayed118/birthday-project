# Dashboard Architecture — Romantic Microsite Platform

## Overview

The admin dashboard is the control center for creating and editing microsites. It provides full control over content, sections, theme, and publishing.

## Layout

```
┌──────────────────────────────────────────────────────────────┐
│  Header: Logo | Site Selector | User Menu | Publish Button   │
├──────────┬───────────────────────────────────┬───────────────┤
│          │                                   │               │
│  Left    │        Center                     │    Right      │
│  Panel   │        Content                    │    Panel      │
│          │                                   │               │
│ Section  │   Content Editor /                │   Live        │
│ Manager  │   Theme Editor                    │   Preview     │
│          │                                   │               │
│ (list of │   (forms for editing              │   (rendered   │
│  sections│    selected section's             │    public     │
│  with    │    content and settings)          │    page with  │
│  drag &  │                                   │    draft      │
│  drop)   │                                   │    data)      │
│          │                                   │               │
├──────────┴───────────────────────────────────┴───────────────┤
│  Footer: Save Status | Last Saved | Version Info             │
└──────────────────────────────────────────────────────────────┘
```

## Dashboard Pages/Routes

### `/dashboard` — Dashboard Home

- Overview of user's sites
- Quick stats (total sites, published sites)
- Create new site button
- Recent sites list

### `/dashboard/sites` — Sites List

- Grid/list of all user's sites
- Filter by status (draft, published, archived)
- Search by title/slug
- Quick actions: Edit, Preview, Delete

### `/dashboard/sites/[siteId]` — Site Editor

This is the main editing interface. It has three panels:

#### Left Panel: Section Manager

- Ordered list of all sections
- Each section shows: type icon, title, visibility toggle, drag handle
- Add section button (opens section type picker)
- Delete section (with confirmation)
- Drag-and-drop reordering
- Click to select → loads in center panel
- Collapse/expand panel for more preview space

#### Center Panel: Content Editor

- Contextual — shows editor for the currently selected element
- Three main editing modes:

**Mode 1: Section Content Editor**
- Form fields specific to the selected section type
- Image upload fields with preview
- Text inputs with character counts
- Date pickers for timeline events
- Conditional fields based on section settings

**Mode 2: Theme Editor**
- Color pickers for all theme colors
- Font selector (Google Fonts dropdown)
- Spacing sliders
- Border radius controls
- Live updates as user adjusts

**Mode 3: Site Settings**
- Title, slug, description
- SEO settings
- Favicon upload
- Occasion type selector

#### Right Panel: Live Preview

- Rendered version of the public page
- Uses draft data (not published data)
- Updates in real-time as edits are made
- Toggle between desktop/tablet/mobile viewport
- Full-page scroll preview
- Click on elements in preview to select them in editor

## Dashboard Components

### Site Header Component

```typescript
interface SiteHeaderProps {
  site: Site;
  isPublished: boolean;
  hasUnpublishedChanges: boolean;
  onPublish: () => void;
  onPreviewPublic: () => void;
}
```

### Section Manager Component

```typescript
interface SectionManagerProps {
  sections: SectionData[];
  selectedSectionId: string | null;
  onSelect: (sectionId: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  onToggleVisibility: (sectionId: string) => void;
  onAdd: (type: SectionType) => void;
  onDelete: (sectionId: string) => void;
}
```

### Content Editor Component

```typescript
interface ContentEditorProps {
  section: SectionData | null;
  sectionType: SectionType;
  onUpdateContent: (content: Partial<SectionContent>) => void;
  onUpdateSettings: (settings: Partial<SectionSettings>) => void;
}
```

Each section type has its own editor form component:

- `HeroEditor` — Title, subtitle, background image, overlay, CTA
- `MessageEditor` — Heading, rich text body, alignment
- `GalleryEditor` — Image upload grid, layout selector, column count
- `TimelineEditor` — Event list with add/edit/delete/reorder
- `QuoteEditor` — Text, author, style selector
- `CountdownEditor` — Date picker, labels, style
- `MapEditor` — Coordinates input, label, zoom
- `DividerEditor` — Style selector, color override
- `StatsEditor` — Stat items with value/label/icon
- `FooterEditor` — Text, social links

### Theme Editor Component

```typescript
interface ThemeEditorProps {
  theme: ThemeData;
  onUpdateTheme: (theme: Partial<ThemeData>) => void;
  onApplyPreset: (presetId: string) => void;
}
```

Sub-sections:
- **Color Editor** — Primary, secondary, background, surface, text, accent, border colors
- **Typography Editor** — Heading font, body font, font sizes, line heights
- **Spacing Editor** — Section padding, container width, element gap
- **Border Editor** — Border radius for various elements
- **Effects Editor** — Shadows, transitions

### Preview Panel Component

```typescript
interface PreviewPanelProps {
  siteData: SiteData;         // Draft data
  theme: ThemeData;
  viewport: 'desktop' | 'tablet' | 'mobile';
  onViewportChange: (v: Viewport) => void;
  onElementClick?: (sectionId: string) => void;
}
```

Renders the actual public page components with draft data. This is the SAME rendering pipeline as the public page, just with different data source.

### Publish Controls Component

```typescript
interface PublishControlsProps {
  hasDraft: boolean;
  hasPublished: boolean;
  hasUnpublishedChanges: boolean;
  onPublish: () => void;
  onRollback: () => void;
  onViewPublic: () => void;
}
```

Shows:
- "Publish" button (enabled only when there are unpublished changes)
- "View Live" link (only when published)
- "Rollback" option (only when published version exists)
- Last published timestamp
- Draft vs published diff summary (Phase 2)

## Dashboard Data Flow

### Initial Load

```
1. User navigates to /dashboard/sites/[siteId]
2. Dashboard layout checks auth (Convex Auth)
3. useQuery(api.sites.get, { siteId }) fetches site data
4. Site data includes both draftData and publishedData
5. Left panel renders section list from draftData.sections
6. Center panel shows section editor for first section (or default view)
7. Right panel renders preview with draftData
```

### Content Editing Flow

```
1. User selects section in left panel
2. Center panel loads appropriate editor component
3. User modifies content (text, image, settings)
4. Editor calls onUpdateContent/onUpdateSettings
5. This triggers a Convex mutation to update draftData
6. Mutation updates the site's draftData in Convex
7. Real-time subscription pushes update to all subscribers
8. Preview panel re-renders with new data
9. Save status indicator shows "Saved" ✓
```

### Section Reordering Flow

```
1. User grabs drag handle in section manager
2. Drag state managed locally (React state)
3. On drop, reorder is applied locally for instant feedback
4. Mutation fires to persist new order to draftData
5. Preview updates to reflect new section order
```

### Theme Editing Flow

```
1. User clicks "Theme" tab in center panel
2. Theme editor loads with current theme tokens
3. User adjusts colors, fonts, spacing
4. Each adjustment triggers a mutation (debounced)
5. Theme tokens update in draftData
6. Preview panel re-renders with new CSS variables
7. User sees real-time theme changes
```

### Publishing Flow

```
1. User clicks "Publish" button in header
2. Confirmation dialog: "Publish changes to live site?"
3. Mutation: copy draftData → publishedData
4. publishedAt timestamp updated
5. Public page now serves new data
6. Dashboard shows "All changes published" ✓
7. Publish button becomes disabled until next edit
```

## Dashboard State

### Server State (Convex)

- `site` — Full site object (draft + published)
- Derived: `sections` from `site.draftData.sections`
- Derived: `theme` from `site.draftData.theme`

### Local UI State

- `selectedSectionId` — Currently selected section
- `editorMode` — 'content' | 'theme' | 'settings'
- `previewViewport` — 'desktop' | 'tablet' | 'mobile'
- `isDragging` — Whether drag-and-drop is active
- `leftPanelCollapsed` — Panel collapse state
- `rightPanelCollapsed` — Panel collapse state

### Form State

- Content editor form values (controlled by React state)
- Unsaved changes indicator
- Validation errors

## Responsive Dashboard

The dashboard is designed for desktop/laptop use (min-width: 1024px). On smaller screens:

- Left panel becomes a slide-out drawer
- Right panel (preview) becomes a full-screen overlay toggle
- Center panel takes full width
- Drag-and-drop disabled on touch (use up/down buttons instead)

## Accessibility

- Keyboard navigation for section list
- ARIA labels for drag handles
- Focus management when selecting sections
- Screen reader announcements for save state
- High contrast mode support via shadcn/ui theming
