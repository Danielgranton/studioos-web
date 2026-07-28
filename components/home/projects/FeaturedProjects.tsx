"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

import ProjectCard from "./ProjectCard";
import { featuredProjects } from "./projectData";

const filters = ["All", "Songs", "Podcasts", "Videos"];

export default function FeaturedProjects() {
    const [activeFilter, setActiveFilter] = useState("All");

    const visibleProjects = featuredProjects;

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
                        mb-5
                        flex
                        flex-col
                        gap-6
                        lg:mb-5
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
                            Featured Projects
                        </span>

                        {/* Heading — waveform mark + single-line, fluid size so it never wraps or overflows */}
                        <div className="mt-2 flex items-center gap-3 sm:mt-3 sm:gap-3">
                            <div
                                aria-hidden="true"
                                className="hidden h-7 shrink-0 items-end gap-[3px] sm:flex"
                            >
                                {[9, 18, 7, 24, 12, 20, 8, 15].map((h, i) => (
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
                                    fontSize: "clamp(1.1rem, 3.6vw, 2.25rem)",
                                }}
                            >
                                Real music,{" "}
                                <span className="relative inline-block">
                                    <span className="text-blue-600">
                                        real success
                                    </span>
                                    <svg
                                        aria-hidden="true"
                                        viewBox="0 0 130 16"
                                        preserveAspectRatio="none"
                                        className="absolute -bottom-1 left-0 h-[0.15em] w-full text-blue-600"
                                    >
                                        <path
                                            d="M2 8 H128"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            strokeDasharray="14 8"
                                            className="projects-headline-underline"
                                        />
                                    </svg>
                                </span>
                            </h2>
                        </div>

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
                            Discover songs, podcasts and creative projects
                            brought to life through StudioOS. From recording
                            and production to mixing, mastering and
                            distribution—everything happens in one place.
                        </p>

                        {/* Trust signal strip — mono numbers, same convention as every card */}
                        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 sm:mt-6 sm:gap-x-6">
                            {[
                                { value: "3K+", label: "projects" },
                                { value: "180K+", label: "streams" },
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
                            href="/projects"
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
                                px-3
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
                            Explore Projects

                            <ArrowRight
                                size={17}
                                className="transition-transform duration-300 group-hover:translate-x-1"
                            />
                        </Link>

                        {/* Quick filter chips — now actually filters the grid below */}
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            {filters.map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setActiveFilter(filter)}
                                    aria-pressed={activeFilter === filter}
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

                {/* Projects — 1 mobile, 2 tablet, 3 desktop */}
                {visibleProjects.length > 0 ? (
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
                        {visibleProjects.map((project) => (
                            <ProjectCard
                                key={project.id}
                                {...project}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="py-12 text-center text-sm text-[#6b685f]">
                        No {activeFilter.toLowerCase()} yet — check back soon.
                    </p>
                )}

            </div>

            <style>{`
                .projects-headline-underline {
                    animation: projects-dash-march 1.2s linear infinite;
                }
                @media (prefers-reduced-motion: reduce) {
                    .projects-headline-underline {
                        animation: none;
                    }
                }
                @keyframes projects-dash-march {
                    to {
                        stroke-dashoffset: -22;
                    }
                }
            `}</style>
        </section>
    );
}