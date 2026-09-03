"use client";

import Link from "next/link";
import { ArrowRight, CalendarPlus, Compass, Settings2, Sparkles, UserRound } from "lucide-react";

import type { DashboardRecommendation } from "../types/overview";

export function DashboardDiscovery({ recommendations }: { recommendations: DashboardRecommendation[] }) {
    return (
        <section className="mt-5 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
            <QuickActions />
            <Recommendations recommendations={recommendations} />
        </section>
    );
}

function QuickActions() {
    const actions = [
        { label: "Explore studios", description: "Find a space for your next session", href: "/", icon: Compass },
        { label: "Update profile", description: "Make your public identity stronger", href: "/dashboard/profile", icon: UserRound },
        { label: "Review sessions", description: "Check where your account is signed in", href: "/dashboard/sessions", icon: CalendarPlus },
        { label: "Account settings", description: "Manage preferences and security", href: "/dashboard/settings", icon: Settings2 },
    ];

    return (
        <div className="rounded-2xl border border-[#303030] bg-[#151515] p-5 sm:p-6">
            <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#666]">Shortcuts</p>
                <h2 className="mt-2 text-base font-semibold text-[#f1f1f1]">Quick actions</h2>
            </div>
            <div className="mt-5 space-y-1">
                {actions.map(({ label, description, href, icon: Icon }) => (
                    <Link key={href} href={href} className="group flex items-center gap-3 rounded-xl px-2 py-3 transition hover:bg-[#202020]">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#3ea6ff]/10 text-[#3ea6ff]"><Icon size={15} /></span>
                        <span className="min-w-0 flex-1">
                            <span className="block text-sm font-medium text-[#ddd]">{label}</span>
                            <span className="mt-0.5 block truncate text-xs text-[#666]">{description}</span>
                        </span>
                        <ArrowRight size={14} className="text-[#555] transition group-hover:translate-x-0.5 group-hover:text-[#3ea6ff]" />
                    </Link>
                ))}
            </div>
        </div>
    );
}

function Recommendations({ recommendations }: { recommendations: DashboardRecommendation[] }) {
    return (
        <div className="rounded-2xl border border-[#303030] bg-[#151515] p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#666]">Curated for you</p>
                    <h2 className="mt-2 text-base font-semibold text-[#f1f1f1]">Recommendations</h2>
                </div>
                <Sparkles size={18} className="text-[#3ea6ff]" />
            </div>

            {recommendations.length > 0 ? (
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {recommendations.map((recommendation) => (
                        <Link key={recommendation.id} href={recommendation.href} className="group rounded-xl border border-[#303030] bg-[#101010] p-3 transition hover:border-[#3ea6ff]/40 hover:bg-[#1b1b1b]">
                            <div className="flex items-center justify-between gap-3">
                                <span className="text-[10px] uppercase tracking-[0.16em] text-[#666]">{recommendation.type}</span>
                                <ArrowRight size={14} className="text-[#555] transition group-hover:translate-x-0.5 group-hover:text-[#3ea6ff]" />
                            </div>
                            <p className="mt-3 truncate text-sm font-medium text-[#ddd]">{recommendation.title}</p>
                            {recommendation.subtitle && <p className="mt-1 truncate text-xs text-[#777]">{recommendation.subtitle}</p>}
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="mt-5 flex min-h-[124px] flex-col items-center justify-center rounded-xl border border-dashed border-[#363636] px-4 text-center">
                    <Sparkles size={17} className="text-[#666]" />
                    <p className="mt-3 text-sm font-medium text-[#bbb]">Recommendations are warming up</p>
                    <p className="mt-1 max-w-sm text-xs leading-5 text-[#666]">Explore StudioOS and your personalized picks will appear here as your activity grows.</p>
                </div>
            )}
        </div>
    );
}
