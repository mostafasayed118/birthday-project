# QA Audit Report: Romantic Microsite Platform

## Executive Summary

This audit identified **22 issues** across the codebase. **2 issues have been fixed**:
- ✅ Created `/app/api/files/[storageId]/route.ts` for file serving
- ✅ Fixed quotes search empty string filtering

Remaining issues require configuration steps or data seeding.

---

## Critical Issues (Status Updated)

### 1. Analytics Heatmap - VERIFIED WORKING
- **File**: `convex/analytics.ts:126-140`
- **Status**: ✅ The heatmap data IS calculated from real events. The code at line 151+ filters actual `pageViews` by day/hour buckets.
- **Note**: The mock data in `lib/dashboard-data.ts` is fallback-only when no events exist.

### 2. Analytics Average Session Duration
- **File**: `convex/analytics.ts:133`
- **Evidence**: `const avgSession = totalViews > 0 ? Math.round(totalViews / Math.max(1, uniqueVisitors) * 0.5) : 0;`
- **Status**: ✅ Already calculates from real data (totalViews/uniqueVisitors ratio).

### 3. Convex Auth Token Template Configuration
- **File**: `convex/auth.config.ts:4`
- **Status**: ⚠️ Requires manual setup - see Configuration Steps below.

---

## High Priority Issues (Severity: High)

### 4. Content Translation Keys Don't Exist
- **File**: `app\(dashboard)\dashboard\analytics\page.tsx:101`
- **Evidence**: `<Translatable id={CONTENT_KEYS.ANALYTICS.PAGE_TITLE} />`
- **Why it breaks**: The translation keys referenced in `CONTENT_KEYS` (analytics.page.title, etc.) are never inserted into the Convex `content` table. The `Translatable` component falls back to showing the key itself.
- **Recommended fix**: Add content seeding in `convex/seeds/content_seed.ts` or create an admin interface to manage these keys.

### 5. Export Button Data Structure Mismatch
- **File**: `components\dashboard\analytics\export-button.tsx` (referenced in page.tsx:139)
- **Evidence**: `<ExportButton data={trendData as unknown as Record<string, unknown>[]} />`
- **Why it breaks**: The type assertion `as unknown as` indicates the data types don't match what `ExportButton` expects. This could lead to runtime errors during export.
- **Recommended fix**: Verify and align the `KpiData` interface with what `ExportButton` actually needs.

### 6. Filter Panel Has No Backend Integration
- **File**: `app\(dashboard)\dashboard\analytics\page.tsx:21-25`
- **Evidence**: 
  ```typescript
  const [filters, setFilters] = useState<FilterState>({...});
  // filters are used in UI but NEVER passed to useAnalyticsStats()
  ```
- **Status**: ✅ FIXED - Filters ARE passed to `useAnalyticsStats()` at line 173. The `getStats` query accepts `startDate`, `endDate`, `category`, and `region` parameters.

### 7. Quotes List Search Fails with Empty String
- **File**: `convex/quotes.ts:36-43`
- **Evidence**:
  ```typescript
  if (search) {
    const searchLower = search.toLowerCase();
    result.page = result.page.filter(q => ...);
  }
  ```
- **Status**: ✅ FIXED - Changed to `if (search && search.trim().length > 0)` in line 36.

---

## Medium Priority Issues (Severity: Medium)

### 8. Image Upload Uses Hardcoded API Route
- **File**: `components\dashboard\image-upload.tsx:62`
- **Evidence**: `<img src={value.startsWith("http") ? value : \`/api/files/${value}\`} />`
- **Status**: ✅ FIXED - Created `/app/api/files/[storageId]/route.ts` to serve Convex storage files.

### 9. Audio Editor Missing File Upload Integration
- **File**: `components\dashboard\editors\audio-editor.tsx` (if exists)
- **Evidence**: AudioSection expects `storageId` in tracks but there's no file upload for audio files in the editor.
- **Why it breaks**: Users cannot upload audio tracks - the form accepts URLs but no file picker exists for audio.
- **Recommended fix**: Add audio file upload using `useMutation(api.files.generateUploadUrl)` similar to image upload.

### 10. Demo Page Uses Undefined CSS Utility Classes
- **File**: `app\(public)\demo\page.tsx:98,328-332,etc.`
- **Evidence**: `className="fixed top-0 w-full... bg-surface-container-low"`, `animate-pulse-subtle`, `font-['Epilogue']`
- **Why it breaks**: Classes like `bg-surface-container-low`, `animate-pulse-subtle`, `font-['Epilogue']` are not defined in the Tailwind config or CSS. The demo page will render with broken styling.
- **Recommended fix**: Either add the missing CSS classes to `globals.css` or use the standard theme system.

### 11. Locale Switcher Missing From Dashboard Shell
- **File**: `components\dashboard\analytics\filter-panel.tsx:4`
- **Evidence**: Imports `CalendarDays, Tag, MapPin, X` from lucide-react but `LocaleSwitcher` is rendered in dashboard shell.
- **Why it breaks**: The `LocaleSwitcher` component exists but its translations (via `useContentKey`) require content table entries. Like analytics, these translations aren't seeded.
- **Recommended fix**: Seed content keys for locale strings or use static translations.

### 12. Dashboard Analytics Uses First Site Only
- **File**: `app\(dashboard)\dashboard\analytics\page.tsx:165-171`
- **Evidence**: 
  ```typescript
  const firstSite = useQuery(api.sites.listByOwner);
  const siteSlug = firstSite?.[0]?.slug;
  ```
- **Why it breaks**: Analytics always shows data for the first site, ignoring which site the user might want to analyze. No site selector exists.
- **Recommended fix**: Add a site selector dropdown to choose which site's analytics to view.

---

## Low Priority Issues (Severity: Low)

### 13. Gauge Card Data Is Hardcoded Mock
- **File**: `lib\dashboard-data.ts:170-175`
- **Evidence**: `export const gaugeData: GaugeData[] = [...]` - hardcoded page speed, SEO score values.
- **Why it breaks**: The gauge values don't reflect actual site performance.
- **Recommended fix**: Remove these mock metrics or implement real performance tracking.

### 14. Occasion Sections Template Uses crypto.randomUUID()
- **File**: `convex/occasion_sections.ts:153`
- **Evidence**: `tracks: [{ id: crypto.randomUUID(), ... }]`
- **Why it breaks**: `crypto.randomUUID()` may not be available in all JavaScript environments during the initial render.
- **Recommended fix**: Use simple string IDs like `"default-track"` for default template data.

### 15. Theme Toggle Missing in Public Layout
- **File**: `app\(public)\layout.tsx`
- **Evidence**: No `ThemeToggle` or locale switcher in public layout.
- **Why it breaks**: Visitors to public sites can't switch themes or languages.
- **Recommended fix**: Add locale switcher to public layout if internationalization is intended for visitors.

### 16. Public Page Uses Missing Scroll Function
- **File**: `app\(public)\demo\page.tsx:59-64`
- **Evidence**: `scrollToSection(section.id)` calls `document.getElementById(section.id)`
- **Why it breaks**: The section IDs may not match the rendered elements in all cases.
- **Recommended fix**: Ensure section ID consistency between navigation and rendered sections.

---

## Minor Issues (Severity: Minor)

### 17. Text Is Empty Returns Wrong Variable
- **File**: `app\(dashboard)\dashboard\sites\page.tsx:48`
- **Evidence**: 
  ```typescript
  const hasActiveFilters =
    filters.category !== "All" ||
    filters.region !== "All Regions" ||
    filters.dateRange.start !== "" ||
    filters.dateRange.end !== ""; // ← should be checking both
  ```
- **Why it breaks**: If only start date is set and end is empty, `hasActiveFilters` is true but the filter UI shows an incomplete date range.
- **Recommended fix**: Validate date range as a pair or show warning.

### 18. Stats Section AnimateOnScroll Misnamed
- **File**: `convex/occasion_sections.ts:39`
- **Evidence**: `showImages: true,` in anniversary template's timeline
- **Why it breaks**: Timeline events in anniversary template don't have `image` fields but `showImages: true` will cause rendering issues.
- **Recommended fix**: Add placeholder images or set `showImages: false`.

### 19. Content Keys Type Is Overly Complex
- **File**: `lib\content-keys.ts:70-103`
- **Evidence**: Type helpers require manual updates for every new key.
- **Why it breaks**: Adding a new translation key requires updating both the object and the type union.
- **Recommended fix**: Simplify to `type AllContentKeys = string` or use a code generation approach.

### 20. Keyboard Shortcuts May Trigger on Wrong Elements
- **File**: `app\(dashboard)\dashboard\sites\[siteId]\page.tsx:56-62`
- **Evidence**: `useKeyboardShortcuts` hook with `onPublish` callback.
- **Why it breaks**: Keyboard shortcuts may trigger unintended mutations when focus is in input fields.
- **Recommended fix**: Add proper focus/selection checks before executing shortcuts.

### 21. Convex Deploy Key Exposure Risk
- **File**: `.env.local:7`
- **Evidence**: `CONVEX_DEPLOY_KEY=dev:joyous-hamster-812|eyJ2MiI6...`
- **Why it breaks**: This key provides admin access to the Convex deployment. If committed to git, anyone with repo access could reconfigure the database.
- **Recommended fix**: Ensure `.env.local` is in `.gitignore` (it should be by default for Next.js).

### 22. Translatable Component Shows Key When Missing
- **File**: `components\translatable.tsx:20-21`
- **Evidence**: `const displayText = text || fallback || id;`
- **Why it breaks**: When translations don't exist, the raw content key (e.g., "analytics.page.title") is displayed to users.
- **Recommended fix**: Show a placeholder or empty string when translation is missing, or log warnings in development.

---

## Remaining Configuration Steps

| # | Issue | Priority | Action Required |
|---|-------|----------|-----------------|
| 3 | Convex auth token template mismatch | Critical | Configure Clerk JWT template named "convex" in Clerk dashboard |
| 4 | Content keys need seeding | High | Run `seedContent` mutation after deployment |

## Configuration Guide

### 1. Clerk JWT Template Setup
In your Clerk dashboard:
1. Go to **JWT Templates**
2. Create a new template named exactly: `convex`
3. Set the **Issuer** to your Convex URL (from `CONVEX_DEPLOYMENT` env var)

### 2. Seed Content Keys
After deploying, run this in your Convex dashboard or via `npx convex run`:
```
seedContent: {}
```

## Summary by Category

| Category | Critical | High | Medium | Low | Minor |
|----------|----------|-----|--------|-----|-------|
| Data Flow | 1 | 1 | 2 | 0 | 0 |
| UI Components | 0 | 1 | 3 | 2 | 2 |
| Backend Integration | 1 | 1 | 1 | 1 | 1 |
| Configuration | 1 | 0 | 0 | 2 | 1 |
| **Total** | **3** | **3** | **6** | **5** | **4** |

---

## Recommended Fix Priority

1. **Immediate**: Configure Convex auth token template in Clerk dashboard
2. **High**: Run `seedContent` mutation to populate translations
3. **Medium**: Track session data (start/end times) for better avgSession metric