"use client";

import { useState } from "react";

import Link from "next/link";
import Image from "next/image";

import {
    ChevronDown,
    LayoutDashboard,
    User,
    FolderKanban,
    Calendar,
    Settings,
    CircleHelp,
    LogOut,
} from "lucide-react";

export default function NavbarProfile() {

    const [open, setOpen] = useState(false);

    return (

        <div className="relative">

            <button
                onClick={() => setOpen(!open)}
                className="
                    flex
                    items-center
                    gap-2
                    rounded-full
                    transition
                    hover:bg-slate-800
                    p-1
                "
            >

                <Image
                    src="/images/avatar.png"
                    alt="Profile"
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                />

                <ChevronDown
                    size={16}
                    className="text-slate-400"
                />

            </button>

            {open && (

                <div
                    className="
                        absolute
                        right-0
                        mt-3
                        w-72
                        overflow-hidden
                        rounded-2xl
                        border
                        border-slate-700
                        bg-slate-900
                        shadow-2xl
                    "
                >

                    <div className="border-b border-slate-700 p-5">

                        <Image
                            src="/images/avatar.png"
                            alt="Profile"
                            width={40}
                            height={40}
                            className="rounded-full object-cover"
                        />

                        <h3 className="font-semibold text-white">

                            Daniel Granton

                        </h3>

                        <p className="text-sm text-slate-400">

                            Artist

                        </p>

                    </div>

                    <div className="py-2">

                        <ProfileItem
                            href="/dashboard"
                            icon={<LayoutDashboard size={18} />}
                            title="Dashboard"
                        />

                        <ProfileItem
                            href="/profile"
                            icon={<User size={18} />}
                            title="Profile"
                        />

                        <ProfileItem
                            href="/dashboard/projects"
                            icon={<FolderKanban size={18} />}
                            title="Projects"
                        />

                        <ProfileItem
                            href="/dashboard/sessions"
                            icon={<Calendar size={18} />}
                            title="Sessions"
                        />

                        <ProfileItem
                            href="/dashboard/settings"
                            icon={<Settings size={18} />}
                            title="Settings"
                        />

                        <ProfileItem
                            href="/help"
                            icon={<CircleHelp size={18} />}
                            title="Help Center"
                        />

                    </div>

                    <div className="border-t border-slate-700 p-2">

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
                                transition
                                hover:bg-red-500/10
                            "
                        >

                            <LogOut size={18} />

                            Logout

                        </button>

                    </div>

                </div>

            )}

        </div>

    );

}

interface ProfileItemProps {

    href: string;

    icon: React.ReactNode;

    title: string;

}

function ProfileItem({

    href,

    icon,

    title,

}: ProfileItemProps) {

    return (

        <Link
            href={href}
            className="
                flex
                items-center
                gap-3
                px-5
                py-3
                text-slate-300
                transition
                hover:bg-slate-800
                hover:text-white
            "
        >

            {icon}

            {title}

        </Link>

    );

}