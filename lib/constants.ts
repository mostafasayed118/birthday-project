import type {
  SectionType,
  OccasionType,
  SectionContent,
  SectionSettings,
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
} from "./types";

export const SECTION_TYPES: { type: SectionType; label: string; icon: string }[] = [
  { type: "hero", label: "Hero Banner", icon: "LayoutTemplate" },
  { type: "message", label: "Message", icon: "MessageSquareHeart" },
  { type: "gallery", label: "Gallery", icon: "Images" },
  { type: "timeline", label: "Timeline", icon: "GitBranch" },
  { type: "quote", label: "Quote", icon: "Quote" },
  { type: "countdown", label: "Countdown", icon: "Timer" },
  { type: "map", label: "Map", icon: "MapPin" },
  { type: "divider", label: "Divider", icon: "Minus" },
  { type: "spacer", label: "Spacer", icon: "ArrowUpDown" },
  { type: "stats", label: "Stats", icon: "BarChart3" },
  { type: "footer", label: "Footer", icon: "PanelBottom" },
  { type: "video", label: "Video", icon: "Play" },
  { type: "audio", label: "Audio", icon: "Music" },
];

export const SECTION_DEFAULTS: Record<
  SectionType,
  { content: SectionContent; settings: SectionSettings }
> = {
  hero: {
    content: {
      title: "Our Love Story",
      subtitle: "A journey of love and devotion",
      titleAlignment: "center",
      height: "full",
      backgroundOverlay: 40,
      overlayColor: "#000000",
    } as HeroContent,
    settings: {},
  },
  message: {
    content: {
      heading: "A Letter to You",
      body: "Write your heartfelt message here...",
      alignment: "center",
      fontStyle: "default",
    } as MessageContent,
    settings: {},
  },
  gallery: {
    content: {
      images: [],
      layout: "grid",
      columns: 3,
      showCaptions: true,
      gap: "16px",
    } as GalleryContent,
    settings: {},
  },
  timeline: {
    content: {
      heading: "Our Journey Together",
      events: [],
      style: "vertical",
      showDates: true,
      showImages: true,
    } as TimelineContent,
    settings: {},
  },
  quote: {
    content: {
      text: "The best thing to hold onto in life is each other.",
      author: "Audrey Hepburn",
      style: "card",
      backgroundStyle: "solid",
    } as QuoteContent,
    settings: {},
  },
  countdown: {
    content: {
      title: "Counting Down To",
      subtitle: "Our Special Day",
      targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      expiredMessage: "The moment has arrived!",
      style: "boxes",
      showLabels: true,
    } as CountdownContent,
    settings: {},
  },
  map: {
    content: {
      latitude: 48.8566,
      longitude: 2.3522,
      label: "Paris",
      zoom: 12,
      mapStyle: "standard",
      showLabel: true,
    } as MapContent,
    settings: {},
  },
  divider: {
    content: {
      style: "ornament",
      ornament: " hearts ",
      height: "24px",
    } as DividerContent,
    settings: {},
  },
  spacer: {
    content: {
      height: "80px",
    } as SpacerContent,
    settings: {},
  },
  stats: {
    content: {
      heading: "Our Milestones",
      items: [
        { id: "1", value: "365", label: "Days Together", icon: " calendar " },
        { id: "2", value: "1000+", label: "Memories", icon: " photo " },
        { id: "3", value: "1", label: "Love Story", icon: " heart " },
      ],
      layout: "row",
      animateOnScroll: true,
    } as StatsContent,
    settings: {},
  },
  footer: {
    content: {
      text: "Made with love",
      socialLinks: [],
      showAttribution: true,
    } as FooterContent,
    settings: {},
  },
  video: {
    content: {
      url: "",
      autoplay: false,
      muted: true,
    } as VideoContent,
    settings: {},
  },
  audio: {
    content: {
      url: "",
      title: "Our Song",
      showPlayer: true,
    } as AudioContent,
    settings: {},
  },
};

export function getDefaultSections(occasionType: OccasionType) {
  const base = ["hero", "message", "gallery", "timeline", "quote", "footer"];

  const occasionSections: Record<OccasionType, string[]> = {
    anniversary: [...base],
    proposal: ["hero", "message", "gallery", "countdown", "footer"],
    valentine: ["hero", "quote", "gallery", "message", "timeline", "footer"],
    birthday: ["hero", "message", "gallery", "stats", "countdown", "footer"],
    "love-story": ["hero", "message", "timeline", "gallery", "quote", "map", "footer"],
    wedding: ["hero", "message", "timeline", "gallery", "stats", "map", "footer"],
    custom: [...base],
  };

  const sectionTypes = occasionSections[occasionType] || base;

  return sectionTypes.map((type, index) => {
    const typedType = type as SectionType;
    const defaults = SECTION_DEFAULTS[typedType];
    return {
      id: crypto.randomUUID(),
      type: typedType,
      visible: true,
      order: index,
      content: defaults.content,
      settings: defaults.settings,
    };
  });
}
