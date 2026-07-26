"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

import ProjectCard from "./ProjectCard";
import { featuredProjects } from "./projectData";

const filters = ["All", "Songs", "Podcasts", "Videos"];

export default function FeaturedProjects() {
    const [activeFilter, setActiveFilter] = useState("All");

    // TODO: wire this to the real category field once known — `type` doesn't
    // exist on your ProjectCardProps (per the error), and I don't have the
    // actual shape of projectData.ts to guess correctly a second time.
    // For now this compiles cleanly and just shows everything regardless of
    // the selected filter. Once you share the real field name (e.g. `category`,
    // `contentType`, or something inferred from `videoPreview`), swap the
    // line below for: featuredProjects.filter((project) => project.<field> === activeFilter)
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
                                border-blue-500/20
                                bg-blue-500/10
                                px-3
                                py-1
                                text-[9px]
                                font-semibold
                                uppercase
                                tracking-[0.2em]
                                text-blue-400
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
                                        bg-blue-400
                                        opacity-60
                                    "
                                />
                                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-blue-400" />
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
                                        className="w-[3px] animate-pulse rounded-full bg-blue-400"
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
                                    fontSize: "clamp(1.1rem, 3.6vw, 2.25rem)",
                                }}
                            >
                                Real music,{" "}
                                <span
                                    className="
                                        bg-gradient-to-r
                                        from-blue-400
                                        via-blue-500
                                        to-blue-600
                                        bg-clip-text
                                        text-transparent
                                    "
                                >
                                    real success
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
                                text-slate-400
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

                        {/* Trust signal strip */}
                        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 sm:mt-6 sm:gap-x-6">
                            {[
                                { value: "3K+", label: "projects" },
                                { value: "180K+", label: "streams" },
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
                                border-[#272727]
                                bg-blue-600
                                px-3
                                py-2
                                text-sm
                                font-semibold
                                text-white
                                transition
                                hover:border-blue-500/40
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
                                                ? "border-blue-500/40 bg-blue-500/10 text-blue-400"
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
                    <p className="py-12 text-center text-sm text-slate-500">
                        No {activeFilter.toLowerCase()} yet — check back soon.
                    </p>
                )}

            </div>
        </section>
    );
}