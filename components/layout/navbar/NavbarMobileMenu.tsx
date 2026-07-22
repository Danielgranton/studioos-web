"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

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
    User2,
} from "lucide-react";

interface NavbarMobileMenuProps {
    open: boolean;
    onClose: () => void;
}

const BROWSE_LINKS = [
    { href: "/", label: "Explore", icon: <Compass size={20} /> },
    { href: "/studios", label: "Studios", icon: <Building2 size={20} /> },
    { href: "/producers", label: "Producers", icon: <Mic2 size={20} /> },
    { href: "/marketplace", label: "Beat Marketplace", icon: <ShoppingBag size={20} /> },
    { href: "/helpcenter", label: "Help Center", icon: <CircleHelp size={20} /> },
];

const DASHBOARD_LINKS = [
    { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { href: "/dashboard/projects", label: "Projects", icon: <FolderKanban size={20} /> },
    { href: "/dashboard/sessions", label: "Sessions", icon: <Calendar size={20} /> },
    { href: "/dashboard/profile", label: "Profile", icon: <User2 size={20} /> },
    { href: "/dashboard/settings", label: "Settings", icon: <Settings size={20} /> },
];

export default function NavbarMobileMenu({
    open,
    onClose,
}: NavbarMobileMenuProps) {

    const pathname = usePathname();

    // Lock body scroll while the drawer is open
    useEffect(() => {

        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };

    }, [open]);

    if (!open) return null;

    return (

        <>

            <div
                onClick={onClose}
                aria-hidden="true"
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
                role="dialog"
                aria-modal="true"
                aria-label="Navigation menu"
                className="
                    fixed
                    right-0
                    top-0
                    z-50
                    flex
                    h-screen
                    w-80
                    max-w-[85vw]
                    flex-col
                    bg-[#0f0f0f]
                    shadow-2xl
                    lg:hidden
                    animate-in
                    slide-in-from-left
                    duration-200
                "
            >

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        border-b
                        border-[#3f3f3f]
                        p-5
                    "
                >

                    <Image
                        src="/images/logo1.png"
                        alt="StudioOS logo"
                        width={36}
                        height={36}
                        priority
                    />

                    <button
                        onClick={onClose}
                        aria-label="Close menu"
                        className="
                            rounded-full
                            p-2
                            transition
                            hover:bg-[#272727]
                        "
                    >
                        <X size={20} className="text-white" />
                    </button>

                </div>

                <nav className="flex-1 overflow-y-auto p-3">

                    <MenuSection>
                        {BROWSE_LINKS.map((link) => (
                            <MenuItem
                                key={link.href}
                                href={link.href}
                                icon={link.icon}
                                active={pathname === link.href}
                                onNavigate={onClose}
                            >
                                {link.label}
                            </MenuItem>
                        ))}
                    </MenuSection>

                    <div className="my-3 border-t border-[#3f3f3f]" />

                    <MenuSection label="Your workspace">
                        {DASHBOARD_LINKS.map((link) => (
                            <MenuItem
                                key={link.href}
                                href={link.href}
                                icon={link.icon}
                                active={pathname === link.href || pathname.startsWith(link.href + "/")}
                                onNavigate={onClose}
                            >
                                {link.label}
                            </MenuItem>
                        ))}
                    </MenuSection>

                </nav>

                <div className="border-t border-[#3f3f3f] p-3">

                    <button
                        className="
                            flex
                            w-full
                            items-center
                            gap-3
                            rounded-lg
                            px-4
                            py-3
                            text-sm
                            font-medium
                            text-red-400
                            transition
                            hover:bg-red-500/10
                        "
                    >
                        <LogOut size={20} />
                        Logout
                    </button>

                </div>

            </aside>

        </>

    );

}

interface MenuSectionProps {
    label?: string;
    children: React.ReactNode;
}

function MenuSection({ label, children }: MenuSectionProps) {
    return (
        <div className="space-y-0.5">

            {label && (
                <p className="px-4 pb-1 pt-2 text-xs font-semibold uppercase tracking-wider text-[#717171]">
                    {label}
                </p>
            )}

            {children}

        </div>
    );
}

interface MenuItemProps {
    href: string;
    icon: React.ReactNode;
    active?: boolean;
    onNavigate?: () => void;
    children: React.ReactNode;
}

function MenuItem({
    href,
    icon,
    active = false,
    onNavigate,
    children,
}: MenuItemProps) {

    return (

        <Link
            href={href}
            onClick={onNavigate}
            className={`
                flex
                items-center
                gap-3
                rounded-lg
                px-4
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
            {icon}
            {children}
        </Link>

    );

}