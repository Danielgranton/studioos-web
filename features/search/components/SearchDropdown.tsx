"use client";

import { SearchEmpty } from "./SearchEmpty";
import { SearchHomeEmpty } from "./SearchHomeEmpty";
import { SearchRecent } from "./SearchRecent";
import { SearchResults } from "./SearchResults";
import { SearchSuggestions } from "./SearchSuggestions";
import { SearchTrending } from "./SearchTrending";

import {
    AutocompleteSuggestion,
    RecentSearch,
    SearchResponse,
    TrendingSearch,
} from "../types/search";

interface SearchDropdownProps {
    open: boolean;

    query: string;

    suggestions: AutocompleteSuggestion[];

    results: SearchResponse | null;

    recent: RecentSearch[];

    trending: TrendingSearch[];

    onClose: () => void;

    onSelectQuery: (value: string) => void;
}

export function SearchDropdown({
    open,
    query,
    suggestions,
    results,
    recent,
    trending,
    onSelectQuery,
}: SearchDropdownProps) {
    if (!open) return null;

    const hasQuery = query.trim() !== "";

    return (
        <div
            className="
                absolute
                top-full
                left-0
                mt-3
                w-full
                overflow-hidden
                rounded-2xl
                border border-[#303030] bg-[#0F0F0F]/95 shadow-2xl shadow-black/30 backdrop-blur-xl
                z-50
            "
        >
            {/* Empty Query */}
            {!hasQuery && (
                <div className="max-h-[min(62vh,460px)] overflow-y-auto overscroll-contain">
                    <div className="grid md:grid-cols-[0.75fr_1.25fr]">
                        <SearchRecent
                            recent={recent}
                            onSelect={onSelectQuery}
                        />

                        <SearchTrending
                            trending={trending}
                            onSelect={onSelectQuery}
                        />
                    </div>

                    {recent.length === 0 && trending.length === 0 && (
                        <SearchHomeEmpty onSelect={onSelectQuery} />
                    )}
                </div>
            )}

            {/* Search */}
            {hasQuery && (
                <>
                    <SearchSuggestions
                        suggestions={suggestions}
                    />

                    <SearchResults
                        results={results}
                    />

                    <SearchEmpty
                        query={query}
                        results={results}
                    />
                </>
            )}
        </div>
    );
}
