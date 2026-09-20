"use client";

import Link from "next/link";
import { ArrowRight, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { BeatCard } from "./BeatCard";
import { BeatService } from "@/features/beatmarketplace";
import type { BeatSummary } from "@/features/beatmarketplace";

const filters = ["Top rated", "Basic", "Premium", "Exclusive"];

export function TrendingBeats() {
    const [activeFilter, setActiveFilter] = useState("Top rated");
    const [beats, setBeats] = useState<BeatSummary[] | null>(null);
    const [error, setError] = useState(false);

    async function loadBeats() {
        setError(false);
        try {
            const response = await BeatService.browse({ page: 0, size: 50, sortBy: "TRENDING" });
            setBeats(response.content ?? []);
        } catch {
            setError(true);
        }
    }

    useEffect(() => { void loadBeats(); }, []);

    const visibleBeats = useMemo(() => {
        const filtered = (beats ?? []).filter((beat) => {
            if (activeFilter === "Basic") return beat.licenseType === "BASIC";
            if (activeFilter === "Premium") return beat.licenseType === "PREMIUM";
            if (activeFilter === "Exclusive") return beat.licenseType === "EXCLUSIVE";
            return true;
        });
        return [...filtered]
            .sort((first, second) => (second.averageRating ?? 0) - (first.averageRating ?? 0)
                || (second.reviewCount ?? 0) - (first.reviewCount ?? 0)
                || (second.likeCount ?? 0) - (first.likeCount ?? 0)
                || (second.playCount ?? 0) - (first.playCount ?? 0))
        .slice(0, 10);
    }, [activeFilter, beats]);

    return (
        <section
            id="beats"
            className="
                relative
                overflow-hidden
                scroll-mt-28
            "
        >

            <div
                className="
                    relative
                    mx-auto
                    max-w-[1600px]
                    px-6
                "
            >
                {/* Header */}
                <div
                    className="
                        mb-7
                        flex
                        flex-col
                        gap-6
                        lg:mb-10
                        lg:flex-row
                        lg:items-end
                        lg:justify-between
                    "
                >
                    <div className="max-w-2xl">

                        {/* Badge */}
                        <div className="flex items-center gap-3">
                            <span
                                className="
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-full
                                    border
                                    border-[#e8a33d]/20
                                    bg-[#e8a33d]/10
                                    px-3
                                    py-1
                                    text-[9px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.2em]
                                    text-[#e8a33d]
                                "
                            >
                                <span className="relative flex h-1.5 w-1.5">
                                    <span
                                        className="
                                            absolute
                                            inline-flex
                                            h-full
                                            w-full
                                            animate-ping
                                            rounded-full
                                            bg-[#e8a33d]
                                            opacity-60
                                        "
                                    />
                                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#e8a33d]" />
                                </span>
                                Top Rated Beats
                            </span>

                            <span className="h-px flex-1 bg-gradient-to-r from-[#e8a33d]/30 to-transparent lg:hidden" />
                        </div>

                        {/* Headline */}
                        <div className="mt-3 flex items-center gap-3 sm:mt-5 sm:gap-4">

                            {/* Waveform mark */}
                            <div
                                aria-hidden="true"
                                className="hidden h-9 shrink-0 items-end gap-[3px] sm:flex"
                            >
                                {[10, 20, 8, 28, 14, 24, 9, 18].map((h, i) => (
                                    <span
                                        key={i}
                                        className="w-[3px] animate-pulse rounded-full bg-[#e8a33d]"
                                        style={{
                                            height: `${h}px`,
                                            animationDelay: `${i * 0.12}s`,
                                            animationDuration: "1.4s",
                                        }}
                                    />
                                ))}
                            </div>

                            <h2
                                className="
                                    font-black
                                    leading-[1.05]
                                    tracking-tight
                                    text-[#f5f4f1]
                                    whitespace-nowrap
                                "
                                style={{
                                    fontSize: "clamp(1.1rem, 4.2vw, 2rem)",
                                }}
                            >
                                Fresh sounds,{" "}
                                <span className="relative inline-block">
                                    <span className="text-blue-600">
                                        Own your favourite Beat
                                    </span>
                                    <svg
                                        aria-hidden="true"
                                        viewBox="0 0 200 16"
                                        preserveAspectRatio="none"
                                        className="absolute -bottom-1 left-0 h-[0.15em] w-full text-blue-600"
                                    >
                                        <path
                                            d="M2 8 H198"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            strokeDasharray="14 8"
                                            className="beats-headline-underline"
                                        />
                                    </svg>
                                </span>
                                .
                            </h2>
                        </div>

                        {/* Subhead */}
                        <p
                            className="
                                mt-3
                                max-w-lg
                                text-sm
                                leading-6
                                text-[#9a978f]
                                sm:mt-4
                                sm:text-base
                                sm:leading-7
                            "
                        >
                            Discover the highest-rated instrumentals from StudioOS producers. Preview, compare, and license your next record.
                        </p>

                        {/* Trust signal strip — mirrors the producer section's live stats */}
                        <div className="mt-5 flex flex-wrap items-baseline gap-x-5 gap-y-2 sm:mt-6 sm:gap-x-6">
                            {[
                                { value: beats ? visibleBeats.length.toLocaleString() : "--", label: "beats in view" },
                                { value: beats && visibleBeats.length ? `${(visibleBeats.reduce((sum, beat) => sum + (beat.averageRating ?? 0), 0) / visibleBeats.length).toFixed(1)}★` : "--", label: "avg rating" },
                                { value: beats ? visibleBeats.reduce((sum, beat) => sum + (beat.reviewCount ?? 0), 0).toLocaleString() : "--", label: "listener reviews" },
                            ].map((stat) => (
                                <div key={stat.label} className="flex items-baseline gap-1.5">
                                    <span className="font-mono text-sm font-bold text-[#f5f4f1] sm:text-base">{stat.value}</span>
                                    <span className="text-[11px] text-[#6b685f] sm:text-xs">{stat.label}</span>
                                </div>
                            ))}
                        </div>

                    </div>

                    {/* Right — CTA + filter */}
                    <div
                        className="
                            flex
                            shrink-0
                            flex-col
                            items-start
                            gap-3
                            sm:gap-4
                            lg:items-end
                        "
                    >
                        <Link
                            href="/marketplace"
                            className="
                                group
                                inline-flex
                                w-full
                                items-center
                                justify-center
                                gap-2
                                rounded-full
                                border
                                border-blue-600
                                bg-blue-600
                                px-5
                                py-2.5
                                text-sm
                                font-semibold
                                text-white
                                transition-all
                                hover:bg-blue-700
                                hover:gap-3
                                sm:w-auto
                                sm:justify-start
                            "
                        >
                            Explore Marketplace
                            <ArrowRight
                                size={16}
                                strokeWidth={2.5}
                                className="transition-transform duration-300 group-hover:translate-x-1"
                            />
                        </Link>

                        {/* Quick filter chips */}
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            {filters.map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setActiveFilter(filter)}
                                    className={`
                                        rounded-full
                                        border
                                        px-2.5
                                        py-1
                                        text-[11px]
                                        font-medium
                                        transition
                                        sm:px-3
                                        sm:py-1.5
                                        sm:text-xs
                                        ${
                                            activeFilter === filter
                                                ? "border-[#e8a33d]/40 bg-[#e8a33d]/10 text-[#e8a33d]"
                                                : "border-[#2a2825] bg-[#161513] text-[#9a978f] hover:border-[#3a3630] hover:text-[#f5f4f1]"
                                        }
                                    `}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>
                    </div>

                </div>

                {error ? <BeatErrorState onRetry={() => void loadBeats()} /> : !beats ? <BeatGridLoading /> : visibleBeats.length === 0 ? <BeatEmptyState filter={activeFilter} /> : <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">{visibleBeats.map((beat, index) => <BeatCard key={beat.id} {...toCardBeat(beat)} loading={index === 0 ? "eager" : "lazy"} />)}</div>}

            </div>

            <style>{`
                .beats-headline-underline {
                    animation: beats-dash-march 1.2s linear infinite;
                }
                @media (prefers-reduced-motion: reduce) {
                    .beats-headline-underline {
                        animation: none;
                    }
                }
                @keyframes beats-dash-march {
                    to {
                        stroke-dashoffset: -22;
                    }
                }
            `}</style>
        </section>
    );
}

function toCardBeat(beat: BeatSummary) {
    return {
        id: beat.id,
        slug: beat.id,
        title: beat.title,
        producer: beat.producerName || "StudioOS producer",
        thumbnail: beat.thumbnailUrl || beat.coverUrl || "/images/beats.png",
        genre: beat.genreName || "Unclassified",
        bpm: beat.bpm ?? 0,
        musicalKey: beat.keySignature || "Key unset",
        price: beat.startingPrice == null ? "Price on request" : `KSh ${beat.startingPrice.toLocaleString()}`,
        plays: beat.playCount ?? 0,
        likes: beat.likeCount ?? 0,
        duration: formatDuration(beat.duration),
        durationSeconds: beat.duration ?? 0,
        exclusive: beat.exclusive,
        verified: beat.verified,
        averageRating: beat.averageRating ?? 0,
        reviewCount: beat.reviewCount ?? 0,
    };
}

function formatDuration(seconds?: number | null) {
    if (!seconds || seconds < 1) return "--:--";
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

function BeatGridLoading() {
    return <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5" aria-label="Loading top-rated beats">{Array.from({ length: 10 }).map((_, index) => <div key={index} className="overflow-hidden rounded-2xl border border-[#2a2825] bg-[#161513] p-2.5"><div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[#24211d]"><div className="absolute inset-0 animate-pulse bg-white/[0.04]" /></div><div className="mt-3 h-4 w-2/3 animate-pulse rounded bg-[#24211d]" /><div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-[#24211d]" /><div className="mt-3 h-7 w-full animate-pulse rounded bg-[#1e1d1a]" /></div>)}</div>;
}

function BeatErrorState({ onRetry }: { onRetry: () => void }) {
    return <div className="relative flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-3xl border border-[#4a4032] bg-[linear-gradient(135deg,#1b1813,#151311)] px-6 text-center"><div aria-hidden="true" className="absolute left-1/2 top-0 h-28 w-64 -translate-x-1/2 rounded-full bg-[#e8a33d]/10 blur-3xl" /><div className="relative"><div className="mx-auto flex h-9 items-end justify-center gap-1">{[12, 24, 16, 30, 19, 26, 10].map((height, index) => <span key={index} className="w-1 rounded-full bg-[#e8a33d]/70" style={{ height }} />)}</div><p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#e8a33d]">Signal interrupted</p><h3 className="mt-2 text-lg font-semibold text-[#f5f4f1]">The beat shelf is taking a moment</h3><p className="mt-1 text-xs text-[#888]">The latest top-rated catalog could not be reached.</p><button type="button" onClick={onRetry} className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[#4a4032] px-3 py-2 text-xs font-semibold text-[#e8a33d] transition hover:bg-[#24211d]"><RefreshCw size={13} /> Reconnect</button></div></div>;
}

function BeatEmptyState({ filter }: { filter: string }) {
    return <div className="relative flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed border-[#3a3027] bg-[#151311] px-6 text-center"><div aria-hidden="true" className="absolute left-1/2 top-0 h-24 w-56 -translate-x-1/2 rounded-full bg-[#e8a33d]/[0.06] blur-3xl" /><div className="relative"><div className="mx-auto flex h-10 w-16 items-end justify-center gap-1 opacity-70">{[10, 18, 28, 15, 23, 12].map((height, index) => <span key={index} className="w-1 rounded-full bg-[#5a5144]" style={{ height }} />)}</div><p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#777]">Quiet lane</p><h3 className="mt-2 text-lg font-semibold text-[#f5f4f1]">No {filter.toLowerCase()} beats yet</h3><p className="mt-1 max-w-sm text-xs leading-5 text-[#888]">New instrumentals will appear here as producers publish and listeners rate them.</p></div></div>;
}
