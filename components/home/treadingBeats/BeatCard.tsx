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
    musicalKey: string;
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
    musicalKey,
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
                p-2
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-blue-500/30
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-blue-500/60
            "
        >
            {/* Background glow */}
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

            {/* Artwork */}
            <div
                className="
                    relative
                    aspect-[4/3]
                    w-full
                    overflow-hidden
                    rounded-xl
                    bg-[#0a0a0a]
                "
            >
                <Image
                    src={thumbnail}
                    alt={title}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                    className="
                        object-cover
                        transition-transform
                        duration-500
                        ease-out
                        group-hover:scale-[1.06]
                    "
                />

                <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent"
                />

                {/* Exclusive — same slot/style as "Available" on the studio card */}
                <div className="absolute left-2 top-2">
                    {exclusive && (
                        <span
                            className="
                                inline-flex
                                items-center
                                gap-1
                                rounded-full
                                bg-emerald-500/90
                                px-1.5
                                py-0.5
                                text-[9px]
                                font-semibold
                                text-white
                                backdrop-blur-md
                            "
                        >
                            Exclusive
                        </span>
                    )}
                </div>

                {/* BPM chip — same slot/style as "Rating" on the studio card */}
                <div
                    className="
                        absolute
                        right-2
                        top-2
                        flex
                        items-center
                        gap-0.5
                        rounded-full
                        bg-black/60
                        px-1.5
                        py-0.5
                        text-[9px]
                        font-semibold
                        text-white
                        backdrop-blur-md
                    "
                >
                    {bpm} BPM
                </div>

                {/* Price — same slot/style as price on the studio card */}
                <div className="absolute bottom-2 left-2">
                    <div className="rounded-lg bg-black/60 px-2 py-1 backdrop-blur-md">
                        <p className="text-xs font-bold leading-tight text-white">
                            {price}
                        </p>
                    </div>
                </div>

                {/* Play — floating center, unique to beats */}
                <button
                    onClick={handlePlayClick}
                    aria-label={playing ? "Pause preview" : "Play preview"}
                    className="
                        absolute
                        left-1/2
                        top-1/2
                        z-10
                        flex
                        h-9
                        w-9
                        -translate-x-1/2
                        -translate-y-1/2
                        items-center
                        justify-center
                        rounded-full
                        bg-blue-600
                        text-white
                        opacity-0
                        shadow-xl
                        transition-all
                        duration-300
                        group-hover:opacity-100
                        hover:bg-blue-500
                    "
                >
                    {playing ? (
                        <Pause size={14} className="fill-current" />
                    ) : (
                        <Play size={14} className="ml-0.5 fill-current" />
                    )}
                </button>

                {/* Like — floating, top-right below the BPM chip */}
                <button
                    onClick={handleLikeClick}
                    aria-label={liked ? "Unlike" : "Like"}
                    className="
                        absolute
                        right-2
                        bottom-2
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
                        className={liked ? "fill-red-500 text-red-500" : "text-white"}
                    />
                </button>
            </div>

            {/* Content — mirrors FeaturedStudioCard's structure exactly */}
            <div className="flex flex-1 flex-col p-3">

                {/* Header — title + verified badge, badge pill on the right */}
                <div className="flex items-start justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-1">
                        <h3 className="truncate text-sm font-bold text-white">
                            {title}
                        </h3>
                        {verified && (
                            <BadgeCheck size={13} className="shrink-0 text-blue-400" />
                        )}
                    </div>

                    <span
                        className="
                            shrink-0
                            rounded-full
                            bg-blue-500/10
                            px-2
                            py-0.5
                            text-[10px]
                            font-semibold
                            text-blue-400
                        "
                    >
                        {genre}
                    </span>
                </div>

                {/* Producer + key — same slot as location + bookings */}
                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#8a8a8a]">
                    <span className="min-w-0 truncate">
                        by {producer}
                    </span>

                    <span className="flex items-center gap-1">
                        <Clock3 size={11} />
                        {duration}
                    </span>
                </div>

                {/* Stats tag — reuses the single-tag pill slot */}
                <div className="mt-2 flex flex-wrap gap-1">
                    <span
                        className="
                            inline-flex
                            items-center
                            gap-1
                            rounded-full
                            border
                            border-[#2c2c2c]
                            bg-[#1c1c1c]
                            px-2
                            py-0.5
                            text-[9px]
                            font-medium
                            text-[#c4c4c4]
                            transition-colors
                            group-hover:border-[#3a3a3a]
                        "
                    >
                        <TrendingUp size={10} className="text-blue-400" />
                        {plays.toLocaleString()} plays
                    </span>
                    <span
                        className="
                            inline-flex
                            items-center
                            gap-1
                            rounded-full
                            border
                            border-[#2c2c2c]
                            bg-[#1c1c1c]
                            px-2
                            py-0.5
                            text-[9px]
                            font-medium
                            text-[#c4c4c4]
                            transition-colors
                            group-hover:border-[#3a3a3a]
                        "
                    >
                        <Heart size={10} className="text-red-400" />
                        {(likes + (liked ? 1 : 0)).toLocaleString()}
                    </span>
                </div>

                {/* Footer — identical structure to FeaturedStudioCard's */}
                <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-[#232323] pt-2.5">
                    <span className="truncate text-[10px] text-[#717171]">
                        {musicalKey}
                    </span>

                    <div
                        className="
                            flex
                            shrink-0
                            items-center
                            gap-1
                            rounded-full
                            bg-blue-600
                            px-2.5
                            py-1
                            text-[11px]
                            font-semibold
                            text-white
                            transition-all
                            duration-300
                            group-hover:gap-1.5
                            group-hover:bg-blue-500
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