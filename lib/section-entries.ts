import type { SectionRegistryEntry } from "./section-registry";

import { HeroSection } from "@/components/public/sections/hero-section";
import { MessageSection } from "@/components/public/sections/message-section";
import { GallerySection } from "@/components/public/sections/gallery-section";
import { TimelineSection } from "@/components/public/sections/timeline-section";
import { QuoteSection } from "@/components/public/sections/quote-section";
import { CountdownSection } from "@/components/public/sections/countdown-section";
import { MapSection } from "@/components/public/sections/map-section";
import { DividerSection } from "@/components/public/sections/divider-section";
import { SpacerSection } from "@/components/public/sections/spacer-section";
import { StatsSection } from "@/components/public/sections/stats-section";
import { FooterSection } from "@/components/public/sections/footer-section";
import { VideoSection } from "@/components/public/sections/video-section";
import { AudioSection } from "@/components/public/sections/audio-section";
import { MemoryHighlightsSection } from "@/components/public/sections/memory-highlights-section";
import { LoveNotesSection } from "@/components/public/sections/love-notes-section";

import { HeroEditor } from "@/components/dashboard/editors/hero-editor";
import { MessageEditor } from "@/components/dashboard/editors/message-editor";
import { GalleryEditor } from "@/components/dashboard/editors/gallery-editor";
import { TimelineEditor } from "@/components/dashboard/editors/timeline-editor";
import { QuoteEditor } from "@/components/dashboard/editors/quote-editor";
import { CountdownEditor } from "@/components/dashboard/editors/countdown-editor";
import { MapEditor } from "@/components/dashboard/editors/map-editor";
import { DividerEditor } from "@/components/dashboard/editors/divider-editor";
import { SpacerEditor } from "@/components/dashboard/editors/spacer-editor";
import { StatsEditor } from "@/components/dashboard/editors/stats-editor";
import { FooterEditor } from "@/components/dashboard/editors/footer-editor";
import { VideoEditor } from "@/components/dashboard/editors/video-editor";
import { AudioEditor } from "@/components/dashboard/editors/audio-editor";
import { MemoryHighlightsEditor } from "@/components/dashboard/editors/memory-highlights-editor";
import { LoveNotesEditor } from "@/components/dashboard/editors/love-notes-editor";

import type {
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
  LoveNotesContent,
} from "./types";

const ENTRIES: SectionRegistryEntry[] = [
  {
    type: "hero",
    label: "Hero Banner",
    description: "Full-width banner with title, subtitle, and background",
    icon: "LayoutTemplate",
    defaultContent: {
      title: "Happy Birthday,",
      subtitle: "Beautiful!",
      titleAlignment: "center",
      height: "full",
      backgroundOverlay: 30,
      overlayColor: "#874e58",
      ctaText: "Celebrate",
      ctaLink: "#our-story",
    } as HeroContent,
    defaultSettings: {},
    publicRenderer: HeroSection,
    editorComponent: HeroEditor,
  },
  {
    type: "message",
    label: "Message",
    description: "Text block for heartfelt messages",
    icon: "MessageSquareHeart",
    defaultContent: {
      heading: "A Letter to You",
      body: "Celebrating another incredible year of you. Here's to all the memories we've made and the beautiful moments yet to come. You make every day brighter.",
      alignment: "center",
      fontStyle: "default",
    } as MessageContent,
    defaultSettings: {},
    publicRenderer: MessageSection,
    editorComponent: MessageEditor,
  },
  {
    type: "gallery",
    label: "Gallery",
    description: "Photo gallery with grid layout",
    icon: "Images",
    defaultContent: {
      images: [],
      layout: "grid",
      columns: 3,
      showCaptions: true,
      gap: "16px",
    } as GalleryContent,
    defaultSettings: {},
    publicRenderer: GallerySection,
    editorComponent: GalleryEditor,
  },
  {
    type: "timeline",
    label: "Timeline",
    description: "Relationship timeline with events",
    icon: "GitBranch",
    defaultContent: {
      heading: "Our Journey",
      events: [
        { id: "1", date: "2020-01-15", title: "The First Hello", description: "That coffee shop by the corner where we talked for hours until they had to close. I knew right then this was something special.", image: "" },
        { id: "2", date: "2020-06-20", title: "Our First Trip", description: "Getting lost in the city streets, finding that hidden bakery, and laughing until our sides hurt. The world felt like it was just ours.", image: "" },
        { id: "3", date: "2024-12-25", title: "Today", description: "Celebrating you, the most amazing person I know. And this is just the beautiful beginning of our next chapter together.", image: "" },
      ],
      style: "alternating",
      showDates: true,
      showImages: true,
    } as TimelineContent,
    defaultSettings: {},
    publicRenderer: TimelineSection,
    editorComponent: TimelineEditor,
  },
  {
    type: "quote",
    label: "Quote",
    description: "Featured quote with styling",
    icon: "Quote",
    defaultContent: {
      text: "Life is a beautiful journey, and every year with you makes the view even more breathtaking.",
      style: "inline",
      backgroundStyle: "solid",
    } as QuoteContent,
    defaultSettings: {},
    publicRenderer: QuoteSection,
    editorComponent: QuoteEditor,
  },
  {
    type: "countdown",
    label: "Countdown",
    description: "Countdown timer to a special date",
    icon: "Timer",
    defaultContent: {
      title: "We can't wait to celebrate you!",
      targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      expiredMessage: "The moment has arrived!",
      style: "boxes",
      showLabels: true,
    } as CountdownContent,
    defaultSettings: {},
    publicRenderer: CountdownSection,
    editorComponent: CountdownEditor,
  },
  {
    type: "map",
    label: "Map",
    description: "Location map with marker",
    icon: "MapPin",
    defaultContent: {
      latitude: 48.8566,
      longitude: 2.3522,
      label: "Paris",
      zoom: 12,
      mapStyle: "standard",
      showLabel: true,
    } as MapContent,
    defaultSettings: {},
    publicRenderer: MapSection,
    editorComponent: MapEditor,
  },
  {
    type: "divider",
    label: "Divider",
    description: "Visual separator between sections",
    icon: "Minus",
    defaultContent: {
      style: "line",
    } as DividerContent,
    defaultSettings: {},
    publicRenderer: DividerSection,
    editorComponent: DividerEditor,
  },
  {
    type: "spacer",
    label: "Spacer",
    description: "Empty vertical space",
    icon: "ArrowUpDown",
    defaultContent: {
      height: "80px",
    } as SpacerContent,
    defaultSettings: {},
    publicRenderer: SpacerSection,
    editorComponent: SpacerEditor,
  },
  {
    type: "stats",
    label: "Stats",
    description: "Milestone numbers and statistics",
    icon: "BarChart3",
    defaultContent: {
      heading: "Our Milestones",
      items: [
        { id: "1", value: "365", label: "Days Together" },
        { id: "2", value: "1000+", label: "Memories" },
        { id: "3", value: "1", label: "Love Story" },
      ],
      layout: "row",
      animateOnScroll: true,
    } as StatsContent,
    defaultSettings: {},
    publicRenderer: StatsSection,
    editorComponent: StatsEditor,
  },
  {
    type: "footer",
    label: "Footer",
    description: "Page footer with closing message",
    icon: "PanelBottom",
    defaultContent: {
      text: "Made with love",
      socialLinks: [],
      showAttribution: true,
    } as FooterContent,
    defaultSettings: {},
    publicRenderer: FooterSection,
    editorComponent: FooterEditor,
  },
  {
    type: "video",
    label: "Video",
    description: "Embedded video player",
    icon: "Play",
    defaultContent: {
      url: "",
      autoplay: false,
      muted: true,
    } as VideoContent,
    defaultSettings: {},
    publicRenderer: VideoSection,
    editorComponent: VideoEditor,
  },
  {
    type: "audio",
    label: "Soundtrack",
    description: "Audio playlist player with multiple tracks",
    icon: "Music",
    defaultContent: {
      tracks: [],
      playlistTitle: "Our Soundtrack",
      playlistSubtitle: "Songs that tell our story",
      autoplay: false,
      loop: false,
      showPlaylist: true,
      showCoverImage: true,
      showProgressBar: true,
      showPlayer: true,
    } as AudioContent,
    defaultSettings: {},
    publicRenderer: AudioSection,
    editorComponent: AudioEditor,
  },
  {
    type: "memory_highlights",
    label: "Memory Highlight",
    description: "Split layout with image and text",
    icon: "Sparkles",
    defaultContent: {
      image: "",
      heading: "A Year of Beautiful Light",
      body: "This past year has been illuminated by your smile, your warmth, and the incredible way you touch the lives of everyone around you.",
      signoff: "Cheers to many more",
    } as MemoryHighlightsContent,
    defaultSettings: {},
    publicRenderer: MemoryHighlightsSection,
    editorComponent: MemoryHighlightsEditor,
  },
  {
    type: "love_notes",
    label: "Love Notes",
    description: "Masonry card grid with messages",
    icon: "Heart",
    defaultContent: {
      heading: "Love Notes",
      subtitle: "Messages from those who adore you.",
      notes: [
        { id: "1", initial: "J", name: "James", message: "Wishing the happiest of birthdays to my favorite person. You deserve the world and more. Love you always!", colorScheme: "secondary" },
        { id: "2", initial: "S", name: "Sarah", message: "Can't wait to celebrate you tonight! Get ready for the best night ever. Happy birthday gorgeous!", colorScheme: "primary" },
        { id: "3", initial: "M", name: "Mike", message: "Another year older, another year wiser, and definitely another year more beautiful. Have an amazing day!", colorScheme: "surface" },
        { id: "4", initial: "C", name: "Chloe", message: "Happy birthday to the most radiant soul! May your year ahead be as bright and beautiful as your smile. Cheers to you!", colorScheme: "primary" },
        { id: "5", initial: "D", name: "Daniel", message: "To another year of adventures and great memories! Wishing you the best day ever. You're truly one of a kind.", colorScheme: "secondary" },
        { id: "6", initial: "S", name: "Sophia", message: "Sending you so much love on your special day! You deserve all the happiness in the world. Have a wonderful celebration!", colorScheme: "surface" },
      ],
      ctaText: "Leave a Note",
      ctaLink: "#",
    } as LoveNotesContent,
    defaultSettings: {},
    publicRenderer: LoveNotesSection,
    editorComponent: LoveNotesEditor,
  },
];

export { ENTRIES as SECTION_ENTRIES };
