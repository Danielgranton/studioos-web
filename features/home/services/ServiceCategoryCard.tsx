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

// Re-spaced palette: consistent muted saturation/lightness (matches the
// patch-cable treatment used across the other cards) with hues spread
// further apart than Tailwind's defaults, so 14 categories stay tellable
// apart at a glance instead of clustering (teal/cyan/emerald were all but
// indistinguishable before, same for indigo/violet/purple).
const accentStyles = {
    red: {
        icon: "text-[#c1594e] bg-[#c1594e]/10 border-[#c1594e]/30",
        hover: "hover:border-[#c1594e]/40",
        glow: "bg-[#c1594e]/10",
        text: "text-[#c1594e]",
        solid: "group-hover:bg-[#c1594e]",
    },
    rose: {
        icon: "text-[#c2637f] bg-[#c2637f]/10 border-[#c2637f]/30",
        hover: "hover:border-[#c2637f]/40",
        glow: "bg-[#c2637f]/10",
        text: "text-[#c2637f]",
        solid: "group-hover:bg-[#c2637f]",
    },
    pink: {
        icon: "text-[#c98ba0] bg-[#c98ba0]/10 border-[#c98ba0]/30",
        hover: "hover:border-[#c98ba0]/40",
        glow: "bg-[#c98ba0]/10",
        text: "text-[#c98ba0]",
        solid: "group-hover:bg-[#c98ba0]",
    },
    orange: {
        icon: "text-[#cf8452] bg-[#cf8452]/10 border-[#cf8452]/30",
        hover: "hover:border-[#cf8452]/40",
        glow: "bg-[#cf8452]/10",
        text: "text-[#cf8452]",
        solid: "group-hover:bg-[#cf8452]",
    },
    amber: {
        icon: "text-[#e8a33d] bg-[#e8a33d]/10 border-[#e8a33d]/30",
        hover: "hover:border-[#e8a33d]/40",
        glow: "bg-[#e8a33d]/10",
        text: "text-[#e8a33d]",
        solid: "group-hover:bg-[#e8a33d]",
    },
    yellow: {
        icon: "text-[#c9a548] bg-[#c9a548]/10 border-[#c9a548]/30",
        hover: "hover:border-[#c9a548]/40",
        glow: "bg-[#c9a548]/10",
        text: "text-[#c9a548]",
        solid: "group-hover:bg-[#c9a548]",
    },
    green: {
        icon: "text-[#8fae82] bg-[#8fae82]/10 border-[#8fae82]/30",
        hover: "hover:border-[#8fae82]/40",
        glow: "bg-[#8fae82]/10",
        text: "text-[#8fae82]",
        solid: "group-hover:bg-[#8fae82]",
    },
    emerald: {
        icon: "text-[#6fa885] bg-[#6fa885]/10 border-[#6fa885]/30",
        hover: "hover:border-[#6fa885]/40",
        glow: "bg-[#6fa885]/10",
        text: "text-[#6fa885]",
        solid: "group-hover:bg-[#6fa885]",
    },
    teal: {
        icon: "text-[#5fa39a] bg-[#5fa39a]/10 border-[#5fa39a]/30",
        hover: "hover:border-[#5fa39a]/40",
        glow: "bg-[#5fa39a]/10",
        text: "text-[#5fa39a]",
        solid: "group-hover:bg-[#5fa39a]",
    },
    cyan: {
        icon: "text-[#6b9ba6] bg-[#6b9ba6]/10 border-[#6b9ba6]/30",
        hover: "hover:border-[#6b9ba6]/40",
        glow: "bg-[#6b9ba6]/10",
        text: "text-[#6b9ba6]",
        solid: "group-hover:bg-[#6b9ba6]",
    },
    blue: {
        icon: "text-[#6f93b8] bg-[#6f93b8]/10 border-[#6f93b8]/30",
        hover: "hover:border-[#6f93b8]/40",
        glow: "bg-[#6f93b8]/10",
        text: "text-[#6f93b8]",
        solid: "group-hover:bg-[#6f93b8]",
    },
    indigo: {
        icon: "text-[#7b8fc4] bg-[#7b8fc4]/10 border-[#7b8fc4]/30",
        hover: "hover:border-[#7b8fc4]/40",
        glow: "bg-[#7b8fc4]/10",
        text: "text-[#7b8fc4]",
        solid: "group-hover:bg-[#7b8fc4]",
    },
    violet: {
        icon: "text-[#9081c4] bg-[#9081c4]/10 border-[#9081c4]/30",
        hover: "hover:border-[#9081c4]/40",
        glow: "bg-[#9081c4]/10",
        text: "text-[#9081c4]",
        solid: "group-hover:bg-[#9081c4]",
    },
    purple: {
        icon: "text-[#a58bc4] bg-[#a58bc4]/10 border-[#a58bc4]/30",
        hover: "hover:border-[#a58bc4]/40",
        glow: "bg-[#a58bc4]/10",
        text: "text-[#a58bc4]",
        solid: "group-hover:bg-[#a58bc4]",
    },
};

export function ServiceCategoryCard({
    id,
    title,
    description,
    icon: Icon,
    accent,
    services,
}: ServiceCategoryCardProps) {
    const style =
        accentStyles[accent as keyof typeof accentStyles] ??
        accentStyles.amber;

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
                border-[#2a2825]
                bg-[#161513]
                p-3
                transition-all
                duration-300
                hover:-translate-y-1
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-white/20
                sm:p-4
                lg:rounded-xl
                lg:p-3
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
                    lg:h-20
                    lg:w-20
                    ${style.glow}
                `}
            />

            <div className="relative flex items-start justify-between gap-2">
                <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border sm:h-12 sm:w-12 sm:rounded-2xl lg:h-10 lg:w-10 lg:rounded-xl ${style.icon}`}
                >
                    <Icon size={19} className="sm:size-6 lg:size-5" />
                </div>

                <span className="rounded-md bg-[#1c1a17] px-2 py-0.5 font-mono text-[10px] text-[#9a978f] sm:px-2.5 sm:text-xs lg:px-2 lg:text-[10px]">
                    {services.length} services
                </span>
            </div>

            <h3 className="relative mt-3 truncate text-sm font-semibold tracking-tight text-[#f5f4f1] sm:mt-4 sm:text-lg lg:mt-3 lg:text-base">
                {title}
            </h3>

            <p className="relative mt-1.5 line-clamp-2 text-xs leading-5 text-[#9a978f] sm:mt-2 sm:text-sm sm:leading-6 lg:mt-1.5 lg:text-xs lg:leading-5">
                {description}
            </p>

            <div className="relative mt-3 flex flex-wrap gap-1 sm:mt-4 sm:gap-1.5 lg:mt-3 lg:gap-1">
                {services.slice(0, 2).map((service) => (
                    <span
                        key={service}
                        className="truncate rounded-md bg-[#1c1a17] px-2 py-0.5 text-[10px] text-[#b5b2a8] sm:px-2.5 sm:text-[11px] lg:px-2 lg:text-[10px]"
                    >
                        {service}
                    </span>
                ))}

                {services.length > 2 && (
                    <span className="rounded-md bg-[#1c1a17] px-2 py-0.5 font-mono text-[10px] text-[#6b685f] sm:px-2.5 sm:text-[11px] lg:px-2 lg:text-[10px]">
                        +{services.length - 2}
                    </span>
                )}
            </div>

            <div className="relative mt-3 flex items-center justify-between gap-2 border-t border-[#2a2825] pt-2.5 sm:mt-4 sm:pt-3.5 lg:mt-2.5 lg:pt-2.5">
                <span className={`truncate text-xs font-semibold sm:text-sm lg:text-xs ${style.text}`}>
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
                        bg-[#1c1a17]
                        text-[#f5f4f1]
                        transition-all
                        duration-300
                        group-hover:translate-x-0.5
                        group-hover:text-[#161513]
                        sm:h-7
                        sm:w-7
                        lg:h-6
                        lg:w-6
                        ${style.solid}
                    `}
                >
                    <ArrowRight size={13} className="sm:size-[15px] lg:size-[13px]" />
                </div>
            </div>
        </Link>
    );
}
