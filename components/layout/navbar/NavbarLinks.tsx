"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
    { label: "Explore", href: "/explore" },
    { label: "Studios", href: "/studios" },
    { label: "Producers", href: "/producers" },
    { label: "Beat Marketplace", href: "/marketplace" },
    { label: "Services", href: "/services" },
    { label: "Bookings", href: "/bookings" },
    { label: "Sponsored" , href: "sponsored"},
    { label: "Help Center", href: "help"},
    
];

export default function NavbarLinks() {

    const pathname = usePathname();

    return (
        <nav className="hidden lg:flex items-center gap-2">
            {NAV_LINKS.map((link) => {

                const active = pathname === link.href || pathname.startsWith(link.href + "/");

                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`
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
                        {link.label}
                    </Link>
                );

            })}
        </nav>
    );
}