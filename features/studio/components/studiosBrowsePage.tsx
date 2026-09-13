"use client";

import { useEffect, useState } from "react";
import BackButton from "@/constants/BackButton";
import { FeaturedStudios, type FeaturedStudio } from "@/features/home";

import { StudioService } from "../services/studio.service";
import type { Studio } from "../types/studio";

export function StudiosBrowsePage() {
    const [studios, setStudios] = useState<FeaturedStudio[] | null>(null);
    const [error, setError] = useState(false);

    async function loadStudios() {
        setError(false);

        try {
            const response = await StudioService.getAllStudios();
            setStudios(response.map(toFeaturedStudio));
        } catch {
            setStudios([]);
            setError(true);
        }
    }

    useEffect(() => {
        void loadStudios();
    }, []);

    if (error) return <StudioDirectoryError onRetry={() => void loadStudios()} />;

    if (!studios) {
        return <StudiosLoading />;
    }

    if (studios.length === 0) {
        return (
            <main className="min-h-screen bg-[#0f0f0f] px-6 py-24 text-center text-[#f5f4f1] lg:px-20">
                <h1 className="text-2xl font-bold">No studios are listed yet</h1>
                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#888]">
                    Check back soon for recording spaces ready for your next session.
                </p>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#0f0f0f] pt-6 text-[#f5f4f1]">
            <div className="px-4 sm:px-6 lg:px-8">
                <BackButton />
            </div>
            <FeaturedStudios
                studios={studios}
                initialFilter="All studios"
                showBrowseCta={false}
                showFeaturedBadge={false}
                showSearch
                loadError={error}
                onRetry={() => void loadStudios()}
            />
        </main>
    );
}

function StudioDirectoryError({ onRetry }: { onRetry: () => void }) {
    const filters = ["All studios", "Top rated", "Available today", "Most booked", "Recording", "Mixing & mastering", "Podcast", "Premium", "Affordable"];

    return (
        <main className="min-h-screen bg-[#0f0f0f] pt-6 text-[#f5f4f1]">
            <div className="px-4 sm:px-6 lg:px-8"><BackButton /></div>
            <section className="relative scroll-mt-10">
                <div className="mx-auto max-w-[1600px] px-6 py-5 lg:px-6 lg:py-8">
                    <div className="mb-8 flex flex-col gap-6 lg:mb-10 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-2xl">
                            <span className="inline-flex items-center gap-2 rounded-full border border-[#e8a33d]/20 bg-[#e8a33d]/10 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#e8a33d]"><span className="h-1.5 w-1.5 rounded-full bg-[#e8a33d]" />Studio directory</span>
                            <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">Find your next <span className="text-blue-500">creative space</span></h1>
                            <p className="mt-3 max-w-xl text-sm leading-7 text-[#9a978f] sm:text-base">Explore professional studios ready for recording, mixing, podcasts, and your next big session.</p>
                            <div className="mt-5 flex flex-wrap items-baseline gap-x-5 gap-y-2"><span className="flex items-baseline gap-2"><span className="font-mono text-base font-bold">0</span><span className="text-xs text-[#6b685f]">studios available</span></span><span className="flex items-baseline gap-2"><span className="font-mono text-base font-bold">0.0</span><span className="text-xs text-[#6b685f]">avg rating</span></span></div>
                        </div>
                        <div className="flex flex-col items-start gap-3 lg:items-end"><label className="flex w-full items-center gap-2 rounded-full border border-[#2a2825] bg-[#161513] px-4 py-2.5 text-sm text-[#9a978f] sm:min-w-[280px]"><SearchIcon /><span className="sr-only">Search studios</span><input placeholder="Search studios" className="w-full bg-transparent text-sm text-[#f5f4f1] outline-none placeholder:text-[#6b685f]" /></label><div className="flex flex-wrap gap-1.5 sm:gap-2">{filters.map((filter) => <button key={filter} type="button" className={`rounded-full border px-3 py-1.5 text-xs font-medium ${filter === "All studios" ? "border-[#e8a33d]/40 bg-[#e8a33d]/10 text-[#e8a33d]" : "border-[#2a2825] bg-[#161513] text-[#9a978f]"}`}>{filter}</button>)}</div></div>
                    </div>
                    <DirectoryMessage onRetry={onRetry} />
                </div>
            </section>
        </main>
    );
}

function SearchIcon() {
    return <svg aria-hidden="true" className="h-[15px] w-[15px] shrink-0 text-[#e8a33d]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>;
}

function DirectoryMessage({ onRetry }: { onRetry: () => void }) {
    return <div className="rounded-3xl border border-dashed border-[#3a3027] bg-gradient-to-br from-[#1b1813] to-[#151311] px-6 py-14 text-center"><span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#e8a33d]/20 bg-[#e8a33d]/10 text-[#e8a33d]"><AlertIcon /></span><p className="mt-5 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#e8a33d]">Studio directory</p><h2 className="mt-2 text-xl font-semibold text-[#f5f4f1]">Studios are taking a moment</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#888176]">We could not load the studio directory. Try again in a moment.</p><button type="button" onClick={onRetry} className="mt-6 inline-flex items-center gap-2 rounded-xl border border-[#4a4032] px-4 py-2.5 text-sm font-medium text-[#ddd] transition hover:bg-[#242019]"><RefreshIcon />Try again</button></div>;
}

function AlertIcon() { return <svg aria-hidden="true" className="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 8v4M12 16h.01" /></svg>; }
function RefreshIcon() { return <svg aria-hidden="true" className="h-[15px] w-[15px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 11a8 8 0 1 0 1 4" /><path d="M20 5v6h-6" /></svg>; }

function toFeaturedStudio(studio: Studio): FeaturedStudio {
    const image =
        studio.profileImageLarge ||
        studio.profileImageMedium ||
        studio.profileImage ||
        studio.media?.find((media) => media.type === "IMAGE")?.largeUrl ||
        studio.media?.find((media) => media.type === "IMAGE")?.url ||
        "/images/beats.png";

    return {
        id: studio.id,
        slug: studio.id,
        name: studio.studioName,
        location: studio.location,
        rating: studio.averageRating ?? 0,
        reviews: studio.totalRatings ?? 0,
        bookings: studio.bookings,
        verified: studio.verified,
        badge: studio.badge || "Standard listing",
        available: studio.available,
        price: studio.pricing,
        priceLabel: `From KSh ${studio.pricing.toLocaleString()}/hr`,
        services: studio.services,
        genres: studio.genres,
        image,
    };
}

function StudiosLoading() {
    return (
        <main className="min-h-screen bg-[#0f0f0f] px-6 py-14 lg:px-20">
            <div className="mx-auto max-w-[1600px] animate-pulse">
                <div className="h-4 w-36 rounded-full bg-[#24211d]" />
                <div className="mt-5 h-12 w-2/3 max-w-xl rounded-xl bg-[#24211d]" />
                <div className="mt-4 h-5 w-full max-w-2xl rounded bg-[#24211d]" />
                <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <div
                            key={index}
                            className="rounded-2xl border border-[#2a2825] bg-[#161513] p-2.5"
                        >
                            <div className="aspect-[4/3] rounded-xl bg-[#24211d]" />
                            <div className="mt-4 h-4 w-2/3 rounded bg-[#24211d]" />
                            <div className="mt-3 h-3 w-1/2 rounded bg-[#24211d]" />
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
