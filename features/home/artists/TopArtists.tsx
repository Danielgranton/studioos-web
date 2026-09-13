"use client";

import Link from "next/link";
import { ArrowRight, BadgeCheck, Music2, RefreshCw, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { ArtistApiService, ArtistCard } from "@/features/artist";
import type { Artist } from "@/features/artist";

const filters = ["Top Rated", "Featured", "Available Now", "Services available"];

export function TopArtists() {
    const [artists, setArtists] = useState<Artist[] | null>(null);
    const [activeFilter, setActiveFilter] = useState("Top Rated");
    const [hasError, setHasError] = useState(false);

    async function loadArtists() {
        setHasError(false);
        try {
            const response = await ArtistApiService.getArtists(0, 50);
            setArtists(response.content);
        } catch {
            setArtists([]);
            setHasError(true);
        }
    }

    useEffect(() => {
        void loadArtists();
    }, []);

    const visibleArtists = useMemo(() => {
        const source = artists ?? [];
        const filtered = source.filter((artist) => {
            if (activeFilter === "Top Rated") return true;
            if (activeFilter === "Featured") return artist.featured;
            if (activeFilter === "Available Now") return artist.available;
            if (activeFilter === "Services available") return artist.services.some((service) => service.active);
            return true;
        });

        return [...filtered]
            .sort((first, second) => {
                if (activeFilter === "Featured") return (second.popularityScore ?? 0) - (first.popularityScore ?? 0);
                return second.averageRating - first.averageRating || second.reviewCount - first.reviewCount;
            })
            .slice(0, 10);
    }, [activeFilter, artists]);

    const ratedArtists = (artists ?? []).filter((artist) => artist.averageRating > 0);
    const averageRating = ratedArtists.length
        ? ratedArtists.reduce((total, artist) => total + artist.averageRating, 0) / ratedArtists.length
        : 0;

    return (
        <section id="artists" className="relative scroll-mt-28">
            <div className="mx-auto max-w-[1600px] px-6">
                <div className="mb-8 flex flex-col gap-6 lg:mb-10 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl">
                        <span className="inline-flex items-center gap-2 rounded-full border border-[#e8a33d]/20 bg-[#e8a33d]/10 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#e8a33d]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#e8a33d]" />
                            Top artists
                        </span>
                        <h2 className="mt-3 text-3xl font-black tracking-tight text-[#f5f4f1] sm:text-4xl">
                            Meet the voices behind the <span className="text-blue-600">next release</span>
                        </h2>
                        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#9a978f] sm:text-base">
                            Discover artists ready to collaborate, perform, and bring your next idea to life.
                        </p>
                        <div className="mt-5 flex flex-wrap items-baseline gap-x-6 gap-y-2">
                            <div className="flex items-baseline gap-1.5"><span className="font-mono text-sm font-bold text-[#f5f4f1] sm:text-base">{artists?.length ?? 0}</span><span className="text-[11px] text-[#6b685f] sm:text-xs">artists</span></div>
                            <div className="flex items-baseline gap-1.5"><span className="font-mono text-sm font-bold text-[#f5f4f1] sm:text-base">{averageRating.toFixed(1)}★</span><span className="text-[11px] text-[#6b685f] sm:text-xs">avg rating</span></div>
                        </div>
                    </div>

                    <div className="flex shrink-0 flex-col items-start gap-3 sm:gap-4 lg:items-end">
                        <Link href="/artists" className="group inline-flex w-full items-center justify-center gap-2 rounded-full border border-blue-600 bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 hover:gap-3 sm:w-fit">
                            View all artists
                            <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            {filters.map((filter) => (
                                <button key={filter} type="button" onClick={() => setActiveFilter(filter)} className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition sm:px-3 sm:py-1.5 sm:text-xs ${activeFilter === filter ? "border-[#e8a33d]/40 bg-[#e8a33d]/10 text-[#e8a33d]" : "border-[#2a2825] bg-[#161513] text-[#9a978f] hover:border-[#3a3630] hover:text-[#f5f4f1]"}`}>
                                    {filter}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {artists === null ? (
                    <ArtistsLoading />
                ) : hasError ? (
                    <DirectoryMessage onRetry={() => void loadArtists()} />
                ) : visibleArtists.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-5">
                        {visibleArtists.map((artist) => <ArtistCard key={artist.id} artist={artist} />)}
                    </div>
                ) : (
                    <ArtistEmptyState activeFilter={activeFilter} onReset={() => setActiveFilter("Top Rated")} />
                )}
            </div>
        </section>
    );
}

function ArtistsLoading() {
    return <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-5">{Array.from({ length: 5 }).map((_, index) => <div key={index} className="animate-pulse rounded-xl border border-[#2a2825] bg-[#161513] p-3.5"><div className="h-14 w-14 rounded-full bg-[#24211d]" /><div className="mt-5 h-4 w-2/3 rounded bg-[#24211d]" /><div className="mt-3 h-3 w-1/2 rounded bg-[#24211d]" /><div className="mt-8 h-3 w-full rounded bg-[#24211d]" /></div>)}</div>;
}

function DirectoryMessage({ onRetry }: { onRetry: () => void }) {
    return <div className="rounded-3xl border border-dashed border-[#3a3027] bg-gradient-to-br from-[#1b1813] to-[#151311] px-6 py-12 text-center"><span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#e8a33d]/20 bg-[#e8a33d]/10 text-[#e8a33d]"><RefreshCw size={22} /></span><p className="mt-5 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#e8a33d]"><Sparkles size={12} />Artist directory</p><h3 className="mt-2 text-xl font-semibold text-[#f5f4f1]">Artists are taking a moment</h3><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#888176]">We could not load the latest artist profiles. Try again in a moment.</p><button type="button" onClick={onRetry} className="mt-6 inline-flex items-center gap-2 rounded-xl border border-[#4a4032] px-4 py-2.5 text-sm font-medium text-[#ddd] transition hover:bg-[#242019]"><RefreshCw size={15} />Try again</button></div>;
}

function ArtistEmptyState({ activeFilter, onReset }: { activeFilter: string; onReset: () => void }) {
    const icon = activeFilter === "Featured" ? <Sparkles size={23} /> : activeFilter === "Services available" ? <Music2 size={23} /> : activeFilter === "Available Now" ? <BadgeCheck size={23} /> : <Music2 size={23} />;

    return (
        <div className="rounded-3xl border border-dashed border-[#3a3027] bg-gradient-to-br from-[#1b1813] to-[#151311] px-6 py-8 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-[#e8a33d]/20 bg-[#e8a33d]/10 text-[#e8a33d]">
                {icon}
            </span>
            <p className="mt-3 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#e8a33d]">
                <Sparkles size={12} />
                Artist directory
            </p>
            <h3 className="mt-1 text-lg font-semibold text-[#f5f4f1]">
                No {activeFilter.toLowerCase()} artists found
            </h3>
            <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-[#888176]">
                There are no artists in this collection yet. Try another filter to discover more creative partners on StudioOS.
            </p>
            <button
                type="button"
                onClick={onReset}
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#4a4032] bg-[#211e19] px-4 py-2 text-xs font-semibold text-[#e8a33d] transition hover:bg-[#29231b]"
            >
                <Music2 size={14} />
                View top artists
            </button>
        </div>
    );
}
