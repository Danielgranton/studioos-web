"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BadgeCheck, Building2, Clock3, MapPin, Star } from "lucide-react";

export interface ProducerCardProps {
    id: number;
    slug: string;
    name: string;
    avatar: string;
    verified: boolean;
    genre: string;
    location: string;
    studioNames: string[];
    available: boolean;
    rating: number;
    reviews: number;
    followerCount?: number;
    releaseCount?: number;
    beatCount?: number;
    popularityScore?: number;
    trendingScore?: number;
    featured?: boolean;
    responseTime: string;
    priceLabel: string;
    badge: string;
    services: string[];
    profileHref?: string;
    creatorLabel?: string;
    showGenre?: boolean;
    showPrice?: boolean;
    servicesTitle?: string;
}

function Waveform() {
    const bars = [4, 9, 6, 13, 8, 5, 11, 7, 4, 9, 6, 3];

    return (
        <div aria-hidden="true" className="flex h-4 items-end gap-[2px] opacity-40 transition-opacity group-hover:opacity-100">
            {bars.map((height, index) => (
                <span
                    key={index}
                    className="w-[2px] rounded-full bg-[#e8a33d] transition-all duration-300 group-hover:animate-pulse"
                    style={{ height: `${height}px`, animationDelay: `${index * 18}ms` }}
                />
            ))}
        </div>
    );
}

export function ProducerCard({
    id,
    name,
    avatar,
    verified,
    genre,
    location,
    studioNames,
    available,
    rating,
    reviews,
    followerCount = 0,
    releaseCount = 0,
    beatCount = 0,
    responseTime,
    priceLabel,
    badge,
    services,
    profileHref = `/producers/${id}`,
    creatorLabel = "producer",
    showGenre = true,
    showPrice = true,
    servicesTitle,
}: ProducerCardProps) {
    const workLabel = creatorLabel === "artist" ? "releases" : "produced";

    return (
        <Link
            href={profileHref}
            className="group relative flex min-h-[250px] flex-col justify-between overflow-hidden rounded-xl border border-[#2a2825] bg-[#161513] p-3.5 transition-all duration-300 hover:-translate-y-1 hover:border-[#e8a33d]/30 hover:shadow-2xl hover:shadow-black/40"
        >
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#e8a33d] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-40" />

            <div className="relative flex items-start gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-white/10">
                    <Image
                        src={avatar}
                        alt={name}
                        fill
                        sizes="56px"
                        unoptimized
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                        <h3 className="line-clamp-2 break-words text-sm font-semibold leading-5 tracking-tight text-[#f5f4f1]">
                            {name}
                        </h3>
                        {verified && <BadgeCheck size={14} className="shrink-0 text-[#5eead4]" />}
                    </div>
                    {showGenre && <p className="mt-0.5 truncate text-[11px] text-[#9a978f]">{genre}</p>}
                    <p className="mt-1 flex items-center gap-1 truncate text-[10px] text-[#6b685f]">
                        <MapPin size={10} />
                        {location}
                    </p>
                    {studioNames.length > 0 && (
                        <p className="mt-1 flex items-center gap-1 truncate text-[10px] text-[#8f887c]">
                            <Building2 size={10} className="shrink-0 text-[#e8a33d]" />
                            <span className="truncate">{studioNames[0]}</span>
                            {studioNames.length > 1 && <span className="shrink-0 text-[#6b685f]">+{studioNames.length - 1} more</span>}
                        </p>
                    )}
                </div>

                <Waveform />
            </div>

            <div className="relative mt-4 flex items-center justify-between gap-2 font-mono text-xs">
                <div className="flex items-center gap-1.5 text-[#f5f4f1]">
                    <Star size={13} className="fill-[#e8a33d] text-[#e8a33d]" />
                    <span className="font-semibold">{rating.toFixed(1)}</span>
                    <span className="text-[10px] text-[#6b685f]">({reviews})</span>
                </div>

                <span className={`rounded-full px-2 py-1 text-[9px] font-semibold uppercase tracking-wide ${available ? "bg-emerald-400/10 text-emerald-300" : "bg-[#27231e] text-[#8f887c]"}`}>
                    {available ? "Available" : "Busy"}
                </span>
            </div>

            {servicesTitle && <p className="relative mt-3 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#6b685f]">{servicesTitle}</p>}
            <div className={`${servicesTitle ? "mt-1.5" : "mt-3"} relative flex flex-wrap gap-1.5`}>
                {services.slice(0, 3).map((service) => (
                    <span key={service} className="rounded-md border border-[#2a2825] bg-[#1c1a17] px-2 py-0.5 text-[10px] text-[#b5b2a8]">
                        {service}
                    </span>
                ))}
                {servicesTitle && services.length === 0 && <span className="text-[10px] text-[#666]">No services listed</span>}
            </div>

            <div className="relative mt-3 flex items-center gap-3 text-[10px] text-[#8f887c]">
                <span>{followerCount.toLocaleString()} followers</span>
                <span className="h-1 w-1 rounded-full bg-[#4b473f]" />
                <span>{releaseCount.toLocaleString()} {workLabel}</span>
                {creatorLabel === "producer" && (
                    <>
                        <span className="h-1 w-1 rounded-full bg-[#4b473f]" />
                        <span>{beatCount.toLocaleString()} beats</span>
                    </>
                )}
            </div>

            <div className="relative mt-4 border-t border-[#2a2825] pt-3">
                <div className="flex flex-col items-start gap-2">
                        {showPrice && <div className="min-w-0 max-w-full flex items-center gap-5">
                            <p className="font-mono text-[9px] uppercase tracking-wider text-[#6b685f]">Starting at</p>
                            <p className="mt-1 inline-flex max-w-full rounded-md border border-[#e8a33d]/25 bg-[#e8a33d]/10 px-2 py-1 text-xs font-semibold text-[#f0bd65]">{priceLabel}</p>
                        </div>}
                    <div className="flex items-center gap-1 font-mono text-[10px] text-[#9a978f]">
                        <Clock3 size={12} />
                        <span>{responseTime}</span>
                    </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#e8a33d]">View {creatorLabel}</span>
                    <span className="flex items-center gap-1 text-[10px] text-[#e8a33d]">
                        {badge}
                        <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                </div>
            </div>
        </Link>
    );
}
