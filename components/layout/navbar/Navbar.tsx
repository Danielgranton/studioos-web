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
                    border-b
                    border-slate-800
                    bg-slate-950/90
                    backdrop-blur-xl
                "
            >

                <div
                    className="
                        mx-auto
                        flex
                        h-20
                        max-w-[1600px]
                        items-center
                        justify-between
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
                            gap-8
                            lg:flex
                        "
                    >

                        {/* Left */}

                        <div
                            className="
                                flex
                                items-center
                                gap-10
                            "
                        >

                            <NavbarLogo />

                            <NavbarLinks />

                        </div>

                        {/* Center */}

                        <div className="flex flex-1 justify-center">

                            <NavbarSearch />

                        </div>

                        {/* Right */}

                        <div
                            className="
                                flex
                                items-center
                                gap-3
                            "
                        >

                            <NavbarNotifications />

                            <NavbarProfile />

                        </div>

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
                        bg-slate-950
                        p-6
                        lg:hidden
                    "
                >

                    <div className="mb-6 flex justify-end">

                        <button
                            onClick={() => setSearchOpen(false)}
                            className="
                                rounded-lg
                                bg-slate-800
                                px-4
                                py-2
                                text-white
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