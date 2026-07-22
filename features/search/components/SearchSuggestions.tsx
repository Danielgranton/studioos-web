"use client";

import { Search } from "lucide-react";

import { AutocompleteSuggestion } from "../types/search";

interface SearchSuggestionsProps {
    suggestions: AutocompleteSuggestion[];
    onSelect?: (value: string) => void;
}

export default function SearchSuggestions({
    suggestions,
    onSelect,
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
                        key={`${item.entityType}-${item.value}`}
                        onClick={() => onSelect?.(item.value)}
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
                        <Search
                            size={16}
                            className="text-slate-500"
                        />

                        <div className="flex flex-1 items-center justify-between">

                            <span className="text-sm text-white">
                                {item.value}
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