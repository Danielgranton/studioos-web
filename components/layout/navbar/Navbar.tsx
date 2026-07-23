"use client";

import { useEffect, useState } from "react";

import NavbarLogo from "./NavbarLogo";
import NavbarLinks from "./NavbarLinks";
import NavbarSearch from "./NavbarSearch";
import NavbarNotifications from "./NavbarNotification";
import NavbarProfile from "./NavbarProfile";
import NavbarMobile from "./NavbarMobile";
import NavbarMobileMenu from "./NavbarMobileMenu";

// Centralized so every overlay in the app can be reasoned about relative to each other.
const Z = {
    header: "z-50",
    mobileSearch: "z-[60]",
} as const;

export default function Navbar() {

    const [menuOpen, setMenuOpen] = useState(false);

    const [searchOpen, setSearchOpen] = useState(false);

    // Close the mobile search overlay on Escape for keyboard users.
    useEffect(() => {

        if (!searchOpen) return;

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setSearchOpen(false);
        };

        window.addEventListener("keydown", onKeyDown);

        return () => window.removeEventListener("keydown", onKeyDown);

    }, [searchOpen]);

    return (

        <>

            <header
                className={`
                    sticky
                    top-0
                    ${Z.header}
                    bg-[#0f0f0f]/95
                    backdrop-blur-xl
                `}
            >

                {/* Row 1 — Logo / Search / Actions */}

                <div
                    className="
                        mx-auto
                        flex
                        h-16
                        max-w-[1600px]
                        items-center
                        justify-between
                        gap-6
                        px-6
                    "
                >

                    {/* Mobile */}

                    <div className="w-full lg:hidden">

                        <NavbarMobile
                            onMenuOpen={() => setMenuOpen(true)}
                            onSearchOpen={() => setSearchOpen(true)}
                        />

                    </div>

                    {/* Desktop */}

                    <div
                        className="
                            hidden
                            w-full
                            items-center
                            justify-between
                            gap-6
                            lg:flex
                        "
                    >

                        <div className="shrink-0">

                            <NavbarLogo />

                        </div>

                        <div className="flex flex-1 justify-center px-8">

                            <NavbarSearch />

                        </div>

                        <div
                            className="
                                flex
                                shrink-0
                                items-center
                                gap-2
                            "
                        >

                            <NavbarNotifications />

                            <NavbarProfile />

                        </div>

                    </div>

                </div>

                {/* Row 2 — Nav links */}

                <nav
                    aria-label="Primary"
                    className="
                        hidden
                        border-b
                        border-[#3f3f3f]/60
                        lg:block
                    "
                >

                    <div
                        className="
                            mx-auto
                            flex
                            h-12
                            max-w-[1600px]
                            items-center
                            justify-center
                            px-6
                        "
                    >

                        <NavbarLinks />

                    </div>

                </nav>

            </header>

            <NavbarMobileMenu
                open={menuOpen}
                onClose={() => setMenuOpen(false)}
            />

            {/* Mobile Search */}

            {searchOpen && (

                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label="Search"
                    className={`
                        fixed
                        inset-0
                        ${Z.mobileSearch}
                        bg-[#0f0f0f]
                        p-6
                        lg:hidden
                    `}
                >

                    <div className="mb-6 flex justify-end">

                        <button
                            onClick={() => setSearchOpen(false)}
                            className="
                                rounded-full
                                bg-[#272727]
                                px-4
                                py-2
                                text-sm
                                font-medium
                                text-white
                                transition
                                hover:bg-[#3f3f3f]
                            "
                        >
                            Close
                        </button>

                    </div>

                    <NavbarSearch />

                </div>

            )}

        </>

    );

}