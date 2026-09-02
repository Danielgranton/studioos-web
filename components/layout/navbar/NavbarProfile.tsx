"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import {
    ChevronDown,
    User,
    User2,
    LayoutDashboard,
    Settings,
    Smartphone,
    LogOut,
} from "lucide-react";

import { useClickOutside } from "@/features/search";
import { AuthService, clearSession, useSession } from "@/features/auth";
import { toast } from "sonner";

interface NavbarUser {
    name: string;
    email: string;
    avatarUrl?: string;
    role?: string;
}

interface NavbarProfileProps {
    user?: NavbarUser;
}

const FALLBACK_USER: NavbarUser = {
    name: "Guest User",
    email: "guest@studioos.app",
    role: "Producer",
};

const WORKSPACE_LINKS = [
    { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { href: "/dashboard/profile", label: "Profile", icon: <User2 size={18} /> },
    { href: "/dashboard/settings", label: "Settings", icon: <Settings size={18} /> },
    { href: "/dashboard/sessions", label: "Active sessions", icon: <Smartphone size={18} /> },
];

export function NavbarProfile({ user = FALLBACK_USER }: NavbarProfileProps) {
    const [open, setOpen] = useState(false);
    const [profile, setProfile] = useState<NavbarUser | null>(null);
    const [loggingOut, setLoggingOut] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);

    const pathname = usePathname();
    const { session, isAuthenticated } = useSession();

    useEffect(() => {
        if (!isAuthenticated) {
            setProfile(null);
            return;
        }

        let active = true;
        AuthService.getMyProfile()
            .then((currentUser) => {
                if (!active) return;
                setProfile({
                    name: currentUser.name,
                    email: currentUser.email,
                    role: currentUser.role,
                    avatarUrl: currentUser.profileImageMedium || currentUser.profileImage,
                });
            })
            .catch(() => {
                // Session data remains available if the profile request is temporarily unavailable.
            });

        return () => {
            active = false;
        };
    }, [isAuthenticated]);

    const currentUser: NavbarUser = profile || (session ? {
        name: session.name,
        email: session.email,
        role: session.role,
    } : user);

    async function handleLogout() {
        if (loggingOut) return;
        setLoggingOut(true);
        try {
            await AuthService.logout();
        } catch {
            // Clear the local session even if the server is unavailable.
        } finally {
            clearSession();
            setOpen(false);
            setLoggingOut(false);
            toast.success("You have been logged out");
        }
    }

    useClickOutside(containerRef, () => setOpen(false));

    return (

        <div ref={containerRef} className="relative">

            <button
                type="button"
                aria-label="Open profile menu"
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
                className="
                    flex
                    items-center
                    gap-1
                    rounded-full
                    p-2
                    transition-colors
                    hover:bg-[#272727]
                "
            >
                <User size={22} className="text-[#f1f1f1]" />

                <ChevronDown size={16} className="text-[#aaaaaa]" />
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
                        border-[#3f3f3f]
                        bg-[#181818]
                        shadow-2xl
                    "
                >

                    {/* User header */}

                    <Link
                        href="/dashboard/profile"
                        onClick={() => setOpen(false)}
                        className="
                            flex
                            items-center
                            gap-3
                            border-b
                            border-[#3f3f3f]
                            px-5
                            py-4
                            transition
                            hover:bg-[#272727]
                        "
                    >

                        <div
                            className="
                                relative
                                h-10
                                w-10
                                shrink-0
                                overflow-hidden
                                rounded-full
                                bg-[#272727]
                            "
                        >

                            {currentUser.avatarUrl ? (

                                <Image
                                    src={currentUser.avatarUrl}
                                    alt={currentUser.name}
                                    fill
                                    className="object-cover"
                                />

                            ) : (

                                <div className="flex h-full w-full items-center justify-center">
                                    <User2 size={18} className="text-[#717171]" />
                                </div>

                            )}

                        </div>

                        <div className="min-w-0 flex-1">

                            <p className="truncate text-sm font-semibold text-white">
                                {currentUser.name}
                            </p>

                            <p className="truncate text-xs text-[#aaaaaa]">
                                {currentUser.role ? `${currentUser.role} · ` : ""}{currentUser.email}
                            </p>

                        </div>

                    </Link>

                    {/* Workspace links */}

                    <div className="p-2">

                        {WORKSPACE_LINKS.map((link) => {

                            const active = link.href === "/dashboard"
                                ? pathname === link.href
                                : pathname === link.href || pathname.startsWith(link.href + "/");

                            return (

                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setOpen(false)}
                                    className={`
                                        flex
                                        items-center
                                        gap-3
                                        rounded-lg
                                        px-3
                                        py-2.5
                                        text-sm
                                        font-medium
                                        transition
                                        ${
                                            active
                                                ? "bg-[#272727] text-white"
                                                : "text-[#f1f1f1] hover:bg-[#272727]"
                                        }
                                    `}
                                >
                                   <span className="text-blue-500">{link.icon}</span> 
                                    {link.label}
                                </Link>

                            );

                        })}

                    </div>

                    <div className="border-t border-[#3f3f3f] p-2">

                        <button
                            type="button"
                            onClick={handleLogout}
                            disabled={loggingOut}
                            className="
                                flex
                                w-full
                                items-center
                                gap-3
                                rounded-lg
                                px-3
                                py-2.5
                                text-sm
                                font-medium
                                text-red-400
                                transition
                                hover:bg-red-500/10
                                disabled:cursor-wait
                                disabled:opacity-60
                            "
                        >
                            <LogOut size={18} />
                            {loggingOut ? "Logging out..." : "Logout"}
                        </button>

                    </div>

                </div>

            )}

        </div>

    );

}
