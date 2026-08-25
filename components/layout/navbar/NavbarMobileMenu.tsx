"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { X } from "lucide-react";

import { NAV_ITEMS } from "./navigation";

interface NavbarMobileMenuProps {
    open: boolean;
    onClose: () => void;
}

export default function NavbarMobileMenu({
    open,
    onClose,
}: NavbarMobileMenuProps) {

    const pathname = usePathname();

    // Lock body scroll while the drawer is open, compensating for the
    // scrollbar's width so page content doesn't shift when it disappears.
    // This is the single owner of body scroll-lock for the mobile menu —
    // Navbar.tsx should not also toggle body overflow for `menuOpen`.
    useEffect(() => {

        if (open) {

            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

            document.body.style.overflow = "hidden";
            document.body.style.paddingRight = `${scrollbarWidth}px`;

        } else {

            document.body.style.overflow = "";
            document.body.style.paddingRight = "";

        }

        return () => {
            document.body.style.overflow = "";
            document.body.style.paddingRight = "";
        };

    }, [open]);

    return (

        <>

            <div
                onClick={onClose}
                aria-hidden="true"
                className={`
                    fixed
                    inset-0
                    z-40
                    bg-black/60
                    backdrop-blur-sm
                    transition-opacity
                    duration-300
                    ease-out
                    lg:hidden
                    ${open ? "opacity-100" : "pointer-events-none opacity-0"}
                `}
            />

            <aside
                role="dialog"
                aria-modal="true"
                aria-hidden={!open}
                aria-label="Navigation menu"
                className={`
                    fixed
                    left-0
                    top-0
                    z-[70]
                    flex
                    h-screen
                    w-60
                    max-w-[85vw]
                    flex-col
                    bg-[#0f0f0f]
                    shadow-2xl
                    transition-transform
                    duration-300
                    ease-out
                    will-change-transform
                    lg:hidden
                    ${open ? "translate-x-0" : "-translate-x-full"}
                `}
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
                        src="/images/logo.png"
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
                        {NAV_ITEMS.map((link) => {
                            const Icon = link.icon;

                            return (
                                <MenuItem
                                    key={link.href}
                                    href={link.href}
                                    icon={<Icon size={20} className="text-blue-500" />}
                                    active={pathname === link.href || pathname.startsWith(link.href + "/")}
                                    onNavigate={onClose}
                                >
                                    {link.label}
                                </MenuItem>
                            );
                        })}
                    </MenuSection>

                </nav>

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
