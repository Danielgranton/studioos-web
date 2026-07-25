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
                min-h-[240px]
                flex-col
                justify-between
                rounded-2xl
                border
                bg-[#171717]
                p-3
                transition-all
                duration-300
                hover:-translate-y-1.5
                hover:border-blue-500/40
                hover:shadow-xl
                hover:shadow-black/30
                sm:min-h-[280px]
                sm:p-4
                lg:min-h-[300px]
                lg:rounded-3xl
                lg:p-5
                ${featured ? "border-blue-500/25" : "border-[#272727]"}
            `}
        >
            {/* Featured tab — sits half outside the card edge, so it needs to live outside the clipped layer below */}
            {featured && (
                <span
                    className="
                        absolute
                        left-4
                        top-0
                        z-10
                        -translate-y-1/2
                        rounded-full
                        border
                        border-orange-500/30
                        bg-[#171717]
                        px-2
                        py-0.5
                        text-[9px]
                        font-semibold
                        uppercase
                        tracking-wide
                        text-orange-400
                        lg:left-5
                        lg:px-2.5
                        lg:text-[10px]
                    "
                >
                    Featured
                </span>
            )}

            {/* Glow — clipped to the card's own rounded corners via this dedicated wrapper, instead of clipping the whole card (which was cutting off the featured tab above) */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl lg:rounded-3xl">
                <div
                    className={`
                        absolute
                        -right-16
                        -top-16
                        h-36
                        w-36
                        rounded-full
                        bg-blue-500/10
                        blur-3xl
                        transition
                        duration-300
                        group-hover:opacity-100
                        lg:-right-20
                        lg:-top-20
                        lg:h-44
                        lg:w-44
                        ${featured ? "opacity-60" : "opacity-0"}
                    `}
                />
            </div>

            {/* Header */}
            <div className="relative flex flex-wrap items-center justify-around ">
                
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-white/20 sm:h-20 sm:w-20 lg:h-24 lg:w-24">
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
                            <h3 className="truncate text-sm font-bold text-white lg:text-base">
                                {name}
                            </h3>

                            {verified && (
                                <BadgeCheck
                                    size={14}
                                    className="shrink-0 text-blue-400 lg:size-4"
                                />
                            )}
                        </div>

                        <p className="mt-1 truncate text-xs text-slate-400 lg:text-sm">
                            {genre}
                        </p>
                    </div>
                

            </div>

            {/* Rating + Projects */}
            <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 lg:mt-3">
                <div className="flex items-center gap-1">
                    <Star
                        size={14}
                        className="fill-yellow-400 text-yellow-400 lg:size-4"
                    />

                    <span className="text-sm font-semibold text-white lg:text-base">
                        {rating}
                    </span>
                    

                    <span className="text-xs text-slate-500 lg:text-sm">
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
                        py-0.5
                        text-[9px]
                        font-semibold
                        text-blue-400
                        lg:px-3
                        lg:py-1
                        lg:text-[11px]
                    "
                >
                    {badge}
                </span>
                </div>
                <div
                    className="
                        flex
                        items-center
                        gap-1.5
                        text-xs
                        text-slate-400
                        lg:gap-2
                        lg:text-sm
                    "
                >
                    <FolderOpen size={13} className="lg:size-[15px]" />

                    <span>
                        {completedProjects.toLocaleString()} projects
                    </span>
                </div>
            </div>

            {/* Skills */}
            <div className="mt-2.5 flex flex-wrap gap-1.5 lg:mt-3 lg:gap-2">
                {skills.map((skill) => (
                    <span
                        key={skill}
                        className="
                            rounded-full
                            bg-[#202020]
                            px-2.5
                            py-0.5
                            text-[10px]
                            text-slate-300
                            lg:px-3
                            lg:py-1
                            lg:text-[11px]
                        "
                    >
                        {skill}
                    </span>
                ))}
            </div>

            {/* Footer */}
            <div
                className="
                    mt-2.5
                    border-t
                    border-[#262626]
                    pt-3
                    lg:mt-3
                    lg:pt-4
                "
            >
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <p className="text-[11px] text-slate-500 lg:text-xs">
                            Starts from
                        </p>

                        <p className="text-sm font-semibold text-white lg:text-base">
                            {priceLabel}
                        </p>
                    </div>

                    <div
                        className="
                            flex
                            items-center
                            gap-1.5
                            text-xs
                            text-slate-400
                            lg:gap-2
                            lg:text-sm
                        "
                    >
                        <Clock3 size={13} className="lg:size-[15px]" />

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
                            text-sm
                            font-semibold
                            text-orange-400
                            lg:text-base
                        "
                    >
                        Hire Producer
                    </span>

                    <ArrowRight
                        size={16}
                        className="
                            transition-transform
                            duration-300
                            group-hover:translate-x-1
                            lg:size-[18px]
                        "
                    />
                </div>
            </div>
        </Link>
    );
}