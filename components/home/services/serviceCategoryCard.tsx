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
    blue: "text-blue-400 bg-blue-500/10 border-blue-500/30",
    purple: "text-purple-400 bg-purple-500/10 border-purple-500/30",
    pink: "text-pink-400 bg-pink-500/10 border-pink-500/30",
    green: "text-green-400 bg-green-500/10 border-green-500/30",
    red: "text-red-400 bg-red-500/10 border-red-500/30",
    orange: "text-orange-400 bg-orange-500/10 border-orange-500/30",
    yellow: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
    cyan: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
    indigo: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30",
    violet: "text-violet-400 bg-violet-500/10 border-violet-500/30",
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    teal: "text-teal-400 bg-teal-500/10 border-teal-500/30",
    amber: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    rose: "text-rose-400 bg-rose-500/10 border-rose-500/30",
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
            className="
                group
                relative
                overflow-hidden
                rounded-3xl
                border
                border-[#272727]
                bg-[#171717]
                p-6
                transition-all
                duration-300
                hover:-translate-y-1.5
                hover:border-blue-500/40
                hover:bg-[#1b1b1b]
            "
        >
            <div className="flex items-start justify-between">
                <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${style}`}
                >
                    <Icon size={24} />
                </div>

                <span className="rounded-full bg-[#202020] px-3 py-1 text-xs text-slate-400">
                    {services.length} Services
                </span>
            </div>

            <h3 className="mt-6 text-xl font-bold text-white">
                {title}
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-400">
                {description}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
                {services.slice(0, 3).map((service) => (
                    <span
                        key={service}
                        className="rounded-full bg-[#202020] px-3 py-1 text-[11px] text-slate-300"
                    >
                        {service}
                    </span>
                ))}

                {services.length > 3 && (
                    <span className="rounded-full bg-[#202020] px-3 py-1 text-[11px] text-slate-500">
                        +{services.length - 3} more
                    </span>
                )}
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-[#262626] pt-4">
                <span className="font-medium text-blue-400">
                    Explore Services
                </span>

                <ArrowRight
                    size={18}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                />
            </div>
        </Link>
    );
}