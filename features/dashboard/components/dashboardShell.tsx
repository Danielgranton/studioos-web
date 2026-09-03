"use client";

import { usePathname } from "next/navigation";

import { DashboardSidebar } from "./dashboardSidebar";

const pageLabels: Record<string, string> = {
    "/dashboard": "Overview",
    "/dashboard/profile": "Profile",
    "/dashboard/sessions": "Sessions",
    "/dashboard/settings": "Settings",
};

export function DashboardShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const pageLabel = pageLabels[pathname] || "Workspace";

    return (
        <div className="min-h-[calc(100vh-5rem)] overflow-x-hidden border-x border-[#252525]/70 bg-[#101010]">
            <a href="#dashboard-main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-40 focus:rounded-lg focus:bg-[#3ea6ff] focus:px-3 focus:py-2 focus:text-xs focus:font-semibold focus:text-[#0f0f0f]">
                Skip to dashboard content
            </a>
            <div className="mx-auto flex w-full max-w-[1600px] flex-col">
                <div className="flex min-h-10 items-center border-b border-[#252525] px-4 text-[11px] uppercase tracking-[0.18em] text-[#666] sm:px-6">
                    <span>Workspace</span>
                    <span aria-hidden="true" className="mx-2 text-[#444]">/</span>
                    <span className="text-[#aaa]">{pageLabel}</span>
                </div>
                <div className="flex min-w-0 flex-1">
                    <DashboardSidebar />
                    <main id="dashboard-main" tabIndex={-1} className="min-w-0 flex-1 outline-none">{children}</main>
                </div>
            </div>
        </div>
    );
}
