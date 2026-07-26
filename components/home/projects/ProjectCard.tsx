"use client";

import Image from "next/image";
import Link from "next/link";
import {
    ArrowRight,
    BadgeCheck,
    Building2,
    Calendar,
    Clock3,
    Headphones,
    Music2,
    Play,
    User,
} from "lucide-react";

interface ProjectCardProps {
    slug: string;
    title: string;
    artist: string;
    cover: string;

    genre: string;

    studio: string;
    producer: string;

    services: string[];

    streams: string;
    likes: string;
    duration: string;
    releaseDate: string;

    platform: string;
    platformIcon: string;

    audioPreview?: boolean;
    videoPreview?: boolean;
    projectType: string;

    verified: boolean;
}

export default function ProjectCard({
    slug,
    title,
    artist,
    cover,
    genre,
    studio,
    producer,
    services,
    streams,
    likes,
    duration,
    releaseDate,
    platform,
    platformIcon,
    audioPreview,
    videoPreview,
    projectType,
    verified,
}: ProjectCardProps) {
    return (
        <Link
            href={`/projects/${slug}`}
            className="
                group
                relative
                flex
                min-h-[440px]
                flex-col
                overflow-hidden
                rounded-3xl
                border
                border-[#272727]
                bg-[#171717]
                transition-all
                duration-300
                hover:-translate-y-1.5
                hover:border-blue-500/40
                hover:bg-[#1b1b1b]
            "
        >
            {/* Glow */}

            <div
                className="
                    absolute
                    -right-20
                    -top-20
                    h-48
                    w-48
                    rounded-full
                    bg-blue-500/10
                    blur-3xl
                    opacity-0
                    transition-opacity
                    duration-300
                    group-hover:opacity-100
                "
            />

            {/* Cover */}

            {/* Cover */}

<div
    className="
        relative
        flex
        aspect-[16/10]
        items-center
        justify-center
        overflow-hidden
        rounded-t-3xl
        bg-gradient-to-br
        from-[#242424]
        via-[#1b1b1b]
        to-[#101010]
    "
>
    {/* Animated Glow */}

    <div
        className="
            absolute
            h-52
            w-52
            rounded-full
            bg-blue-500/10
            blur-3xl
            transition-all
            duration-500
            group-hover:scale-125
            group-hover:bg-blue-500/20
        "
    />

    {/* Emoji */}

    <div
        className="
            relative
            text-7xl
            transition-all
            duration-500
            group-hover:scale-110
            group-hover:-rotate-6
        "
    >
        {cover}
    </div>

    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

    {/* Type */}

    <div className="absolute left-4 top-4">

        <span
            className="
                rounded-full
                border
                border-white/10
                bg-black/50
                px-3
                py-1
                text-xs
                font-semibold
                text-white
                backdrop-blur-md
            "
        >
            {projectType}
        </span>

    </div>

    {/* Preview */}

    {(audioPreview || videoPreview) && (
        <button
            type="button"
            className="
                absolute
                right-4
                top-4
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                bg-white/15
                text-white
                backdrop-blur-md
                transition
                hover:bg-white/25
            "
        >
            <Play
                size={16}
                className="fill-white"
            />
        </button>
    )}

    {/* Platform */}

    <div
        className="
            absolute
            bottom-4
            left-4
            flex
            items-center
            gap-2
            rounded-full
            bg-black/55
            px-3
            py-1.5
            text-xs
            font-semibold
            text-white
            backdrop-blur-md
        "
    >
        <span>{platformIcon}</span>
        <span>{platform}</span>
    </div>
</div>

            {/* Content */}

            <div className="flex flex-1 flex-col p-5">

                {/* Title */}

                <div>

                    <div className="flex items-center gap-2">

                        <h3 className="text-xl font-bold text-white">
                            {title}
                        </h3>

                        {verified && (
                            <BadgeCheck
                                size={18}
                                className="text-blue-400"
                            />
                        )}

                    </div>

                    <div className="mt-2 flex items-center gap-2 text-sm text-slate-400">

                        <User size={15} />

                        <span>{artist}</span>

                    </div>

                    <span
                        className="
                            mt-3
                            inline-flex
                            rounded-full
                            bg-blue-500/10
                            px-3
                            py-1
                            text-xs
                            font-medium
                            text-blue-400
                        "
                    >
                        {genre}
                    </span>

                </div>

                {/* Studio & Producer */}

                <div className="mt-5 space-y-3">

                    <div className="flex items-center gap-2 text-sm text-slate-300">

                        <Building2 size={15} />

                        <span>{studio}</span>

                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-300">

                        <Music2 size={15} />

                        <span>{producer}</span>

                    </div>

                </div>

                {/* Services */}

                <div className="mt-5 flex flex-wrap gap-2">

                    {services.slice(0, 3).map((service) => (
                        <span
                            key={service}
                            className="
                                rounded-full
                                bg-[#202020]
                                px-3
                                py-1
                                text-[11px]
                                text-slate-300
                            "
                        >
                            {service}
                        </span>
                    ))}

                </div>

                {/* Stats */}

                <div
                    className="
                        mt-5
                        grid
                        grid-cols-2
                        gap-3
                        rounded-2xl
                        border
                        border-[#262626]
                        bg-[#1b1b1b]
                        p-3
                    "
                >
                    <div>
                        <p className="text-[11px] text-slate-500">
                            Streams
                        </p>

                        <p className="mt-1 text-sm font-semibold text-white">
                            {streams}
                        </p>
                    </div>

                    <div>
                        <p className="text-[11px] text-slate-500">
                            Likes
                        </p>

                        <p className="mt-1 text-sm font-semibold text-white">
                            {likes}
                        </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Clock3 size={13} />
                        {duration}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Calendar size={13} />
                        {releaseDate}
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
                    <div className="flex items-center gap-2 text-blue-400">

                        <Headphones size={16} />

                        <span className="font-semibold">
                            View Project
                        </span>

                    </div>

                    <ArrowRight
                        size={18}
                        className="
                            transition-transform
                            duration-300
                            group-hover:translate-x-1
                        "
                    />

                </div>

            </div>

        </Link>
    );
}
