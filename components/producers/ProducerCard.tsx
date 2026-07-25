"use client";

import Image from "next/image";
import Link from "next/link";
import {
    ArrowRight,
    BadgeCheck,
    Clock3,
    FolderOpen,
    Star,
} from "lucide-react";

interface ProducerCardProps {
    id: number;
    slug: string;
    name: string;
    avatar: string;
    verified: boolean;
    featured: boolean;
    genre: string;
    rating: number;
    reviews: number;
    completedProjects: number;
    responseTime: string;
    priceLabel: string;
    badge: string;
    skills: string[];
}

export default function ProducerCard({
    slug,
    name,
    avatar,
    verified,
    featured,
    genre,
    rating,
    reviews,
    completedProjects,
    responseTime,
    priceLabel,
    badge,
    skills,
}: ProducerCardProps) {
    return (
        <Link
            href={`/producers/${slug}`}
            className={`
                group
                relative
                flex
                min-h-[280px]
                flex-col
                justify-between
                rounded-2xl
                border
                bg-[#171717]
                p-4
                transition-all
                duration-300
                hover:-translate-y-1.5
                hover:border-blue-500/40
                hover:shadow-xl
                hover:shadow-black/30
                sm:min-h-[300px]
                sm:rounded-3xl
                sm:p-5
                ${featured ? "border-blue-500/25" : "border-[#272727]"}
            `}
        >
            {/* Featured tab — sits half outside the card edge, so it needs to live outside the clipped layer below */}
            {featured && (
                <span
                    className="
                        absolute
                        left-5
                        top-0
                        z-10
                        -translate-y-1/2
                        rounded-full
                        border
                        border-orange-500/30
                        bg-[#171717]
                        px-2.5
                        py-0.5
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-wide
                        text-orange-400
                    "
                >
                    Featured
                </span>
            )}

            {/* Glow — clipped to the card's own rounded corners via this dedicated wrapper, instead of clipping the whole card (which was cutting off the featured tab above) */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl sm:rounded-3xl">
                <div
                    className={`
                        absolute
                        -right-20
                        -top-20
                        h-44
                        w-44
                        rounded-full
                        bg-blue-500/10
                        blur-3xl
                        transition
                        duration-300
                        group-hover:opacity-100
                        ${featured ? "opacity-60" : "opacity-0"}
                    `}
                />
            </div>

            {/* Header */}
            <div className="relative flex flex-wrap items-center justify-around ">
                
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full sm:h-30 sm:w-30 border border-white/20">
                        <Image
                            src={avatar}
                            alt={name}
                            fill
                            className="
                                object-cover
                                transition-transform
                                duration-500
                                group-hover:scale-110
                            "
                        />
                    </div>

                    <div className="min-w-0">
                        <div className="flex items-center gap-1">
                            <h3 className="truncate text-sm font-bold text-white sm:text-base">
                                {name}
                            </h3>

                            {verified && (
                                <BadgeCheck
                                    size={16}
                                    className="shrink-0 text-blue-400"
                                />
                            )}
                        </div>

                        <p className="mt-1 truncate text-sm text-slate-400">
                            {genre}
                        </p>
                    </div>
                

            </div>

            {/* Rating + Projects */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 sm:mt-3">
                <div className="flex items-center gap-1">
                    <Star
                        size={16}
                        className="fill-yellow-400 text-yellow-400"
                    />

                    <span className="font-semibold text-white">
                        {rating}
                    </span>
                    

                    <span className="text-sm text-slate-500">
                        ({reviews})
                    </span>
                </div>
                 <div>
                    <span
                    className="
                        shrink-0
                        whitespace-nowrap
                        rounded-full
                        bg-blue-500/10
                        px-2
                        py-1
                        text-[10px]
                        font-semibold
                        text-blue-400
                        sm:px-3
                        sm:text-[11px]
                    "
                >
                    {badge}
                </span>
                </div>
                <div
                    className="
                        flex
                        items-center
                        gap-2
                        text-xs
                        text-slate-400
                        sm:text-sm
                    "
                >
                    <FolderOpen size={15} />

                    <span>
                        {completedProjects.toLocaleString()} projects
                    </span>
                </div>
            </div>

            {/* Skills */}
            <div className="mt-3 flex flex-wrap gap-2 sm:mt-3">
                {skills.map((skill) => (
                    <span
                        key={skill}
                        className="
                            rounded-full
                            bg-[#202020]
                            px-3
                            py-1
                            text-[11px]
                            text-slate-300
                        "
                    >
                        {skill}
                    </span>
                ))}
            </div>

            {/* Footer */}
            <div
                className="
                    mt-3
                    border-t
                    border-[#262626]
                    pt-4
                    sm:mt-3
                "
            >
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <p className="text-xs text-slate-500">
                            Starts from
                        </p>

                        <p className="font-semibold text-white">
                            {priceLabel}
                        </p>
                    </div>

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                            text-xs
                            text-slate-400
                            sm:text-sm
                        "
                    >
                        <Clock3 size={15} />

                        <span>{responseTime}</span>
                    </div>
                </div>

                <div
                    className="
                        mt-2
                        flex
                        items-center
                        justify-between
                    "
                >
                    <span
                        className="
                            font-semibold
                            text-orange-400
                        "
                    >
                        Hire Producer
                    </span>

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