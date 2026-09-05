"use client";

import { useEffect, useState } from "react";
import { Globe2, Laptop, Loader2, LogOut, Monitor, RefreshCw, Smartphone } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { AuthService } from "../services/auth.service";
import { clearSession } from "../services/session.service";
import type { AuthSession } from "../types/auth";

export function SessionManagement() {
    const [sessions, setSessions] = useState<AuthSession[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [actionId, setActionId] = useState("");
    const router = useRouter();

    async function loadSessions(showSpinner = true) {
        if (showSpinner) setLoading(true); else setRefreshing(true);
        try { setSessions(await AuthService.getSessions()); }
        catch (error) { const response = (error as { response?: { data?: { message?: string } } }).response; toast.error("Could not load sessions", { description: response?.data?.message || "Please try again." }); }
        finally { setLoading(false); setRefreshing(false); }
    }

    useEffect(() => { void loadSessions(); }, []);

    async function revoke(sessionId: string) {
        setActionId(sessionId);
        try { await AuthService.revokeSession(sessionId); setSessions((current) => current.map((session) => session.sessionId === sessionId ? { ...session, active: false, revokedAt: new Date().toISOString() } : session)); toast.success("Session signed out"); }
        catch { toast.error("Could not sign out this session"); }
        finally { setActionId(""); }
    }

    async function revokeAll() {
        setActionId("all");
        try { await AuthService.logout(true); clearSession(); toast.success("All sessions signed out"); router.replace("/auth/signin"); }
        catch { toast.error("Could not sign out all sessions"); }
        finally { setActionId(""); }
    }

    const activeSessions = sessions.filter((session) => session.active);

    return <main className="mx-auto max-w-5xl px-4 py-8 text-[#f1f1f1] sm:px-10 sm:py-12 md:px-15 lg:px-20">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#3ea6ff]">Security</p><h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Where you&apos;re logged in</h1><p className="mt-2 max-w-xl text-sm leading-6 text-[#888]">Review active login sessions and sign out devices you do not recognize.</p></div><div className="flex gap-2"><button type="button" onClick={() => void loadSessions(false)} disabled={refreshing} className="inline-flex items-center gap-2 rounded-xl border border-[#3f3f3f] px-3 py-2 text-xs text-[#bbb] transition hover:bg-[#181818] disabled:opacity-60"><RefreshCw size={14} className={refreshing ? "animate-spin" : ""} /> Refresh</button><button type="button" onClick={() => void revokeAll()} disabled={actionId !== "" || activeSessions.length === 0} className="inline-flex items-center gap-2 rounded-xl border border-red-400/30 px-3 py-2 text-xs text-red-300 transition hover:bg-red-400/10 disabled:opacity-50"><LogOut size={14} /> Log out all</button></div></div>
        <div className="mt-7 rounded-2xl border border-[#3f3f3f] bg-[#151515] p-4 sm:p-5"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3ea6ff]/10 text-[#3ea6ff]"><Monitor size={18} /></div><div><p className="text-sm font-semibold">{activeSessions.length} active {activeSessions.length === 1 ? "session" : "sessions"}</p><p className="mt-1 text-xs text-[#777]">Each login has its own revocable session.</p></div></div></div>
        <div className="mt-5 overflow-hidden rounded-2xl border border-[#3f3f3f] bg-[#151515]">{loading ? <div className="flex items-center justify-center gap-2 p-10 text-sm text-[#888]"><Loader2 size={16} className="animate-spin" /> Loading sessions...</div> : sessions.length === 0 ? <p className="p-10 text-center text-sm text-[#888]">No sessions found.</p> : sessions.map((session) => <SessionRow key={session.sessionId} session={session} busy={actionId === session.sessionId} onRevoke={() => void revoke(session.sessionId)} />)}</div>
    </main>;
}

function SessionRow({ session, busy, onRevoke }: { session: AuthSession; busy: boolean; onRevoke: () => void }) {
    const isMobile = session.deviceType === "MOBILE" || /mobile|android|iphone/i.test(`${session.deviceName} ${session.userAgent}`);
    const Icon = isMobile ? Smartphone : Laptop;
    return <div className="flex flex-col gap-4 border-b border-[#3f3f3f] p-5 last:border-b-0 sm:flex-row sm:items-start sm:justify-between"><div className="flex min-w-0 items-start gap-4"><div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${session.active ? "bg-[#3ea6ff]/10 text-[#3ea6ff]" : "bg-[#272727] text-[#666]"}`}><Icon size={20} /></div><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><p className="truncate text-sm font-semibold">{session.deviceName || "Unknown device"}</p>{session.currentSession && <span className="rounded-full bg-emerald-400/10 px-2 py-0.5 text-[10px] text-emerald-300">This device</span>}<span className={`rounded-full px-2 py-0.5 text-[10px] ${session.active ? "bg-[#3ea6ff]/10 text-[#8ccfff]" : "bg-[#272727] text-[#777]"}`}>{session.active ? "Active" : "Revoked"}</span></div><p className="mt-2 text-xs text-[#aaa]">{session.browser || "Unknown browser"} · {session.operatingSystem || "Unknown OS"}</p><p className="mt-1 flex items-center gap-1.5 text-xs text-[#777]"><Globe2 size={12} />IP address: {session.ipAddress || "Unavailable"}</p><p className="mt-1 text-xs text-[#666]">Last active {formatActivity(session.lastActiveAt || session.createdAt)} · Started {formatDate(session.createdAt)}{session.expiresAt ? ` · Expires ${formatDate(session.expiresAt)}` : ""}</p></div></div>{session.active && !session.currentSession && <button type="button" onClick={onRevoke} disabled={busy} className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-[#3f3f3f] px-3 py-2 text-xs text-[#aaa] transition hover:border-red-400/40 hover:text-red-300 disabled:opacity-60 sm:self-auto">{busy ? <Loader2 size={14} className="animate-spin" /> : <LogOut size={14} />} Log out</button>}</div>;
}

function formatDate(value: string) { return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)); }
function formatActivity(value: string) { const age = Date.now() - new Date(value).getTime(); if (age < 60_000) return "now"; if (age < 3_600_000) return `${Math.floor(age / 60_000)}m ago`; if (age < 86_400_000) return `${Math.floor(age / 3_600_000)}h ago`; return formatDate(value); }
