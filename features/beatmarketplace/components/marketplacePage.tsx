"use client";

import { useEffect, useMemo, useState } from "react";
import { RefreshCw, Search, SlidersHorizontal } from "lucide-react";

import BackButton from "@/constants/BackButton";
import { BeatCard } from "@/features/home/trending-beats";

import { BeatService } from "../services/beat.service";
import type { BeatSummary } from "../types/beat";

const filters = ["All", "Hip-Hop", "Afrobeat", "Trap", "Exclusive"];

export function MarketplacePage() {
    const [beats, setBeats] = useState<BeatSummary[] | null>(null);
    const [activeFilter, setActiveFilter] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState(false);

    async function loadBeats() {
        setError(false);
        try {
            const response = await BeatService.browse();
            setBeats(response.content ?? []);
        } catch {
            setError(true);
        }
    }

    useEffect(() => {
        void loadBeats();
    }, []);

    const visibleBeats = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();
        return (beats ?? []).filter((beat) => {
            const genre = beat.genreName?.toLowerCase() ?? "";
            const matchesSearch = !query || [beat.title, beat.producerName ?? "", genre].some((value) => value.toLowerCase().includes(query));
            const matchesFilter = activeFilter === "All"
                || (activeFilter === "Exclusive" && beat.exclusive)
                || genre.includes(activeFilter.toLowerCase().replace("-", " "))
                || (activeFilter === "Afrobeat" && genre.includes("afro"));
            return matchesSearch && matchesFilter;
        });
    }, [activeFilter, beats, searchTerm]);

    return (
        <main className="min-h-screen bg-[#0f0f0f] py-8 text-[#f5f4f1] sm:py-12">
            <section className="relative overflow-hidden scroll-mt-28">
                <div className="mx-auto max-w-[1600px] px-6">
                    <div className="mb-5"><BackButton /></div>
                    <div className="mb-8 flex flex-col gap-6 lg:mb-10 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-2xl">
                            <div className="mt-3 flex items-center gap-3 sm:mt-5 sm:gap-4">
                                <div aria-hidden="true" className="hidden h-9 shrink-0 items-end gap-[3px] sm:flex">{[10, 20, 8, 28, 14, 24, 9, 18].map((height, index) => <span key={index} className="beats-marketplace-wave w-[3px] rounded-full bg-[#e8a33d]" style={{ height: `${height}px`, animationDelay: `${index * 0.12}s` }} />)}</div>
                                <h1 className="whitespace-nowrap font-black leading-[1.05] tracking-tight" style={{ fontSize: "clamp(1.1rem, 4.2vw, 2rem)" }}>Find the sound for your <span className="relative inline-block"><span className="text-blue-600">next record</span><svg aria-hidden="true" viewBox="0 0 200 16" preserveAspectRatio="none" className="absolute -bottom-1 left-0 h-[0.15em] w-full text-blue-600"><path d="M2 8 H198" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="14 8" className="beats-marketplace-underline" /></svg></span>.</h1>
                            </div>
                            <p className="mt-3 max-w-xl text-sm leading-7 text-[#9a978f] sm:text-base">Browse original instrumentals from StudioOS producers. Preview the energy, find your pocket, and license the right beat.</p>
                            <div className="mt-5 flex flex-wrap items-baseline gap-x-6 gap-y-2"><span className="flex items-baseline gap-2"><span className="font-mono text-base font-bold">{beats?.length ?? "--"}</span><span className="text-xs text-[#6b685f]">beats in view</span></span><span className="flex items-baseline gap-2"><span className="font-mono text-base font-bold">{visibleBeats.filter((beat) => beat.exclusive).length || "--"}</span><span className="text-xs text-[#6b685f]">exclusive drops</span></span></div>
                        </div>
                        <div className="flex w-full flex-col items-start gap-3 lg:w-auto lg:items-end">
                            <label className="flex w-full items-center gap-2 rounded-full border border-[#2a2825] bg-[#161513] px-4 py-2.5 text-sm text-[#9a978f] sm:min-w-[300px]"><Search size={15} className="text-[#e8a33d]" /><span className="sr-only">Search beats</span><input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search beats or producers" className="w-full bg-transparent text-sm text-[#f5f4f1] outline-none placeholder:text-[#6b685f]" /></label>
                            <div className="flex flex-wrap gap-1.5 sm:gap-2">{filters.map((filter) => <button key={filter} type="button" onClick={() => setActiveFilter(filter)} className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${activeFilter === filter ? "border-[#e8a33d]/40 bg-[#e8a33d]/10 text-[#e8a33d]" : "border-[#2a2825] bg-[#161513] text-[#9a978f] hover:border-[#3a3630] hover:text-[#f5f4f1]"}`}>{filter}</button>)}</div>
                        </div>
                    </div>

                    {error ? <MarketplaceErrorState onRetry={() => void loadBeats()} /> : !beats ? <MarketplaceLoading /> : visibleBeats.length === 0 ? <MarketplaceEmptyState filter={activeFilter} searchTerm={searchTerm} onReset={() => { setActiveFilter("All"); setSearchTerm(""); }} /> : <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">{visibleBeats.map((beat, index) => <BeatCard key={beat.id} {...toCardBeat(beat)} loading={index === 0 ? "eager" : "lazy"} />)}</div>}
                </div>
            </section>
            <style>{`
                .beats-marketplace-wave { animation: beats-marketplace-wave-pulse 1.4s ease-in-out infinite; }
                .marketplace-shimmer { animation: marketplace-shimmer 1.8s ease-in-out infinite; background: linear-gradient(100deg, #24211d 25%, #302b24 45%, #24211d 65%); background-size: 200% 100%; }
                .beats-marketplace-underline { animation: beats-marketplace-dash-march 1.2s linear infinite; }
                @media (prefers-reduced-motion: reduce) {
                    .beats-marketplace-wave, .beats-marketplace-underline { animation: none; }
                }
                @keyframes beats-marketplace-wave-pulse {
                    0%, 100% { opacity: 0.55; transform: scaleY(0.72); transform-origin: bottom; }
                    50% { opacity: 1; transform: scaleY(1); transform-origin: bottom; }
                }
                @keyframes beats-marketplace-dash-march { to { stroke-dashoffset: -22; } }
                @keyframes marketplace-shimmer { to { background-position: -200% 0; } }
            `}</style>
        </main>
    );
}

function toCardBeat(beat: BeatSummary) {
    return { id: beat.id, slug: beat.id, title: beat.title, producer: beat.producerName || "StudioOS producer", thumbnail: beat.thumbnailUrl || beat.coverUrl || "/images/beats.png", genre: beat.genreName || "Unclassified", bpm: beat.bpm ?? 0, musicalKey: beat.keySignature || "Key unset", price: beat.startingPrice == null ? "Price on request" : `KSh ${beat.startingPrice.toLocaleString()}`, plays: beat.playCount ?? 0, likes: beat.likeCount ?? 0, duration: formatDuration(beat.duration), durationSeconds: beat.duration ?? 0, exclusive: beat.exclusive, verified: beat.verified, averageRating: beat.averageRating ?? 0, reviewCount: beat.reviewCount ?? 0 };
}

function formatDuration(seconds?: number | null) {
    if (seconds == null) return "--:--";
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

function MarketplaceLoading() {
    return <div aria-label="Loading beats" className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">{Array.from({ length: 10 }).map((_, index) => <div key={index} className="rounded-2xl border border-[#2a2825] bg-[#161513] p-2.5"><div className="marketplace-shimmer aspect-[4/3] rounded-xl" /><div className="mt-4 marketplace-shimmer h-4 w-2/3 rounded" /><div className="mt-3 marketplace-shimmer h-3 w-1/2 rounded" /><div className="mt-3 flex gap-1.5"><div className="marketplace-shimmer h-4 w-16 rounded" /><div className="marketplace-shimmer h-4 w-12 rounded" /></div></div>)}</div>;
}

function MarketplaceErrorState({ onRetry }: { onRetry: () => void }) {
    return <div className="relative overflow-hidden rounded-3xl border border-[#4a4032] bg-[linear-gradient(135deg,#1b1813,#151311)] px-6 py-14 text-center sm:py-16"><div aria-hidden="true" className="absolute inset-x-1/3 top-0 h-32 rounded-full bg-[#e8a33d]/10 blur-3xl" /><div className="relative"><div className="mx-auto flex h-12 items-end justify-center gap-1">{[12, 23, 9, 30, 17, 25, 11].map((height, index) => <span key={index} className="w-1 rounded-full bg-[#e8a33d]/70" style={{ height }} />)}</div><p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#e8a33d]">Signal interrupted</p><h2 className="mt-2 text-xl font-semibold text-[#f5f4f1]">The marketplace is taking a moment</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#888176]">The latest beats could not be reached. Your saved work is safe, try reconnecting in a moment.</p><button type="button" onClick={onRetry} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#e8a33d] px-4 py-2.5 text-sm font-semibold text-[#161513] transition hover:bg-[#f0b458]"><RefreshCw size={15} /> Reconnect</button></div></div>;
}

function MarketplaceEmptyState({ filter, searchTerm, onReset }: { filter: string; searchTerm: string; onReset: () => void }) {
    const filtered = filter !== "All";
    return <div className="relative overflow-hidden rounded-3xl border border-dashed border-[#3a3027] bg-[#151311] px-6 py-16 text-center"><div aria-hidden="true" className="absolute left-1/2 top-0 h-24 w-56 -translate-x-1/2 rounded-full bg-[#e8a33d]/[0.06] blur-3xl" /><div className="relative"><span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#e8a33d]/20 bg-[#e8a33d]/10 text-[#e8a33d]"><SlidersHorizontal size={23} /></span><p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#e8a33d]">Quiet channel</p><h2 className="mt-2 text-xl font-semibold text-[#f5f4f1]">No beats found{searchTerm ? ` for \"${searchTerm}\"` : ""}</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#888176]">{filtered ? `Nothing is tagged ${filter} yet.` : "Try a different search or explore another sound."}</p><button type="button" onClick={onReset} className="mt-6 rounded-xl border border-[#4a4032] px-4 py-2.5 text-sm font-medium text-[#ddd] transition hover:bg-[#242019]">Reset filters</button></div></div>;
}
