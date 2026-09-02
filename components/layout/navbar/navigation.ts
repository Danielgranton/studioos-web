import {
    Building2,
    CalendarCheck,
    CircleHelp,
    Compass,
    Megaphone,
    Mic2,
    ShoppingBag,
    Star,
    User,
    Wrench,
} from "lucide-react";

export type NavbarNavItem = {
    label: string;
    href: string;
    icon: typeof Compass;
};

export const NAV_ITEMS: NavbarNavItem[] = [
    { label: "Explore", href: "/", icon: Compass },
    { label: "Studios", href: "/studios", icon: Building2 },
    { label: "Producers", href: "/producers", icon: Mic2 },
    { label: "Artists", href: "/artists", icon: User },
    { label: "Beat Marketplace", href: "/marketplace", icon: ShoppingBag },
    { label: "Services", href: "/services", icon: Wrench },
    { label: "Bookings", href: "/bookings", icon: CalendarCheck },
    { label: "Sponsored", href: "/sponsored", icon: Megaphone },
    { label: "Reviews", href: "/reviews", icon: Star },
    { label: "Help Center", href: "/help", icon: CircleHelp },
];
