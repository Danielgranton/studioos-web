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
        <section className="relative overflow-hidden ">

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

                        {/* Badge — same pulsing-dot pattern used sitewide */}
                        <span
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
                                text-[#f5f4f1]
                                whitespace-nowrap
                                sm:mt-4
                            "
                            style={{
                                fontSize: "clamp(1.4rem, 4.5vw, 2rem)",
                            }}
                        >
                            Beyond{" "}
                            <span className="relative inline-block">
                                <span className="text-blue-600">
                                    the recording
                                </span>
                                <svg
                                    aria-hidden="true"
                                    viewBox="0 0 190 16"
                                    preserveAspectRatio="none"
                                    className="absolute -bottom-1 left-0 h-3 w-full text-blue-600 sm:-bottom-2"
                                >
                                    <path
                                        d="M2 8 H188"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeDasharray="14 8"
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
                                text-[#9a978f]
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

                        {/* Trust signal strip — mono numbers, same convention as every card */}
                        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 sm:mt-6 sm:gap-x-6">
                            {[
                                { value: "500+", label: "specialists" },
                                { value: "24hr", label: "avg turnaround" },
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
                    animation: services-dash-march 1.2s linear infinite;
                }
                @media (prefers-reduced-motion: reduce) {
                    .services-headline-underline {
                        animation: none;
                    }
                }
                @keyframes services-dash-march {
                    to {
                        stroke-dashoffset: -22;
                    }
                }
            `}</style>

        </section>
    );
}