"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Music2, RefreshCw, Search, Sparkles } from "lucide-react";

import BackButton from "@/constants/BackButton";
import { TopProducers, type ProducerCardProps } from "@/features/home";

import { ProducerService } from "../services/producer.service";
import type { ProducerSearchResult } from "../types/producer";

export function ProducersBrowsePage() {
    const [producers, setProducers] = useState<ProducerCardProps[] | null>(null);
    const [error, setError] = useState(false);

    async function loadProducers() {
        setError(false);

        try {
            const response = await ProducerService.getProducers(0, 20);
            setProducers(response.results.map(toProducerCard));
        } catch {
            setProducers([]);
            setError(true);
        }
    }

    useEffect(() => {
        void loadProducers();
    }, []);

    if (error) return <ProducerDirectoryError onRetry={() => void loadProducers()} />;

    if (!producers) return <ProducersLoading />;

    if (producers.length === 0) {
        return (
            <main className="min-h-screen bg-[#0f0f0f] px-6 py-16 text-[#f5f4f1] lg:px-20 lg:py-24">
                <div className="mx-auto max-w-2xl overflow-hidden rounded-3xl border border-[#302d28] bg-gradient-to-br from-[#1b1813] to-[#151311] px-6 py-16 text-center shadow-[0_20px_70px_rgba(0,0,0,0.18)] sm:px-10">
                    <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#e8a33d]/20 bg-[#e8a33d]/10 text-[#e8a33d]">
                        <Music2 size={25} />
                    </span>
                    <p className="mt-6 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#e8a33d]">
                        <Sparkles size={12} />
                        Producer directory
                    </p>
                    <h1 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">The next sound is taking shape</h1>
                    <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#888176]">
                        Producers are joining StudioOS and building their creative spaces. Check back soon to find your next collaborator.
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#0f0f0f] pt-6 text-[#f5f4f1]">
            <div className="px-4 sm:px-6 lg:px-8">
                <BackButton />
            </div>
            <TopProducers
                producers={producers}
                showBrowseCta={false}
                showSearch
                showBadge={false}
                loadError={error}
                onRetry={() => void loadProducers()}
            />
        </main>
    );
}

function ProducerDirectoryError({ onRetry }: { onRetry: () => void }) {
    const filters = ["All", "Available Now", "Verified", "Top Rated", "Has Studio", "Featured", "Trending"];

    return (
        <main className="min-h-screen bg-[#0f0f0f] pt-6 text-[#f5f4f1]">
            <div className="px-4 sm:px-6 lg:px-8">
                <BackButton />
            </div>
            <section className="relative scroll-mt-10">
                <div className="mx-auto max-w-[1600px] px-6 py-5 lg:px-6 lg:py-8">
                    <div className="mb-8 flex flex-col gap-6 lg:mb-10 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-2xl">
                            <span className="inline-flex items-center gap-2 rounded-full border border-[#e8a33d]/20 bg-[#e8a33d]/10 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#e8a33d]">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#e8a33d]" />
                                Producer directory
                            </span>
                            <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
                                Find your next <span className="text-blue-500">creative partner</span>
                            </h1>
                            <p className="mt-3 max-w-xl text-sm leading-7 text-[#9a978f] sm:text-base">
                                Discover experienced producers and connect with the people shaping the sound of the next release.
                            </p>
                            <div className="mt-5 flex flex-wrap items-baseline gap-x-5 gap-y-2">
                                <span className="flex items-baseline gap-2"><span className="font-mono text-base font-bold">0</span><span className="text-xs text-[#6b685f]">producers available</span></span>
                                <span className="flex items-baseline gap-2"><span className="font-mono text-base font-bold">0.0</span><span className="text-xs text-[#6b685f]">avg rating</span></span>
                            </div>
                        </div>
                        <div className="flex flex-col items-start gap-3 lg:items-end">
                            <label className="flex w-full items-center gap-2 rounded-full border border-[#2a2825] bg-[#161513] px-4 py-2.5 text-sm text-[#9a978f] sm:min-w-[280px]">
                                <Search size={15} className="shrink-0 text-[#e8a33d]" />
                                <span className="sr-only">Search producers</span>
                                <input placeholder="Search producers" className="w-full bg-transparent text-sm text-[#f5f4f1] outline-none placeholder:text-[#6b685f]" />
                            </label>
                            <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                {filters.map((filter) => <button key={filter} type="button" className={`rounded-full border px-3 py-1.5 text-xs font-medium ${filter === "All" ? "border-[#e8a33d]/40 bg-[#e8a33d]/10 text-[#e8a33d]" : "border-[#2a2825] bg-[#161513] text-[#9a978f]"}`}>{filter}</button>)}
                            </div>
                        </div>
                    </div>
                    <DirectoryMessage
                        icon={<AlertCircle size={22} />}
                        title="Producers are taking a moment"
                        message="We could not load the producer directory. Try again in a moment."
                        action={<button type="button" onClick={onRetry} className="mt-6 inline-flex items-center gap-2 rounded-xl border border-[#4a4032] px-4 py-2.5 text-sm font-medium text-[#ddd] transition hover:bg-[#242019]"><RefreshCw size={15} />Try again</button>}
                    />
                </div>
            </section>
        </main>
    );
}

function DirectoryMessage({ icon, title, message, action }: { icon: React.ReactNode; title: string; message: string; action: React.ReactNode }) {
    return (
        <div className="rounded-3xl border border-dashed border-[#3a3027] bg-gradient-to-br from-[#1b1813] to-[#151311] px-6 py-14 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#e8a33d]/20 bg-[#e8a33d]/10 text-[#e8a33d]">{icon}</span>
            <p className="mt-5 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#e8a33d]"><Sparkles size={12} />Producer directory</p>
            <h2 className="mt-2 text-xl font-semibold text-[#f5f4f1]">{title}</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#888176]">{message}</p>
            {action}
        </div>
    );
}

function toProducerCard(producer: ProducerSearchResult): ProducerCardProps {
    const services = producer.services?.length
        ? producer.services
        : producer.genre
            ? [producer.genre]
            : ["Music production"];

    return {
        id: producer.id,
        slug: String(producer.id),
        name: producer.name,
        avatar: producer.profileImageThumbnail || producer.profileImage || "/images/avatar.png",
        verified: producer.verified ?? false,
        genre: producer.genre || "Music producer",
        location: producer.location || "Location not listed",
        studioNames: producer.studioNames || [],
        available: producer.available ?? false,
        rating: producer.averageRating ?? 0,
        reviews: producer.reviewCount ?? 0,
        followerCount: producer.followerCount ?? 0,
        beatCount: producer.beatCount ?? 0,
        popularityScore: producer.popularityScore ?? 0,
        trendingScore: producer.trendingScore ?? 0,
        featured: producer.featured ?? false,
        responseTime: producer.responseTime || "Response time varies",
        priceLabel: producer.startingPrice != null
            ? `From KSh ${producer.startingPrice.toLocaleString()}`
            : "Contact for rates",
        badge: producer.verified ? "Verified" : "Producer",
        services,
    };
}

function ProducersLoading() {
    return (
        <main className="min-h-screen bg-[#0f0f0f] px-6 py-14 lg:px-20">
            <div className="mx-auto max-w-[1600px] animate-pulse">
                <div className="h-4 w-32 rounded-full bg-[#24211d]" />
                <div className="mt-5 h-10 w-2/3 max-w-xl rounded-xl bg-[#24211d]" />
                <div className="mt-4 h-5 w-full max-w-2xl rounded bg-[#24211d]" />
                <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="min-h-[250px] rounded-xl border border-[#2a2825] bg-[#161513] p-3.5">
                            <div className="h-14 w-14 rounded-full bg-[#24211d]" />
                            <div className="mt-5 h-4 w-2/3 rounded bg-[#24211d]" />
                            <div className="mt-3 h-3 w-1/2 rounded bg-[#24211d]" />
                            <div className="mt-8 h-3 w-full rounded bg-[#24211d]" />
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
