"use client";

import Image from "next/image";
import Link from "next/link";
import {
    ArrowRight,
    BadgeCheck,
    MapPin,
    Star,
    Users,
} from "lucide-react";

interface FeaturedStudioCardProps {
    id: number;
    slug: string;
    name: string;
    location: string;
    rating: number;
    reviews: number;
    bookings: number;
    verified: boolean;
    badge: string;
    available: boolean;
    priceLabel: string;
    services: string[];
    genres: string[];
    image: string;
}

export default function FeaturedStudioCard({
    slug,
    name,
    location,
    rating,
    reviews,
    bookings,
    verified,
    badge,
    available,
    priceLabel,
    services,
    genres,
    image,
}: FeaturedStudioCardProps) {
    return (
        <Link
            href={`/studios/${slug}`}
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
                sm:rounded-[24px]
                sm:p-3
            "
        >
            {/* Background glow — desktop-only flourish, skip the cost on mobile */}
            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    -right-16
                    -top-16
                    hidden
                    h-40
                    w-40
                    rounded-full
                    bg-blue-500/10
                    opacity-0
                    blur-3xl
                    transition-opacity
                    duration-300
                    group-hover:opacity-100
                    sm:block
                "
            />

            {/* Studio image */}
            <div
                className="
                    relative
                    aspect-[4/3]
                    w-full
                    overflow-hidden
                    rounded-xl
                    bg-[#0a0a0a]
                    sm:aspect-[16/11]
                    sm:rounded-[18px]
                "
            >
                <Image
                    src={image}
                    alt={`${name} studio`}
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
                    className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-black/20"
                />

                {/* Availability */}
                <div className="absolute left-1.5 top-1.5 sm:left-3 sm:top-3">
                    <span
                        className={`
                            inline-flex
                            items-center
                            gap-1
                            rounded-full
                            px-1.5
                            py-0.5
                            text-[8px]
                            font-semibold
                            text-white
                            backdrop-blur-md
                            sm:gap-1.5
                            sm:px-2.5
                            sm:py-1
                            sm:text-[10px]
                            ${
                                available
                                    ? "bg-emerald-500/90"
                                    : "bg-orange-500/90"
                            }
                        `}
                    >
                        <span className="relative flex h-1 w-1 shrink-0 sm:h-1.5 sm:w-1.5">
                            {available && (
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                            )}
                            <span className="relative inline-flex h-1 w-1 rounded-full bg-white sm:h-1.5 sm:w-1.5" />
                        </span>
                        <span className="hidden sm:inline">
                            {available ? "Available Today" : "Busy"}
                        </span>
                        <span className="sm:hidden">
                            {available ? "Open" : "Busy"}
                        </span>
                    </span>
                </div>

                {/* Rating */}
                <div
                    className="
                        absolute
                        right-1.5
                        top-1.5
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
                        sm:right-3
                        sm:top-3
                        sm:gap-1
                        sm:px-2.5
                        sm:py-1
                        sm:text-[11px]
                    "
                >
                    <Star size={10} className="fill-yellow-400 text-yellow-400 sm:size-3" />
                    {rating.toFixed(1)}
                    <span className="hidden text-[#d4d4d4] sm:inline">
                        ({reviews})
                    </span>
                </div>

                {/* Price */}
                <div className="absolute bottom-1.5 left-1.5 sm:bottom-3 sm:left-3">
                    <div className="rounded-lg bg-black/60 px-2 py-1 backdrop-blur-md sm:rounded-xl sm:px-3 sm:py-1.5">
                        <p className="hidden text-[9px] uppercase tracking-wide text-[#c4c4c4] sm:block">
                            From
                        </p>
                        <p className="text-xs font-bold leading-tight text-white sm:text-sm">
                            {priceLabel}
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col px-0.5 pb-0.5 pt-2.5 sm:px-1 sm:pb-1 sm:pt-4">

                {/* Header */}
                <div className="flex items-start justify-between gap-2 sm:gap-3">
                    <div className="flex min-w-0 items-center gap-1 sm:gap-1.5">
                        <h3 className="truncate text-sm font-bold text-white sm:text-base">
                            {name}
                        </h3>
                        {verified && (
                            <BadgeCheck size={14} className="shrink-0 text-blue-400 sm:size-4" />
                        )}
                    </div>

                    <span
                        className="
                            hidden
                            shrink-0
                            rounded-full
                            bg-blue-500/10
                            px-2.5
                            py-1
                            text-[10px]
                            font-semibold
                            text-blue-400
                            sm:inline-block
                        "
                    >
                        {badge}
                    </span>
                </div>

                {/* Location + bookings */}
                <div
                    className="
                        mt-1.5
                        flex
                        flex-wrap
                        items-center
                        gap-x-3
                        gap-y-1
                        text-[11px]
                        text-[#8a8a8a]
                        sm:mt-2
                        sm:gap-x-4
                        sm:text-xs
                    "
                >
                    <span className="flex min-w-0 items-center gap-1 sm:gap-1.5">
                        <MapPin size={11} className="shrink-0 sm:size-[13px]" />
                        <span className="truncate">{location}</span>
                    </span>

                    {bookings > 0 && (
                        <span className="hidden items-center gap-1.5 sm:flex">
                            <Users size={13} />
                            {bookings.toLocaleString()} bookings
                        </span>
                    )}
                </div>

                {/* Services — desktop/tablet only, too cramped on 2-up mobile */}
                {services.length > 0 && (
                    <p className="mt-3 hidden line-clamp-2 text-sm leading-6 text-[#9a9a9a] sm:block">
                        {services.join(" • ")}
                    </p>
                )}

                {/* Genre tags — show just one on mobile, up to 3 from sm */}
                {genres.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1 sm:mt-3 sm:gap-1.5">
                        {genres.slice(0, 1).map((genre) => (
                            <span
                                key={genre}
                                className="
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
                                    sm:hidden
                                "
                            >
                                {genre}
                            </span>
                        ))}
                        {genres.slice(0, 3).map((genre) => (
                            <span
                                key={`${genre}-desktop`}
                                className="
                                    hidden
                                    rounded-full
                                    border
                                    border-[#2c2c2c]
                                    bg-[#1c1c1c]
                                    px-2.5
                                    py-1
                                    text-[10px]
                                    font-medium
                                    text-[#c4c4c4]
                                    transition-colors
                                    group-hover:border-[#3a3a3a]
                                    sm:inline-block
                                "
                            >
                                {genre}
                            </span>
                        ))}
                    </div>
                )}

                {/* Footer */}
<div className="mt-2.5 flex items-center justify-between gap-2 border-t border-[#232323] pt-2 sm:mt-3 sm:pt-2.5">
    <span className="hidden truncate text-[10px] text-[#717171] sm:block">
        {reviews > 0 ? `${reviews} verified reviews` : "New studio"}
    </span>
    <span className="text-[9px] text-[#717171] sm:hidden">
        {reviews > 0 ? `${reviews} reviews` : "New"}
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
            text-[10px]
            font-semibold
            text-white
            transition-all
            duration-300
            group-hover:gap-1.5
            group-hover:bg-blue-500
            sm:px-3
            sm:py-1.5
            sm:text-[11px]
        "
    >
        Book
        <ArrowRight
            size={11}
            className="transition-transform duration-300 group-hover:translate-x-0.5 sm:size-3"
        />
    </div>
</div>

            </div>

        </Link>
    );
}