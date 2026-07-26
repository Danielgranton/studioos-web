"use client";

import Link from "next/link";
import {
    ArrowRight,
    BadgeCheck,
    Building2,
    Calendar,
    Clock3,
    Headphones,
    Heart,
    Play,
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
    const extraServices = services.length - 2;

    return (
        <Link
            href={`/projects/${slug}`}
            className="
                group
                relative
                flex
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
                sm:rounded-2xl
            "
        >
            {/* Cover */}
            <div
                className="
                    relative
                    flex
                    aspect-[16/9]
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
                        h-32
                        w-32
                        rounded-full
                        bg-blue-500/10
                        blur-3xl
                        transition-all
                        duration-500
                        group-hover:scale-125
                        group-hover:bg-blue-500/20
                        sm:h-44
                        sm:w-44
                    "
                />

                {/* Emoji */}
                <div
                    className="
                        relative
                        text-3xl
                        transition-all
                        duration-500
                        group-hover:scale-110
                        group-hover:-rotate-6
                        sm:text-5xl
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
                            h-7
                            w-7
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
                            sm:h-8
                            sm:w-8
                        "
                    >
                        <Play
                            size={12}
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
                <div className="flex min-w-0 items-center gap-1.5">
                    <h3 className="truncate text-sm font-bold text-white sm:text-base">
                        {title}
                    </h3>

                    {verified && (
                        <BadgeCheck
                            size={14}
                            className="shrink-0 text-blue-400"
                        />
                    )}
                </div>

                {/* Artist • Genre — merged onto one line instead of two */}
                <p className="mt-1 truncate text-xs text-slate-400 sm:text-sm">
                    {artist} <span className="text-slate-600">•</span>{" "}
                    <span className="text-blue-400">{genre}</span>
                </p>

                {/* Studio • Producer — merged onto one line instead of two */}
                <div className="mt-2 flex min-w-0 items-center gap-1.5 text-xs text-slate-300 sm:text-sm">
                    <Building2 size={13} className="shrink-0" />
                    <span className="truncate">
                        {studio} <span className="text-slate-600">•</span>{" "}
                        {producer}
                    </span>
                </div>

                {/* Services — capped at 2 + overflow count, was 3 */}
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {services.slice(0, 2).map((service) => (
                        <span
                            key={service}
                            className="
                                rounded-full
                                bg-[#202020]
                                px-2
                                py-0.5
                                text-[10px]
                                text-slate-300
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
                                sm:text-[11px]
                            "
                        >
                            +{extraServices}
                        </span>
                    )}
                </div>

                {/* Stats — one compact row instead of a bordered 2x2 box */}
                <div className="mt-3 flex items-center  border-t border-[#262626] pt-2 text-[11px] text-slate-400 sm:gap-4 sm:text-xs">
                    <span className="flex items-center gap-1">
                        <Headphones size={12} />
                        {streams}
                    </span>
                    <span className="flex items-center gap-1">
                        <Heart size={12} className="text-red-400" />
                        {likes}
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock3 size={12} />
                        {duration}
                    </span>
                    <span className="ml-auto flex shrink-0 items-center gap-1">
                        <Calendar size={12} />
                        {releaseDate}
                    </span>
                </div>

                <div className="mt-2 flex min-w-0 items-center justify-between gap-2">
                    <span className="truncate text-xs font-semibold text-blue-400 sm:text-sm">
                        View Project
                    </span>

                    <span
                        className="
                            flex
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-blue-500/10
                            text-blue-400
                            transition-all
                            duration-300
                            group-hover:bg-blue-500/20
                            group-hover:translate-x-0.5
                        "
                    >
                        <ArrowRight size={13} className="sm:size-[15px]" />
                    </span>
                </div>
            </div>
        </Link>
    );
}