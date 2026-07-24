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
                rounded-[24px]
                border
                border-[#272727]
                bg-[#171717]
                p-4
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-blue-500/40
                hover:bg-[#1b1b1b]
                hover:shadow-[0_20px_60px_rgba(37,99,235,0.15)]
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-blue-500/60
            "
        >
            {/* Background Glow */}

            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    -right-16
                    -top-16
                    h-40
                    w-40
                    rounded-full
                    bg-blue-500/10
                    blur-3xl
                    opacity-0
                    transition-opacity
                    duration-300
                    group-hover:opacity-100
                "
            />

            {/* Studio Image */}

            <div
                className="
                    relative
                    aspect-[16/11]
                    w-full
                    overflow-hidden
                    rounded-[18px]
                "
            >
                <Image
                    src={image}
                    alt={`${name} studio`}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="
                        object-cover
                        transition-transform
                        duration-500
                        group-hover:scale-105
                    "
                />

                <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"
                />

                {/* Availability */}

                <div className="absolute left-3 top-3">

                    <span
                        className={`
                            rounded-full
                            px-3
                            py-1
                            text-[10px]
                            font-semibold
                            text-white
                            backdrop-blur-md
                            ${
                                available
                                    ? "bg-emerald-500/90"
                                    : "bg-orange-500/90"
                            }
                        `}
                    >
                        {available ? "Available Today" : "Busy"}
                    </span>

                </div>

                {/* Rating */}

                <div
                    className="
                        absolute
                        right-3
                        top-3
                        flex
                        items-center
                        gap-1
                        rounded-full
                        bg-black/60
                        px-3
                        py-1
                        text-[11px]
                        font-semibold
                        text-white
                        backdrop-blur-md
                    "
                >
                    <Star
                        size={12}
                        className="fill-yellow-400 text-yellow-400"
                    />

                    {rating.toFixed(1)}

                    <span className="text-[#d4d4d4]">
                        ({reviews})
                    </span>

                </div>

            </div>

            {/* Content */}

            <div className="mt-4 flex flex-1 flex-col">

                {/* Header */}

                <div className="flex items-center justify-between gap-3">

                    <div className="flex items-center gap-2">

                        <h3 className="text-base font-bold text-white">
                            {name}
                        </h3>

                        {verified && (
                            <BadgeCheck
                                size={16}
                                className="text-blue-400"
                            />
                        )}

                    </div>

                    <span
                        className="
                            shrink-0
                            rounded-full
                            bg-blue-500/10
                            px-2.5
                            py-1
                            text-[10px]
                            font-semibold
                            text-blue-400
                        "
                    >
                        {badge}
                    </span>

                </div>

                {/* Location + bookings */}

                <div
                    className="
                        mt-2
                        flex
                        flex-wrap
                        items-center
                        gap-x-4
                        gap-y-1
                        text-xs
                        text-[#aaaaaa]
                    "
                >
                    <span className="flex items-center gap-1.5">
                        <MapPin size={14} />
                        {location}
                    </span>

                    {bookings > 0 && (
                        <span className="flex items-center gap-1.5">
                            <Users size={14} />
                            {bookings.toLocaleString()} bookings
                        </span>
                    )}

                </div>

                {/* Services */}

                {services.length > 0 && (
                    <p
                        className="
                            mt-3
                            line-clamp-2
                            text-sm
                            leading-6
                            text-[#aaaaaa]
                        "
                    >
                        {services.join(" • ")}
                    </p>
                )}

                {/* Genre tags */}

                {genres.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">

                        {genres.slice(0, 3).map((genre) => (
                            <span
                                key={genre}
                                className="
                                    rounded-full
                                    border
                                    border-[#333]
                                    bg-[#202020]
                                    px-2.5
                                    py-1
                                    text-[10px]
                                    font-medium
                                    text-[#d4d4d4]
                                "
                            >
                                {genre}
                            </span>
                        ))}

                    </div>
                )}

                {/* Divider */}

                <div className="my-4 border-t border-[#272727]" />

                {/* Footer */}

                <div className="mt-auto flex items-center justify-between">

                    <div>

                        <p className="text-[11px] text-[#717171]">
                            Starting from
                        </p>

                        <p className="mt-1 text-sm font-bold text-white">
                            {priceLabel}
                        </p>

                    </div>

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                            rounded-full
                            bg-blue-600
                            px-4
                            py-2
                            text-xs
                            font-semibold
                            text-white
                            transition-all
                            duration-300
                            group-hover:bg-blue-500
                            group-hover:gap-3
                        "
                    >
                        Book

                        <ArrowRight
                            size={15}
                            className="
                                translate-x-0
                                transition-transform
                                duration-300
                                group-hover:translate-x-1
                            "
                        />
                    </div>

                </div>

            </div>

        </Link>
    );
}