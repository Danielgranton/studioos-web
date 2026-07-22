"use client";

import { Search } from "lucide-react";
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

        <div
            className="
                flex
                items-center
                justify-between
                lg:hidden
            "
        >

            <NavbarLogo/>

            <button
                onClick={onSearchOpen}
                className="
                    rounded-lg
                    p-2
                    transition
                    hover:bg-slate-800
                "
            >

                <Search
                    size={22}
                    className="text-white"
                />

            </button>

            <NavbarNotifications />
            
            <NavbarProfile onMenuOpen={onMenuOpen} />

        </div>

    );

}