"use client";

import { Menu, Search } from "lucide-react";

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

            <button
                onClick={onMenuOpen}
                className="
                    rounded-lg
                    p-2
                    transition
                    hover:bg-slate-800
                "
            >

                <Menu
                    size={24}
                    className="text-white"
                />

            </button>

            <h1
                className="
                    text-xl
                    font-bold
                    text-white
                "
            >
                StudioOS
            </h1>

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

        </div>

    );

}