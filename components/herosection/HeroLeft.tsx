"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Music2 } from "lucide-react";
import HeroAudienceToggle from "./HeroAudienceToggle";

const genres = ["Hip-Hop", "Afrobeat", "R&B", "Podcast", "Gospel"];

export default function HeroLeft() {
    return (
        <div className="w-full max-w-3xl">

            {/* Badge — same pulsing-dot pattern used across the site */}
            <div
                className="
                    mb-4
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-blue-500/20
                    bg-blue-500/10
                    px-2.5
                    py-1
                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-[0.2em]
                    text-blue-400
                    sm:mb-5
                    sm:px-3
                    sm:text-[9px]
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
                Featured Today
            </div>

            {/* Headline */}
            <h1
                className="
                    text-[2rem]
                    font-black
                    leading-[0.95]
                    tracking-tight
                    text-white
                    sm:text-4xl
                    md:text-5xl
                    xl:text-6xl
                "
            >
                CREATE MUSIC
                <span className="relative mt-1 block w-fit">
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
                        WITHOUT LIMITS
                    </span>
                    <svg
                        aria-hidden="true"
                        viewBox="0 0 460 20"
                        preserveAspectRatio="none"
                        className="absolute -bottom-2 left-0 h-3 w-full text-blue-500 sm:-bottom-3 sm:h-4"
                    >
                        <path
                            d="M2 12c32-11 64-11 96 0s64 11 96 0 64-11 96 0 64 11 96 0 64-11 74 0"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            className="hero-headline-underline"
                        />
                    </svg>
                </span>
            </h1>

            <p
                className="
                    mt-4
                    max-w-xl
                    text-sm
                    leading-6
                    text-slate-400
                    sm:mt-6
                    sm:text-base
                    sm:leading-7
                "
            >
                The all-in-one platform for recording,
                mixing, mastering, licensing beats,
                booking studios and collaborating
                with creators around the world.
            </p>

            <div className="mt-5 flex flex-wrap gap-2.5 sm:mt-6 sm:gap-3">

                <Link
                    href="/studios"
                    className="
                        group
                        inline-flex
                        flex-1
                        items-center
                        justify-center
                        gap-2
                        rounded-full
                        bg-orange-600
                        px-4
                        py-2.5
                        text-xs
                        font-semibold
                        text-white
                        transition-all
                        hover:bg-orange-700
                        hover:gap-3
                        sm:flex-none
                        sm:px-5
                        sm:py-3
                        sm:text-sm
                    "
                >
                    Book Studio
                    <ArrowRight
                        size={15}
                        className="transition-transform duration-300 group-hover:translate-x-1 sm:size-4"
                    />
                </Link>

                <Link
                    href="/marketplace"
                    className="
                        group
                        inline-flex
                        flex-1
                        items-center
                        justify-center
                        gap-2
                        rounded-full
                        border
                        border-slate-700
                        bg-[#171717]
                        px-4
                        py-2.5
                        text-xs
                        font-semibold
                        text-white
                        transition
                        hover:border-slate-600
                        hover:bg-[#272727]
                        sm:flex-none
                        sm:px-5
                        sm:py-3
                        sm:text-sm
                    "
                >
                    <Music2
                        size={15}
                        className="transition-transform duration-300 group-hover:rotate-12 sm:size-4"
                    />
                    Explore Marketplace
                </Link>

            </div>

            <HeroAudienceToggle />

            {/* Genre pills */}
            <div className="mt-4 flex flex-wrap gap-1.5 sm:gap-2">

                {genres.map((genre) => (
                    <button
                        key={genre}
                        className="
                            rounded-full
                            border
                            border-slate-800
                            bg-[#171717]
                            px-2.5
                            py-1
                            text-[11px]
                            text-slate-300
                            transition
                            hover:border-blue-500/40
                            hover:text-white
                            sm:px-3
                            sm:text-xs
                        "
                    >
                        {genre}
                    </button>
                ))}

            </div>

            {/* Rating + avatar stack */}
            <div className="mt-5 flex flex-wrap items-center gap-3 sm:mt-6">

                <div className="flex -space-x-2 sm:-space-x-2.5">

                    {[
                        "https://i.pravatar.cc/40?img=12",
                        "https://i.pravatar.cc/40?img=32",
                        "https://i.pravatar.cc/40?img=47",
                        "https://i.pravatar.cc/40?img=5",
                    ].map((src, i) => (
                        <Image
                            key={i}
                            src={src}
                            alt=""
                            width={32}
                            height={32}
                            className="
                                h-7
                                w-7
                                rounded-full
                                border-2
                                border-[#0f0f0f]
                                object-cover
                                sm:h-8
                                sm:w-8
                            "
                        />
                    ))}

                    <div
                        className="
                            flex
                            h-7
                            w-7
                            items-center
                            justify-center
                            rounded-full
                            border-2
                            border-[#0f0f0f]
                            bg-gradient-to-br
                            from-blue-500
                            to-blue-700
                            text-[9px]
                            font-semibold
                            text-white
                            sm:h-8
                            sm:w-8
                            sm:text-[10px]
                        "
                    >
                        250K+
                    </div>

                </div>

                <div>
                    <p className="text-xs text-yellow-400 sm:text-sm">
                        ★★★★★
                    </p>

                    <p className="text-[11px] text-slate-400 sm:text-xs">
                        Trusted by creators worldwide
                    </p>
                </div>

            </div>

            {/* Live activity ticker */}
            <div
                className="
                    mt-4
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-slate-800
                    bg-[#171717]
                    px-2.5
                    py-1.5
                    text-[11px]
                    text-slate-300
                    sm:px-3
                    sm:text-xs
                "
            >
                <span className="relative flex h-1.5 w-1.5 shrink-0">
                    <span
                        className="
                            absolute
                            inline-flex
                            h-full
                            w-full
                            animate-ping
                            rounded-full
                            bg-blue-500
                            opacity-75
                        "
                    />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-blue-500" />
                </span>

                <span className="truncate">Studio session booked 3 min ago</span>
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-2 gap-2.5 sm:mt-8 sm:gap-3 md:grid-cols-4">

                {[
                    ["8,000+", "Studios"],
                    ["12,000+", "Producers"],
                    ["1M+", "Beats"],
                    ["250K+", "Artists"],
                ].map(([value, label]) => (
                    <div
                        key={label}
                        className="
                            group
                            relative
                            overflow-hidden
                            rounded-xl
                            border
                            border-slate-800
                            bg-[#171717]
                            p-2.5
                            transition-colors
                            hover:border-slate-700
                            sm:p-3
                        "
                    >
                        <p className="text-lg font-bold text-white sm:text-xl">
                            {value}
                        </p>

                        <p className="mt-0.5 text-[11px] text-slate-400 sm:text-xs">
                            {label}
                        </p>

                        <span
                            aria-hidden="true"
                            className="
                                absolute
                                bottom-0
                                left-0
                                h-[2px]
                                w-0
                                bg-blue-500
                                transition-all
                                duration-300
                                group-hover:w-full
                            "
                        />
                    </div>
                ))}

            </div>

            <style>{`
                .hero-headline-underline {
                    stroke-dasharray: 620;
                    stroke-dashoffset: 620;
                    animation: hero-underline-draw 1.1s cubic-bezier(0.65, 0, 0.35, 1) 0.5s forwards;
                }
                @media (prefers-reduced-motion: reduce) {
                    .hero-headline-underline {
                        animation: none;
                        stroke-dashoffset: 0;
                    }
                }
                @keyframes hero-underline-draw {
                    to {
                        stroke-dashoffset: 0;
                    }
                }
            `}</style>

        </div>
    );
}