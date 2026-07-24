"use client";

import Image from "next/image";
import Link from "next/link";
import {
    ArrowRight,
    BadgeCheck,
    MapPin,
    Star,
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
    verified,
    badge,
    available,
    priceLabel,
    services,
    image,
}: FeaturedStudioCardProps) {
    return (
        <Link
            href={`/studios/${slug}`}
            className="
                group
                overflow-hidden
                rounded-[30px]
                bg-[#161616]
                shadow-[0_10px_40px_rgba(0,0,0,0.35)]
                transition-all
                duration-500
                hover:-translate-y-2
                hover:shadow-[0_30px_80px_rgba(37,99,235,.18)]
            "
        >
            {/* Cover */}

            <div className="relative h-72 overflow-hidden">

                <Image
                    src={image}
                    alt={name}
                    fill
                    className="
                        object-cover
                        transition-transform
                        duration-700
                        group-hover:scale-110
                    "
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                {/* Badge */}

                <div className="absolute left-5 top-5">

                    <span
                        className="
                            rounded-full
                            bg-blue-600/90
                            px-4
                            py-1.5
                            text-xs
                            font-semibold
                            text-white
                            backdrop-blur-xl
                        "
                    >
                        {badge}
                    </span>

                </div>

                {/* Availability */}

                <div className="absolute right-5 top-5">

                    <span
                        className={`
                            rounded-full
                            px-4
                            py-1.5
                            text-xs
                            font-semibold
                            text-white
                            backdrop-blur-xl
                            ${
                                available
                                    ? "bg-emerald-500/90"
                                    : "bg-orange-500/90"
                            }
                        `}
                    >
                        {available ? "Available" : "Busy"}
                    </span>

                </div>

                {/* Floating Content */}

                <div
                    className="
                        absolute
                        bottom-5
                        left-5
                        right-5
                        rounded-3xl
                        border
                        border-white/10
                        bg-black/45
                        p-5
                        backdrop-blur-xl
                    "
                >

                    <div className="flex items-start justify-between">

                        <div>

                            <div className="flex items-center gap-2">

                                <h3 className="text-xl font-bold text-white">
                                    {name}
                                </h3>

                                {verified && (
                                    <BadgeCheck
                                        size={18}
                                        className="text-sky-400"
                                    />
                                )}

                            </div>

                            <div
                                className="
                                    mt-2
                                    flex
                                    items-center
                                    gap-2
                                    text-sm
                                    text-slate-300
                                "
                            >
                                <MapPin size={14} />

                                {location}

                            </div>

                        </div>

                        <div
                            className="
                                flex
                                items-center
                                gap-1
                                rounded-full
                                bg-white/10
                                px-3
                                py-1.5
                                text-sm
                                font-semibold
                                text-white
                            "
                        >
                            <Star
                                size={14}
                                className="fill-yellow-400 text-yellow-400"
                            />

                            {rating}

                            <span className="text-slate-300">
                                ({reviews})
                            </span>

                        </div>

                    </div>

                </div>

            </div>

            {/* Bottom */}

            <div className="space-y-5 p-6">

                {/* Services */}

                <p
                    className="
                        text-sm
                        leading-7
                        text-slate-400
                    "
                >
                    {services.join(" • ")}
                </p>

                {/* Footer */}

                <div
                    className="
                        flex
                        items-center
                        justify-between
                    "
                >

                    <div>

                        <p className="text-xs text-slate-500">
                            Starting from
                        </p>

                        <p
                            className="
                                mt-1
                                text-lg
                                font-bold
                                text-white
                            "
                        >
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
                            px-5
                            py-3
                            text-sm
                            font-semibold
                            text-white
                            transition
                            group-hover:bg-blue-500
                        "
                    >
                        Book

                        <ArrowRight
                            size={16}
                            className="
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