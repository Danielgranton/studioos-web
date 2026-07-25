"use client";

import { Search, Menu } from "lucide-react";

import NavbarLogo from "./NavbarLogo";
import NavbarNotifications from "./NavbarNotification";
import NavbarProfile from "./NavbarProfile";

interface NavbarMobileProps {
    onMenuOpen: () => void;
    onSearchOpen: () => void;
}

export default function NavbarMobile({
    onMenuOpen,
    onSearchOpen,
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
                    <NavbarProfile />
                </div>

            </div>

        </div>

    );

}