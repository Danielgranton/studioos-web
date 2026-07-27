"use client";

import Link from "next/link";
import {
    ArrowRight,
    BadgeCheck,
    Building2,
    Clock3,
    Headphones,
    Heart,
    Play,
} from "lucide-react";
import Image from "next/image";

interface ProjectCardProps {
    slug: string;
    title: string;
    artist: string;
    cover: string;

    genre: string;

    studio: string;
    producer: string;

    streams: string;
    likes: string;
    duration: string;

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
    streams,
    likes,
    duration,
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
                aspect-[4/4.6]
                flex-col
                justify-end
                overflow-hidden
                rounded-2xl
                border
                border-[#272727]
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-blue-500/40
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-blue-500/60
                sm:aspect-[4/4.2]
            "
        >
            {/* Background image */}
            <Image
                src={cover}
                alt={title}
                fill
                sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="
                    object-cover
                    transition-transform
                    duration-500
                    ease-out
                    group-hover:scale-105
                "
            />

            {/* Scrim */}
            <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/5"
            />
            <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/40 to-transparent"
            />

            {/* Top row — type chip + preview button */}
            <div className="absolute inset-x-3 top-3 z-10 flex items-start justify-between gap-2 sm:inset-x-3.5 sm:top-3.5">
                <span
                    className="
                        rounded-full
                        border
                        border-white/15
                        bg-black/50
                        px-2.5
                        py-1
                        text-[9px]
                        font-semibold
                        uppercase
                        tracking-wide
                        text-white
                        backdrop-blur-md
                        sm:text-[10px]
                    "
                >
                    {projectType}
                </span>

                {(audioPreview || videoPreview) && (
                    <button
                        type="button"
                        aria-label={`Preview ${title}`}
                        className="
                            flex
                            h-7
                            w-7
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-white/15
                            text-white
                            backdrop-blur-md
                            transition
                            hover:bg-white/25
                            hover:scale-105
                            sm:h-8
                            sm:w-8
                        "
                    >
                        <Play size={12} className="ml-0.5 fill-white sm:size-[13px]" />
                    </button>
                )}
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col p-4 sm:p-5">

                {/* Genre */}
                <span className="text-[10px] font-semibold uppercase tracking-wide text-blue-400 sm:text-[11px]">
                    {genre}
                </span>

                {/* Title — the visual anchor */}
                <div className="mt-1 flex min-w-0 items-center gap-1.5">
                    <h3 className="truncate text-lg font-bold leading-tight text-white sm:text-xl">
                        {title}
                    </h3>

                    {verified && (
                        <BadgeCheck size={16} className="shrink-0 text-blue-400" />
                    )}
                </div>

                {/* Artist */}
                <p className="mt-0.5 truncate text-xs text-slate-300 sm:text-sm">
                    by {artist}
                </p>

                {/* Studio • Producer */}
                <div className="mt-2.5 flex min-w-0 items-center gap-1.5 text-[11px] text-slate-400 sm:text-xs">
                    <Building2 size={12} className="shrink-0 text-slate-500" />
                    <span className="truncate">
                        {studio} <span className="text-slate-600">•</span> {producer}
                    </span>
                </div>

                {/* Stats */}
                <div className="mt-3.5 flex items-center gap-3 border-t border-white/10 pt-3 text-[11px] text-slate-300 sm:mt-4 sm:pt-3.5">
                    <span className="flex items-center gap-1">
                        <Headphones size={12} />
                        {streams}
                    </span>
                    <span className="flex items-center gap-1">
                        <Heart size={12} className="text-red-400" />
                        {likes}
                    </span>
                    <span className="ml-auto flex shrink-0 items-center gap-1">
                        <Clock3 size={12} />
                        {duration}
                    </span>
                </div>

                {/* Footer */}
                <div className="mt-2.5 flex min-w-0 items-center justify-between gap-2">
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