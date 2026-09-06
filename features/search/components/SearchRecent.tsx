"use client";

import { Clock3 } from "lucide-react";

import { RecentSearch } from "../types/search";

interface SearchRecentProps {
    recent: RecentSearch[];
    onSelect?: (value: string) => void;
}

export function SearchRecent({
    recent,
    onSelect,
}: SearchRecentProps) {

    if (recent.length === 0) return null;

    return (
        <div className="p-4 sm:p-5">

            <h3 className="mb-3 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                <span>Recent searches</span>
                <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[9px] tracking-normal text-slate-500">
                    {recent.length}
                </span>
            </h3>

            <div className="space-y-1">

                {recent.slice(0, 8).map((item) => (

                    <button
                        key={item.id}
                        type="button"
                        onClick={() => onSelect?.(item.query)}
                        className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition hover:bg-slate-800"
                    >
                        <Clock3
                            size={14}
                            className="text-slate-500"
                        />

                        <span className="truncate text-xs text-white">
                            {item.query}
                        </span>

                    </button>

                ))}

            </div>

        </div>
    );
}
