"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BadgeCheck, Building2, Clock3, Layers3, MapPin, Star } from "lucide-react";
import { useEffect, useState } from "react";

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

const PRODUCTION_SERVICE_ORDER = [
    ["beat creation", "beat production", "beat making"],
    ["recording", "vocal recording"],
    ["mixing", "mix and"],
    ["mastering", "master"],
];

function orderPackageServices(services: string[]) {
    return services
        .map((service, index) => ({ service, index }))
        .sort((a, b) => {
            const getOrder = (name: string) => PRODUCTION_SERVICE_ORDER.findIndex((aliases) =>
                aliases.some((alias) => name.trim().toLowerCase() === alias || name.trim().toLowerCase().startsWith(`${alias} `)),
            );
            const orderA = getOrder(a.service);
            const orderB = getOrder(b.service);
            return (orderA < 0 ? PRODUCTION_SERVICE_ORDER.length : orderA)
                - (orderB < 0 ? PRODUCTION_SERVICE_ORDER.length : orderB)
                || a.index - b.index;
        })
        .map(({ service }) => service);
}

function compactCount(value: number) {
    return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

function Waveform() {
    const bars = [3, 6, 4, 8, 5, 3, 7, 4, 2, 6, 4, 2];

    return (
        <div aria-hidden="true" className="flex h-2.5 items-end justify-end gap-[2px] opacity-40 transition-opacity group-hover:opacity-100">
            {bars.map((height, index) => (
                <span
                    key={index}
                    className="w-[1.5px] rounded-full bg-[#e8a33d] transition-all duration-300 group-hover:animate-pulse"
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
    const orderedServices = orderPackageServices(services);
    const [avatarSrc, setAvatarSrc] = useState(avatar || "/images/avatar.png");

    useEffect(() => {
        setAvatarSrc(avatar || "/images/avatar.png");
    }, [avatar]);

    return (
        <Link
            href={profileHref}
            className="group relative flex min-h-[250px] flex-col justify-between overflow-hidden rounded-xl border border-[#2a2825] bg-[#161513] p-3.5 transition-all duration-300 hover:-translate-y-1 hover:border-[#e8a33d]/30 hover:shadow-2xl hover:shadow-black/40"
        >
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#e8a33d] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-40" />

            <div className="relative grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-x-2 sm:gap-x-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-white/10 ring-1 ring-white/[0.04] transition-colors group-hover:border-[#e8a33d]/40 sm:h-[72px] sm:w-[72px]">
                    <Image
                        src={avatarSrc}
                        alt={name}
                        fill
                        sizes="72px"
                        unoptimized
                        onError={() => {
                            if (avatarSrc !== "/images/avatar.png") setAvatarSrc("/images/avatar.png");
                        }}
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                </div>

                <div className="min-w-0 pt-0.5">
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

                <div className="ml-1 flex w-9 shrink-0 flex-col items-end gap-1.5 pt-1 sm:ml-3 sm:w-14 sm:pt-1.5">
                    <Waveform />
                    <span className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[7px] font-semibold uppercase tracking-[0.08em] sm:px-2 sm:text-[8px] ${available ? "bg-emerald-400/10 text-emerald-300" : "bg-[#27231e] text-[#8f887c]"}`}>
                        <span className={`h-1 w-1 shrink-0 rounded-full ${available ? "bg-emerald-300" : "bg-[#777168]"}`} />
                        {available ? "Open" : "Busy"}
                    </span>
                </div>
            </div>

            <div className="relative mt-3 flex items-stretch gap-1 sm:gap-1.5">
                <div aria-label={`${rating.toFixed(1)} rating from ${reviews} reviews`} className="relative flex min-w-0 flex-1 flex-col items-center justify-center overflow-hidden rounded-md border border-[#e8a33d]/20 bg-gradient-to-b from-[#241f17] to-[#171512] px-0.5 py-1.5 text-center shadow-inner shadow-black/20">
                    <span aria-hidden="true" className="absolute inset-x-2 top-0 h-px bg-gradient-to-r from-transparent via-[#e8a33d]/70 to-transparent" />
                    <span className="flex items-center gap-0.5 font-mono text-[11px] font-bold tabular-nums text-[#f5f1e8] sm:text-xs"><Star size={9} className="fill-[#e8a33d] text-[#e8a33d]" />{rating.toFixed(1)}</span>
                    <span className="mt-0.5 truncate text-[7px] font-semibold uppercase tracking-[0.08em] text-[#a49b8a] sm:text-[8px]">Rating</span>
                </div>
                <div className="flex min-w-0 flex-1 flex-col items-center justify-center rounded-md border border-white/[0.06] bg-[#11100e] px-0.5 py-1.5 text-center transition-colors group-hover:border-white/[0.1]">
                    <span className="font-mono text-[11px] font-bold tabular-nums text-[#e7e3db] sm:text-xs">{compactCount(followerCount)}</span>
                    <span className="mt-0.5 truncate text-[7px] font-semibold uppercase tracking-[0.08em] text-[#777168] sm:text-[8px]">Fans</span>
                </div>
                <div className="flex min-w-0 flex-1 flex-col items-center justify-center rounded-md border border-white/[0.06] bg-[#11100e] px-0.5 py-1.5 text-center transition-colors group-hover:border-white/[0.1]">
                    <span className="font-mono text-[11px] font-bold tabular-nums text-[#e7e3db] sm:text-xs">{compactCount(releaseCount)}</span>
                    <span className="mt-0.5 block w-full max-w-full truncate text-[7px] font-semibold uppercase leading-none tracking-[0.04em] text-[#777168] sm:hidden">{creatorLabel === "producer" ? "Prod." : "Rel."}</span>
                    <span className="mt-0.5 hidden w-full max-w-full truncate text-[8px] font-semibold uppercase leading-none tracking-[0.08em] text-[#777168] sm:block">{workLabel}</span>
                </div>
                {creatorLabel === "producer" && <div className="flex min-w-0 flex-1 flex-col items-center justify-center rounded-md border border-white/[0.06] bg-[#11100e] px-0.5 py-1.5 text-center transition-colors group-hover:border-white/[0.1]">
                    <span className="font-mono text-[11px] font-bold tabular-nums text-[#e7e3db] sm:text-xs">{compactCount(beatCount)}</span>
                    <span className="mt-0.5 truncate text-[7px] font-semibold uppercase tracking-[0.08em] text-[#777168] sm:text-[8px]">Beats</span>
                </div>}
            </div>

            {(servicesTitle || creatorLabel === "producer") && <p className="relative mt-3 flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#6b685f]">{creatorLabel === "producer" && <Layers3 size={11} className="text-[#e8a33d]" />}{servicesTitle || "Production package services"}</p>}
            <div className={`${servicesTitle || creatorLabel === "producer" ? "mt-1.5" : "mt-3"} relative flex flex-wrap gap-1.5`}>
                {orderedServices.filter((_, index) => creatorLabel === "producer" || index < 3).map((service) => (
                    <span key={service} className="rounded-md border border-[#2a2825] bg-[#1c1a17] px-2 py-0.5 text-[10px] text-[#b5b2a8]">
                        {service}
                    </span>
                ))}
                {creatorLabel === "producer" && showPrice && <span className="inline-flex items-center rounded-md border border-[#e8a33d]/25 bg-[#e8a33d]/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-[#f0bd65]">{priceLabel}</span>}
                {creatorLabel === "producer" && orderedServices.length === 0 && <span className="text-[10px] text-[#666]">No package services listed</span>}
                {servicesTitle && services.length === 0 && <span className="text-[10px] text-[#666]">No services listed</span>}
            </div>

            <div className="relative mt-4 border-t border-[#2a2825] pt-3">
                <div className="flex flex-col items-start gap-2">
                        {showPrice && creatorLabel !== "producer" && <div className="min-w-0 max-w-full">
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
