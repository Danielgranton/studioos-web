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
                min-h-[205px]
                flex-col
                justify-between
                overflow-hidden
                rounded-2xl
                border
                border-[#262626]
                bg-[#171717]
                p-5
                transition-all
                duration-300
                hover:-translate-y-1
                hover:bg-[#1b1b1b]
                hover:shadow-xl
                ${style.border}
            `}
        >
            {/* Glow */}

            <div
                className={`
                    absolute
                    -right-12
                    -top-12
                    h-32
                    w-32
                    rounded-full
                    blur-3xl
                    opacity-0
                    transition
                    duration-300
                    group-hover:opacity-100
                    ${style.glow}
                `}
            />

            {/* Header */}

            <div className="flex items-start justify-between">

                <div className="flex items-center gap-3">

                    <div
                        className={`
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-xl
                            ${style.icon}
                        `}
                    >
                        <Icon size={20} />
                    </div>

                    <div>

                        <h3 className="text-lg font-semibold text-white">
                            {title}
                        </h3>

                        <p className="mt-0.5 text-xs text-slate-500">
                            {stats}
                        </p>

                    </div>

                </div>

            </div>

            {/* Description */}

            <div className="mt-4">

                <p className="line-clamp-2 text-sm leading-6 text-slate-400">
                    {description}
                </p>

                {/* Tags */}

                <div className="mt-4 flex flex-wrap gap-2">

                    {tags.slice(0, 2).map((tag) => (
                        <span
                            key={tag}
                            className="
                                rounded-full
                                border
                                border-[#333]
                                bg-[#202020]
                                px-2.5
                                py-1
                                text-[10px]
                                font-medium
                                text-slate-300
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
                    mt-4
                    flex
                    items-center
                    justify-between
                    border-t
                    border-[#262626]
                    pt-3
                "
            >
                <span
                    className={`
                        text-sm
                        font-medium
                        ${style.text}
                    `}
                >
                    Explore
                </span>

                <ArrowRight
                    size={16}
                    className="
                        transition-transform
                        duration-300
                        group-hover:translate-x-1
                    "
                />
            </div>

        </Link>
    );
}