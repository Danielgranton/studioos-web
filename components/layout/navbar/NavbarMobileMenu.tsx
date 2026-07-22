"use client";

import Link from "next/link";

import {

    X,

    Compass,

    Building2,

    Mic2,

    ShoppingBag,

    LayoutDashboard,

    FolderKanban,

    Calendar,

    Settings,

    LogOut,
    
    CircleHelp,
    User2

} from "lucide-react";
import Image from "next/image";

interface NavbarMobileMenuProps {

    open: boolean;

    onClose: () => void;

}

export default function NavbarMobileMenu({

    open,

    onClose,

}: NavbarMobileMenuProps) {

    if (!open) return null;

    return (

        <>

            <div
                onClick={onClose}
                className="
                    fixed
                    inset-0
                    z-40
                    bg-black/60
                    backdrop-blur-sm
                    lg:hidden
                "
            />

            <aside
                className="
                    fixed
                    left-0
                    top-0
                    z-50
                    flex
                    h-screen
                    w-80
                    flex-col
                    bg-[#0f0f0f]/95
                    shadow-2xl
                    lg:hidden
                "
            >

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        border-b
                        border-slate-700
                        p-6
                    "
                >
                    <Image
                        src="/images/logo1.png"
                        alt="Studioos logo"
                        width={40}
                        height={40}
                        priority
                    />

                    <button
                        onClick={onClose}
                        className="
                            rounded-lg
                            p-2
                            hover:bg-slate-800
                        "
                    >

                        <X className="text-white" />

                    </button>

                </div>

                <nav className="flex-1 p-4 space-y-1">

                    <MenuItem href="/" icon={<Compass size={20}/>}>Explore</MenuItem>

                    <MenuItem href="/studios" icon={<Building2 size={20}/>}>Studios</MenuItem>

                    <MenuItem href="/producers" icon={<Mic2 size={20}/>}>Producers</MenuItem>

                    <MenuItem href="/marketplace" icon={<ShoppingBag size={20}/>}>Beat Marketplace</MenuItem>

                    <MenuItem href="/helpcenter" icon={<CircleHelp size={18}/>}> Help Center </MenuItem>

                    <div className="my-4 border-t border-slate-700"/>

                    <MenuItem href="/dashboard" icon={<LayoutDashboard size={20}/>}>Dashboard</MenuItem>

                    <MenuItem href="/dashboard/projects" icon={<FolderKanban size={20}/>}>Projects</MenuItem>

                    <MenuItem href="/dashboard/sessions" icon={<Calendar size={20}/>}>Sessions</MenuItem>

                    <MenuItem href="/dashboard/settings" icon={<Settings size={20}/>}>Settings</MenuItem>

                    <MenuItem href="/dashboard/profile" icon= {<User2 size={20}/>} >Profile</MenuItem>

                </nav>

                <div className="border-t border-slate-700 p-4">

                    <button
                        className="
                            flex
                            w-full
                            items-center
                            gap-3
                            rounded-lg
                            px-4
                            py-3
                            text-red-400
                            hover:bg-red-500/10
                        "
                    >

                        <LogOut size={20}/>

                        Logout

                    </button>

                </div>

            </aside>

        </>

    );

}

interface MenuItemProps {

    href: string;

    icon: React.ReactNode;

    children: React.ReactNode;

}

function MenuItem({

    href,

    icon,

    children,

}: MenuItemProps) {

    return (

        <Link
            href={href}
            className="
                flex
                items-center
                gap-3
                rounded-lg
                px-4
                py-3
                text-slate-300
                transition
                hover:bg-slate-800
                hover:text-white
            "
        >

            {icon}

            {children}

        </Link>

    );

}