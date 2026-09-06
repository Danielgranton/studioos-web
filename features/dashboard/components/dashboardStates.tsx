"use client";

import { AlertCircle, ArrowLeft, RefreshCw, ServerCrash, WifiOff } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export function DashboardLoadingState() {
    return (
        <div className="mx-auto max-w-6xl px-5 py-8 sm:px-6 sm:py-12" aria-label="Loading dashboard" role="status">
            <span className="sr-only">Loading your workspace...</span>
            <div className="grid animate-pulse gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
                <div className="h-[220px] rounded-2xl bg-[#181818]" />
                <div className="h-[220px] rounded-2xl bg-[#181818]" />
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="h-[122px] rounded-2xl bg-[#181818]" />
                <div className="h-[122px] rounded-2xl bg-[#181818]" />
                <div className="h-[122px] rounded-2xl bg-[#181818]" />
            </div>
            <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.75fr)]">
                <div className="h-[300px] rounded-2xl bg-[#181818]" />
                <div className="h-[300px] rounded-2xl bg-[#181818]" />
            </div>
        </div>
    );
}

export function DashboardErrorState({
    onRetry,
    title = "Workspace unavailable",
    description = "We could not reach StudioOS right now. Your account is safe. Try again in a moment.",
}: {
    onRetry: () => void | Promise<void>;
    title?: string;
    description?: string;
}) {
    const [retrying, setRetrying] = useState(false);

    async function retry() {
        setRetrying(true);
        try {
            await onRetry();
        } finally {
            setRetrying(false);
        }
    }

    return (
        <div className="mx-auto flex min-h-[calc(100vh-10rem)] max-w-2xl items-center justify-center px-5 py-16 sm:px-8">
            <div role="alert" className="relative w-full overflow-hidden rounded-[28px] border border-[#303030] bg-[#151515] px-6 py-10 text-center shadow-[0_24px_80px_rgba(0,0,0,0.22)] sm:px-12 sm:py-14">
                <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#3ea6ff]/8 blur-3xl" />
                <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#3ea6ff]/20 bg-[#3ea6ff]/10 text-[#3ea6ff]">
                    <ServerCrash size={28} strokeWidth={1.6} />
                    <span className="absolute -bottom-2 -right-2 flex h-7 w-7 items-center justify-center rounded-lg border-4 border-[#151515] bg-[#242424] text-[#999]"><WifiOff size={13} /></span>
                </div>
                <p className="relative mt-7 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#3ea6ff]">Connection interrupted</p>
                <h1 className="relative mt-3 text-2xl font-semibold tracking-tight text-[#f1f1f1] sm:text-3xl">{title}</h1>
                <p className="relative mx-auto mt-3 max-w-md text-sm leading-7 text-[#888]">{description}</p>
                <div className="relative mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                    <button type="button" onClick={() => void retry()} disabled={retrying} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#3ea6ff] px-5 py-3 text-sm font-semibold text-[#0f0f0f] transition hover:bg-[#65b8ff] disabled:cursor-wait disabled:opacity-60">
                        <RefreshCw size={16} className={retrying ? "animate-spin" : ""} />
                        {retrying ? "Reconnecting..." : "Try again"}
                    </button>
                    <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#3f3f3f] px-5 py-3 text-sm font-medium text-[#ccc] transition hover:border-[#555] hover:bg-[#202020]"><ArrowLeft size={16} /> Back to overview</Link>
                </div>
                <div className="relative mx-auto mt-8 flex max-w-sm items-center justify-center gap-2 border-t border-[#2b2b2b] pt-5 text-xs text-[#666]"><AlertCircle size={14} /> If this continues, check your connection or try again later.</div>
            </div>
        </div>
    );
}
