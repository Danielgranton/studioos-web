"use client";

import { Clock3 } from "lucide-react";

import { RecentSearch } from "../types/search";

interface SearchRecentProps {
    recent: RecentSearch[];
}

export default function SearchRecent({
    recent,
}: SearchRecentProps) {

    if (recent.length === 0) return null;

    return (
        <div className="p-4">

            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Recent
            </h3>

            <div className="space-y-2">

                {recent.map((item) => (

                    <button
                        key={item.id}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition hover:bg-slate-800"
                    >
                        <Clock3
                            size={16}
                            className="text-slate-500"
                        />

                        <span className="text-sm text-white">
                            {item.query}
                        </span>

                    </button>

                ))}

            </div>

        </div>
    );
}