"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

import ServiceCategoryCard from "./serviceCategoryCard";
import { serviceCategories } from "./serviceCategories";

const filters = ["All", "Mixing", "Mastering", "Marketing", "Visuals"];

export default function ServiceSection() {
    const [activeFilter, setActiveFilter] = useState("All");

    return (
        <section className="relative overflow-hidden py-5">

            <div className="relative mx-auto max-w-[1600px] px-6">

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
                                bg-orange-500/10
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
                            Music Services
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
                            Beyond{" "}
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
                                    the recording
                                </span>
                                <svg
                                    aria-hidden="true"
                                    viewBox="0 0 190 16"
                                    preserveAspectRatio="none"
                                    className="absolute -bottom-1 left-0 h-3 w-full text-orange-500 sm:-bottom-2"
                                >
                                    <path
                                        d="M2 10c23-9 46-9 69 0s46 9 69 0 46-9 48 0"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        className="services-headline-underline"
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
                            Hire professionals for mixing, mastering,
                            songwriting, marketing, distribution,
                            photography, music videos and much more —
                            all from one platform.
                        </p>

                        {/* Trust signal strip */}
                        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 sm:mt-6 sm:gap-x-6">
                            {[
                                { value: "500+", label: "specialists" },
                                { value: "24hr", label: "avg turnaround" },
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
                            href="/services"
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
                            Browse All Services

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
                    {serviceCategories.map((category) => (
                        <ServiceCategoryCard
                            key={category.id}
                            {...category}
                        />
                    ))}
                </div>

            </div>

            <style>{`
                .services-headline-underline {
                    stroke-dasharray: 320;
                    stroke-dashoffset: 320;
                    animation: services-underline-draw 0.9s cubic-bezier(0.65, 0, 0.35, 1) 0.35s forwards;
                }
                @media (prefers-reduced-motion: reduce) {
                    .services-headline-underline {
                        animation: none;
                        stroke-dashoffset: 0;
                    }
                }
                @keyframes services-underline-draw {
                    to {
                        stroke-dashoffset: 0;
                    }
                }
            `}</style>

        </section>
    );
}