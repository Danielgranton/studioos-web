import {
  Mic2,
  Music2,
  PenTool,
  Guitar,
  Video,
  Palette,
  Megaphone,
  Globe2,
  FileVideo,
  Podcast,
  Disc3,
  Camera,
  GraduationCap,
  BriefcaseBusiness,
  CalendarDays,
} from "lucide-react";

export const serviceCategories = [
  {
    id: "recording-audio",
    title: "Recording & Audio",
    description:
      "Professional recording, editing, mixing and mastering services.",
    icon: Mic2,
    accent: "blue",
    services: [
      "Recording Session",
      "Record Vocals",
      "Record Instruments",
      "Podcast Recording",
      "Voice-over Recording",
      "Vocal Mixing",
      "Beat + Vocal Mixing",
      "Stem Mixing",
      "Live Recording Mixing",
      "Stereo Mastering",
      "Streaming Mastering",
      "Vinyl Mastering",
      "Vocal Tuning",
      "Vocal Editing",
      "Vocal Comping",
      "Noise Removal",
      "Timing Correction",
    ],
  },

  {
    id: "music-production",
    title: "Music Production",
    description:
      "Create original music from beats to full song arrangements.",
    icon: Music2,
    accent: "purple",
    services: [
      "Beat Production",
      "Custom Beat Creation",
      "Music Composition",
      "Song Arrangement",
      "Instrument Programming",
      "Sound Design",
      "Live Instrumentation",
      "Sample Replay",
    ],
  },

  {
    id: "songwriting",
    title: "Songwriting",
    description:
      "Collaborate with experienced songwriters and composers.",
    icon: PenTool,
    accent: "pink",
    services: [
      "Lyric Writing",
      "Melody Writing",
      "Hook Writing",
      "Ghostwriting",
      "Song Translation",
      "Co-writing Sessions",
    ],
  },

  {
    id: "session-musicians",
    title: "Session Musicians",
    description:
      "Hire professional musicians for studio sessions and live recordings.",
    icon: Guitar,
    accent: "green",
    services: [
      "Guitarist",
      "Pianist",
      "Bass Player",
      "Drummer",
      "Saxophonist",
      "Violinist",
      "Backing Vocalists",
      "Choir",
    ],
  },

  {
    id: "video-production",
    title: "Video Production",
    description:
      "Everything needed to produce professional music videos.",
    icon: Video,
    accent: "red",
    services: [
      "Music Video Shoot",
      "Video Editing",
      "Colour Grading",
      "Drone Footage",
      "Behind-the-scenes Filming",
      "Performance Video",
      "Lyric Video",
      "Visualizers",
      "Reels & TikTok Edits",
    ],
  },

  {
    id: "branding-design",
    title: "Branding & Design",
    description:
      "Build a memorable artist identity and visual brand.",
    icon: Palette,
    accent: "orange",
    services: [
      "Album Cover",
      "Single Artwork",
      "EP Artwork",
      "Logo Design",
      "Artist Branding",
      "Merchandise Design",
      "Poster Design",
      "Social Media Graphics",
    ],
  },

  {
    id: "marketing",
    title: "Marketing & Promotion",
    description:
      "Promote your music across streaming platforms and social media.",
    icon: Megaphone,
    accent: "yellow",
    services: [
      "Spotify Promotion",
      "Apple Music Promotion",
      "YouTube Promotion",
      "TikTok Campaigns",
      "Instagram Marketing",
      "Facebook Ads",
      "Influencer Outreach",
      "Press Release Writing",
      "Playlist Pitching",
    ],
  },

  {
    id: "distribution",
    title: "Distribution",
    description:
      "Prepare and distribute your music worldwide.",
    icon: Globe2,
    accent: "cyan",
    services: [
      "Release Setup",
      "Metadata Preparation",
      "ISRC Registration",
      "Distribution Management",
      "Royalty Setup",
    ],
    platforms: [
      "DistroKid",
      "TuneCore",
      "CD Baby",
      "Ditto",
      "ONErpm",
      "UnitedMasters",
    ],
  },

  {
    id: "youtube",
    title: "YouTube Services",
    description:
      "Launch and grow your YouTube music presence.",
    icon: FileVideo,
    accent: "red",
    services: [
      "Channel Creation",
      "Channel Branding",
      "SEO Optimisation",
      "Thumbnail Design",
      "Monetisation Setup",
      "Content Strategy",
      "Copyright Management",
    ],
  },

  {
    id: "podcast",
    title: "Podcast Services",
    description:
      "Professional podcast production and publishing.",
    icon: Podcast,
    accent: "indigo",
    services: [
      "Podcast Editing",
      "Podcast Mastering",
      "Intro Creation",
      "Publishing",
      "Distribution",
    ],
  },

  {
    id: "dj",
    title: "DJ Services",
    description:
      "Book DJs and audio professionals for events and mixes.",
    icon: Disc3,
    accent: "violet",
    services: [
      "DJ Drops",
      "Event DJ Booking",
      "Radio Mixes",
      "Live Streaming Setup",
    ],
  },

  {
    id: "photography",
    title: "Photography",
    description:
      "Professional photography for artists and events.",
    icon: Camera,
    accent: "emerald",
    services: [
      "Artist Photoshoots",
      "Press Photos",
      "Album Photography",
      "Event Photography",
    ],
  },

  {
    id: "education",
    title: "Education",
    description:
      "Learn music production from experienced professionals.",
    icon: GraduationCap,
    accent: "teal",
    services: [
      "Vocal Coaching",
      "Piano Lessons",
      "Guitar Lessons",
      "FL Studio Coaching",
      "Ableton Coaching",
      "Logic Pro Coaching",
      "Mixing Lessons",
      "Mastering Lessons",
    ],
  },

  {
    id: "music-business",
    title: "Music Business",
    description:
      "Professional assistance with the business side of music.",
    icon: BriefcaseBusiness,
    accent: "amber",
    services: [
      "Copyright Registration",
      "Publishing Administration",
      "Split Sheet Preparation",
      "Licensing Advice",
      "Contract Review",
      "Royalty Consultation",
    ],
  },

  {
    id: "live-events",
    title: "Live Performance",
    description:
      "Services for concerts, festivals and live productions.",
    icon: CalendarDays,
    accent: "rose",
    services: [
      "Live Sound Engineer",
      "Stage Manager",
      "Lighting Engineer",
      "Event Recording",
      "Live Streaming",
    ],
  },
];