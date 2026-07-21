"use client";

import { Search } from "lucide-react";

import { AutocompleteSuggestion } from "../types/search";

interface SearchSuggestionsProps {
    suggestions: AutocompleteSuggestion[];
}

export default function SearchSuggestions({
    suggestions,
}: SearchSuggestionsProps) {

    if (suggestions.length === 0) return null;

    return (
        <div className="border-b border-slate-800 p-4">

            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Suggestions
            </h3>

            <div className="space-y-2">

                {suggestions.map((item) => (

                    <button
                        key={item.id}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-slate-800"
                    >
                        <Search
                            size={16}
                            className="text-slate-500"
                        />

                        <span className="text-sm text-white">
                            {item.title}
                        </span>

                    </button>

                ))}

            </div>

        </div>
    );
}