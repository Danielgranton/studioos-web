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

        <div className="flex w-full items-center justify-between">

            <div className="flex items-center gap-1">

                <button
                    onClick={onMenuOpen}
                    aria-label="Open navigation menu"
                    className="
                        rounded-full
                        p-2
                        transition
                        hover:bg-[#272727]
                    "
                >
                    <Menu size={22} className="text-[#f1f1f1]" />
                </button>

                <NavbarLogo compact />

            </div>

            <div className="flex items-center gap-1">

                <button
                    onClick={onSearchOpen}
                    aria-label="Search"
                    className="
                        rounded-full
                        p-2
                        transition
                        hover:bg-[#272727]
                    "
                >
                    <Search size={20} className="text-[#f1f1f1]" />
                </button>

                <NavbarNotifications />

                <NavbarProfile />

            </div>

        </div>

    );

}