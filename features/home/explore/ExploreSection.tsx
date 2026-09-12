"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { PlatformStatsService, type FeaturedCreators, type PlatformStats } from "../services/platformStats.service";
import { ExploreCard } from "./ExploreCard";
import { exploreItems } from "./exploreData";

export function ExploreSection() {
    const [platformStats, setPlatformStats] = useState<PlatformStats | null>(null);
    const [featuredCreators, setFeaturedCreators] = useState<FeaturedCreators | null>(null);

    useEffect(() => {
        let active = true;
        void PlatformStatsService.getStats()
            .then((stats) => {
                if (active) setPlatformStats(stats);
            })
            .catch(() => undefined);

        void PlatformStatsService.getFeaturedCreators(4)
            .then((creators) => {
                if (active) setFeaturedCreators(creators);
            })
            .catch(() => undefined);

        return () => {
            active = false;
        };
    }, []);

    const items = exploreItems.map((item) => ({
        ...item,
        stats: platformStats ? getExploreStats(item.title, platformStats) : "Loading...",
    }));
    const creatorCount = featuredCreators?.creatorCount ?? (platformStats ? platformStats.producers + platformStats.artists : 0);
    const creators = featuredCreators?.creators ?? [];
    const remainingCreators = Math.max(creatorCount - creators.length, 0);

    return (
        <section
            id="explore"
            className="
                relative
                overflow-hidden
                scroll-mt-28
            "
        >
            <div className="mx-auto max-w-[1600px] px-6">

                {/* Header */}
                <div
                    className="
                        mb-6
                        flex
                        flex-col
                        gap-8
                        lg:flex-row
                        lg:items-end
                        lg:justify-between
                    "
                >
                    <div className="max-w-2xl">

                        {/* Eyebrow — same pulsing-dot badge used across the site */}
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
                            Explore
                        </span>

                        {/* Headline — blue reserved for the accent word, same rule as Hero/Testimonials/Beats/Studios */}
                        <h2
                            className="
                                mt-4
                                text-3xl
                                font-bold
                                leading-[1.1]
                                tracking-tight
                                text-[#f5f4f1]
                                md:text-4xl
                            "
                        >
                            Everything you need to{" "}
                            <span className="relative inline-block">
                                <span className="text-blue-600">
                                    create music.
                                </span>
                                <svg
                                    aria-hidden="true"
                                    viewBox="0 0 220 16"
                                    preserveAspectRatio="none"
                                    className="absolute -bottom-1 left-0 h-3 w-full text-blue-600"
                                >
                                    <path
                                        d="M2 8 H218"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeDasharray="14 8"
                                        className="explore-headline-underline"
                                    />
                                </svg>
                            </span>
                        </h2>

                        {/* Subhead — category words quietly emphasized so the breadth reads at a glance */}
                        <p
                            className="
                                mt-3
                                max-w-xl
                                text-sm
                                leading-7
                                text-[#9a978f]
                            "
                        >
                            Discover{" "}
                            <span className="font-medium text-[#f5f4f1]">studios</span>,{" "}
                            <span className="font-medium text-[#f5f4f1]">producers</span>,{" "}
                            <span className="font-medium text-[#f5f4f1]">artists</span>,{" "}
                            <span className="font-medium text-[#f5f4f1]">beats</span>,
                            creative services and promotional tools — all in one
                            platform.
                        </p>

                    </div>

                    {/* Social proof — swatches pulled from ExploreCard's own category palette */}
                    <div
                        className="
                            hidden
                            shrink-0
                            items-center
                            gap-4
                            rounded-full
                            border
                            border-[#2a2825]
                            bg-[#161513]
                            px-4
                            py-2
                            lg:flex
                        "
                    >
                        <div className="flex -space-x-2">
                            {creators.length > 0 ? creators.map((creator) => (
                                <div key={creator.id} className="relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-full border-2 border-[#161513] bg-[#e8a33d]/15 text-[9px] font-semibold text-[#e8a33d]">
                                    {creator.profileImageThumbnail ? (
                                        <Image
                                            src={creator.profileImageThumbnail}
                                            alt={`${creator.name} profile`}
                                            fill
                                            sizes="28px"
                                            unoptimized
                                            className="object-cover"
                                        />
                                    ) : creator.name.charAt(0).toUpperCase()}
                                </div>
                            )) : Array.from({ length: 4 }).map((_, index) => (
                                <span key={index} className="h-7 w-7 animate-pulse rounded-full border-2 border-[#161513] bg-[#2a2825]" />
                            ))}
                            {remainingCreators > 0 && (
                                <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#161513] bg-[#2a2825] text-[9px] font-bold text-[#b5b2a8]">
                                    +{formatCount(remainingCreators)}
                                </div>
                            )}
                        </div>

                        <div>
                            <p className="text-xs font-semibold text-[#f5f4f1]">
                                Join <span className="font-mono text-[#e8a33d]">{platformStats ? formatCount(creatorCount) : "..."}</span> creators
                            </p>
                            <p className="text-[11px] text-[#6b685f]">
                                Studios • Artists • Producers
                            </p>
                        </div>
                    </div>

                </div>

                {/* Cards */}
                <div
                    className="
                        grid
                        grid-cols-2
                        gap-3
                        sm:gap-5
                        md:grid-cols-3
                        lg:grid-cols-6
                    "
                >
                    {items.map((item) => (
                        <ExploreCard
                            key={item.title}
                            {...item}
                        />
                    ))}
                </div>

            </div>

            <style>{`
                .explore-headline-underline {
                    animation: explore-dash-march 1.2s linear infinite;
                }
                @media (prefers-reduced-motion: reduce) {
                    .explore-headline-underline {
                        animation: none;
                    }
                }
                @keyframes explore-dash-march {
                    to {
                        stroke-dashoffset: -22;
                    }
                }
            `}</style>

        </section>
    );
}

function getExploreStats(title: string, stats: PlatformStats): string {
    const values: Record<string, [number, string]> = {
        "Recording Studios": [stats.studios, "Studios"],
        Producers: [stats.producers, "Producers"],
        Artists: [stats.artists, "Artists"],
        "Beat Marketplace": [stats.beats, "Beats"],
        "Creative Services": [stats.services, "Services"],
        Advertise: [stats.campaigns, "Campaigns"],
    };
    const [value, label] = values[title] || [0, "Listings"];
    return `${formatCount(value)} ${label}`;
}

function formatCount(value: number): string {
    return new Intl.NumberFormat("en", {
        notation: "compact",
        maximumFractionDigits: 1,
    }).format(value);
}
