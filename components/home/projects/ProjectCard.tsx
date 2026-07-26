"use client";

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
    const extraServices = services.length - 3;

    return (
        <Link
            href={`/projects/${slug}`}
            className="
                group
                relative
                flex
                min-h-[300px]
                flex-col
                overflow-hidden
                rounded-xl
                border
                border-[#272727]
                bg-[#171717]
                transition-all
                duration-300
                hover:-translate-y-1.5
                hover:border-blue-500/40
                hover:bg-[#1b1b1b]
                sm:min-h-[360px]
                sm:rounded-2xl
            "
        >
            {/* Cover */}
            <div
                className="
                    relative
                    flex
                    aspect-[16/10]
                    items-center
                    justify-center
                    overflow-hidden
                    rounded-t-xl
                    bg-gradient-to-br
                    from-[#242424]
                    via-[#1b1b1b]
                    to-[#101010]
                    sm:rounded-t-2xl
                "
            >
                {/* Glow */}
                <div
                    className="
                        absolute
                        h-40
                        w-40
                        rounded-full
                        bg-blue-500/10
                        blur-3xl
                        transition-all
                        duration-500
                        group-hover:scale-125
                        group-hover:bg-blue-500/20
                        sm:h-52
                        sm:w-52
                    "
                />

                {/* Emoji */}
                <div
                    className="
                        relative
                        text-4xl
                        transition-all
                        duration-500
                        group-hover:scale-110
                        group-hover:-rotate-6
                        sm:text-6xl
                    "
                >
                    {cover}
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                {/* Type */}
                <div className="absolute left-2 top-2 sm:left-3 sm:top-3">
                    <span
                        className="
                            rounded-full
                            border
                            border-white/10
                            bg-black/50
                            px-2
                            py-0.5
                            text-[10px]
                            font-semibold
                            text-white
                            backdrop-blur-md
                            sm:px-2.5
                            sm:py-1
                            sm:text-[11px]
                        "
                    >
                        {projectType}
                    </span>
                </div>

                {/* Preview */}
                {(audioPreview || videoPreview) && (
                    <button
                        type="button"
                        aria-label={`Preview ${title}`}
                        className="
                            absolute
                            right-2
                            top-2
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            rounded-full
                            bg-white/15
                            text-white
                            backdrop-blur-md
                            transition
                            hover:bg-white/25
                            sm:right-3
                            sm:top-3
                            sm:h-9
                            sm:w-9
                        "
                    >
                        <Play
                            size={13}
                            className="fill-white"
                        />
                    </button>
                )}

                {/* Platform */}
                <div
                    className="
                        absolute
                        bottom-2
                        left-2
                        flex
                        max-w-[calc(100%-1rem)]
                        items-center
                        gap-1.5
                        rounded-full
                        bg-black/55
                        px-2
                        py-0.5
                        text-[10px]
                        font-semibold
                        text-white
                        backdrop-blur-md
                        sm:bottom-3
                        sm:left-3
                        sm:gap-2
                        sm:px-2.5
                        sm:py-1
                        sm:text-[11px]
                    "
                >
                    <span className="shrink-0">{platformIcon}</span>
                    <span className="truncate">{platform}</span>
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col p-3 sm:p-4">

                {/* Title */}
                <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                        <h3 className="truncate text-sm font-bold text-white sm:text-base">
                            {title}
                        </h3>

                        {verified && (
                            <BadgeCheck
                                size={15}
                                className="shrink-0 text-blue-400"
                            />
                        )}
                    </div>

                    <div className="mt-1.5 flex min-w-0 items-center gap-1.5 text-xs text-slate-400 sm:text-sm">
                        <User size={13} className="shrink-0" />
                        <span className="truncate">{artist}</span>
                    </div>

                    <span
                        className="
                            mt-2
                            inline-flex
                            max-w-full
                            truncate
                            rounded-full
                            bg-blue-500/10
                            px-2.5
                            py-0.5
                            text-[11px]
                            font-medium
                            text-blue-400
                            sm:mt-2.5
                            sm:px-3
                            sm:py-1
                            sm:text-xs
                        "
                    >
                        {genre}
                    </span>
                </div>

                {/* Studio & Producer */}
                <div className="mt-3 space-y-2 sm:mt-4">
                    <div className="flex min-w-0 items-center gap-1.5 text-xs text-slate-300 sm:text-sm">
                        <Building2 size={13} className="shrink-0" />
                        <span className="truncate">{studio}</span>
                    </div>

                    <div className="flex min-w-0 items-center gap-1.5 text-xs text-slate-300 sm:text-sm">
                        <Music2 size={13} className="shrink-0" />
                        <span className="truncate">{producer}</span>
                    </div>
                </div>

                {/* Services */}
                <div className="mt-3 flex flex-wrap gap-1.5 sm:mt-4 sm:gap-2">
                    {services.slice(0, 3).map((service) => (
                        <span
                            key={service}
                            className="
                                rounded-full
                                bg-[#202020]
                                px-2
                                py-0.5
                                text-[10px]
                                text-slate-300
                                sm:px-2.5
                                sm:py-1
                                sm:text-[11px]
                            "
                        >
                            {service}
                        </span>
                    ))}

                    {extraServices > 0 && (
                        <span
                            className="
                                rounded-full
                                bg-[#202020]
                                px-2
                                py-0.5
                                text-[10px]
                                text-slate-500
                                sm:px-2.5
                                sm:py-1
                                sm:text-[11px]
                            "
                        >
                            +{extraServices}
                        </span>
                    )}
                </div>

                {/* Stats — consistent icon + label + value styling across all four cells */}
                <div
                    className="
                        mt-3
                        grid
                        grid-cols-2
                        gap-2
                        rounded-xl
                        border
                        border-[#262626]
                        bg-[#1b1b1b]
                        p-2.5
                        sm:mt-4
                        sm:gap-3
                        sm:rounded-2xl
                        sm:p-3
                    "
                >
                    <div>
                        <p className="text-[10px] text-slate-500 sm:text-[11px]">
                            Streams
                        </p>
                        <p className="mt-0.5 text-xs font-semibold text-white sm:mt-1 sm:text-sm">
                            {streams}
                        </p>
                    </div>

                    <div>
                        <p className="text-[10px] text-slate-500 sm:text-[11px]">
                            Likes
                        </p>
                        <p className="mt-0.5 text-xs font-semibold text-white sm:mt-1 sm:text-sm">
                            {likes}
                        </p>
                    </div>

                    <div>
                        <p className="flex items-center gap-1 text-[10px] text-slate-500 sm:gap-1.5 sm:text-[11px]">
                            <Clock3 size={11} />
                            Duration
                        </p>
                        <p className="mt-0.5 truncate text-xs font-semibold text-white sm:mt-1 sm:text-sm">
                            {duration}
                        </p>
                    </div>

                    <div className="min-w-0">
                        <p className="flex items-center gap-1 text-[10px] text-slate-500 sm:gap-1.5 sm:text-[11px]">
                            <Calendar size={11} />
                            Released
                        </p>
                        <p className="mt-0.5 truncate text-xs font-semibold text-white sm:mt-1 sm:text-sm">
                            {releaseDate}
                        </p>
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
                        pt-3
                        sm:pt-4
                    "
                >
                    <div className="flex items-center gap-1.5 text-blue-400 sm:gap-2">
                        <Headphones size={14} className="sm:size-4" />
                        <span className="text-sm font-semibold sm:text-base">
                            View Project
                        </span>
                    </div>

                    <ArrowRight
                        size={16}
                        className="
                            transition-transform
                            duration-300
                            group-hover:translate-x-1
                            sm:size-[18px]
                        "
                    />
                </div>
            </div>
        </Link>
    );
}