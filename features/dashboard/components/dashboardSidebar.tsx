"use client";

import { ChevronRight, Clock3, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import { useDashboardSession } from "./dashboardAuthGuard";
import { filterDashboardItems, getDashboardNavigation, isDashboardRole } from "../config/navigation";

export function DashboardSidebar() {
    const pathname = usePathname();
    const session = useDashboardSession();
    const [mobileOpen, setMobileOpen] = useState(false);
    const role = isDashboardRole(session?.role) ? session.role : "USER";
    const groups = filterDashboardItems(getDashboardNavigation(role), role);

    useEffect(() => {
        if (!mobileOpen) return;
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") setMobileOpen(false);
        };
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", closeOnEscape);
        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", closeOnEscape);
        };
    }, [mobileOpen]);

    return (
        <>
            <aside className="dashboard-scrollbar hidden h-full w-72 shrink-0 overflow-y-auto border-r border-[#2b2b2b] bg-[#121212] lg:block">
                <div className="border-b border-[#2b2b2b] p-4">
                    <SidebarIdentity session={session} compact />
                </div>
                <SidebarNavigation groups={groups} pathname={pathname} onNavigate={() => undefined} />
            </aside>

            <div className="border-b border-[#2b2b2b] bg-[#121212] px-4 py-3 lg:hidden sm:px-6">
                <button
                    type="button"
                    onClick={() => setMobileOpen(true)}
                    aria-expanded={mobileOpen}
                    aria-controls="dashboard-mobile-navigation"
                    className="inline-flex items-center gap-2 rounded-lg border border-[#363636] px-3 py-2 text-xs font-medium text-[#ddd] transition hover:border-[#555] hover:bg-[#1d1d1d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3ea6ff]"
                >
                    <Menu size={15} />
                    Dashboard menu
                </button>
            </div>

            {mobileOpen && (
                <div className="fixed inset-0 z-[70] lg:hidden">
                    <button
                        type="button"
                        aria-label="Close dashboard menu"
                        onClick={() => setMobileOpen(false)}
                        className="absolute inset-0 bg-black/70"
                    />
                    <aside
                        id="dashboard-mobile-navigation"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Dashboard navigation"
                        className="relative flex h-full w-[min(86vw,320px)] flex-col border-r border-[#363636] bg-[#121212] shadow-2xl"
                    >
                        <div className="flex items-center justify-between border-b border-[#2b2b2b] px-5 py-4">
                            <SidebarIdentity session={session} compact />
                            <button
                                type="button"
                                onClick={() => setMobileOpen(false)}
                                aria-label="Close dashboard menu"
                                className="rounded-lg p-2 text-[#888] transition hover:bg-[#222] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3ea6ff]"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <SidebarNavigation groups={groups} pathname={pathname} onNavigate={() => setMobileOpen(false)} />
                    </aside>
                </div>
            )}
        </>
    );
}

function SidebarIdentity({ session, compact = false }: { session: ReturnType<typeof useDashboardSession>; compact?: boolean }) {
    const name = session?.name || "StudioOS user";
    const initials = name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
    const role = session?.role?.replaceAll("_", " ") || "User";

    return <div className={compact ? "flex items-center gap-3" : "border-b border-[#2b2b2b] p-4"}>
        <div className="relative shrink-0">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#4a4a4a] bg-gradient-to-br from-[#303030] to-[#171717] text-xs font-bold tracking-[0.12em] text-[#f1f1f1] shadow-[0_4px_18px_rgb(0_0_0_/_25%)]">{initials}</div>
            <span aria-label="Online" className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#121212] bg-emerald-400" />
        </div>
        <div className="min-w-0">
            {!compact && <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#666]">Your workspace</p>}
            <p className="truncate text-sm font-semibold text-[#f1f1f1]">{name}</p>
            <span className="mt-1 block truncate text-[11px] capitalize text-[#888]">{role.toLowerCase()}</span>
        </div>
    </div>;
}

function SidebarNavigation({
    groups,
    pathname,
    onNavigate,
}: {
    groups: ReturnType<typeof filterDashboardItems>;
    pathname: string;
    onNavigate: () => void;
}) {
    return (
        <nav aria-label="Dashboard navigation" className="space-y-7 p-4">
            {groups.map((group) => (
                <div key={group.label}>
                    <div className="flex items-center gap-3 px-3"><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#666]">{group.label}</p><span className="h-px flex-1 bg-[#252525]" /></div>
                    <div className="mt-2 space-y-1">
                        {group.items.map((item) => {
                            const active = item.href === "/dashboard"
                                ? pathname === item.href
                                : pathname.startsWith(item.href);
                            const Icon = item.icon;

                            if (item.comingSoon) {
                                return (
                                    <div key={item.href} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[#555]">
                                        <Icon size={16} />
                                        <span className="min-w-0 flex-1 truncate text-sm">{item.label}</span>
                                        <Clock3 size={13} aria-label="Coming soon" />
                                    </div>
                                );
                            }

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={onNavigate}
                                    aria-current={active ? "page" : undefined}
                                    className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3ea6ff] ${active ? "bg-[#3ea6ff]/10 font-medium text-[#f1f1f1]" : "text-[#999] hover:bg-[#202020] hover:text-[#f1f1f1]"}`}
                                >
                                    {active && <span aria-hidden="true" className="absolute left-0 h-5 w-0.5 rounded-full bg-[#3ea6ff]" />}
                                    <Icon size={16} className={active ? "text-[#3ea6ff]" : "text-[#666] group-hover:text-[#aaa]"} />
                                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                                    {active && <ChevronRight size={14} className="text-[#3ea6ff]" />}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            ))}
        </nav>
    );
}
