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
                                border-blue-500/20
                                bg-blue-500/10
                                px-2
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
                            Explore
                        </span>

                        {/* Headline */}
                        <h2
                            className="
                                mt-4
                                text-3xl
                                font-bold
                                leading-[1.1]
                                tracking-tight
                                text-white
                                md:text-4xl
                            "
                        >
                            Everything you need to{" "}
                            <span className="relative inline-block">
                                create music.
                                <svg
                                    aria-hidden="true"
                                    viewBox="0 0 220 16"
                                    preserveAspectRatio="none"
                                    className="absolute -bottom-1 left-0 h-3 w-full text-green-500"
                                >
                                    <path
                                        d="M2 10c18-9 36-9 54 0s36 9 54 0 36-9 54 0 36 9 54 0"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        strokeLinecap="round"
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
                                text-slate-400
                            "
                        >
                            Discover{" "}
                            <span className="font-medium text-slate-200">studios</span>,{" "}
                            <span className="font-medium text-slate-200">producers</span>,{" "}
                            <span className="font-medium text-slate-200">artists</span>,{" "}
                            <span className="font-medium text-slate-200">beats</span>,
                            creative services and promotional tools — all in one
                            platform.
                        </p>

                    </div>

                    {/* Social proof */}
                    <div
                        className="
                            hidden
                            shrink-0
                            items-center
                            gap-4
                            rounded-full
                            border
                            border-[#262626]
                            bg-[#171717]
                            px-4
                            py-2
                            lg:flex
                        "
                    >
                        <div className="flex -space-x-2">
                            <div className="h-7 w-7 rounded-full border-2 border-[#171717] bg-gradient-to-br from-blue-400 to-blue-600" />
                            <div className="h-7 w-7 rounded-full border-2 border-[#171717] bg-gradient-to-br from-purple-400 to-purple-600" />
                            <div className="h-7 w-7 rounded-full border-2 border-[#171717] bg-gradient-to-br from-emerald-400 to-emerald-600" />
                            <div className="h-7 w-7 rounded-full border-2 border-[#171717] bg-gradient-to-br from-orange-400 to-orange-600" />
                            <div
                                className="
                                    flex
                                    h-7
                                    w-7
                                    items-center
                                    justify-center
                                    rounded-full
                                    border-2
                                    border-[#171717]
                                    bg-[#262626]
                                    text-[9px]
                                    font-bold
                                    text-slate-300
                                "
                            >
                                +
                            </div>
                        </div>

                        <div>
                            <p className="text-xs font-semibold text-white">
                                Join <span className="text-blue-400">250K+</span> creators
                            </p>
                            <p className="text-[11px] text-slate-500">
                                Studios • Artists • Producers
                            </p>
                        </div>
                    </div>

                </div>

                {/* Cards */}
                                {/* Cards */}
                <div
                    className="
                        grid
                        grid-cols-2
                        gap-4
                        sm:gap-5
                        md:grid-cols-3
                        lg:grid-cols-5
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
                    stroke-dasharray: 320;
                    stroke-dashoffset: 320;
                    animation: explore-underline-draw 0.9s cubic-bezier(0.65, 0, 0.35, 1) 0.3s forwards;
                }
                @media (prefers-reduced-motion: reduce) {
                    .explore-headline-underline {
                        animation: none;
                        stroke-dashoffset: 0;
                    }
                }
                @keyframes explore-underline-draw {
                    to {
                        stroke-dashoffset: 0;
                    }
                }
            `}</style>
        </section>
    );
}