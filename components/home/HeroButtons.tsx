"use client";

import Link from "next/link";
import { ArrowRight, Music2 } from "lucide-react";

export default function HeroButtons() {
    return (
        <div className="flex flex-wrap items-center gap-4">

            <Link
                href="/studios"
                className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    bg-red-600
                    px-7
                    py-4
                    font-semibold
                    text-white
                    transition
                    hover:bg-red-500
                "
            >
                Book Studio

                <ArrowRight size={18} />
            </Link>

            <Link
                href="/marketplace"
                className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-slate-700
                    bg-[#1b1b1b]
                    px-7
                    py-4
                    font-semibold
                    text-white
                    transition
                    hover:bg-[#272727]
                "
            >
                <Music2 size={18} />

                Explore Beats
            </Link>

        </div>
    );
}