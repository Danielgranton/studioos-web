"use client";

import { useState } from "react";

import NavbarLogo from "./NavbarLogo";
import NavbarLinks from "./NavbarLinks";
import NavbarSearch from "./NavbarSearch";
import NavbarNotifications from "./NavbarNotification";
import NavbarProfile from "./NavbarProfile";
import NavbarMobile from "./NavbarMobile";
import NavbarMobileMenu from "./NavbarMobileMenu";

export default function Navbar() {

    const [mobileOpen, setMobileOpen] = useState(false);

    const [searchOpen, setSearchOpen] = useState(false);

    return (

        <>

            <header
                className="
                    sticky
                    top-0
                    z-50
                    bg-[#0f0f0f]/95
                    backdrop-blur-xl
                "
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
                            onMenuOpen={() => setMobileOpen(true)}
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

                <div
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

                </div>

            </header>

            <NavbarMobileMenu
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
            />

            {/* Mobile Search */}

            {searchOpen && (

                <div
                    className="
                        fixed
                        inset-0
                        z-[60]
                        bg-[#0f0f0f]
                        p-6
                        lg:hidden
                    "
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