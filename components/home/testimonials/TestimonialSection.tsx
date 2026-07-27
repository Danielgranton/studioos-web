"use client";

import Link from "next/link";
import {
    ArrowRight,
    Building2,
    Disc3,
    Globe2,
    Mic2,
    Music2,
    BriefcaseBusiness,
    MessageCircleMore,
    Star,
    ThumbsUp
} from "lucide-react";

import TestimonialSlider from "./TestimonialSlider";

const filters = [
    {
        label: "All",
        icon: Globe2,
        active: true,
    },
    {
        label: "Artists",
        icon: Mic2,
    },
    {
        label: "Producers",
        icon: Music2,
    },
    {
        label: "Studios",
        icon: Building2,
    },
    {
        label: "Beats",
        icon: Disc3,
    },
    {
        label: "Services",
        icon: BriefcaseBusiness,
    },
];

export default function TestimonialSection() {
    return (
        <section
            className="
                relative
                overflow-hidden
            "
        >
            <div
                className="
                    mx-auto
                    max-w-[1600px]
                    px-6
                "
            >
              {/* Header */}

            <div
                className="
                    mb-10
                    flex
                    flex-col
                    gap-8
                    xl:flex-row
                    xl:items-end
                    xl:justify-between
                "
            >
                {/* Left */}

                <div className="max-w-2xl">

                    {/* Badge */}

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
                            text-[10px]
                            font-semibold
                            uppercase
                            tracking-[0.2em]
                            text-blue-400
                        "
                    >
                        <span className="relative flex h-2 w-2">

                            <span
                                className="
                                    absolute
                                    inline-flex
                                    h-full
                                    w-full
                                    animate-ping
                                    rounded-full
                                    bg-blue-400
                                    opacity-70
                                "
                            />

                            <span
                                className="
                                    relative
                                    inline-flex
                                    h-2
                                    w-2
                                    rounded-full
                                    bg-blue-400
                                "
                            />

                        </span>

                        Live Creator Reviews
                    </span>

                    {/* Title */}

                    <h2
                        className="
                            mt-4
                            text-3xl
                            font-black
                            tracking-tight
                            text-white
                            md:text-4xl
                        "
                    >
                        Loved by{" "}

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
                            creators
                        </span>

                        {" "}worldwide.
                    </h2>

                    <p
                        className="
                            mt-4
                            max-w-2xl
                            text-base
                            leading-7
                            text-slate-400
                            md:text-lg
                        "
                    >
                        Honest feedback from artists, producers,
                        studios and creators building amazing
                        careers with StudioOS.
                    </p>

                    {/* Metrics */}

                    <div
                        className="
                            mt-6
                            flex
                            flex-wrap
                            items-center
                            gap-6
                        "
                    >
                        <div className="flex items-center gap-2">

                            <Star
                                size={18}
                                className="fill-yellow-400 text-yellow-400"
                            />

                            <div>

                                <p className="font-semibold text-white">
                                    4.9
                                </p>

                                <p className="text-xs text-slate-500">
                                    Average Rating
                                </p>

                            </div>

                        </div>

                        <div className="flex items-center gap-2">

                            <MessageCircleMore
                                size={18}
                                className="text-blue-400"
                            />

                            <div>

                                <p className="font-semibold text-white">
                                    8.4K
                                </p>

                                <p className="text-xs text-slate-500">
                                    Reviews
                                </p>

                            </div>

                        </div>

                        <div className="flex items-center gap-2">

                            <ThumbsUp
                                size={18}
                                className="text-emerald-400"
                            />

                            <div>

                                <p className="font-semibold text-white">
                                    97%
                                </p>

                                <p className="text-xs text-slate-500">
                                    Recommend StudioOS
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

                {/* Right */}

                <div
                    className="
                        flex
                        w-full
                        flex-col
                        items-start
                        gap-4
                        xl:w-auto
                        xl:items-end
                    "
                >
                    {/* View All */}

                    <Link
                        href="/testimonials"
                        className="
                            group
                            inline-flex
                            items-center
                            gap-2
                            rounded-full
                            border
                            border-blue-500/20
                            bg-blue-600
                            px-3
                            py-1
                            text-sm
                            font-semibold
                            text-white
                            transition-all
                            duration-300
                            hover:bg-blue-700
                        "
                    >
                        View All Reviews

                        <ArrowRight
                            size={16}
                            className="
                                transition-transform
                                duration-300
                                group-hover:translate-x-1
                            "
                        />
                    </Link>

                    {/* Filters */}

                    <div
                        className="
                            flex
                            w-full
                            flex-wrap
                            gap-2
                            xl:w-auto
                            xl:justify-end
                        "
                    >
                        {filters.map((filter) => {
                            const Icon = filter.icon;

                            return (
                                <button
                                    key={filter.label}
                                    className={`
                                        inline-flex
                                        h-7
                                        items-center
                                        gap-1.5
                                        rounded-full
                                        px-3.5
                                        text-xs
                                        font-medium
                                        transition-all
                                        duration-300
                                        ${
                                            filter.active
                                                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/20"
                                                : "border border-[#2b2b2b] bg-[#171717]/80 text-slate-400 hover:border-blue-500/30 hover:bg-[#1d1d1d] hover:text-white"
                                        }
                                    `}
                                >
                                    <Icon size={14} />

                                    {filter.label}
                                </button>
                            );
                        })}
                    </div>

                </div>

            </div>
                
                <TestimonialSlider />

            </div>
        </section>
    );
}