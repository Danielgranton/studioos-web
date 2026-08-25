"use client";

import ExploreCard from "./ExploreCard";
import { exploreItems } from "./exploreData";

export default function ExploreSection() {
    return (
        <section
            className="
                relative
                overflow-hidden
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
                            <div className="h-7 w-7 rounded-full border-2 border-[#161513]" style={{ background: "linear-gradient(to bottom right, #7fa9ac, #5a8386)" }} />
                            <div className="h-7 w-7 rounded-full border-2 border-[#161513]" style={{ background: "linear-gradient(to bottom right, #a58bc4, #7d63a0)" }} />
                            <div className="h-7 w-7 rounded-full border-2 border-[#161513]" style={{ background: "linear-gradient(to bottom right, #8fae82, #6b8a5e)" }} />
                            <div className="h-7 w-7 rounded-full border-2 border-[#161513]" style={{ background: "linear-gradient(to bottom right, #e8a33d, #cf8452)" }} />
                            <div
                                className="
                                    flex
                                    h-7
                                    w-7
                                    items-center
                                    justify-center
                                    rounded-full
                                    border-2
                                    border-[#161513]
                                    bg-[#2a2825]
                                    text-[9px]
                                    font-bold
                                    text-[#b5b2a8]
                                "
                            >
                                +
                            </div>
                        </div>

                        <div>
                            <p className="text-xs font-semibold text-[#f5f4f1]">
                                Join <span className="font-mono text-[#e8a33d]">250K+</span> creators
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
                    {exploreItems.map((item) => (
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