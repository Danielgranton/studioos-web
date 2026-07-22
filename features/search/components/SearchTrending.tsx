"use client";

import { Flame } from "lucide-react";

import { TrendingSearch } from "../types/search";

interface SearchTrendingProps {
    trending: TrendingSearch[];
    onSelect?: (value: string) => void;
}

export default function SearchTrending({
    trending,
    onSelect,
}: SearchTrendingProps) {

    if (trending.length === 0) return null;

    return (
        <div className="border-t border-slate-800 p-4">

            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Trending
            </h3>

            <div className="space-y-2">

                {trending.map((item) => (

                    <button
                        key={`${item.entityType}-${item.title}`}
                        onClick={() => onSelect?.(item.title)}
                        className="
                            flex
                            w-full
                            items-center
                            gap-3
                            rounded-lg
                            px-3
                            py-2
                            text-left
                            transition
                            hover:bg-slate-800
                        "
                    >
                        <Flame
                            size={16}
                            className="text-orange-500"
                        />

                        <div className="flex flex-1 items-center justify-between">

                            <span className="text-sm text-white">
                                {item.title}
                            </span>

                            <span
                                className="
                                    rounded-full
                                    bg-slate-800
                                    px-2
                                    py-0.5
                                    text-[10px]
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