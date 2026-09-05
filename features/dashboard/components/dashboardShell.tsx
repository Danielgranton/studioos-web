"use client";

import { usePathname } from "next/navigation";

import { DashboardSidebar } from "./dashboardSidebar";

const pageLabels: Record<string, string> = {
    "/dashboard": "Overview",
    "/dashboard/profile": "Profile",
    "/dashboard/sessions": "Sessions",
    "/dashboard/settings": "Settings",
};

const pageDescriptions: Record<string, string> = {
    "/dashboard": "Your activity at a glance",
    "/dashboard/profile": "Your public identity and creator details",
    "/dashboard/sessions": "Review your signed-in sessions",
    "/dashboard/settings": "Manage your account preferences",
};

export function DashboardShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const pageLabel = pageLabels[pathname] || "Workspace";

    return (
        <div className="flex h-[calc(100dvh-4rem)] min-h-0 flex-col overflow-hidden border-x border-[#252525]/70 bg-[#101010] lg:h-[calc(100dvh-7rem)]">
            <a href="#dashboard-main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-40 focus:rounded-lg focus:bg-[#3ea6ff] focus:px-3 focus:py-2 focus:text-xs focus:font-semibold focus:text-[#0f0f0f]">
                Skip to dashboard content
            </a>
            <div className="mx-auto flex h-full min-h-0 w-full max-w-[1600px] flex-col">
                <div className="flex min-h-16 shrink-0 items-center justify-between gap-4 border-b border-[#252525] bg-[#111111] px-4 sm:px-6">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#666]">
                            <span>Workspace</span>
                            <span aria-hidden="true" className="text-[#444]">/</span>
                            <span className="text-[#999]">{pageLabel}</span>
                        </div>
                        <p className="mt-1 truncate text-xs text-[#777]">{pageDescriptions[pathname] || "Your StudioOS workspace"}</p>
                    </div>
                    <div className="hidden shrink-0 items-center gap-2 rounded-full border border-[#2f3a34] bg-[#172019] px-3 py-1.5 text-[10px] font-medium text-[#9bd3aa] sm:flex">
                        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        Workspace ready
                    </div>
                </div>
                <div className="flex min-h-0 min-w-0 flex-1">
                    <DashboardSidebar />
                    <main id="dashboard-main" tabIndex={-1} className="dashboard-scrollbar min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain outline-none">{children}</main>
                </div>
            </div>
        </div>
    );
}
