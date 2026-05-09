// Reusable validators for Convex schema
import { v } from "convex/values";

// Section content validators
export const HeroContent = v.object({
  title: v.string(),
  subtitle: v.optional(v.string()),
  backgroundImage: v.optional(v.string()),
  backgroundOverlay: v.optional(v.number()),
  overlayColor: v.optional(v.string()),
  ctaText: v.optional(v.string()),
  ctaLink: v.optional(v.string()),
  sendLoveText: v.optional(v.string()),
  heartAnimationDuration: v.optional(v.number()),
  loveMessages: v.optional(v.array(v.string())),
  titleAlignment: v.union(v.literal("left"), v.literal("center"), v.literal("right")),
  height: v.union(v.literal("full"), v.literal("large"), v.literal("medium")),
});

export const MessageContent = v.object({
  heading: v.optional(v.string()),
  body: v.string(),
  alignment: v.union(v.literal("left"), v.literal("center"), v.literal("right")),
  fontStyle: v.union(v.literal("default"), v.literal("handwritten"), v.literal("elegant")),
  maxWidth: v.optional(v.string()),
});

export const GalleryContent = v.object({
  images: v.array(
    v.object({
      id: v.string(),
      storageId: v.string(),
      src: v.optional(v.string()),
      caption: v.optional(v.string()),
      alt: v.optional(v.string()),
    })
  ),
  layout: v.union(v.literal("grid"), v.literal("masonry"), v.literal("carousel"), v.literal("stack")),
  columns: v.union(v.literal(2), v.literal(3), v.literal(4)),
  showCaptions: v.boolean(),
  gap: v.string(),
});

export const TimelineContent = v.object({
  heading: v.optional(v.string()),
  events: v.array(
    v.object({
      id: v.string(),
      date: v.string(),
      title: v.string(),
      description: v.optional(v.string()),
      image: v.optional(v.string()),
    })
  ),
  style: v.union(v.literal("vertical"), v.literal("horizontal"), v.literal("alternating")),
  showDates: v.boolean(),
  showImages: v.boolean(),
});

export const QuoteContent = v.object({
  text: v.string(),
  author: v.optional(v.string()),
  style: v.union(v.literal("card"), v.literal("inline"), v.literal("banner"), v.literal("scripture")),
  backgroundStyle: v.union(v.literal("solid"), v.literal("gradient"), v.literal("image")),
  backgroundImage: v.optional(v.string()),
});

export const CountdownContent = v.object({
  title: v.optional(v.string()),
  subtitle: v.optional(v.string()),
  targetDate: v.string(),
  expiredMessage: v.string(),
  style: v.union(v.literal("boxes"), v.literal("flip"), v.literal("minimal")),
  showLabels: v.boolean(),
  celebrationAnimation: v.optional(
    v.object({
      type: v.union(v.literal("gif"), v.literal("image"), v.literal("icon")),
      asset: v.optional(v.string()),
      enabled: v.optional(v.boolean()),
    })
  ),
});

export const MapContent = v.object({
  latitude: v.number(),
  longitude: v.number(),
  label: v.optional(v.string()),
  zoom: v.optional(v.number()),
  mapStyle: v.union(v.literal("standard"), v.literal("satellite"), v.literal("terrain")),
  showLabel: v.boolean(),
});

export const DividerContent = v.object({
  style: v.union(v.literal("line"), v.literal("ornament"), v.literal("gradient"), v.literal("image")),
  ornament: v.optional(v.string()),
  color: v.optional(v.string()),
  height: v.optional(v.string()),
});

export const SpacerContent = v.object({
  height: v.string(),
});

export const StatsContent = v.object({
  heading: v.optional(v.string()),
  items: v.array(
    v.object({
      id: v.string(),
      value: v.string(),
      label: v.string(),
      icon: v.optional(v.string()),
    })
  ),
  layout: v.union(v.literal("row"), v.literal("grid")),
  animateOnScroll: v.boolean(),
});

export const FooterContent = v.object({
  text: v.optional(v.string()),
  socialLinks: v.array(
    v.object({
      id: v.string(),
      platform: v.string(),
      url: v.string(),
      label: v.optional(v.string()),
    })
  ),
  showAttribution: v.boolean(),
});

export const VideoContent = v.object({
  url: v.string(),
  autoplay: v.boolean(),
  muted: v.boolean(),
  thumbnail: v.optional(v.string()),
});

export const AudioContent = v.object({
  tracks: v.array(
    v.object({
      id: v.string(),
      title: v.string(),
      artist: v.string(),
      storageId: v.optional(v.string()),
      url: v.optional(v.string()),
      coverImage: v.optional(v.string()),
      duration: v.optional(v.number()),
      caption: v.optional(v.string()),
      order: v.number(),
      enabled: v.boolean(),
    })
  ),
  playlistTitle: v.string(),
  playlistSubtitle: v.optional(v.string()),
  defaultTrackId: v.optional(v.string()),
  autoplay: v.boolean(),
  loop: v.boolean(),
  showPlaylist: v.boolean(),
  showCoverImage: v.boolean(),
  showProgressBar: v.boolean(),
  showPlayer: v.boolean(),
});

export const MemoryHighlightsContent = v.object({
  image: v.string(),
  heading: v.string(),
  body: v.string(),
  sparkline: v.optional(v.string()),
  signoff: v.string(),
});

export const LoveNoteItem = v.object({
  id: v.string(),
  initial: v.string(),
  name: v.string(),
  message: v.string(),
  colorScheme: v.union(v.literal("primary"), v.literal("secondary"), v.literal("surface")),
});

export const LoveNotesContent = v.object({
  heading: v.string(),
  subtitle: v.string(),
  notes: v.array(LoveNoteItem),
  ctaText: v.string(),
  ctaLink: v.string(),
});

// Union of all section content types
export const SectionContent = v.union(
  HeroContent,
  MessageContent,
  GalleryContent,
  TimelineContent,
  QuoteContent,
  CountdownContent,
  MapContent,
  DividerContent,
  SpacerContent,
  StatsContent,
  FooterContent,
  VideoContent,
  AudioContent,
  MemoryHighlightsContent,
  LoveNotesContent
);

// Section data validator (schema-level: structural validation only)
// Content is validated at the mutation boundary via the specific content validators above
export const SectionData = v.object({
  id: v.string(),
  type: v.union(
    v.literal("hero"),
    v.literal("message"),
    v.literal("gallery"),
    v.literal("timeline"),
    v.literal("quote"),
    v.literal("countdown"),
    v.literal("map"),
    v.literal("divider"),
    v.literal("spacer"),
    v.literal("stats"),
    v.literal("footer"),
    v.literal("video"),
    v.literal("audio"),
    v.literal("memory_highlights"),
    v.literal("love_notes")
  ),
  visible: v.boolean(),
  order: v.number(),
  content: v.any(),
  settings: v.any(),
});

// Theme validators
export const ThemeColors = v.object({
  primary: v.string(),
  secondary: v.string(),
  background: v.string(),
  surface: v.string(),
  text: v.string(),
  textSecondary: v.string(),
  accent: v.string(),
  border: v.string(),
  error: v.string(),
  success: v.string(),
  primaryContainer: v.optional(v.string()),
  secondaryContainer: v.optional(v.string()),
  surfaceDim: v.optional(v.string()),
  surfaceVariant: v.optional(v.string()),
  onPrimaryContainer: v.optional(v.string()),
  onSecondaryContainer: v.optional(v.string()),
  onSurfaceVariant: v.optional(v.string()),
  primaryFixed: v.optional(v.string()),
  primaryFixedDim: v.optional(v.string()),
  secondaryFixed: v.optional(v.string()),
});

export const ThemeTypography = v.object({
  headingFont: v.string(),
  bodyFont: v.string(),
  headingWeight: v.string(),
  bodyWeight: v.string(),
  baseFontSize: v.number(),
  lineHeight: v.number(),
  headingScale: v.number(),
});

export const ThemeSpacing = v.object({
  sectionPadding: v.string(),
  containerWidth: v.string(),
  elementGap: v.string(),
  cardPadding: v.string(),
});

export const ThemeBorders = v.object({
  radius: v.string(),
  cardRadius: v.string(),
  buttonRadius: v.string(),
  borderWidth: v.string(),
});

export const ThemeEffects = v.object({
  shadow: v.string(),
  cardShadow: v.string(),
  transition: v.string(),
});

export const ThemeData = v.object({
  colors: ThemeColors,
  typography: ThemeTypography,
  spacing: ThemeSpacing,
  borders: ThemeBorders,
  effects: ThemeEffects,
});

// Settings validator
export const SiteSettings = v.object({
  favicon: v.optional(v.string()),
  customCss: v.optional(v.string()),
  seoTitle: v.optional(v.string()),
  seoDescription: v.optional(v.string()),
  seoImage: v.optional(v.string()),
  backgroundColor: v.optional(v.string()),
});

// Site data validator (for both draft and published data)
export const SiteData = v.object({
  sections: v.array(SectionData),
  theme: ThemeData,
  settings: SiteSettings,
});