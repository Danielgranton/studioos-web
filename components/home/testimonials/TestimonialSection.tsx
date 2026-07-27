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
    Star
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

                <div className="mb-9">

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
                            text-[9px]
                            font-semibold
                            uppercase
                            tracking-[0.22em]
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

                    <div
                        className="
                            mt-3
                            flex
                            flex-col
                            gap-8
                            xl:flex-row
                            xl:items-end
                            xl:justify-between
                        "
                    >
                        <div className="max-w-2xl">

                            <h2
                                className="
                                    text-2xl
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
                                    mt-2
                                    max-w-2xl
                                    text-lg
                                    leading-8
                                    text-slate-400
                                "
                            >
                                Real feedback from artists, producers,
                                studios and creators using StudioOS to
                                build amazing music.
                            </p>

                            {/* Trust Metrics */}

                            <div
                                className="
                                    mt-5
                                    flex
                                    flex-wrap
                                    gap-5
                                "
                            >
                                <div>

                                    <p className="text-sm font-bold text-white flex items-center gap-2">
                                        <Star size={20} className="text-yellow-600"/>
                                        <span>4.9</span>
                                    </p>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Average Rating
                                    </p>

                                </div>

                                <div>

                                    <p className="text-sm font-bold text-white flex items-center gap-2">
                                        <MessageCircleMore size={20} className="text-blue-500"/> <span>8.4k</span>
                                    </p>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Reviews
                                    </p>

                                </div>

                                <div>

                                    <p className="text-sm font-bold text-white">
                                        ❤️ 97%
                                    </p>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Recommend StudioOS
                                    </p>

                                </div>

                            </div>

                        </div>

                        {/* View All */}

                        <Link
                            href="/testimonials"
                            className="
                                group
                                inline-flex
                                items-center
                                gap-2
                                self-start
                                rounded-full
                                border
                                border-[#272727]
                                bg-blue-600
                                px-5
                                py-2
                                text-sm
                                font-semibold
                                text-white
                                transition-all
                                duration-300
                                hover:border-blue-500/40
                                hover:bg-blue-700
                                hover:gap-3
                            "
                        >
                            View All Reviews

                            <ArrowRight
                                size={17}
                                className="
                                    transition-transform
                                    duration-300
                                    group-hover:translate-x-1
                                "
                            />
                        </Link>

                    </div>

                </div>

                <TestimonialSlider />

            </div>
        </section>
    );
}