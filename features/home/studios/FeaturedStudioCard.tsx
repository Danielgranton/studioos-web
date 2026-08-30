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

export function FeaturedStudioCard({
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
                border-[#2a2825]
                bg-[#161513]
                p-2
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-[#e8a33d]/30
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#e8a33d]/60
                sm:rounded-[24px]
                sm:p-3
                lg:rounded-2xl
                lg:p-2.5
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
                    bg-[#e8a33d]/10
                    opacity-0
                    blur-3xl
                    transition-opacity
                    duration-300
                    group-hover:opacity-100
                    sm:block
                    lg:h-32
                    lg:w-32
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
                    bg-[#0e0d0c]
                    sm:aspect-[16/11]
                    sm:rounded-[18px]
                    lg:rounded-2xl
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

                {/* Availability — status color, kept distinct from the brand accent */}
                <div className="absolute left-1.5 top-1.5 sm:left-3 sm:top-3 lg:left-2.5 lg:top-2.5">
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
                            lg:px-2
                            lg:py-0.5
                            lg:text-[9px]
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

                {/* Rating — mono readout, matches the producer card's meter numbers */}
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
                        font-mono
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
                        lg:right-2.5
                        lg:top-2.5
                        lg:px-2
                        lg:py-0.5
                        lg:text-[10px]
                    "
                >
                    <Star size={10} className="fill-[#e8a33d] text-[#e8a33d] sm:size-3 lg:size-[11px]" />
                    {rating.toFixed(1)}
                    <span className="hidden text-[#a19d92] sm:inline">
                        ({reviews})
                    </span>
                </div>

                {/* Price */}
                <div className="absolute bottom-1.5 left-1.5 sm:bottom-3 sm:left-3 lg:bottom-2.5 lg:left-2.5">
                    <div className="rounded-lg bg-black/60 px-2 py-1 backdrop-blur-md sm:rounded-xl sm:px-3 sm:py-1.5 lg:rounded-lg lg:px-2.5 lg:py-1">
                        <p className="hidden font-mono text-[9px] uppercase tracking-wide text-[#c4c0b6] sm:block lg:text-[8px]">
                            From
                        </p>
                        <p className="font-mono text-xs font-bold leading-tight text-white sm:text-sm lg:text-xs">
                            {priceLabel}
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col px-0.5 pb-0.5 pt-2.5 sm:px-1 sm:pb-1 sm:pt-4 lg:pt-3">

                {/* Header */}
                <div className="flex items-start justify-between gap-2 sm:gap-3">
                    <div className="flex min-w-0 items-center gap-1 sm:gap-1.5">
                        <h3 className="truncate text-sm font-semibold tracking-tight text-[#f5f4f1] sm:text-base lg:text-sm">
                            {name}
                        </h3>
                        {verified && (
                            <BadgeCheck size={14} className="shrink-0 text-[#5eead4] sm:size-4 lg:size-[14px]" />
                        )}
                    </div>

                    <span
                        className="
                            hidden
                            shrink-0
                            rounded-full
                            border
                            border-[#e8a33d]/20
                            bg-[#e8a33d]/10
                            px-2.5
                            py-1
                            text-[10px]
                            font-semibold
                            uppercase
                            tracking-wide
                            text-[#e8a33d]
                            sm:inline-block
                            lg:px-2
                            lg:py-0.5
                            lg:text-[9px]
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
                        font-mono
                        text-[11px]
                        text-[#9a978f]
                        sm:mt-2
                        sm:gap-x-4
                        sm:text-xs
                        lg:mt-1.5
                        lg:text-[11px]
                    "
                >
                    <span className="flex min-w-0 items-center gap-1 sm:gap-1.5">
                        <MapPin size={11} className="shrink-0 sm:size-[13px] lg:size-[11px]" />
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
                    <p className="mt-3 hidden line-clamp-2 text-sm leading-6 text-[#a19d92] sm:block lg:mt-2 lg:text-xs lg:leading-5">
                        {services.join(" • ")}
                    </p>
                )}

                {/* Genre tags — patch-cable label style, shared with ProducerCard */}
                {genres.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1 sm:mt-3 sm:gap-1.5 lg:mt-2">
                        {genres.slice(0, 1).map((genre) => (
                            <span
                                key={genre}
                                className="
                                    rounded-md
                                    border
                                    border-[#2a2825]
                                    bg-[#1c1a17]
                                    px-2
                                    py-0.5
                                    text-[9px]
                                    font-medium
                                    text-[#b5b2a8]
                                    transition-colors
                                    group-hover:border-[#3a3630]
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
                                    rounded-md
                                    border
                                    border-[#2a2825]
                                    bg-[#1c1a17]
                                    px-2.5
                                    py-1
                                    text-[10px]
                                    font-medium
                                    text-[#b5b2a8]
                                    transition-colors
                                    group-hover:border-[#3a3630]
                                    sm:inline-block
                                    lg:px-2
                                    lg:py-0.5
                                    lg:text-[9px]
                                "
                            >
                                {genre}
                            </span>
                        ))}
                    </div>
                )}

                {/* Footer */}
                <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-[#2a2825] pt-2 sm:mt-3 sm:pt-2.5 lg:mt-2 lg:pt-2">
                    <span className="hidden truncate font-mono text-[10px] text-[#6b685f] sm:block lg:text-[9px]">
                        {reviews > 0 ? `${reviews} verified reviews` : "New studio"}
                    </span>
                    <span className="font-mono text-[9px] text-[#6b685f] sm:hidden">
                        {reviews > 0 ? `${reviews} reviews` : "New"}
                    </span>

                    <div
                        className="
                            flex
                            shrink-0
                            items-center
                            gap-1
                            rounded-full
                            bg-[#e8a33d]
                            px-2.5
                            py-1
                            text-[10px]
                            font-semibold
                            text-[#161513]
                            transition-all
                            duration-300
                            group-hover:gap-1.5
                            group-hover:bg-[#f0b458]
                            sm:px-3
                            sm:py-1.5
                            sm:text-[11px]
                            lg:px-2.5
                            lg:py-1
                            lg:text-[10px]
                        "
                    >
                        Book
                        <ArrowRight
                            size={11}
                            className="transition-transform duration-300 group-hover:translate-x-0.5 sm:size-3 lg:size-[11px]"
                        />
                    </div>
                </div>

            </div>

        </Link>
    );
}
