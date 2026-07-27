"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import FeaturedStudioCard from "./featuredStudioCard";
import { featuredStudios } from "./featuredStudiosData";

export default function FeaturedStudios() {
    return (
        <section className="relative">
            <div className="mx-auto max-w-[1600px] px-6">

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
                    {/* Left — headline block */}
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
                                    <span
                                        className="
                                            bg-gradient-to-r
                                            from-[#e8a33d]
                                            via-[#e0954f]
                                            to-[#d97757]
                                            bg-clip-text
                                            text-transparent
                                        "
                                    >
                                        quality sound
                                    </span>
                                    <svg
                                        aria-hidden="true"
                                        viewBox="0 0 110 16"
                                        preserveAspectRatio="none"
                                        className="absolute -bottom-1 left-0 h-[0.15em] w-full text-[#e8a33d]"
                                    >
                                        <path
                                            d="M2 10c13-9 26-9 39 0s26 9 39 0 26-9 27 0"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            strokeLinecap="round"
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
                            {[
                                { value: "200+", label: "Studios" },
                                { value: "12K+", label: "Bookings" },
                                { value: "4.9★", label: "Avg rating" },
                            ].map((stat) => (
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
                                bg-[#e8a33d]
                                px-5
                                py-2.5
                                text-sm
                                font-semibold
                                text-[#161513]
                                transition-all
                                hover:bg-[#f0b458]
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

                        {/* Quick filter chips */}
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            {["All", "Nairobi", "Mombasa", "Available Today"].map(
                                (filter, i) => (
                                    <button
                                        key={filter}
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
                                                i === 0
                                                    ? "border-[#e8a33d]/40 bg-[#e8a33d]/10 text-[#e8a33d]"
                                                    : "border-[#2a2825] bg-[#161513] text-[#9a978f] hover:border-[#3a3630] hover:text-[#f5f4f1]"
                                            }
                                        `}
                                    >
                                        {filter}
                                    </button>
                                )
                            )}
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
                    {featuredStudios.map((studio) => (
                        <FeaturedStudioCard
                            key={studio.id}
                            {...studio}
                        />
                    ))}
                </div>

            </div>

            <style>{`
                .studio-headline-underline {
                    stroke-dasharray: 220;
                    stroke-dashoffset: 220;
                    animation: studio-underline-draw 1s cubic-bezier(0.65, 0, 0.35, 1) 0.4s forwards;
                }
                @media (prefers-reduced-motion: reduce) {
                    .studio-headline-underline {
                        animation: none;
                        stroke-dashoffset: 0;
                    }
                }
                @keyframes studio-underline-draw {
                    to {
                        stroke-dashoffset: 0;
                    }
                }
            `}</style>
        </section>
    );
}