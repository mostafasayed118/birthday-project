# Project Summary

## Romantic Microsite Platform

A Next.js 16 application for creating customizable romantic microsites with full content and design control.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4 with OKLCH color system
- **Backend**: Convex (realtime database)
- **Auth**: Clerk
- **UI Components**: shadcn/ui (base-ui/react)
- **Icons**: lucide-react
- **Fonts**: next/font (Inter, Playfair Display)

## Project Structure

```
omar_project/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── (dashboard)/           # Dashboard routes
│   ├── (public)/              # Public site routes
│   └── api/                   # API routes
├── components/
│   ├── ui/                    # shadcn components
│   ├── public/                # Public page components
│   └── translatable.tsx       # Translation wrapper
├── convex/
│   ├── schema.ts              # Database schema
│   └── content.ts             # Content queries
├── i18n/
│   ├── config.ts              # Locale config (en, ar)
│   ├── provider.tsx           # I18n context provider
│   └── translations/          # Translation files
├── lib/
│   ├── types.ts               # TypeScript types
│   ├── content-keys.ts        # Content key registry
│   └── utils.ts               # Utility functions
└── hooks/
    └── use-content.ts         # Content fetching hooks
```

## Features

### Content Management
- Section-based page builder with 14 section types
- Real-time preview with theme customization
- Convex backend with automatic seeding
- Translatable content system (EN/AR)

### Authentication & Authorization
- Clerk integration with sign-in/sign-up pages
- Protected dashboard routes
- User-scoped site management

### UI Components
- Responsive dashboard layout
- Modal dialogs and forms
- Data tables with sorting
- Charts and analytics (Recharts)

## Internationalisation

- **Languages**: English, Arabic
- **Provider**: Custom `I18nProvider` with context
- **Storage**: localStorage for persistence
- **RTL Support**: Document direction changes for Arabic
- **Implementation**: 
  - `/i18n/config.ts` - locale configuration
  - `/i18n/provider.tsx` - React context provider
  - `/i18n/translations/` - EN/AR translation files

## Dark/Light Mode

- **Provider**: next-themes
- **Strategy**: Class-based (`.dark` class)
- **Integration**: `ThemeProvider` in root layout with system default
- **Toggle**: `ThemeToggle` component using Select dropdown (light/dark/system)
- **CSS**: OKLCH colors in globals.css with `.dark` variant

## Key Types

### Section Types
`hero`, `message`, `gallery`, `timeline`, `quote`, `countdown`, `map`, `divider`, `spacer`, `stats`, `footer`, `video`, `audio`, `memory_highlights`, `love_notes`

### Content Types
Stored in Convex with translations for `en` and `ar` fields.

## Scripts

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run lint` - ESLint
- `npm run test` - Vitest tests

## Environment Variables

```
NEXT_PUBLIC_CONVEX_URL=
```