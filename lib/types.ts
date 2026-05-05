export type SectionType =
  | "hero"
  | "message"
  | "gallery"
  | "timeline"
  | "quote"
  | "countdown"
  | "map"
  | "divider"
  | "spacer"
  | "stats"
  | "footer"
  | "video"
  | "audio";

export type OccasionType =
  | "anniversary"
  | "proposal"
  | "valentine"
  | "birthday"
  | "love-story"
  | "wedding"
  | "custom";

export type SiteStatus = "draft" | "published" | "archived";

export type ViewportSize = "desktop" | "tablet" | "mobile";
export type ViewData = ViewportSize;

export type EditorMode = "content" | "theme" | "settings";

export interface SectionData {
  id: string;
  type: SectionType;
  visible: boolean;
  order: number;
  content: SectionContent;
  settings: SectionSettings;
}

export type SectionContent =
  | HeroContent
  | MessageContent
  | GalleryContent
  | TimelineContent
  | QuoteContent
  | CountdownContent
  | MapContent
  | DividerContent
  | SpacerContent
  | StatsContent
  | FooterContent
  | VideoContent
  | AudioContent;

export type SectionSettings = Record<string, unknown>;

export interface HeroContent {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  backgroundOverlay?: number;
  overlayColor?: string;
  ctaText?: string;
  ctaLink?: string;
  titleAlignment: "left" | "center" | "right";
  height: "full" | "large" | "medium";
}

export interface MessageContent {
  heading?: string;
  body: string;
  alignment: "left" | "center" | "right";
  fontStyle: "default" | "handwritten" | "elegant";
  maxWidth?: string;
}

export interface GalleryContent {
  images: GalleryImage[];
  layout: "grid" | "masonry" | "carousel" | "stack";
  columns: 2 | 3 | 4;
  showCaptions: boolean;
  gap: string;
}

export interface GalleryImage {
  id: string;
  storageId: string;
  caption?: string;
  alt?: string;
}

export interface TimelineContent {
  heading?: string;
  events: TimelineEvent[];
  style: "vertical" | "horizontal" | "alternating";
  showDates: boolean;
  showImages: boolean;
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description?: string;
  image?: string;
}

export interface QuoteContent {
  text: string;
  author?: string;
  style: "card" | "inline" | "banner" | "scripture";
  backgroundStyle: "solid" | "gradient" | "image";
  backgroundImage?: string;
}

export interface CountdownContent {
  title?: string;
  subtitle?: string;
  targetDate: string;
  expiredMessage: string;
  style: "boxes" | "flip" | "minimal";
  showLabels: boolean;
}

export interface MapContent {
  latitude: number;
  longitude: number;
  label?: string;
  zoom?: number;
  mapStyle: "standard" | "satellite" | "terrain";
  showLabel: boolean;
}

export interface DividerContent {
  style: "line" | "ornament" | "gradient" | "image";
  ornament?: string;
  color?: string;
  height?: string;
}

export interface SpacerContent {
  height: string;
}

export interface StatsContent {
  heading?: string;
  items: StatItem[];
  layout: "row" | "grid";
  animateOnScroll: boolean;
}

export interface StatItem {
  id: string;
  value: string;
  label: string;
  icon?: string;
}

export interface FooterContent {
  text?: string;
  socialLinks: SocialLink[];
  showAttribution: boolean;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  label?: string;
}

export interface VideoContent {
  url: string;
  autoplay: boolean;
  muted: boolean;
  thumbnail?: string;
}

export interface AudioContent {
  url: string;
  title?: string;
  showPlayer: boolean;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  accent: string;
  border: string;
  error: string;
  success: string;
}

export interface ThemeTypography {
  headingFont: string;
  bodyFont: string;
  headingWeight: string;
  bodyWeight: string;
  baseFontSize: number;
  lineHeight: number;
  headingScale: number;
}

export interface ThemeSpacing {
  sectionPadding: string;
  containerWidth: string;
  elementGap: string;
  cardPadding: string;
}

export interface ThemeBorders {
  radius: string;
  cardRadius: string;
  buttonRadius: string;
  borderWidth: string;
}

export interface ThemeEffects {
  shadow: string;
  cardShadow: string;
  transition: string;
}

export interface ThemeData {
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  borders: ThemeBorders;
  effects: ThemeEffects;
}

export interface SiteSettings {
  favicon?: string;
  customCss?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoImage?: string;
  backgroundColor?: string;
}

export interface SiteData {
  sections: SectionData[];
  theme: ThemeData;
  settings: SiteSettings;
}

export interface SectionProps {
  content: SectionContent;
  settings: SectionSettings;
  theme: ThemeData;
  isPreview?: boolean;
}

export interface SectionRegistryEntry {
  type: SectionType;
  label: string;
  icon: string;
  component: React.ComponentType<SectionProps>;
  editorComponent?: React.ComponentType<unknown>;
  defaultContent: SectionContent;
  defaultSettings: SectionSettings;
}
