"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Music2 } from "lucide-react";
import { HeroAudienceToggle } from "./HeroAudienceToggle";

const genres = ["Hip-Hop", "Afrobeat", "R&B", "Podcast", "Gospel"];

export function HeroLeft() {
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
                    border-[#e8a33d]/20
                    bg-[#e8a33d]/10
                    px-2.5
                    py-1
                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-[0.2em]
                    text-[#e8a33d]
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
                            bg-[#e8a33d]
                            opacity-60
                        "
                    />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#e8a33d]" />
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
                    text-[#f5f4f1]
                    sm:text-4xl
                    md:text-5xl
                    xl:text-6xl
                "
            >
                CREATE MUSIC
                <span className="relative mt-1 block w-fit">
                    <span className="text-blue-600">
                        WITHOUT LIMITS
                    </span>
                    <svg
                        aria-hidden="true"
                        viewBox="0 0 460 20"
                        preserveAspectRatio="none"
                        className="absolute -bottom-2 left-0 h-3 w-full text-blue-600 sm:-bottom-3 sm:h-4"
                    >
                        <path
                            d="M2 10 H458"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            strokeDasharray="16 9"
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
                    text-[#9a978f]
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
                        border
                        border-blue-600
                        bg-blue-600
                        px-4
                        py-2.5
                        text-xs
                        font-semibold
                        text-white
                        transition-all
                        hover:bg-blue-700
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
                        border-[#2a2825]
                        bg-[#161513]
                        px-4
                        py-2.5
                        text-xs
                        font-semibold
                        text-[#f5f4f1]
                        transition
                        hover:border-[#3a3630]
                        hover:bg-[#1c1a17]
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
                            border-[#2a2825]
                            bg-[#161513]
                            px-2.5
                            py-1
                            text-[11px]
                            text-[#b5b2a8]
                            transition
                            hover:border-[#e8a33d]/40
                            hover:text-[#f5f4f1]
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
                                border-[#0e0d0c]
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
                            border-[#0e0d0c]
                            bg-gradient-to-br
                            from-[#e8a33d]
                            to-[#d97757]
                            font-mono
                            text-[9px]
                            font-semibold
                            text-[#161513]
                            sm:h-8
                            sm:w-8
                            sm:text-[10px]
                        "
                    >
                        250K+
                    </div>

                </div>

                <div>
                    <p className="text-xs text-[#e8a33d] sm:text-sm">
                        ★★★★★
                    </p>

                    <p className="text-[11px] text-[#9a978f] sm:text-xs">
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
                    border-[#2a2825]
                    bg-[#161513]
                    px-2.5
                    py-1.5
                    font-mono
                    text-[11px]
                    text-[#b5b2a8]
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
                            bg-[#e8a33d]
                            opacity-75
                        "
                    />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#e8a33d]" />
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
                            border-[#2a2825]
                            bg-[#161513]
                            p-2.5
                            transition-colors
                            hover:border-[#3a3630]
                            sm:p-3
                        "
                    >
                        <p className="font-mono text-lg font-bold text-[#f5f4f1] sm:text-xl">
                            {value}
                        </p>

                        <p className="mt-0.5 text-[11px] text-[#9a978f] sm:text-xs">
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
                                bg-[#e8a33d]
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
                    animation: hero-dash-march 1.2s linear infinite;
                }
                @media (prefers-reduced-motion: reduce) {
                    .hero-headline-underline {
                        animation: none;
                    }
                }
                @keyframes hero-dash-march {
                    to {
                        stroke-dashoffset: -25;
                    }
                }
            `}</style>

        </div>
    );
}
