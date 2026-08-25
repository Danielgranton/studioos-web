"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Clock3, FolderOpen, Star, ArrowUpRight } from "lucide-react";

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

// Deterministic little "waveform" so it doesn't jump every render
function Waveform({ active }: { active: boolean }) {
    const bars = [4, 9, 6, 13, 8, 5, 11, 7, 4, 9, 6, 3];
    return (
        <div className="flex h-4 items-end gap-[2px]">
            {bars.map((h, i) => (
                <span
                    key={i}
                    className="w-[2px] rounded-full bg-[#e8a33d] transition-all duration-300 ease-out"
                    style={{
                        height: active ? `${h}px` : "3px",
                        opacity: active ? 1 : 0.35,
                        transitionDelay: `${i * 18}ms`,
                    }}
                />
            ))}
        </div>
    );
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
    const [hover, setHover] = useState(false);

    return (
        <Link
            href={`/producers/${slug}`}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            className={`
                group
                relative
                flex
                min-h-[280px]
                flex-col
                justify-between
                overflow-hidden
                rounded-xl
                border
                bg-[#161513]
                p-4
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-2xl
                hover:shadow-black/40
                ${featured ? "border-[#e8a33d]/30" : "border-[#2a2825]"}
            `}
        >
            {/* hairline "tape" accent at top instead of a glow blob */}
            <div
                className={`
                    absolute
                    inset-x-0
                    top-0
                    h-[2px]
                    bg-gradient-to-r
                    from-transparent
                    via-[#e8a33d]
                    to-transparent
                    transition-opacity
                    duration-300
                    ${featured ? "opacity-70" : "opacity-0 group-hover:opacity-40"}
                `}
            />

            {featured && (
                <span
                    className="
                        absolute
                        left-4
                        top-3
                        rounded-full
                        border
                        border-[#e8a33d]/30
                        bg-[#e8a33d]/10
                        px-2
                        py-0.5
                        text-[9px]
                        font-semibold
                        uppercase
                        tracking-widest
                        text-[#e8a33d]
                    "
                >
                    Featured
                </span>
            )}

            {/* Header */}
            <div className={`relative flex items-center gap-3 ${featured ? "mt-6" : ""}`}>
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-white/10">
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

                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                        <h3 className="truncate text-sm font-semibold tracking-tight text-[#f5f4f1]">
                            {name}
                        </h3>
                        {verified && (
                            <BadgeCheck size={14} className="shrink-0 text-[#5eead4]" />
                        )}
                    </div>
                    <p className="mt-0.5 truncate text-xs text-[#9a978f]">{genre}</p>
                </div>

                <Waveform active={hover} />
            </div>

            {/* Meter readout row — monospace like a display panel */}
            <div className="relative mt-4 flex items-center justify-between font-mono text-xs">
                <div className="flex items-center gap-1.5 text-[#f5f4f1]">
                    <Star size={13} className="fill-[#e8a33d] text-[#e8a33d]" />
                    <span className="font-semibold">{rating.toFixed(1)}</span>
                    <span className="text-[#6b685f]">/{reviews}</span>
                </div>

                <span className="rounded border border-[#2a2825] bg-[#1c1a17] px-2 py-0.5 text-[9px] uppercase tracking-wider text-[#c9a45f]">
                    {badge}
                </span>

                <div className="flex items-center gap-1 text-[#9a978f]">
                    <FolderOpen size={12} />
                    <span>{completedProjects}</span>
                </div>
            </div>

            {/* Skills — patch-cable label style */}
            <div className="relative mt-3 flex flex-wrap gap-1.5">
                {skills.map((skill) => (
                    <span
                        key={skill}
                        className="rounded-md border border-[#2a2825] bg-[#1c1a17] px-2 py-0.5 text-[10px] text-[#b5b2a8]"
                    >
                        {skill}
                    </span>
                ))}
            </div>

            {/* Footer */}
            <div className="relative mt-4 border-t border-[#2a2825] pt-3">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-mono text-[10px] uppercase tracking-wider text-[#6b685f]">
                            From
                        </p>
                        <p className="text-sm font-semibold text-[#f5f4f1]">{priceLabel}</p>
                    </div>

                    <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#9a978f]">
                        <Clock3 size={12} />
                        <span>{responseTime}</span>
                    </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#e8a33d]">
                        Hire Producer
                    </span>
                    <ArrowUpRight
                        size={16}
                        className="
                            text-[#e8a33d]
                            transition-transform
                            duration-300
                            group-hover:translate-x-0.5
                            group-hover:-translate-y-0.5
                        "
                    />
                </div>
            </div>
        </Link>
    );
}