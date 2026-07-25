import {
    Building2,
    Mic2,
    Music2,
    Megaphone,
    User,
    BriefcaseBusiness,
} from "lucide-react";

export const exploreItems = [
    {
        title: "Recording Studios",
        description:
            "Book professional recording, mixing and mastering studios near you.",
        href: "/studios",
        icon: Building2,
        stats: "8,000+ Studios",
        tags: ["Recording", "Mixing", "Mastering"],
        accent: "blue",
    },
    {
        title: "Producers",
        description:
            "Discover talented producers for every genre and budget.",
        href: "/producers",
        icon: Mic2,
        stats: "12,000+ Producers",
        tags: ["Afrobeats", "Hip Hop", "Amapiano"],
        accent: "purple",
    },
    {
        title: "Artists",
        description:
            "Discover talented artists, invite them to projects, collaborate in real time, and grow together.",
        href: "/artists",
        icon: User,
        stats: "250,000+ Artists",
        tags: ["Vocals", "Rap", "Songwriting"],
        accent: "pink",
    },
    {
        title: "Beat Marketplace",
        description:
            "Browse thousands of exclusive and premium beats from verified producers.",
        href: "/marketplace",
        icon: Music2,
        stats: "1M+ Beats",
        tags: ["Exclusive", "Lease", "Premium"],
        accent: "green",
    },
    {
        title: "Creative Services",
        description:
            "Hire professionals for mixing, mastering, cover art, music videos, marketing, distribution and much more.",
        href: "/services",
        icon: BriefcaseBusiness,
        stats: "3,500+ Services",
        tags: ["Mixing", "Cover Art", "Marketing"],
        accent: "orange",
    },
    {
        title: "Advertise",
        description:
            "Promote your studio, producer profile, artist profile or beat store to reach thousands of creators.",
        href: "/advertise",
        icon: Megaphone,
        stats: "Reach 1M+ Creators",
        tags: ["Studios", "Artists", "Beats"],
        accent: "red",
    },
];