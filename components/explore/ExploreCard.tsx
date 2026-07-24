"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ExploreCardProps {
    title: string;
    description: string;
    href: string;
    icon: React.ElementType;
}

export default function ExploreCard({
    title,
    description,
    href,
    icon: Icon,
}: ExploreCardProps) {
    return (
        <Link
            href={href}
            className="
                group
                relative
                flex
                min-h-[280px]
                flex-col
                justify-between
                overflow-hidden
                rounded-3xl
                border
                border-[#262626]
                bg-[#171717]
                p-8
                transition-all
                duration-300
                hover:-translate-y-2
                hover:border-blue-500/40
                hover:bg-[#1b1b1b]
                hover:shadow-[0_20px_60px_rgba(37,99,235,0.15)]
            "
        >
            {/* Background Glow */}
            <div
                className="
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

            {/* Icon */}
            <div
                className="
                    flex
                    h-16
                    w-16
                    items-center
                    justify-center
                    rounded-2xl
                    bg-blue-500/10
                    text-blue-400
                "
            >
                <Icon size={30} />
            </div>

            {/* Content */}
            <div className="mt-8">
                <h3 className="text-2xl font-bold text-white">
                    {title}
                </h3>

                <p className="mt-4 leading-7 text-slate-400">
                    {description}
                </p>
            </div>

            {/* CTA */}
            <div
                className="
                    mt-10
                    flex
                    items-center
                    gap-2
                    font-semibold
                    text-blue-400
                    transition-all
                    group-hover:gap-3
                "
            >
                <span>Explore</span>

                <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                />
            </div>
        </Link>
    );
}