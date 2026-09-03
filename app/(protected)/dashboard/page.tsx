"use client";

import Link from "next/link";
import { ArrowUpRight, Bell, LockKeyhole, UserRound } from "lucide-react";

import { DashboardActivityPanels, DashboardDiscovery, DashboardErrorState, DashboardLoadingState, DashboardMetricCards, DashboardWelcome, RoleWorkspacePanel, useDashboardOverview } from "@/features/dashboard";

const cards = [
    { href: "/dashboard/profile", label: "Profile", description: "Update your public identity, contact details, and role.", icon: UserRound },
    { href: "/dashboard/settings#notifications", label: "Notifications", description: "Choose where StudioOS updates can reach you.", icon: Bell },
    { href: "/dashboard/sessions", label: "Security", description: "Review active devices and revoke access you do not recognize.", icon: LockKeyhole },
];

export default function DashboardPage() {
    const { overview, loading, error, refresh } = useDashboardOverview();

    if (loading) {
        return <DashboardLoadingState />;
    }

    if (error || !overview) {
        return <DashboardErrorState onRetry={() => void refresh()} />;
    }

    return (
        <div className="mx-auto max-w-6xl px-4 py-7 text-[#f1f1f1] sm:px-6 sm:py-12">
            <DashboardWelcome overview={overview} />
            <DashboardMetricCards metrics={overview.metrics} />
            <DashboardActivityPanels bookings={overview.upcomingBookings} activity={overview.recentActivity} />
            <RoleWorkspacePanel workspace={overview.workspace} />
            <DashboardDiscovery recommendations={overview.recommendations} />
            <div className="mb-8 mt-10">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#3ea6ff]">Workspace</p>
                <h2 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">Quick access</h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-[#888]">A quick path to your account, preferences, and security controls.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                {cards.map(({ href, label, description, icon: Icon }) => (
                    <Link key={href} href={href} className="group rounded-2xl border border-[#3f3f3f] bg-[#151515] p-5 transition hover:border-[#3ea6ff]/50 hover:bg-[#191919]">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3ea6ff]/10 text-[#3ea6ff]"><Icon size={19} /></span>
                        <span className="mt-5 flex items-center justify-between gap-3"><span className="text-base font-semibold">{label}</span><ArrowUpRight size={16} className="text-[#666] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#3ea6ff]" /></span>
                        <span className="mt-2 block text-sm leading-6 text-[#888]">{description}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
