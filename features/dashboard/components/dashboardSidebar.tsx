"use client";

import { ChevronRight, Clock3, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

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
            <aside className="hidden w-64 shrink-0 border-r border-[#2b2b2b] bg-[#121212] lg:block">
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
                <div className="fixed inset-0 z-50 lg:hidden">
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
                            <div>
                                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#666]">StudioOS</p>
                                <p className="mt-1 text-sm font-semibold text-[#f1f1f1]">Your workspace</p>
                            </div>
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
        <nav aria-label="Dashboard navigation" className="space-y-6 p-4">
            {groups.map((group) => (
                <div key={group.label}>
                    <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#666]">{group.label}</p>
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
                                <a
                                    key={item.href}
                                    href={item.href}
                                    onClick={onNavigate}
                                    aria-current={active ? "page" : undefined}
                                    className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3ea6ff] ${active ? "bg-[#3ea6ff]/10 font-medium text-[#f1f1f1]" : "text-[#999] hover:bg-[#202020] hover:text-[#f1f1f1]"}`}
                                >
                                    <Icon size={16} className={active ? "text-[#3ea6ff]" : "text-[#666] group-hover:text-[#aaa]"} />
                                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                                    {active && <ChevronRight size={14} className="text-[#3ea6ff]" />}
                                </a>
                            );
                        })}
                    </div>
                </div>
            ))}
        </nav>
    );
}
