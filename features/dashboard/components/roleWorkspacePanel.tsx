"use client";

import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, CalendarClock, Disc3, Sparkles } from "lucide-react";

import type { RoleWorkspace } from "../types/overview";

export function RoleWorkspacePanel({ workspace }: { workspace: RoleWorkspace }) {
    if (workspace.role === "PRODUCER") {
        return (
            <WorkspaceCard
                eyebrow="Producer workspace"
                title="Keep your studio pipeline moving"
                description="Review incoming requests and keep your services ready for the next booking."
                icon={<BriefcaseBusiness size={18} />}
                items={[
                    { label: "Pending booking requests", value: workspace.pendingRequestCount },
                    { label: "Published services", value: workspace.serviceCount },
                ]}
                action={{ label: "Manage profile and services", href: "/dashboard/profile" }}
            />
        );
    }

    if (workspace.role === "ARTIST") {
        return (
            <WorkspaceCard
                eyebrow="Artist workspace"
                title="Shape your next release"
                description="Your release and project tools will live here as those workspaces come online."
                icon={<Disc3 size={18} />}
                items={[
                    { label: "Releases", value: workspace.releaseCount, muted: true },
                    { label: "Active projects", value: workspace.activeProjectCount, muted: true },
                ]}
                action={{ label: "Complete your artist profile", href: "/dashboard/profile" }}
            />
        );
    }

    if (workspace.role === "USER") {
        return (
            <WorkspaceCard
                eyebrow="Your next move"
                title="Find the right sound for your idea"
                description="Personalized recommendations will appear here once your StudioOS activity builds up."
                icon={<Sparkles size={18} />}
                items={[{ label: "Personalized recommendations", value: workspace.recommendationsCount, muted: true }]}
                action={{ label: "Explore StudioOS", href: "/" }}
            />
        );
    }

    return (
        <WorkspaceCard
            eyebrow="Workspace"
            title="Your account is ready"
            description="Manage your account details and security from the dashboard."
            icon={<CalendarClock size={18} />}
            items={[]}
            action={{ label: "Open account settings", href: "/dashboard/settings" }}
        />
    );
}

function WorkspaceCard({
    eyebrow,
    title,
    description,
    icon,
    items,
    action,
}: {
    eyebrow: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    items: Array<{ label: string; value: number; muted?: boolean }>;
    action: { label: string; href: string };
}) {
    return (
        <section className="mt-5 rounded-2xl border border-[#303030] bg-[#151515] p-5 sm:p-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div className="flex min-w-0 items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#3ea6ff]/10 text-[#3ea6ff]">{icon}</span>
                    <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#666]">{eyebrow}</p>
                        <h2 className="mt-2 text-base font-semibold text-[#f1f1f1]">{title}</h2>
                        <p className="mt-1 max-w-xl text-sm leading-6 text-[#888]">{description}</p>
                    </div>
                </div>
                <Link href={action.href} className="inline-flex shrink-0 items-center gap-2 self-start rounded-xl border border-[#3f3f3f] px-4 py-2.5 text-xs font-medium text-[#ddd] transition hover:border-[#3ea6ff]/50 hover:bg-[#202020] md:self-center">
                    {action.label}
                    <ArrowRight size={14} />
                </Link>
            </div>

            {items.length > 0 && (
                <div className="mt-5 grid gap-3 border-t border-[#292929] pt-4 sm:grid-cols-2">
                    {items.map((item) => (
                        <div key={item.label} className="flex items-center justify-between gap-3 rounded-xl bg-[#101010] px-4 py-3">
                            <span className="text-xs text-[#888]">{item.label}</span>
                            <span className={`text-lg font-semibold ${item.muted ? "text-[#777]" : "text-[#f1f1f1]"}`}>{item.value}</span>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
