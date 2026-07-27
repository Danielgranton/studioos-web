"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ExploreCardProps {
    title: string;
    description: string;
    href: string;
    icon: React.ElementType;
    stats: string;
    tags: string[];
    accent: string;
}

const accentStyles = {
    blue: {
        icon: "text-blue-400 bg-blue-500/10",
        border: "group-hover:border-blue-500/40",
        glow: "bg-blue-500/10",
        text: "text-blue-400",
    },
    purple: {
        icon: "text-purple-400 bg-purple-500/10",
        border: "group-hover:border-purple-500/40",
        glow: "bg-purple-500/10",
        text: "text-purple-400",
    },
    pink: {
        icon: "text-pink-400 bg-pink-500/10",
        border: "group-hover:border-pink-500/40",
        glow: "bg-pink-500/10",
        text: "text-pink-400",
    },
    green: {
        icon: "text-green-400 bg-green-500/10",
        border: "group-hover:border-green-500/40",
        glow: "bg-green-500/10",
        text: "text-green-400",
    },
    orange: {
        icon: "text-orange-400 bg-orange-500/10",
        border: "group-hover:border-orange-500/40",
        glow: "bg-orange-500/10",
        text: "text-orange-400",
    },
    red: {
        icon: "text-red-400 bg-red-500/10",
        border: "group-hover:border-red-500/40",
        glow: "bg-red-500/10",
        text: "text-red-400",
    },
} as const;

export default function ExploreCard({
    title,
    description,
    href,
    icon: Icon,
    stats,
    tags,
    accent,
}: ExploreCardProps) {
    const style =
        accentStyles[accent as keyof typeof accentStyles] ??
        accentStyles.blue;

    return (
        <Link
            href={href}
            className={`
                group
                relative
                flex
                min-h-[180px]
                flex-col
                justify-between
                overflow-hidden
                rounded-xl
                border
                border-[#262626]
                bg-[#171717]
                p-3
                transition-all
                duration-300
                hover:-translate-y-1
                hover:bg-[#1b1b1b]
                hover:shadow-xl
                sm:min-h-[205px]
                sm:rounded-2xl
                sm:p-5
                lg:min-h-[190px]
                lg:rounded-xl
                lg:p-5
                ${style.border}
            `}
        >
            {/* Glow */}

            <div
                className={`
                    absolute
                    -right-12
                    -top-12
                    h-24
                    w-24
                    rounded-full
                    blur-3xl
                    opacity-0
                    transition
                    duration-300
                    group-hover:opacity-100
                    sm:h-32
                    sm:w-32
                    lg:h-28
                    lg:w-28
                    ${style.glow}
                `}
            />

            {/* Header */}

            <div className="flex items-start justify-between">

                <div className="flex items-center gap-2 sm:gap-3">

                    <div
                        className={`
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            sm:h-10
                            sm:w-10
                            sm:rounded-xl
                            lg:h-9
                            lg:w-9
                            lg:rounded-lg
                            ${style.icon}
                        `}
                    >
                        <Icon size={18} className="sm:size-5 lg:size-[18px]" />
                    </div>

                    <div className="min-w-0">

                        <h3 className="truncate text-base font-semibold text-white sm:text-lg lg:text-sm">
                            {title}
                        </h3>

                        <p className="mt-0.5 truncate text-[11px] text-slate-500 sm:text-xs lg:text-[11px]">
                            {stats}
                        </p>

                    </div>

                </div>

            </div>

            {/* Description */}

            <div className="mt-3 sm:mt-4 lg:mt-3">

                <p className="line-clamp-2 text-xs leading-5 text-slate-400 sm:text-sm sm:leading-6 lg:text-xs lg:leading-5">
                    {description}
                </p>

                {/* Tags */}

                <div className="mt-3 flex flex-wrap gap-1.5 sm:mt-4 sm:gap-2 lg:mt-3">

                    {tags.slice(0, 2).map((tag) => (
                        <span
                            key={tag}
                            className="
                                rounded-full
                                border
                                border-[#333]
                                bg-[#202020]
                                px-2
                                py-0.5
                                text-[9px]
                                font-medium
                                text-slate-300
                                sm:px-2.5
                                sm:py-1
                                sm:text-[10px]
                                lg:px-2
                                lg:py-0.5
                                lg:text-[10px]
                            "
                        >
                            {tag}
                        </span>
                    ))}

                </div>

            </div>

            {/* Footer */}

            <div
                className="
                    mt-3
                    flex
                    items-center
                    justify-between
                    border-t
                    border-[#262626]
                    pt-2.5
                    sm:mt-4
                    sm:pt-3
                    lg:mt-3
                    lg:pt-2.5
                "
            >
                <span
                    className={`
                        text-xs
                        font-medium
                        sm:text-sm
                        lg:text-xs
                        ${style.text}
                    `}
                >
                    Explore
                </span>

                <ArrowRight
                    size={14}
                    className="
                        transition-transform
                        duration-300
                        group-hover:translate-x-1
                        sm:size-4
                        lg:size-[20px]
                    "
                />
            </div>

        </Link>
    );
}