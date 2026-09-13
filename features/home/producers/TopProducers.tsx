"use client";

import Link from "next/link";
import { ArrowRight, BadgeCheck, Music2, Search, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

import { SearchService, type ProducerSearchResult } from "@/features/search";

import { ProducerCard, type ProducerCardProps } from "./ProducerCard";

const browseFilters = [
    "All",
    "Available Now",
    "Verified",
    "Top Rated",
    "Has Studio",
    "Featured",
    "Trending",
];

const homeFilters = [
    "Top Rated",
    "Has Studio",
    "Available Now",
    "Verified",
];

type TopProducersProps = {
    producers?: ProducerCardProps[];
    showBrowseCta?: boolean;
    showSearch?: boolean;
    showBadge?: boolean;
    loadError?: boolean;
    onRetry?: () => void;
};

export function TopProducers({
    producers,
    showBrowseCta = true,
    showSearch = false,
    showBadge = true,
    loadError = false,
    onRetry,
}: TopProducersProps) {
    const [fetchedProducers, setFetchedProducers] = useState<ProducerCardProps[] | null>(null);
    const [isLoading, setIsLoading] = useState(!producers);
    const [hasError, setHasError] = useState(false);
    const sourceProducers = producers ?? fetchedProducers ?? [];
    const isBrowsePage = Boolean(producers);
    const [activeFilter, setActiveFilter] = useState(isBrowsePage ? "All" : "Top Rated");
    const [searchTerm, setSearchTerm] = useState("");
    const normalizedSearch = searchTerm.trim().toLowerCase();

    useEffect(() => {
        if (producers) {
            setIsLoading(false);
            return;
        }

        let active = true;
        setIsLoading(true);
        setHasError(false);

        void SearchService.producers(undefined, 0, 50)
            .then((response) => {
                if (active) setFetchedProducers(response.results.map(toProducerCard));
            })
            .catch(() => {
                if (active) setHasError(true);
            })
            .finally(() => {
                if (active) setIsLoading(false);
            });

        return () => {
            active = false;
        };
    }, [producers]);
    const filteredProducers = sourceProducers.filter((producer) => {
        const matchesSearch = !normalizedSearch || [
            producer.name,
            producer.genre,
            producer.location,
            ...producer.services,
            ...producer.studioNames,
        ].some((value) => value.toLowerCase().includes(normalizedSearch));
        const producerServices = producer.services.map((service) => service.toLowerCase());
        const producerGenre = producer.genre.toLowerCase().replace("-", "");
        const filterValue = activeFilter.toLowerCase().replace("-", "");
        const matchesFilter = activeFilter === "All"
            || (activeFilter === "Available Now" && producer.available)
            || (activeFilter === "Verified" && producer.verified)
            || activeFilter === "Top Rated"
            || (activeFilter === "Has Studio" && producer.studioNames.length > 0)
            || (activeFilter === "Featured" && producer.featured)
            || (activeFilter === "Trending" && (producer.trendingScore ?? 0) > 0)
            || producerServices.some((service) => service.includes(filterValue))
            || producerGenre.includes(filterValue);

        return matchesSearch && matchesFilter;
    });
    const visibleProducers = (isBrowsePage && activeFilter === "All"
        ? filteredProducers
        : [...filteredProducers].sort((first, second) => activeFilter === "Trending"
            ? (second.trendingScore ?? 0) - (first.trendingScore ?? 0)
            : activeFilter === "Featured"
                ? (second.popularityScore ?? 0) - (first.popularityScore ?? 0)
                : second.rating - first.rating || second.reviews - first.reviews)
    ).slice(0, isBrowsePage ? filteredProducers.length : 10);
    const ratedProducers = sourceProducers.filter((producer) => producer.rating > 0);
    const averageRating = ratedProducers.length > 0
        ? ratedProducers.reduce((total, producer) => total + producer.rating, 0) / ratedProducers.length
        : 0;

    return (
        <section
            id="producers"
            className="relative scroll-mt-28"
        >

            <div className="mx-auto max-w-[1600px] px-6">

                {/* Header */}
                <div
                    className="
                        mb-8
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

                        {/* Badge — same pulsing-dot pattern used sitewide */}
                        {showBadge && <span
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
                            Top Producers
                        </span>}

                        {/* Heading — single line, fluid size so it never wraps or overflows */}
                        <h2
                            className="
                                relative
                                mt-2
                                w-fit
                                font-black
                                leading-[1.05]
                                tracking-tight
                                text-[#f5f4f1]
                                whitespace-nowrap
                                sm:mt-4
                            "
                            style={{
                                fontSize: "clamp(1.4rem, 4.5vw, 2rem)",
                            }}
                        >
                            Work with{" "}
                            <span className="relative inline-block">
                                <span className="text-blue-600">
                                    the best producers
                                </span>
                                <svg
                                    aria-hidden="true"
                                    viewBox="0 0 150 16"
                                    preserveAspectRatio="none"
                                    className="absolute -bottom-1 left-0 h-3 w-full text-blue-600 sm:-bottom-2"
                                >
                                    <path
                                        d="M2 8 H148"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeDasharray="14 8"
                                        className="producers-headline-underline"
                                    />
                                </svg>
                            </span>
                        </h2>

                        {/* Subhead */}
                        <p
                            className="
                                mt-3
                                max-w-2xl
                                text-sm
                                leading-6
                                text-[#9a978f]
                                sm:mt-4
                                sm:text-lg
                                sm:leading-8
                            "
                        >
                            Connect with experienced producers trusted by
                            thousands of artists to create chart-worthy music.
                        </p>

                        {/* Trust signal strip — mono numbers, same convention as every card */}
                        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 sm:mt-6 sm:gap-x-6">
                            {[
                                { value: sourceProducers.length.toLocaleString(), label: "producers" },
                                { value: `${averageRating.toFixed(1)}★`, label: "avg rating" },
                            ].map((stat) => (
                                <div key={stat.label} className="flex items-baseline gap-1.5">
                                    <span className="font-mono text-sm font-bold text-[#f5f4f1] sm:text-base">
                                        {stat.value}
                                    </span>
                                    <span className="text-[11px] text-[#6b685f] sm:text-xs">
                                        {stat.label}
                                    </span>
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
                        {showSearch && (
                            <label className="flex w-full items-center gap-2 rounded-full border border-[#2a2825] bg-[#161513] px-4 py-2.5 text-sm text-[#9a978f] sm:min-w-[280px]">
                                <Search size={15} className="shrink-0 text-[#e8a33d]" />
                                <span className="sr-only">Search producers</span>
                                <input
                                    value={searchTerm}
                                    onChange={(event) => setSearchTerm(event.target.value)}
                                    placeholder="Search producers"
                                    className="w-full bg-transparent text-sm text-[#f5f4f1] outline-none placeholder:text-[#6b685f]"
                                />
                            </label>
                        )}

                        {showBrowseCta && (
                            <Link
                                href="/producers"
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
                                px-4
                                py-2
                                text-sm
                                font-semibold
                                text-white
                                transition
                                hover:bg-blue-700
                                hover:gap-3
                                sm:w-fit
                            "
                            >
                                View All

                                <ArrowRight
                                    size={17}
                                    className="transition-transform duration-300 group-hover:translate-x-1"
                                />
                            </Link>
                        )}

                        {/* Quick filter chips */}
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            {(isBrowsePage ? browseFilters : homeFilters).map((filter) => (
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

                {isLoading ? (
                    <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-5">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <div key={index} className="animate-pulse rounded-xl border border-[#2a2825] bg-[#161513] p-3.5">
                                <div className="h-14 w-14 rounded-full bg-[#24211d]" />
                                <div className="mt-5 h-4 w-2/3 rounded bg-[#24211d]" />
                                <div className="mt-3 h-3 w-1/2 rounded bg-[#24211d]" />
                                <div className="mt-8 h-3 w-full rounded bg-[#24211d]" />
                            </div>
                        ))}
                    </div>
                ) : hasError || loadError ? (
                    <div className="rounded-3xl border border-dashed border-[#3a3027] bg-gradient-to-br from-[#1b1813] to-[#151311] px-6 py-14 text-center">
                        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#e8a33d]/20 bg-[#e8a33d]/10 text-[#e8a33d]">
                            <Music2 size={23} />
                        </span>
                        <p className="mt-5 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#e8a33d]">
                            <Sparkles size={12} />
                            Producer directory
                        </p>
                        <h3 className="mt-2 text-xl font-semibold text-[#f5f4f1]">Producers are taking a moment</h3>
                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#888176]">
                            We could not load the latest producer profiles. Try again in a moment.
                        </p>
                        <button
                            type="button"
                            onClick={onRetry}
                            className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#4a4032] bg-[#211e19] px-4 py-2.5 text-xs font-semibold text-[#e8a33d] transition hover:bg-[#29231b]"
                        >
                            <Music2 size={14} />
                            Try again
                        </button>
                    </div>
                ) : visibleProducers.length === 0 && (
                    <div className="mt-8 rounded-3xl border border-dashed border-[#3a3027] bg-gradient-to-br from-[#1b1813] to-[#151311] px-6 py-14 text-center">
                        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#e8a33d]/20 bg-[#e8a33d]/10 text-[#e8a33d]">
                            {activeFilter === "Verified" ? <BadgeCheck size={23} /> : normalizedSearch ? <Search size={22} /> : <Music2 size={23} />}
                        </span>
                        <p className="mt-5 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#e8a33d]">
                            <Sparkles size={12} />
                            Producer directory
                        </p>
                        <h3 className="mt-2 text-xl font-semibold text-[#f5f4f1]">
                            {normalizedSearch
                                ? "No producers match your search"
                                : `No ${activeFilter.toLowerCase()} producers found`}
                        </h3>
                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#888176]">
                            {normalizedSearch
                                ? "Try another name, location, genre, or service."
                                : "Try another filter to discover more creative partners on StudioOS."}
                        </p>
                        <button
                            type="button"
                            onClick={() => {
                                setSearchTerm("");
                                setActiveFilter("All");
                            }}
                            className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#4a4032] bg-[#211e19] px-4 py-2.5 text-xs font-semibold text-[#e8a33d] transition hover:bg-[#29231b]"
                        >
                            <Music2 size={14} />
                            View all producers
                        </button>
                    </div>
                )}

                {/* Cards */}
                {!isLoading && !hasError && visibleProducers.length > 0 && <div
                    className="
                        grid
                        grid-cols-2
                        gap-4
                        sm:gap-6
                        md:grid-cols-3
                        lg:grid-cols-5
                    "
                >

                    {visibleProducers.map((producer) => (

                        <ProducerCard
                            key={producer.id}
                            {...producer}
                        />

                    ))}

                </div>}

            </div>

            <style>{`
                .producers-headline-underline {
                    animation: producers-dash-march 1.2s linear infinite;
                }
                @media (prefers-reduced-motion: reduce) {
                    .producers-headline-underline {
                        animation: none;
                    }
                }
                @keyframes producers-dash-march {
                    to {
                        stroke-dashoffset: -22;
                    }
                }
            `}</style>

        </section>
    );
}

function toProducerCard(producer: ProducerSearchResult): ProducerCardProps {
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
        services: producer.services || [],
    };
}
