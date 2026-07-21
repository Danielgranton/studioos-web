"use client";

import { Flame } from "lucide-react";

import { TrendingSearch } from "../types/search";

interface SearchTrendingProps {
    trending: TrendingSearch[];
}

export default function SearchTrending({
    trending,
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
                        key={item.keyword}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-slate-800"
                    >
                        <Flame
                            size={16}
                            className="text-orange-500"
                        />

                        <span className="text-sm text-white">
                            {item.keyword}
                        </span>

                    </button>

                ))}

            </div>

        </div>
    );
}