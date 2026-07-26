"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ServiceCategoryCardProps {
    id: string;
    title: string;
    description: string;
    icon: React.ElementType;
    accent: string;
    services: string[];
}

const accentStyles = {
    blue: {
        icon: "text-blue-400 bg-blue-500/10 border-blue-500/30",
        hover: "hover:border-blue-500/40",
        glow: "bg-blue-500/10",
        text: "text-blue-400",
        solid: "group-hover:bg-blue-600",
    },
    purple: {
        icon: "text-purple-400 bg-purple-500/10 border-purple-500/30",
        hover: "hover:border-purple-500/40",
        glow: "bg-purple-500/10",
        text: "text-purple-400",
        solid: "group-hover:bg-purple-600",
    },
    pink: {
        icon: "text-pink-400 bg-pink-500/10 border-pink-500/30",
        hover: "hover:border-pink-500/40",
        glow: "bg-pink-500/10",
        text: "text-pink-400",
        solid: "group-hover:bg-pink-600",
    },
    green: {
        icon: "text-green-400 bg-green-500/10 border-green-500/30",
        hover: "hover:border-green-500/40",
        glow: "bg-green-500/10",
        text: "text-green-400",
        solid: "group-hover:bg-green-600",
    },
    red: {
        icon: "text-red-400 bg-red-500/10 border-red-500/30",
        hover: "hover:border-red-500/40",
        glow: "bg-red-500/10",
        text: "text-red-400",
        solid: "group-hover:bg-red-600",
    },
    orange: {
        icon: "text-orange-400 bg-orange-500/10 border-orange-500/30",
        hover: "hover:border-orange-500/40",
        glow: "bg-orange-500/10",
        text: "text-orange-400",
        solid: "group-hover:bg-orange-600",
    },
    yellow: {
        icon: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
        hover: "hover:border-yellow-500/40",
        glow: "bg-yellow-500/10",
        text: "text-yellow-400",
        solid: "group-hover:bg-yellow-600",
    },
    cyan: {
        icon: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
        hover: "hover:border-cyan-500/40",
        glow: "bg-cyan-500/10",
        text: "text-cyan-400",
        solid: "group-hover:bg-cyan-600",
    },
    indigo: {
        icon: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30",
        hover: "hover:border-indigo-500/40",
        glow: "bg-indigo-500/10",
        text: "text-indigo-400",
        solid: "group-hover:bg-indigo-600",
    },
    violet: {
        icon: "text-violet-400 bg-violet-500/10 border-violet-500/30",
        hover: "hover:border-violet-500/40",
        glow: "bg-violet-500/10",
        text: "text-violet-400",
        solid: "group-hover:bg-violet-600",
    },
    emerald: {
        icon: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
        hover: "hover:border-emerald-500/40",
        glow: "bg-emerald-500/10",
        text: "text-emerald-400",
        solid: "group-hover:bg-emerald-600",
    },
    teal: {
        icon: "text-teal-400 bg-teal-500/10 border-teal-500/30",
        hover: "hover:border-teal-500/40",
        glow: "bg-teal-500/10",
        text: "text-teal-400",
        solid: "group-hover:bg-teal-600",
    },
    amber: {
        icon: "text-amber-400 bg-amber-500/10 border-amber-500/30",
        hover: "hover:border-amber-500/40",
        glow: "bg-amber-500/10",
        text: "text-amber-400",
        solid: "group-hover:bg-amber-600",
    },
    rose: {
        icon: "text-rose-400 bg-rose-500/10 border-rose-500/30",
        hover: "hover:border-rose-500/40",
        glow: "bg-rose-500/10",
        text: "text-rose-400",
        solid: "group-hover:bg-rose-600",
    },
};

export default function ServiceCategoryCard({
    id,
    title,
    description,
    icon: Icon,
    accent,
    services,
}: ServiceCategoryCardProps) {
    const style =
        accentStyles[accent as keyof typeof accentStyles] ??
        accentStyles.blue;

    return (
        <Link
            href={`/services/${id}`}
            className={`
                group
                relative
                flex
                flex-col
                overflow-hidden
                rounded-2xl
                border
                border-[#272727]
                bg-[#141414]
                p-3
                transition-all
                duration-300
                hover:-translate-y-1
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-white/20
                sm:p-4
                ${style.hover}
            `}
        >
            {/* Glow — tinted to match this card's own accent, not a hardcoded color */}
            <div
                aria-hidden="true"
                className={`
                    pointer-events-none
                    absolute
                    -right-12
                    -top-12
                    h-24
                    w-24
                    rounded-full
                    opacity-0
                    blur-3xl
                    transition-opacity
                    duration-300
                    group-hover:opacity-100
                    ${style.glow}
                `}
            />

            <div className="relative flex items-start justify-between gap-2">
                <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border sm:h-12 sm:w-12 sm:rounded-2xl ${style.icon}`}
                >
                    <Icon size={19} className="sm:size-6" />
                </div>

                <span className="rounded-full bg-[#1c1c1c] px-2 py-0.5 text-[10px] text-slate-400 sm:px-2.5 sm:text-xs">
                    {services.length} services
                </span>
            </div>

            <h3 className="relative mt-3 truncate text-sm font-bold text-white sm:mt-4 sm:text-lg">
                {title}
            </h3>

            <p className="relative mt-1.5 line-clamp-2 text-xs leading-5 text-slate-400 sm:mt-2 sm:text-sm sm:leading-6">
                {description}
            </p>

            <div className="relative mt-3 flex flex-wrap gap-1 sm:mt-4 sm:gap-1.5">
                {services.slice(0, 2).map((service) => (
                    <span
                        key={service}
                        className="truncate rounded-full bg-[#1c1c1c] px-2 py-0.5 text-[10px] text-slate-300 sm:px-2.5 sm:text-[11px]"
                    >
                        {service}
                    </span>
                ))}

                {services.length > 2 && (
                    <span className="rounded-full bg-[#1c1c1c] px-2 py-0.5 text-[10px] text-slate-500 sm:px-2.5 sm:text-[11px]">
                        +{services.length - 2}
                    </span>
                )}
            </div>

            <div className="relative mt-3 flex items-center justify-between gap-2 border-t border-[#232323] pt-2.5 sm:mt-4 sm:pt-3.5">
                <span className={`truncate text-xs font-semibold sm:text-sm ${style.text}`}>
                    Explore
                </span>

                <div
                    className={`
                        flex
                        h-6
                        w-6
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-[#1c1c1c]
                        text-white
                        transition-all
                        duration-300
                        group-hover:translate-x-0.5
                        sm:h-7
                        sm:w-7
                        ${style.solid}
                    `}
                >
                    <ArrowRight size={13} className="sm:size-[15px]" />
                </div>
            </div>
        </Link>
    );
}