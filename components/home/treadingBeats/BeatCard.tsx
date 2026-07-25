"use client";

import Image from "next/image";
import Link from "next/link";
import {
    ArrowRight,
    BadgeCheck,
    Clock3,
    Heart,
    Pause,
    Play,
    TrendingUp,
} from "lucide-react";
import { useState } from "react";

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
    const [playing, setPlaying] = useState(false);
    const [liked, setLiked] = useState(false);

    const handlePlayClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setPlaying((p) => !p);
    };

    const handleLikeClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setLiked((l) => !l);
    };

    return (
        <Link
            href={`/marketplace/${slug}`}
            className="
                group
                relative
                flex
                flex-col
                overflow-hidden
                rounded-2xl
                border
                border-[#272727]
                bg-[#141414]
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-blue-500/40
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-blue-500/60
            "
        >
            {/* Blue glow */}
            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    -right-14
                    -top-14
                    h-28
                    w-28
                    rounded-full
                    bg-blue-500/10
                    opacity-0
                    blur-3xl
                    transition-opacity
                    duration-300
                    group-hover:opacity-100
                "
            />

            {/* Artwork — shorter than square now */}
            <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                    src={thumbnail}
                    alt={title}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                    className="
                        object-cover
                        transition-transform
                        duration-500
                        ease-out
                        group-hover:scale-105
                    "
                />

                <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent"
                />

                {/* Top row — exclusive tag + BPM chip */}
                <div className="absolute inset-x-2 top-2 flex items-start justify-between gap-2">
                    {exclusive ? (
                        <span
                            className="
                                inline-flex
                                items-center
                                rounded-full
                                bg-emerald-500
                                px-2
                                py-0.5
                                text-[9px]
                                font-semibold
                                text-white
                            "
                        >
                            Exclusive
                        </span>
                    ) : (
                        <span />
                    )}

                    <span
                        className="
                            rounded-full
                            bg-black/60
                            px-2
                            py-0.5
                            text-[9px]
                            font-semibold
                            text-white
                            backdrop-blur-md
                        "
                    >
                        {bpm} BPM
                    </span>
                </div>

                {/* Like */}
                <button
                    onClick={handleLikeClick}
                    aria-label={liked ? "Unlike" : "Like"}
                    className="
                        absolute
                        right-2
                        top-9
                        z-10
                        flex
                        h-6
                        w-6
                        items-center
                        justify-center
                        rounded-full
                        bg-black/50
                        opacity-0
                        backdrop-blur-md
                        transition-all
                        duration-200
                        group-hover:opacity-100
                        hover:bg-black/70
                    "
                >
                    <Heart
                        size={12}
                        className={`transition-colors ${
                            liked ? "fill-red-500 text-red-500" : "text-white"
                        }`}
                    />
                </button>

                {/* Play */}
                <button
                    onClick={handlePlayClick}
                    aria-label={playing ? "Pause preview" : "Play preview"}
                    className="
                        absolute
                        left-1/2
                        top-1/2
                        z-10
                        flex
                        h-10
                        w-10
                        -translate-x-1/2
                        -translate-y-1/2
                        items-center
                        justify-center
                        rounded-full
                        bg-blue-600
                        text-white
                        shadow-xl
                        transition-all
                        duration-300
                        hover:bg-blue-500
                        group-hover:scale-110
                    "
                >
                    {playing ? (
                        <Pause size={16} className="fill-current" />
                    ) : (
                        <Play size={16} className="ml-0.5 fill-current" />
                    )}
                </button>

                {/* Waveform pulse — only visible while "playing" */}
                {playing && (
                    <div className="absolute inset-x-0 bottom-2 flex h-3 items-end justify-center gap-[2px]">
                        {[5, 10, 4, 12, 6, 11, 5, 8].map((h, i) => (
                            <span
                                key={i}
                                className="w-[2px] animate-pulse rounded-full bg-white/70"
                                style={{
                                    height: `${h}px`,
                                    animationDelay: `${i * 0.1}s`,
                                    animationDuration: "0.9s",
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Content — tightened padding + spacing to cut overall height */}
            <div className="flex flex-1 flex-col p-3">

                <div className="min-w-0">
                    <h3 className="truncate text-sm font-bold text-white">
                        {title}
                    </h3>

                    <div className="mt-0.5 flex items-center gap-1">
                        <span className="truncate text-xs text-slate-400">
                            by {producer}
                        </span>

                        {verified && (
                            <BadgeCheck size={13} className="shrink-0 text-blue-400" />
                        )}
                    </div>

                    <p className="mt-1.5 truncate text-[11px] text-slate-500">
                        {genre} • {key}
                    </p>
                </div>

                {/* Stats — condensed single row, no bordered box */}
                <div className="mt-2.5 flex items-center gap-3 text-slate-400">
                    <div className="flex items-center gap-1">
                        <Heart
                            size={11}
                            className={liked ? "fill-red-400 text-red-400" : "text-red-400"}
                        />
                        <span className="text-[10px]">
                            {(likes + (liked ? 1 : 0)).toLocaleString()}
                        </span>
                    </div>

                    <div className="flex items-center gap-1">
                        <TrendingUp size={11} className="text-blue-400" />
                        <span className="text-[10px]">
                            {plays.toLocaleString()}
                        </span>
                    </div>

                    <div className="flex items-center gap-1">
                        <Clock3 size={11} />
                        <span className="text-[10px]">
                            {duration}
                        </span>
                    </div>
                </div>

                {/* Footer */}
                <div
                    className="
                        mt-2.5
                        flex
                        items-center
                        justify-between
                        gap-2
                        border-t
                        border-[#262626]
                        pt-2.5
                    "
                >
                    <p className="truncate text-sm font-bold text-white">
                        {price}
                    </p>

                    <div
                        className="
                            flex
                            shrink-0
                            items-center
                            gap-1
                            rounded-full
                            bg-blue-500/10
                            px-2.5
                            py-1
                            text-[11px]
                            font-semibold
                            text-blue-400
                            transition-colors
                            duration-300
                            group-hover:bg-blue-600
                            group-hover:text-white
                        "
                    >
                        Buy
                        <ArrowRight
                            size={12}
                            className="transition-transform duration-300 group-hover:translate-x-0.5"
                        />
                    </div>
                </div>
            </div>
        </Link>
    );
}