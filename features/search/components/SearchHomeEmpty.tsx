"use client";

import { Building2, Mic2, Music2 } from "lucide-react";

interface SearchHomeEmptyProps {
    onSelect: (value: string) => void;
}

const categories = [
    { label: "Studios", icon: Building2 },
    { label: "Producers", icon: Mic2 },
    { label: "Beats", icon: Music2 },
];

export function SearchHomeEmpty({ onSelect }: SearchHomeEmptyProps) {
    return (
        <div className="p-4">
            <p className="text-sm font-medium text-white">Start searching</p>
            <p className="mt-1 text-xs text-slate-400">
                Find studios, producers, beats, and more.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
                {categories.map(({ label, icon: Icon }) => (
                    <button
                        key={label}
                        type="button"
                        onClick={() => onSelect(label)}
                        className="inline-flex items-center gap-2 rounded-lg border border-[#3f3f3f] px-3 py-2 text-xs text-slate-300 transition hover:border-[#3ea6ff]/50 hover:bg-[#181818] hover:text-white"
                    >
                        <Icon size={14} className="text-[#3ea6ff]" />
                        {label}
                    </button>
                ))}
            </div>
        </div>
    );
}
