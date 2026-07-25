"use client";

import Image from "next/image";
import Link from "next/link";
import {
    ArrowRight,
    BadgeCheck,
    Clock3,
    Heart,
    Play,
    TrendingUp,
} from "lucide-react";

interface BeatCardProps {
    id: number;
    slug: string;
    title: string;
    producer: string;
    thumbnail: string;

    genre: string;
    bpm: number;
    key: string;

    price: string;

    plays: number;
    likes: number;
    duration: string;

    exclusive: boolean;
    verified: boolean;
}

export default function BeatCard({
    slug,
    title,
    producer,
    thumbnail,
    genre,
    bpm,
    key,
    price,
    plays,
    likes,
    duration,
    exclusive,
    verified,
}: BeatCardProps) {
    return (
        <Link
            href={`/marketplace/${slug}`}
            className="
                group
                relative
                flex
                min-h-[360px]
                flex-col
                overflow-hidden
                rounded-3xl
                border
                border-[#272727]
                bg-[#171717]
                transition-all
                duration-300
                hover:-translate-y-1.5
                hover:border-purple-500/40
                hover:bg-[#1b1b1b]
                hover:shadow-[0_20px_60px_rgba(168,85,247,0.18)]
            "
        >
            {/* Purple Glow */}
            <div
                className="
                    absolute
                    -right-20
                    -top-20
                    h-44
                    w-44
                    rounded-full
                    bg-purple-500/10
                    blur-3xl
                    opacity-0
                    transition
                    duration-300
                    group-hover:opacity-100
                "
            />

            {/* Artwork */}
            <div className="relative aspect-square overflow-hidden">
                <Image
                    src={thumbnail}
                    alt={title}
                    fill
                    className="
                        object-cover
                        transition-transform
                        duration-500
                        group-hover:scale-105
                    "
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Exclusive */}
                {exclusive && (
                    <span
                        className="
                            absolute
                            left-4
                            top-4
                            rounded-full
                            bg-emerald-500
                            px-3
                            py-1
                            text-[11px]
                            font-semibold
                            text-white
                        "
                    >
                        Exclusive
                    </span>
                )}

                {/* Play */}
                <button
                    className="
                        absolute
                        left-1/2
                        top-1/2
                        flex
                        h-14
                        w-14
                        -translate-x-1/2
                        -translate-y-1/2
                        items-center
                        justify-center
                        rounded-full
                        bg-purple-600
                        text-white
                        shadow-xl
                        transition
                        duration-300
                        group-hover:scale-110
                    "
                >
                    <Play
                        size={22}
                        className="ml-1 fill-current"
                    />
                </button>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col p-5">
                {/* Title */}
                <div>
                    <h3 className="text-lg font-bold text-white">
                        {title}
                    </h3>

                    <div className="mt-1 flex items-center gap-1">
                        <span className="text-sm text-slate-400">
                            by {producer}
                        </span>

                        {verified && (
                            <BadgeCheck
                                size={15}
                                className="text-purple-400"
                            />
                        )}
                    </div>

                    <p className="mt-3 text-sm text-slate-500">
                        {genre} • {bpm} BPM • {key}
                    </p>
                </div>

                {/* Stats */}
                <div
                    className="
                        mt-5
                        flex
                        items-center
                        justify-between
                        rounded-2xl
                        border
                        border-[#262626]
                        bg-[#1d1d1d]
                        px-4
                        py-3
                    "
                >
                    <div className="flex items-center gap-1 text-slate-400">
                        <Heart
                            size={14}
                            className="text-red-400"
                        />
                        <span className="text-xs">
                            {likes.toLocaleString()}
                        </span>
                    </div>

                    <div className="flex items-center gap-1 text-slate-400">
                        <TrendingUp
                            size={14}
                            className="text-purple-400"
                        />
                        <span className="text-xs">
                            {plays.toLocaleString()}
                        </span>
                    </div>

                    <div className="flex items-center gap-1 text-slate-400">
                        <Clock3 size={14} />
                        <span className="text-xs">
                            {duration}
                        </span>
                    </div>
                </div>

                {/* Footer */}
                <div
                    className="
                        mt-auto
                        flex
                        items-center
                        justify-between
                        border-t
                        border-[#262626]
                        pt-5
                    "
                >
                    <div>
                        <p className="text-xs text-slate-500">
                            Licence
                        </p>

                        <p className="mt-1 font-bold text-white">
                            {price}
                        </p>
                    </div>

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                            font-semibold
                            text-purple-400
                        "
                    >
                        Buy Beat

                        <ArrowRight
                            size={17}
                            className="
                                transition-transform
                                duration-300
                                group-hover:translate-x-1
                            "
                        />
                    </div>
                </div>
            </div>
        </Link>
    );
}