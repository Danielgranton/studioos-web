"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { NAV_ITEMS } from "./navigation";

export default function NavbarLinks() {

    const pathname = usePathname();

    return (
        <nav className="hidden lg:flex items-center gap-2">
            {NAV_ITEMS.map((link) => {

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
                                    ? "bg-white/20 text-black"
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
