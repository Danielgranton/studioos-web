"use client";

import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { useState } from "react";

import { FeaturedStudioCard } from "./FeaturedStudioCard";
import { featuredStudios } from "./featuredStudiosData";

export type FeaturedStudio = {
    id: number | string;
    slug: string;
    name: string;
    location: string;
    rating: number;
    reviews: number;
    bookings: number;
    verified: boolean;
    badge: string;
    available: boolean;
    price?: number;
    priceLabel: string;
    services: string[];
    genres: string[];
    image: string;
};

type FeaturedStudiosProps = {
    studios?: FeaturedStudio[];
    showHeader?: boolean;
    showBrowseCta?: boolean;
    showFeaturedBadge?: boolean;
    showSearch?: boolean;
};

export function FeaturedStudios({
    studios = featuredStudios,
    showHeader = true,
    showBrowseCta = true,
    showFeaturedBadge = true,
    showSearch = false,
}: FeaturedStudiosProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilter, setActiveFilter] = useState("All studios");
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const visibleStudios = studios.filter((studio) => {
        const matchesSearch = !normalizedSearch || [
            studio.name,
            studio.location,
            ...studio.services,
            ...studio.genres,
        ].some((value) => value.toLowerCase().includes(normalizedSearch));

        const services = studio.services.map((service) => service.toLowerCase());
        const genres = studio.genres.map((genre) => genre.toLowerCase());
        const matchesFilter = {
            "All studios": true,
            "Available today": studio.available,
            "Top rated": studio.rating >= 4.8,
            Recording: services.includes("recording"),
            "Mixing & mastering": services.some(
                (service) => service.includes("mix") || service.includes("master"),
            ),
            Podcast: services.includes("podcast") || genres.includes("podcast"),
            Premium: studio.price != null && studio.price >= 3000,
            Affordable: studio.price != null && studio.price <= 2000,
            "Near me": true,
        }[activeFilter];

        return matchesSearch && matchesFilter;
    });

    const filters = [
        "All studios",
        "Available today",
        "Top rated",
        "Recording",
        "Mixing & mastering",
        "Podcast",
        "Premium",
        "Affordable",
        "Near me",
    ];
    const totalBookings = studios.reduce((total, studio) => total + studio.bookings, 0);
    const ratedStudios = studios.filter((studio) => studio.rating > 0);
    const averageRating = ratedStudios.length
        ? ratedStudios.reduce((total, studio) => total + studio.rating, 0) / ratedStudios.length
        : 0;
    const stats = [
        { value: studios.length.toLocaleString(), label: "Studios" },
        { value: totalBookings.toLocaleString(), label: "Bookings" },
        { value: `${averageRating.toFixed(1)}★`, label: "Avg rating" },
    ];

    return (
        <section
            id="studios"
            className="relative scroll-mt-28"
        >
            <div className="mx-auto max-w-[1600px] px-6">

                {/* Header */}
                <div
                    className={`
                        mb-7
                        flex
                        flex-col
                        gap-6
                        lg:mb-10
                        lg:flex-row
                        lg:items-end
                        lg:justify-between
                        ${showHeader ? "" : "hidden"}
                    `}
                >
                    {/* Left — headline block */}
                    <div className="max-w-2xl">

                        {/* Badge */}
                        <div className={showFeaturedBadge ? "flex items-center gap-3" : "hidden"}>
                            <span
                                className="
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-full
                                    border
                                    border-[#e8a33d]/20
                                    bg-[#e8a33d]/10
                                    px-2
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
                                Featured Studios
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
                                Studios built for{" "}
                                <span className="relative inline-block">
                                    <span className="text-blue-600">
                                        quality sound
                                    </span>
                                    <svg
                                        aria-hidden="true"
                                        viewBox="0 0 110 16"
                                        preserveAspectRatio="none"
                                        className="absolute -bottom-1 left-0 h-[0.15em] w-full text-blue-600"
                                    >
                                        <path
                                            d="M2 8 H108"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            strokeDasharray="14 8"
                                            className="studio-headline-underline"
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
                            Discover professional recording spaces trusted by artists,
                            producers and labels. Book instantly and bring your next
                            project to life.
                        </p>

                        {/* Trust signal strip — mono numbers, same convention as every card */}
                        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 sm:mt-6 sm:gap-x-6">
                            {stats.map((stat) => (
                                <div key={stat.label} className="flex items-center gap-1.5 sm:gap-2">
                                    <span className="font-mono text-xs font-bold text-[#f5f4f1] sm:text-sm">
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
                                <span className="sr-only">Search studios</span>
                                <input
                                    value={searchTerm}
                                    onChange={(event) => setSearchTerm(event.target.value)}
                                    placeholder="Search studios"
                                    className="w-full bg-transparent text-sm text-[#f5f4f1] outline-none placeholder:text-[#6b685f]"
                                />
                            </label>
                        )}

                        {showBrowseCta && (
                            <Link
                                href="/studios"
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
                                Browse all studios
                                <ArrowRight
                                    size={16}
                                    strokeWidth={2.5}
                                    className="transition-transform duration-300 group-hover:translate-x-1"
                                />
                            </Link>
                        )}

                        {/* Quick filter chips */}
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            {filters.map((filter) => (
                                    <button
                                        key={filter}
                                        type="button"
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

                {/* Grid */}
                <div
                    className="
                        grid
                        grid-cols-2
                        gap-3
                        sm:gap-4
                        md:grid-cols-3
                        lg:grid-cols-5
                    "
                >
                    {visibleStudios.map((studio) => (
                        <FeaturedStudioCard
                            key={studio.id}
                            {...studio}
                        />
                    ))}
                </div>

                {visibleStudios.length === 0 && (
                    <div className="mt-8 rounded-2xl border border-dashed border-[#2a2825] px-6 py-12 text-center text-sm text-[#9a978f]">
                        No studios match your search.
                    </div>
                )}

            </div>

            <style>{`
                .studio-headline-underline {
                    animation: studio-dash-march 1.2s linear infinite;
                }
                @media (prefers-reduced-motion: reduce) {
                    .studio-headline-underline {
                        animation: none;
                    }
                }
                @keyframes studio-dash-march {
                    to {
                        stroke-dashoffset: -22;
                    }
                }
            `}</style>
        </section>
    );
}
