// Occasion-specific section templates for new sites
// Organized by occasion type with appropriate default content

export const OCCASION_TEMPLATES: Record<string, Array<{
   type: "hero" | "message" | "gallery" | "timeline" | "quote" | "countdown" | "map" | "divider" | "spacer" | "stats" | "footer" | "video" | "audio" | "memory_highlights" | "love_notes";
   content: unknown;
   visible: boolean;
}>> = {
  birthday: [
    {
      type: "hero",
      visible: true,
      content: {
        title: "Happy Birthday,",
        subtitle: "Beautiful!",
        titleAlignment: "center" as const,
        height: "full" as const,
        backgroundOverlay: 30,
        overlayColor: "#874e58",
        ctaText: "Celebrate",
        ctaLink: "#our-story",
      },
    },
    {
      type: "quote",
      visible: true,
      content: {
        text: "Life is a beautiful journey, and every year with you makes the view even more breathtaking.",
        style: "inline" as const,
        backgroundStyle: "solid" as const,
      },
    },
    {
      type: "timeline",
      visible: true,
      content: {
        heading: "Our Journey",
        events: [
          {
            id: "1",
            date: "2020-01-15",
            title: "The First Hello",
            description: "That coffee shop by the corner where we talked for hours until they had to close.",
          },
          {
            id: "2",
            date: "2020-06-20",
            title: "Our First Trip",
            description: "Getting lost in the city streets, finding that hidden bakery, and laughing until our sides hurt.",
          },
          {
            id: "3",
            date: "2024-12-25",
            title: "Today",
            description: "Celebrating you, the most amazing person I know.",
          },
        ],
        style: "alternating" as const,
        showDates: true,
        showImages: true,
      },
    },
    {
      type: "countdown",
      visible: true,
      content: {
        title: "We can't wait to celebrate you!",
        targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        expiredMessage: "The moment has arrived!",
        style: "boxes" as const,
        showLabels: true,
      },
    },
    {
      type: "memory_highlights",
      visible: true,
      content: {
        image: "",
        heading: "A Year of Beautiful Light",
        body: "This past year has been illuminated by your smile, your warmth, and the incredible way you touch the lives of everyone around you.",
        signoff: "Cheers to many more",
      },
    },
    {
      type: "gallery",
      visible: true,
      content: {
        images: [],
        layout: "grid" as const,
        columns: 3 as const,
        showCaptions: true,
        gap: "16px",
      },
    },
    {
      type: "love_notes",
      visible: true,
      content: {
        heading: "Love Notes",
        subtitle: "Messages from those who adore you.",
        notes: [
          {
            id: "1",
            initial: "J",
            name: "James",
            message: "Wishing the happiest of birthdays to my favorite person.",
            colorScheme: "secondary" as const,
          },
          {
            id: "2",
            initial: "S",
            name: "Sarah",
            message: "Can't wait to celebrate you tonight! Happy birthday gorgeous!",
            colorScheme: "primary" as const,
          },
          {
            id: "3",
            initial: "M",
            name: "Mike",
            message: "Another year older, another year wiser, and definitely another year more beautiful.",
            colorScheme: "surface" as const,
          },
          {
            id: "4",
            initial: "C",
            name: "Chloe",
            message: "Happy birthday to the most radiant soul!",
            colorScheme: "primary" as const,
          },
          {
            id: "5",
            initial: "D",
            name: "Daniel",
            message: "To another year of adventures and great memories!",
            colorScheme: "secondary" as const,
          },
          {
            id: "6",
            initial: "S",
            name: "Sophia",
            message: "Sending you so much love on your special day!",
            colorScheme: "surface" as const,
          },
        ],
        ctaText: "Leave a Note",
        ctaLink: "#",
      },
    },
{
        type: "audio",
        visible: true,
        content: {
          tracks: [{ id: "audio-track-1", title: "Our Song", artist: "", storageId: "", url: "", order: 0, enabled: true }],
         playlistTitle: "Our Playlist",
         autoplay: false,
         loop: false,
         showPlaylist: true,
         showCoverImage: true,
         showProgressBar: true,
         showPlayer: true,
       },
     },
  ],
  anniversary: [
    {
      type: "hero",
      visible: true,
      content: {
        title: "Happy Anniversary,",
        subtitle: "My Forever Love",
        titleAlignment: "center" as const,
        height: "full" as const,
        backgroundOverlay: 30,
        overlayColor: "#7c3aed",
        ctaText: "Our Story",
        ctaLink: "#timeline",
      },
    },
    {
      type: "timeline",
      visible: true,
      content: {
        heading: "Our Journey Together",
        events: [
          {
            id: "1",
            date: "Our First Date",
            title: "The Beginning",
            description: "When I knew you were someone special.",
          },
          {
            id: "2",
            date: "First Trip",
            title: "Adventure Awaits",
            description: "Exploring the world hand in hand.",
          },
          {
            id: "3",
            date: "Today",
            title: "Forever and Always",
            description: "Growing more in love every single day.",
          },
        ],
        style: "alternating" as const,
        showDates: true,
        showImages: true,
      },
    },
    {
      type: "countdown",
      visible: true,
      content: {
        title: "Counting Down",
        targetDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        expiredMessage: "Happy Anniversary!",
        style: "boxes" as const,
        showLabels: true,
      },
    },
    {
      type: "love_notes",
      visible: true,
      content: {
        heading: "Love Notes",
        subtitle: "Cherished Memories",
        notes: [],
        ctaText: "Add a Note",
        ctaLink: "#",
      },
    },
    {
      type: "gallery",
      visible: true,
      content: {
        images: [],
        layout: "grid" as const,
        columns: 3 as const,
        showCaptions: true,
        gap: "16px",
      },
    },
  ],
  proposal: [
    {
      type: "hero",
      visible: true,
      content: {
        title: "The Question",
        subtitle: "Will you marry me?",
        titleAlignment: "center" as const,
        height: "full" as const,
        backgroundOverlay: 40,
        overlayColor: "#000000",
        ctaText: "Our Story",
        ctaLink: "#details",
      },
    },
    {
      type: "message",
      visible: true,
      content: {
        heading: "To My Forever Person",
        body: "Every moment with you has been a blessing. I can't imagine spending my life with anyone else. Will you do me the honor of becoming my wife?",
        alignment: "center" as const,
        fontStyle: "elegant" as const,
      },
    },
    {
      type: "gallery",
      visible: true,
      content: {
        images: [],
        layout: "grid" as const,
        columns: 3 as const,
        showCaptions: true,
        gap: "16px",
      },
    },
    {
      type: "countdown",
      visible: true,
      content: {
        title: "Big Day Countdown",
        targetDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        expiredMessage: "I do!",
        style: "boxes" as const,
        showLabels: true,
      },
    },
  ],
  valentine: [
    {
      type: "hero",
      visible: true,
      content: {
        title: "Happy Valentine's Day",
        subtitle: "My Heart Belongs to You",
        titleAlignment: "center" as const,
        height: "full" as const,
        backgroundOverlay: 30,
        overlayColor: "#dc2626",
        ctaText: "Read More",
        ctaLink: "#love-letter",
      },
    },
    {
      type: "quote",
      visible: true,
      content: {
        text: "You have no idea how much I love you, or how much I want to spend the rest of my life making you happy.",
        style: "scripture" as const,
        backgroundStyle: "gradient" as const,
      },
    },
    {
      type: "message",
      visible: true,
      content: {
        heading: "Why I Love You",
        body: "From the way you smile in the morning to the way you hold my hand when we walk together, you make every ordinary moment feel extraordinary. Happy Valentine's Day, my love.",
        alignment: "center" as const,
        fontStyle: "elegant" as const,
      },
    },
    {
      type: "love_notes",
      visible: true,
      content: {
        heading: "Reasons I Love You",
        subtitle: "100+ reasons and counting...",
        notes: [
          {
            id: "1",
            initial: "Y",
            name: "You",
            message: "Make every day better just by being in it",
            colorScheme: "primary" as const,
          },
        ],
        ctaText: "Add Reason",
        ctaLink: "#",
      },
    },
  ],
  wedding: [
    {
      type: "hero",
      visible: true,
      content: {
        title: "Our Wedding Day",
        subtitle: "Happily Ever After Begins",
        titleAlignment: "center" as const,
        height: "full" as const,
        backgroundOverlay: 25,
        overlayColor: "#6b7280",
        ctaText: "View Ceremony",
        ctaLink: "#ceremony",
      },
    },
    {
      type: "gallery",
      visible: true,
      content: {
        images: [],
        layout: "grid" as const,
        columns: 3 as const,
        showCaptions: true,
        gap: "16px",
      },
    },
    {
      type: "timeline",
      visible: true,
      content: {
        heading: "Our Wedding Timeline",
        events: [
          {
            id: "1",
            date: "Ceremony",
            title: "I Do!",
            description: "The moment we became one.",
          },
          {
            id: "2",
            date: "Reception",
            title: "Celebration",
            description: "Dancing the night away with our loved ones.",
          },
        ],
        style: "vertical" as const,
        showDates: true,
        showImages: true,
      },
    },
    {
      type: "message",
      visible: true,
      content: {
        heading: "Thank You",
        body: "Thank you to everyone who shared our special day with us. Your love and support mean the world to us.",
        alignment: "center" as const,
        fontStyle: "default" as const,
      },
    },
  ],
  "love-story": [
    {
      type: "hero",
      visible: true,
      content: {
        title: "Our Love Story",
        subtitle: "From the Beginning",
        titleAlignment: "center" as const,
        height: "full" as const,
        backgroundOverlay: 30,
        overlayColor: "#db2777",
        ctaText: "Read More",
        ctaLink: "#story",
      },
    },
    {
      type: "timeline",
      visible: true,
      content: {
        heading: "How We Met",
        events: [
          {
            id: "1",
            date: "The Beginning",
            title: "Chapter 1",
            description: "Where our story started...",
          },
          {
            id: "2",
            date: "First Date",
            title: "Chapter 2",
            description: "When sparks started flying.",
          },
          {
            id: "3",
            date: "Today",
            title: "The Present",
            description: "Writing our story together, one day at a time.",
          },
        ],
        style: "alternating" as const,
        showDates: true,
        showImages: true,
      },
    },
    {
      type: "gallery",
      visible: true,
      content: {
        images: [],
        layout: "grid" as const,
        columns: 3 as const,
        showCaptions: true,
        gap: "16px",
      },
    },
    {
      type: "message",
      visible: true,
      content: {
        heading: "Love Letters",
        body: "Words can't express how much you mean to me. Every day with you is a new adventure, and I'm so grateful to share this journey together.",
        alignment: "center" as const,
        fontStyle: "elegant" as const,
      },
    },
  ],
  custom: [
    {
      type: "hero",
      visible: true,
      content: {
        title: "Welcome to Our Story",
        subtitle: "A Personalized Journey",
        titleAlignment: "center" as const,
        height: "full" as const,
        backgroundOverlay: 30,
        overlayColor: "#3b82f6",
        ctaText: "Explore",
        ctaLink: "#sections",
      },
    },
    {
      type: "message",
      visible: true,
      content: {
        heading: "Our Message",
        body: "Share your unique story with those you love. Customize this page with your favorite moments, photos, and memories.",
        alignment: "center" as const,
        fontStyle: "default" as const,
      },
    },
    {
      type: "gallery",
      visible: true,
      content: {
        images: [],
        layout: "grid" as const,
        columns: 3 as const,
        showCaptions: true,
        gap: "16px",
      },
    },
  ],
};

// Type guard to ensure template is properly typed
export function getTemplateForOccasion(occasionType: string) {
  return OCCASION_TEMPLATES[occasionType] || OCCASION_TEMPLATES.custom;
}