"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Music2 } from "lucide-react";

const genres = ["Hip-Hop", "Afrobeat", "R&B", "Podcast", "Gospel"];

export default function HeroLeft() {
    return (
        <div className="max-w-3xl">

            <div
                className="
                    mb-4
                    inline-flex
                    items-center
                    rounded-full
                    border
                    border-blue-500/20
                    bg-blue-500/10
                    px-3
                    py-1.5
                    text-xs
                    font-medium
                    text-blue-400
                "
            >
                🔥 Featured Today
            </div>

            <h1
                className="
                    text-4xl
                    font-black
                    leading-none
                    tracking-tight
                    text-white
                    md:text-5xl
                    xl:text-6xl
                "
            >
                CREATE MUSIC

                <span className="block text-blue-500">
                    WITHOUT LIMITS
                </span>
            </h1>

            <p
                className="
                    mt-5
                    max-w-xl
                    text-base
                    leading-7
                    text-slate-400
                "
            >
                The all-in-one platform for recording,
                mixing, mastering, licensing beats,
                booking studios and collaborating
                with creators around the world.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">

                <Link
                    href="/studios"
                    className="
                        inline-flex
                        items-center
                        gap-2
                        rounded-full
                        bg-blue-600
                        px-5
                        py-3
                        text-sm
                        font-semibold
                        text-white
                        transition
                        hover:bg-blue-500
                    "
                >
                    Book Studio
                    <ArrowRight size={16} />
                </Link>

                <Link
                    href="/marketplace"
                    className="
                        inline-flex
                        items-center
                        gap-2
                        rounded-full
                        border
                        border-slate-700
                        bg-[#171717]
                        px-5
                        py-3
                        text-sm
                        font-semibold
                        text-white
                        transition
                        hover:bg-[#272727]
                    "
                >
                    <Music2 size={16} />
                    Explore Marketplace
                </Link>

            </div>

            {/* Genre pills */}
            <div className="mt-4 flex flex-wrap gap-2">

                {genres.map((genre) => (
                    <button
                        key={genre}
                        className="
                            rounded-full
                            border
                            border-slate-800
                            bg-[#171717]
                            px-3
                            py-1
                            text-xs
                            text-slate-300
                            transition
                            hover:border-blue-500/40
                            hover:text-white
                        "
                    >
                        {genre}
                    </button>
                ))}

            </div>

            {/* Rating + avatar stack */}
            <div className="mt-6 flex flex-wrap items-center gap-3">

                <div className="flex -space-x-2.5">

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
                                h-8
                                w-8
                                rounded-full
                                border-2
                                border-[#0f0f0f]
                                object-cover
                            "
                        />
                    ))}

                    <div
                        className="
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            rounded-full
                            border-2
                            border-[#0f0f0f]
                            bg-blue-600
                            text-[10px]
                            font-semibold
                            text-white
                        "
                    >
                        250K+
                    </div>

                </div>

                <div>
                    <p className="text-sm text-yellow-400">
                        ★★★★★
                    </p>

                    <p className="text-xs text-slate-400">
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
                    px-3
                    py-1.5
                    text-xs
                    text-slate-300
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
                            bg-blue-500
                            opacity-75
                        "
                    />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-blue-500" />
                </span>

                Studio session booked in Nairobi, 3 min ago
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">

                {[
                    ["8,000+", "Studios"],
                    ["12,000+", "Producers"],
                    ["1M+", "Beats"],
                    ["250K+", "Artists"],
                ].map(([value, label]) => (
                    <div
                        key={label}
                        className="
                            rounded-xl
                            border
                            border-slate-800
                            bg-[#171717]
                            p-3.5
                        "
                    >
                        <p className="text-xl font-bold text-white">
                            {value}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-400">
                            {label}
                        </p>
                    </div>
                ))}

            </div>

        </div>
    );
}