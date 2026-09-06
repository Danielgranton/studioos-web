"use client";

import { Flame } from "lucide-react";

import { TrendingSearch } from "../types/search";

interface SearchTrendingProps {
    trending: TrendingSearch[];
    onSelect?: (value: string) => void;
}

export function SearchTrending({
    trending,
    onSelect,
}: SearchTrendingProps) {

    if (trending.length === 0) return null;

    return (
        <div className="border-t border-slate-800 p-4 sm:p-5 md:border-l md:border-t-0">

            <h3 className="mb-3 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                <span>Trending now</span>
                <span className="rounded-full bg-orange-500/10 px-2 py-0.5 text-[9px] tracking-normal text-orange-400">
                    {trending.length}
                </span>
            </h3>

            <div className="grid gap-1 sm:grid-cols-2">

                {trending.map((item) => (

                    <button
                        key={`${item.entityType}-${item.title}`}
                        onClick={() => onSelect?.(item.title)}
                        className="flex w-full min-w-0 items-center gap-2 rounded-lg px-2.5 py-2 text-left transition hover:bg-slate-800"
                    >
                        <Flame
                            size={14}
                            className="text-orange-500"
                        />

                        <div className="flex min-w-0 flex-1 items-center justify-between gap-2">

                            <span className="truncate text-xs text-white">
                                {item.title}
                            </span>

                            <span
                                className="
                                    rounded-full
                                    bg-slate-800
                                    px-1.5
                                    py-0.5
                                    text-[9px]
                                    font-semibold
                                    uppercase
                                    text-slate-400
                                "
                            >
                                {item.entityType}
                            </span>

                        </div>

                    </button>

                ))}

            </div>

        </div>
    );
}
