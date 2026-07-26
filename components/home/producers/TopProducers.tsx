"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

import ProducerCard from "./ProducerCard";
import { producerData } from "./producerData";

const filters = ["All", "Hip-Hop", "Afrobeat", "R&B", "Available Now"];

export default function TopProducers() {
    const [activeFilter, setActiveFilter] = useState("All");

    return (
        <section className="relative">

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

                        {/* Badge — same pulsing-dot pattern used sitewide, recolored for this section */}
                        <span
                            className="
                                inline-flex
                                items-center
                                gap-2
                                rounded-full
                                border
                                border-orange-500/20
                                bg-orange-600/10
                                px-3
                                py-1
                                text-[9px]
                                font-semibold
                                uppercase
                                tracking-[0.2em]
                                text-orange-400
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
                                        bg-orange-400
                                        opacity-60
                                    "
                                />
                                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-orange-400" />
                            </span>
                            Top Producers
                        </span>

                        {/* Heading — single line, fluid size so it never wraps or overflows */}
                        <h2
                            className="
                                relative
                                mt-2
                                w-fit
                                font-black
                                leading-[1.05]
                                tracking-tight
                                text-white
                                whitespace-nowrap
                                sm:mt-4
                            "
                            style={{
                                fontSize: "clamp(1.4rem, 4.5vw, 2rem)",
                            }}
                        >
                            Work with{" "}
                            <span className="relative inline-block">
                                <span
                                    className="
                                        bg-gradient-to-r
                                        from-orange-400
                                        via-orange-500
                                        to-amber-500
                                        bg-clip-text
                                        text-transparent
                                    "
                                >
                                    the best
                                </span>
                                <svg
                                    aria-hidden="true"
                                    viewBox="0 0 150 16"
                                    preserveAspectRatio="none"
                                    className="absolute -bottom-1 left-0 h-3 w-full text-orange-500 sm:-bottom-2"
                                >
                                    <path
                                        d="M2 10c18-9 36-9 54 0s36 9 54 0 36-9 38 0"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        strokeLinecap="round"
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
                                text-slate-400
                                sm:mt-4
                                sm:text-lg
                                sm:leading-8
                            "
                        >
                            Connect with experienced producers trusted by
                            thousands of artists to create chart-worthy music.
                        </p>

                        {/* Trust signal strip */}
                        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 sm:mt-6 sm:gap-x-6">
                            {[
                                { value: "12K+", label: "producers" },
                                { value: "4.9★", label: "avg rating" },
                            ].map((stat) => (
                                <div key={stat.label} className="flex items-baseline gap-1.5">
                                    <span className="text-sm font-bold text-white sm:text-base">
                                        {stat.value}
                                    </span>
                                    <span className="text-[11px] text-slate-500 sm:text-xs">
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
                                border-[#272727]
                                bg-orange-600
                                px-4
                                py-2
                                text-sm
                                font-semibold
                                text-white
                                transition
                                hover:border-orange-500/10
                                hover:bg-orange-700
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
                                                ? "border-orange-500/40 bg-orange-500/10 text-orange-400"
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

                {/* Cards */}
                <div
                    className="
                        grid
                        grid-cols-2
                        gap-4
                        sm:gap-6
                        md:grid-cols-3
                        lg:grid-cols-4
                    "
                >

                    {producerData.map((producer) => (

                        <ProducerCard
                            key={producer.id}
                            {...producer}
                        />

                    ))}

                </div>

            </div>

            <style>{`
                .producers-headline-underline {
                    stroke-dasharray: 250;
                    stroke-dashoffset: 250;
                    animation: producers-underline-draw 0.9s cubic-bezier(0.65, 0, 0.35, 1) 0.35s forwards;
                }
                @media (prefers-reduced-motion: reduce) {
                    .producers-headline-underline {
                        animation: none;
                        stroke-dashoffset: 0;
                    }
                }
                @keyframes producers-underline-draw {
                    to {
                        stroke-dashoffset: 0;
                    }
                }
            `}</style>

        </section>
    );
}