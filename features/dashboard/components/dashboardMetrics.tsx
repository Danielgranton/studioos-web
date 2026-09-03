"use client";

import { Bookmark, CalendarCheck, FolderKanban } from "lucide-react";

import type { DashboardMetrics as DashboardMetricsData } from "../types/overview";

export function DashboardMetricCards({ metrics }: { metrics: DashboardMetricsData }) {
    const cards = [
        {
            label: "Upcoming bookings",
            value: metrics.upcomingBookings,
            detail: metrics.upcomingBookings === 1 ? "session scheduled" : "sessions scheduled",
            icon: CalendarCheck,
        },
        {
            label: "Saved items",
            value: metrics.savedItems,
            detail: metrics.savedItems === 1 ? "item saved" : "items saved",
            icon: Bookmark,
        },
        {
            label: "Projects",
            value: metrics.activeProjects,
            detail: "Project workspace coming soon",
            icon: FolderKanban,
            muted: true,
        },
    ];

    return (
        <section aria-label="Workspace overview" className="mt-5 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {cards.map(({ label, value, detail, icon: Icon, muted }) => (
                <div key={label} className="rounded-2xl border border-[#303030] bg-[#151515] px-4 py-4 sm:px-5">
                    <div className="flex items-center justify-between gap-3">
                        <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${muted ? "bg-[#252525] text-[#777]" : "bg-[#3ea6ff]/10 text-[#3ea6ff]"}`}>
                            <Icon size={17} />
                        </span>
                        <span className={`text-2xl font-semibold tracking-tight ${muted ? "text-[#777]" : "text-[#f1f1f1]"}`}>{value}</span>
                    </div>
                    <p className="mt-4 text-sm font-medium text-[#ddd]">{label}</p>
                    <p className="mt-1 text-xs text-[#777]">{detail}</p>
                </div>
            ))}
        </section>
    );
}
