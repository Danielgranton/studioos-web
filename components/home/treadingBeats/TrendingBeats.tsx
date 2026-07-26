"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

import BeatCard from "./BeatCard";
import { trendingBeats } from "./beatData";

const filters = ["All", "Hip-Hop", "Afrobeat", "Trap", "Exclusive"];

export default function TrendingBeats() {
    const [activeFilter, setActiveFilter] = useState("All");

    return (
        <section
            className="
                relative
                overflow-hidden
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
                                    border-emerald-500/20
                                    bg-emerald-500/10
                                    px-3
                                    py-1
                                    text-[9px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.2em]
                                    text-emerald-400
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
                                            bg-emerald-400
                                            opacity-60
                                        "
                                    />
                                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                </span>
                                Trending Beats
                            </span>

                            <span className="h-px flex-1 bg-gradient-to-r from-emerald-500/30 to-transparent lg:hidden" />
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
                                        className="w-[3px] animate-pulse rounded-full bg-emerald-400"
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
                                    text-white
                                    whitespace-nowrap
                                "
                                style={{
                                    fontSize: "clamp(1.1rem, 4.2vw, 2rem)",
                                }}
                            >
                                Fresh sounds,{" "}
                                <span className="relative inline-block">
                                    <span
                                        className="
                                            bg-gradient-to-r
                                            from-emerald-400
                                            via-emerald-500
                                            to-teal-500
                                            bg-clip-text
                                            text-transparent
                                        "
                                    >
                                        ready to record
                                    </span>
                                    <svg
                                        aria-hidden="true"
                                        viewBox="0 0 200 16"
                                        preserveAspectRatio="none"
                                        className="absolute -bottom-1 left-0 h-[0.15em] w-full text-emerald-500"
                                    >
                                        <path
                                            d="M2 10c24-9 48-9 72 0s48 9 72 0 48-9 50 0"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            strokeLinecap="round"
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
                                text-[#aaaaaa]
                                sm:mt-4
                                sm:text-base
                                sm:leading-7
                            "
                        >
                            Browse exclusive instrumentals from top
                            producers. Preview, purchase and start
                            recording instantly.
                        </p>

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
                                bg-emerald-600/20
                                px-3
                                py-2
                                text-sm
                                font-semibold
                                text-white
                                transition-all
                                hover:bg-emerald-600/10
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
                                                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                                                : "border-[#272727] bg-[#171717] text-[#aaaaaa] hover:border-[#3f3f3f] hover:text-white"
                                        }
                                    `}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Beat Grid — 2 mobile, 3 tablet, 4 desktop */}
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
                    {trendingBeats.map((beat) => (
                        <BeatCard
                            key={beat.id}
                            {...beat}
                        />
                    ))}
                </div>

            </div>

            <style>{`
                .beats-headline-underline {
                    stroke-dasharray: 350;
                    stroke-dashoffset: 350;
                    animation: beats-underline-draw 1s cubic-bezier(0.65, 0, 0.35, 1) 0.4s forwards;
                }
                @media (prefers-reduced-motion: reduce) {
                    .beats-headline-underline {
                        animation: none;
                        stroke-dashoffset: 0;
                    }
                }
                @keyframes beats-underline-draw {
                    to {
                        stroke-dashoffset: 0;
                    }
                }
            `}</style>
        </section>
    );
}