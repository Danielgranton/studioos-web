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

// Patch-cable palette — muted, warm-leaning hues instead of stock Tailwind
// neon-on-dark. Keys are unchanged so existing call sites don't need to
// pass different accent props.
const accentStyles = {
    blue: {
        icon: "text-[#7fa9ac] bg-[#7fa9ac]/10",
        border: "group-hover:border-[#7fa9ac]/40",
        glow: "bg-[#7fa9ac]/10",
        text: "text-[#7fa9ac]",
    },
    purple: {
        icon: "text-[#a58bc4] bg-[#a58bc4]/10",
        border: "group-hover:border-[#a58bc4]/40",
        glow: "bg-[#a58bc4]/10",
        text: "text-[#a58bc4]",
    },
    pink: {
        icon: "text-[#c98ba0] bg-[#c98ba0]/10",
        border: "group-hover:border-[#c98ba0]/40",
        glow: "bg-[#c98ba0]/10",
        text: "text-[#c98ba0]",
    },
    green: {
        icon: "text-[#8fae82] bg-[#8fae82]/10",
        border: "group-hover:border-[#8fae82]/40",
        glow: "bg-[#8fae82]/10",
        text: "text-[#8fae82]",
    },
    orange: {
        icon: "text-[#e8a33d] bg-[#e8a33d]/10",
        border: "group-hover:border-[#e8a33d]/40",
        glow: "bg-[#e8a33d]/10",
        text: "text-[#e8a33d]",
    },
    red: {
        icon: "text-[#c17361] bg-[#c17361]/10",
        border: "group-hover:border-[#c17361]/40",
        glow: "bg-[#c17361]/10",
        text: "text-[#c17361]",
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
        accentStyles.orange;

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
                border-[#2a2825]
                bg-[#161513]
                p-3
                transition-all
                duration-300
                hover:-translate-y-1
                hover:bg-[#1b1a17]
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

                        <h3 className="truncate text-base font-semibold tracking-tight text-[#f5f4f1] sm:text-lg lg:text-sm">
                            {title}
                        </h3>

                        <p className="mt-0.5 truncate font-mono text-[11px] text-[#6b685f] sm:text-xs lg:text-[11px]">
                            {stats}
                        </p>

                    </div>

                </div>

            </div>

            {/* Description */}

            <div className="mt-3 sm:mt-4 lg:mt-3">

                <p className="line-clamp-2 text-xs leading-5 text-[#9a978f] sm:text-sm sm:leading-6 lg:text-xs lg:leading-5">
                    {description}
                </p>

                {/* Tags */}

                <div className="mt-3 flex flex-wrap gap-1.5 sm:mt-4 sm:gap-2 lg:mt-3">

                    {tags.slice(0, 2).map((tag) => (
                        <span
                            key={tag}
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
                    border-[#2a2825]
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
                    className={`
                        transition-transform
                        duration-300
                        group-hover:translate-x-1
                        sm:size-4
                        lg:size-[18px]
                        ${style.text}
                    `}
                />
            </div>

        </Link>
    );
}