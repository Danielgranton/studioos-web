"use client";

import { useEffect, useState } from "react";
import { Laptop, Loader2, LogOut, RefreshCw, Smartphone } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { AuthService } from "../services/auth.service";
import { clearSession } from "../services/session.service";
import { AuthSession } from "../types/auth";

export function SessionManagement() {
    const [sessions, setSessions] = useState<AuthSession[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [actionId, setActionId] = useState("");
    const router = useRouter();

    async function loadSessions(showSpinner = true) {
        if (showSpinner) setLoading(true);
        else setRefreshing(true);
        try {
            setSessions(await AuthService.getSessions());
        } catch (error) {
            const response = (error as { response?: { data?: { message?: string } } }).response;
            toast.error("Could not load sessions", { description: response?.data?.message || "Please try again." });
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }

    useEffect(() => {
        void loadSessions();
    }, []);

    async function revoke(sessionId: string) {
        setActionId(sessionId);
        try {
            await AuthService.revokeSession(sessionId);
            setSessions((current) => current.map((session) => session.sessionId === sessionId ? { ...session, active: false, revokedAt: new Date().toISOString() } : session));
            toast.success("Session revoked");
        } catch {
            toast.error("Could not revoke session");
        } finally {
            setActionId("");
        }
    }

    async function revokeAll() {
        setActionId("all");
        try {
            await AuthService.logout(true);
            setSessions((current) => current.map((session) => ({ ...session, active: false, revokedAt: new Date().toISOString() })));
            clearSession();
            toast.success("All sessions revoked");
            router.replace("/auth/signin");
        } catch {
            toast.error("Could not revoke all sessions");
        } finally {
            setActionId("");
        }
    }

    return (
        <main className="mx-auto max-w-4xl py-10 text-[#f1f1f1]">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#3ea6ff]">Security</p><h1 className="mt-2 text-3xl font-semibold">Active sessions</h1><p className="mt-2 text-sm text-[#888]">Review where your StudioOS account is signed in.</p></div>
                <div className="flex gap-2"><button type="button" onClick={() => void loadSessions(false)} disabled={refreshing} className="inline-flex items-center gap-2 rounded-xl border border-[#3f3f3f] px-3 py-2 text-xs text-[#bbb] hover:bg-[#181818] disabled:opacity-60"><RefreshCw size={14} className={refreshing ? "animate-spin" : ""} /> Refresh</button><button type="button" onClick={() => void revokeAll()} disabled={actionId !== "" || !sessions.some((session) => session.active)} className="inline-flex items-center gap-2 rounded-xl border border-red-400/30 px-3 py-2 text-xs text-red-300 hover:bg-red-400/10 disabled:opacity-50"><LogOut size={14} /> Log out all</button></div>
            </div>
            <div className="mt-8 overflow-hidden rounded-2xl border border-[#3f3f3f] bg-[#151515]">
                {loading ? <div className="flex items-center justify-center gap-2 p-10 text-sm text-[#888]"><Loader2 size={16} className="animate-spin" /> Loading sessions...</div> : sessions.length === 0 ? <p className="p-10 text-center text-sm text-[#888]">No active sessions found.</p> : sessions.map((session) => <SessionRow key={session.sessionId} session={session} busy={actionId === session.sessionId} onRevoke={() => void revoke(session.sessionId)} />)}
            </div>
        </main>
    );
}

function SessionRow({ session, busy, onRevoke }: { session: AuthSession; busy: boolean; onRevoke: () => void }) {
    const Icon = /mobile|android|iphone/i.test(`${session.deviceName} ${session.userAgent}`) ? Smartphone : Laptop;
    return <div className="flex flex-col gap-4 border-b border-[#3f3f3f] p-5 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"><div className="flex min-w-0 items-center gap-4"><div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${session.active ? "bg-[#3ea6ff]/10 text-[#3ea6ff]" : "bg-[#272727] text-[#666]"}`}><Icon size={20} /></div><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><p className="truncate text-sm font-semibold">{session.deviceName || "Unknown device"}</p><span className={`rounded-full px-2 py-0.5 text-[10px] ${session.active ? "bg-emerald-400/10 text-emerald-300" : "bg-[#272727] text-[#777]"}`}>{session.active ? "Active" : "Revoked"}</span></div><p className="mt-1 truncate text-xs text-[#777]">{session.ipAddress || "IP unavailable"} · Started {formatDate(session.createdAt)}</p></div></div>{session.active && <button type="button" onClick={onRevoke} disabled={busy} className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-[#3f3f3f] px-3 py-2 text-xs text-[#aaa] hover:border-red-400/40 hover:text-red-300 disabled:opacity-60 sm:self-auto">{busy ? <Loader2 size={14} className="animate-spin" /> : <LogOut size={14} />} Revoke</button>}</div>;
}

function formatDate(value: string) {
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}
