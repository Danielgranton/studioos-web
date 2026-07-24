"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
    Compass,
    Building2,
    Mic2,
    ShoppingBag,
    Wrench,
    CalendarCheck,
    Megaphone,
    CircleHelp,
    User,
} from "lucide-react";

const NAV_LINKS = [
    { label: "Explore", href: "/explore", icon: Compass },
    { label: "Studios", href: "/studios", icon: Building2 },
    { label: "Producers", href: "/producers", icon: Mic2 },
    { label: "Artists", href: "/artists", icon: User},
    { label: "Beat Marketplace", href: "/marketplace", icon: ShoppingBag },
    { label: "Services", href: "/services", icon: Wrench },
    { label: "Bookings", href: "/bookings", icon: CalendarCheck },
    { label: "Sponsored", href: "/sponsored", icon: Megaphone },
    { label: "Help Center", href: "/help", icon: CircleHelp },
];

export default function NavbarLinks() {

    const pathname = usePathname();

    return (
        <nav className="hidden lg:flex items-center gap-2">
            {NAV_LINKS.map((link) => {

                const active = pathname === link.href || pathname.startsWith(link.href + "/");

                const Icon = link.icon;

                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`
                            flex
                            items-center
                            gap-1.5
                            rounded-full
                            px-4
                            py-1.5
                            text-sm
                            font-medium
                            transition-colors
                            ${
                                active
                                    ? "bg-white text-black"
                                    : "text-[#f1f1f1] hover:bg-[#272727]"
                            }
                        `}
                    >
                        <Icon size={16} className="text-blue-500" />
                        {link.label}
                    </Link>
                );

            })}
        </nav>
    );
}