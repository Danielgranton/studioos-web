import {
    BarChart3,
    CalendarCheck,
    CircleUserRound,
    Compass,
    FolderKanban,
    Laptop2,
    Settings,
    ShoppingBag,
    SlidersHorizontal,
    Sparkles,
    UsersRound,
} from "lucide-react";

import type { DashboardNavItem, DashboardRole } from "../types/dashboard";

export type DashboardIcon = typeof Compass;

export type DashboardNavigationItem = DashboardNavItem & {
    icon: DashboardIcon;
};

export type DashboardNavigationGroup = {
    label: string;
    items: DashboardNavigationItem[];
};

const sharedGroups: DashboardNavigationGroup[] = [
    {
        label: "Workspace",
        items: [
            { label: "Overview", href: "/dashboard", description: "Your StudioOS activity at a glance.", icon: BarChart3 },
            { label: "Bookings", href: "/dashboard/bookings", description: "Track upcoming and past bookings.", icon: CalendarCheck, comingSoon: true },
            { label: "Projects", href: "/dashboard/projects", description: "Keep releases and collaborations moving.", icon: FolderKanban, comingSoon: true },
        ],
    },
    {
        label: "Discover",
        items: [
            { label: "Studios", href: "/studios", description: "Find a space for your next session.", icon: Compass, comingSoon: true },
            { label: "Producers", href: "/producers", description: "Connect with producers and collaborators.", icon: UsersRound, comingSoon: true },
            { label: "Beat marketplace", href: "/marketplace", description: "Find the right sound for your project.", icon: ShoppingBag, comingSoon: true },
        ],
    },
    {
        label: "Account",
        items: [
            { label: "Profile", href: "/dashboard/profile", description: "Manage your public identity.", icon: CircleUserRound },
            { label: "Sessions", href: "/dashboard/sessions", description: "Review signed-in devices.", icon: Laptop2 },
            { label: "Settings", href: "/dashboard/settings", description: "Manage account preferences.", icon: Settings },
        ],
    },
];

const roleGroups: Record<DashboardRole, DashboardNavigationGroup> = {
    USER: {
        label: "For you",
        items: [
            { label: "Recommendations", href: "/dashboard/recommendations", description: "Discover spaces and talent picked for you.", icon: Sparkles, comingSoon: true },
        ],
    },
    ARTIST: {
        label: "Artist workspace",
        items: [
            { label: "My releases", href: "/dashboard/releases", description: "Organize your release pipeline.", icon: SlidersHorizontal, comingSoon: true },
        ],
    },
    PRODUCER: {
        label: "Producer workspace",
        items: [
            { label: "Booking requests", href: "/dashboard/requests", description: "Respond to new booking opportunities.", icon: CalendarCheck, comingSoon: true },
        ],
    },
};

export function getDashboardNavigation(role: DashboardRole): DashboardNavigationGroup[] {
    return [roleGroups[role], ...sharedGroups];
}

export function isDashboardRole(role: string | undefined): role is DashboardRole {
    return role === "USER" || role === "ARTIST" || role === "PRODUCER";
}

export function filterDashboardItems(
    groups: DashboardNavigationGroup[],
    role: DashboardRole,
): DashboardNavigationGroup[] {
    return groups
        .map((group) => ({
            ...group,
            items: group.items.filter((item) => !item.roles || item.roles.includes(role)),
        }))
        .filter((group) => group.items.length > 0);
}
