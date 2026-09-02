"use client";

import { Search, Menu } from "lucide-react";
import Link from "next/link";

import { NavbarLogo } from "./NavbarLogo";
import { NavbarNotifications } from "./NavbarNotifications";
import { NavbarProfile } from "./NavbarProfile";

interface NavbarMobileProps {
    onMenuOpen: () => void;
    onSearchOpen: () => void;
    isAuthenticated: boolean;
    sessionLoading: boolean;
}

export function NavbarMobile({
    onMenuOpen,
    onSearchOpen,
    isAuthenticated,
    sessionLoading,
}: NavbarMobileProps) {

    return (

        <div className="flex w-full items-center justify-between ">

            <div className="flex items-center gap-0.5">

                <button
                    onClick={onMenuOpen}
                    aria-label="Open navigation menu"
                    className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-full
                        text-[#f1f1f1]
                        transition-colors
                        duration-150
                        hover:bg-white/10
                        active:scale-95
                        active:bg-white/15
                    "
                >
                    <Menu size={22} strokeWidth={2} />
                </button>

                <NavbarLogo compact />

            </div>

            <div className="flex items-center gap-0.5">

                <button
                    onClick={onSearchOpen}
                    aria-label="Search"
                    className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-full
                        text-[#f1f1f1]
                        transition-colors
                        duration-150
                        hover:bg-white/10
                        active:scale-95
                        active:bg-white/15
                    "
                >
                    <Search size={20} strokeWidth={2} />
                </button>

                <NavbarNotifications />

                <div className="ml-0.5 pl-1.5">
                    {!sessionLoading && (isAuthenticated ? (
                        <NavbarProfile />
                    ) : (
                        <Link
                            href="/auth/signin"
                            className="rounded-full bg-[#3ea6ff] px-3 py-2 text-xs font-semibold text-[#0f0f0f] transition hover:bg-[#65b8ff]"
                        >
                            Sign in
                        </Link>
                    ))}
                </div>

            </div>

        </div>

    );

}
