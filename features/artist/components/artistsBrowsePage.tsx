"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, BadgeCheck, Music2, RefreshCw, Search, Sparkles } from "lucide-react";

import BackButton from "@/constants/BackButton";

import { ArtistService } from "../services/artist.service";
import type { Artist } from "../types/artist";
import { ArtistCard } from "./ArtistCard";

const filters = ["All", "Verified", "Services available"];

export function ArtistsBrowsePage() {
    const [artists, setArtists] = useState<Artist[] | null>(null);
    const [activeFilter, setActiveFilter] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [hasError, setHasError] = useState(false);

    async function loadArtists() {
        setHasError(false);
        try {
            const response = await ArtistService.getArtists(0, 20);
            setArtists(response.content);
        } catch {
            setHasError(true);
        }
    }

    useEffect(() => {
        void loadArtists();
    }, []);

    const visibleArtists = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();
        return (artists ?? []).filter((artist) => {
            const searchable = [
                artist.name,
                artist.genre,
                artist.location,
                artist.bio,
                ...artist.services.map((service) => service.name),
            ].filter(Boolean).join(" ").toLowerCase();

            const matchesSearch = !query || searchable.includes(query);
            const matchesFilter = activeFilter === "All"
                || (activeFilter === "Verified" && artist.verified)
                || (activeFilter === "Services available" && artist.services.some((service) => service.active));

            return matchesSearch && matchesFilter;
        });
    }, [activeFilter, artists, searchTerm]);

    if (artists === null && !hasError) return <ArtistsLoading />;

    return (
        <main className="min-h-screen bg-[#0f0f0f] pt-6 text-[#f5f4f1]">
            <div className="px-4 sm:px-6 lg:px-8">
                <BackButton />
            </div>

            <section className="relative scroll-mt-28">
                <div className="mx-auto max-w-[1600px] px-6 py-10 lg:px-20 lg:py-14">
                    <div className="mb-8 flex flex-col gap-6 lg:mb-10 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-2xl">
                            <span className="inline-flex items-center gap-2 rounded-full border border-[#e8a33d]/20 bg-[#e8a33d]/10 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#e8a33d]">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#e8a33d]" />
                                Artist directory
                            </span>
                            <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
                                Find your next <span className="text-blue-500">creative partner</span>
                            </h1>
                            <p className="mt-3 max-w-xl text-sm leading-7 text-[#9a978f] sm:text-base">
                                Discover verified artists and book focused creative services for your next release.
                            </p>
                            <div className="mt-5 flex items-baseline gap-2">
                                <span className="font-mono text-base font-bold text-[#f5f4f1]">{artists?.length ?? 0}</span>
                                <span className="text-xs text-[#6b685f]">artists available</span>
                            </div>
                        </div>

                        <div className="flex flex-col items-start gap-3 lg:items-end">
                            <label className="flex w-full items-center gap-2 rounded-full border border-[#2a2825] bg-[#161513] px-4 py-2.5 text-sm text-[#9a978f] sm:min-w-[280px]">
                                <Search size={15} className="shrink-0 text-[#e8a33d]" />
                                <span className="sr-only">Search artists</span>
                                <input
                                    value={searchTerm}
                                    onChange={(event) => setSearchTerm(event.target.value)}
                                    placeholder="Search artists"
                                    className="w-full bg-transparent text-sm text-[#f5f4f1] outline-none placeholder:text-[#6b685f]"
                                />
                            </label>
                            <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                {filters.map((filter) => (
                                    <button
                                        key={filter}
                                        type="button"
                                        onClick={() => setActiveFilter(filter)}
                                        className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${activeFilter === filter
                                            ? "border-[#e8a33d]/40 bg-[#e8a33d]/10 text-[#e8a33d]"
                                            : "border-[#2a2825] bg-[#161513] text-[#9a978f] hover:border-[#3a3630] hover:text-[#f5f4f1]"}`}
                                    >
                                        {filter}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {hasError ? (
                        <DirectoryMessage
                            icon={<AlertCircle size={22} />}
                            title="Artists are taking a moment"
                            message="We could not load the artist directory. Try again in a moment."
                            action={<button type="button" onClick={() => void loadArtists()} className="mt-6 inline-flex items-center gap-2 rounded-xl border border-[#4a4032] px-4 py-2.5 text-sm font-medium text-[#ddd] transition hover:bg-[#242019]"><RefreshCw size={15} />Try again</button>}
                        />
                    ) : visibleArtists.length === 0 ? (
                        <DirectoryMessage
                            icon={activeFilter === "Verified" ? <BadgeCheck size={23} /> : <Music2 size={23} />}
                            title={searchTerm ? "No artists match your search" : `No ${activeFilter.toLowerCase()} artists found`}
                            message={searchTerm ? "Try another name, location, genre, or service." : "Try another filter to discover artists on StudioOS."}
                            action={<button type="button" onClick={() => { setSearchTerm(""); setActiveFilter("All"); }} className="mt-6 rounded-full border border-[#4a4032] bg-[#211e19] px-4 py-2.5 text-xs font-semibold text-[#e8a33d] transition hover:bg-[#29231b]">View all artists</button>}
                        />
                    ) : (
                        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-5">
                            {visibleArtists.map((artist) => <ArtistCard key={artist.id} artist={artist} />)}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}

function DirectoryMessage({ icon, title, message, action }: { icon: React.ReactNode; title: string; message: string; action: React.ReactNode }) {
    return (
        <div className="rounded-3xl border border-dashed border-[#3a3027] bg-gradient-to-br from-[#1b1813] to-[#151311] px-6 py-14 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#e8a33d]/20 bg-[#e8a33d]/10 text-[#e8a33d]">{icon}</span>
            <p className="mt-5 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#e8a33d]"><Sparkles size={12} />Artist directory</p>
            <h2 className="mt-2 text-xl font-semibold text-[#f5f4f1]">{title}</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#888176]">{message}</p>
            {action}
        </div>
    );
}

function ArtistsLoading() {
    return (
        <main className="min-h-screen bg-[#0f0f0f] px-6 py-14 lg:px-20">
            <div className="mx-auto max-w-[1600px] animate-pulse">
                <div className="h-4 w-32 rounded-full bg-[#24211d]" />
                <div className="mt-5 h-10 w-2/3 max-w-xl rounded-xl bg-[#24211d]" />
                <div className="mt-4 h-5 w-full max-w-2xl rounded bg-[#24211d]" />
                <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
                    {Array.from({ length: 5 }).map((_, index) => <div key={index} className="min-h-[250px] rounded-xl border border-[#2a2825] bg-[#161513] p-3.5" />)}
                </div>
            </div>
        </main>
    );
}
