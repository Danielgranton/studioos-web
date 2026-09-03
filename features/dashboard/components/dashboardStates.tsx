"use client";

import { AlertCircle, RefreshCw } from "lucide-react";

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

export function DashboardErrorState({ onRetry }: { onRetry: () => void }) {
    return (
        <div className="mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center px-5 py-16 text-center sm:px-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-400/10 text-red-300">
                <AlertCircle size={19} />
            </span>
            <h1 className="mt-4 text-base font-semibold text-[#f1f1f1]">Workspace unavailable</h1>
            <p className="mt-2 text-sm leading-6 text-[#888]">We could not load your dashboard data. Check your connection and try again.</p>
            <button
                type="button"
                onClick={onRetry}
                className="mt-5 inline-flex items-center gap-2 rounded-xl border border-[#3f3f3f] px-4 py-2.5 text-sm font-medium text-[#ddd] transition hover:border-[#555] hover:bg-[#202020]"
            >
                <RefreshCw size={15} />
                Try again
            </button>
        </div>
    );
}
