"use client";

import Link from "next/link";
import { Bell, ChevronRight, LogOut, ShieldCheck, Smartphone } from "lucide-react";

import { AuthService, clearSession } from "@/features/auth";
import { NotificationPreferences } from "./notificationPreferences";
import { PrivacySettings } from "./privacySettings";
import { DeleteAccount } from "./deleteAccount";
import { DataExport } from "./dataExport";

export function AccountSettings() {
    async function handleLogout() {
        try { await AuthService.logout(); } catch { /* Local cleanup still prevents stale client state. */ } finally {
            clearSession();
            window.location.assign("/auth/signin");
        }
    }

    return <div className="mx-auto max-w-6xl px-4 py-8 text-[#f1f1f1] sm:px-10 sm:py-12 md:px-15 lg:px-20">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#3ea6ff]">Account</p><h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Account settings</h1><p className="mt-2 max-w-xl text-sm leading-6 text-[#888]">Control security, privacy, sessions, and how StudioOS communicates with you.</p></div><Link href="/dashboard/profile" className="inline-flex items-center gap-2 self-start rounded-xl border border-[#3f3f3f] px-4 py-2.5 text-sm text-[#ddd] transition hover:border-[#3ea6ff]/50 hover:bg-[#222] sm:self-auto">Edit profile <ChevronRight size={15} /></Link></div>
        <div className="grid gap-5">
            <section id="sessions" className="scroll-mt-28 rounded-2xl border border-[#3f3f3f] bg-[#151515] p-5 sm:p-6"><SectionHeading icon={<Smartphone size={18} />} title="Sessions" description="Review and revoke signed-in devices." /><SettingsRow title="Active sessions" description="Manage the devices currently signed in to your account" href="/dashboard/sessions" icon={<Smartphone size={16} />} /></section>
            <section id="notifications" className="scroll-mt-28 rounded-2xl border border-[#3f3f3f] bg-[#151515] p-5 sm:p-6"><SectionHeading icon={<Bell size={18} />} title="Notifications" description="Choose how StudioOS keeps you informed." /><NotificationPreferences /></section>
            <section id="privacy" className="scroll-mt-28 rounded-2xl border border-[#3f3f3f] bg-[#151515] p-5 sm:p-6"><SectionHeading icon={<ShieldCheck size={18} />} title="Privacy and data" description="Control your visibility and account data." /><PrivacySettings /><DataExport /><DeleteAccount /></section>
        </div>
        <div className="mt-5 flex justify-end"><button type="button" onClick={() => void handleLogout()} className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-300 transition hover:bg-red-400/10"><LogOut size={16} /> Log out</button></div>
    </div>;
}

function SectionHeading({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) { return <div className="flex items-start gap-3"><span className="mt-0.5 text-[#3ea6ff]">{icon}</span><div><h2 className="text-base font-semibold">{title}</h2><p className="mt-1 text-sm text-[#888]">{description}</p></div></div>; }
function SettingsRow({ title, description, href, icon }: { title: string; description: string; href: string; icon: React.ReactNode }) { return <Link href={href} className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-[#303030] bg-[#101010] px-4 py-3 transition hover:border-[#3ea6ff]/40 hover:bg-[#191919]"><span className="flex items-center gap-3"><span className="text-[#3ea6ff]">{icon}</span><span><span className="block text-sm font-medium">{title}</span><span className="mt-1 block text-xs text-[#777]">{description}</span></span></span><ChevronRight size={17} className="shrink-0 text-[#666]" /></Link>; }
