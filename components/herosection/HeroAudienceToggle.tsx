"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Building2,
    Music2,
    Users,
    Upload,
    Megaphone,
    ArrowUpRight,
} from "lucide-react";

type Audience = "artists" | "producers";

const CONTENT: Record<
    Audience,
    { icon: React.ReactNode; label: string; href: string }[]
> = {
    artists: [
        { icon: <Building2 size={15} />, label: "Book studios", href: "/studios" },
        { icon: <Music2 size={15} />, label: "Buy beats", href: "/marketplace" },
        { icon: <Users size={15} />, label: "Discover producers", href: "/producers" },
    ],
    producers: [
        { icon: <Upload size={15} />, label: "Sell your beats", href: "/dashboard/beats" },
        { icon: <Building2 size={15} />, label: "List your studio", href: "/dashboard/studios" },
        { icon: <Megaphone size={15} />, label: "Run ad campaigns", href: "/dashboard/ads" },
    ],
};

export default function HeroAudienceToggle() {

    const [audience, setAudience] = useState<Audience>("artists");

    return (
        <div className="mt-6">

            {/* Segmented control */}
            <div
                className="
                    inline-flex
                    items-center
                    rounded-full
                    border
                    border-[#272727]
                    bg-[#171717]
                    p-1
                "
            >
                {(["artists", "producers"] as Audience[]).map((option) => (
                    <button
                        key={option}
                        onClick={() => setAudience(option)}
                        className={`
                            rounded-full
                            px-4
                            py-1.5
                            text-xs
                            font-semibold
                            capitalize
                            transition-colors
                            ${
                                audience === option
                                    ? "bg-white text-black"
                                    : "text-[#aaaaaa] hover:text-white"
                            }
                        `}
                    >
                        For {option}
                    </button>
                ))}
            </div>

            {/* Quick highlights for the selected audience */}
            <div className="mt-3 flex flex-wrap items-center gap-2">

                {CONTENT[audience].map((item) => (
                    <Link
                        key={item.label}
                        href={item.href}
                        className="
                            group
                            inline-flex
                            items-center
                            gap-1.5
                            rounded-full
                            border
                            border-[#272727]
                            bg-[#141414]
                            px-3
                            py-1.5
                            text-xs
                            font-medium
                            text-[#f1f1f1]
                            transition
                            hover:border-blue-500/40
                            hover:text-white
                        "
                    >
                        <span className="text-blue-400">{item.icon}</span>
                        {item.label}
                        <ArrowUpRight
                            size={12}
                            className="
                                text-[#5a5a5a]
                                opacity-0
                                transition
                                group-hover:opacity-100
                            "
                        />
                    </Link>
                ))}

            </div>

        </div>
    );
}