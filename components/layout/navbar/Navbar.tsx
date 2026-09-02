"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { NavbarLogo } from "./NavbarLogo";
import { NavbarLinks } from "./NavbarLinks";
import { NavbarSearch } from "./NavbarSearch";
import { NavbarNotifications } from "./NavbarNotifications";
import { NavbarProfile } from "./NavbarProfile";
import { NavbarMobile } from "./NavbarMobile";
import { NavbarMobileMenu } from "./NavbarMobileMenu";
import { useSession } from "@/features/auth";

// Centralized so every overlay in the app can be reasoned about relative to each other.
const Z = {
    header: "z-50",
    mobileSearch: "z-[60]",
} as const;

export function Navbar() {

    const [menuOpen, setMenuOpen] = useState(false);

    const [searchOpen, setSearchOpen] = useState(false);
    const { isAuthenticated, isLoading: sessionLoading } = useSession();

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
                    border-b
                    border-[#3f3f3f]/60
                    bg-[#0f0f0f]/90
                    backdrop-blur-xl
                    lg:px-20
                    md:px-15
                    sm:px-10
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
                            isAuthenticated={isAuthenticated}
                            sessionLoading={sessionLoading}
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

                            {!sessionLoading && (isAuthenticated ? (
                                <NavbarProfile />
                            ) : (
                                <Link
                                    href="auth/signin"
                                    className="rounded-full bg-[#3ea6ff] px-4 py-2 text-sm font-semibold text-[#0f0f0f] transition hover:bg-[#65b8ff]"
                                >
                                    Sign in
                                </Link>
                            ))}

                        </div>

                    </div>

                </div>

                {/* Row 2 — Nav links */}

                <nav
                    aria-label="Primary"
                    className="
                        hidden
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
                        flex
                        flex-col
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
