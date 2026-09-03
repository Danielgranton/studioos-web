"use client";

import Link from "next/link";
import { ArrowRight, CircleUserRound, Sparkles } from "lucide-react";

import type { DashboardOverview } from "../types/overview";

export function DashboardWelcome({ overview }: { overview: DashboardOverview }) {
    const roleLabel = overview.user.role.replaceAll("_", " ");
    const firstMissing = overview.profile.missingItems.slice(0, 3);

    return (
        <section className="grid gap-4 border-b border-[#2b2b2b] pb-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-stretch">
            <div className="flex min-h-[220px] flex-col justify-between rounded-2xl border border-[#303030] bg-[#151515] p-5 sm:p-7">
                <div>
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#3f3f3f] bg-[#101010] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#999]">
                            <CircleUserRound size={13} className="text-[#3ea6ff]" />
                            {roleLabel}
                        </span>
                        <span className="text-[11px] text-[#666]">Personal workspace</span>
                    </div>
                    <h1 className="mt-5 max-w-2xl text-2xl font-semibold tracking-tight text-[#f1f1f1] sm:text-3xl">
                        Welcome back, {overview.user.name.split(" ")[0] || "creator"}.
                    </h1>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-[#888]">
                        Keep your next session, collaboration, and release moving from one place.
                    </p>
                </div>

                <div className="mt-7 flex flex-wrap gap-2">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 rounded-xl bg-[#3ea6ff] px-4 py-2.5 text-sm font-semibold text-[#0f0f0f] transition hover:bg-[#65b8ff]"
                    >
                        Explore StudioOS
                        <ArrowRight size={15} />
                    </Link>
                    <Link
                        href="/dashboard/profile"
                        className="inline-flex items-center gap-2 rounded-xl border border-[#3f3f3f] px-4 py-2.5 text-sm font-medium text-[#ddd] transition hover:border-[#555] hover:bg-[#202020]"
                    >
                        Complete profile
                    </Link>
                </div>
            </div>

            <div className="rounded-2xl border border-[#303030] bg-[#121212] p-5 sm:p-6">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#666]">Profile strength</p>
                        <p className="mt-2 text-3xl font-semibold tracking-tight text-[#f1f1f1]">{overview.profile.percentage}%</p>
                    </div>
                    <Sparkles size={18} className="text-[#3ea6ff]" />
                </div>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#292929]" aria-label={`Profile ${overview.profile.percentage}% complete`} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={overview.profile.percentage}>
                    <div className="h-full rounded-full bg-[#3ea6ff] transition-all" style={{ width: `${overview.profile.percentage}%` }} />
                </div>
                {firstMissing.length > 0 ? (
                    <div className="mt-5">
                        <p className="text-xs text-[#999]">Finish these next:</p>
                        <ul className="mt-2 space-y-2">
                            {firstMissing.map((item) => (
                                <li key={item} className="flex items-center gap-2 text-xs text-[#bbb]">
                                    <span className="h-1.5 w-1.5 rounded-full bg-[#3ea6ff]" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <p className="mt-5 text-xs text-[#3ea6ff]">Your profile is ready to be discovered.</p>
                )}
                <Link href="/dashboard/profile" className="mt-5 inline-flex items-center gap-1 text-xs font-medium text-[#3ea6ff] transition hover:text-[#65b8ff]">
                    Manage profile
                    <ArrowRight size={13} />
                </Link>
            </div>
        </section>
    );
}
