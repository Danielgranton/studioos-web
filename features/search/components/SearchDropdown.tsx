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
                border-[#303030] bg-[#0F0F0F]/95 backdrop-blur-xl
                z-50
            "
        >
            {/* Empty Query */}
            {!hasQuery && (
                <>
                    <SearchRecent recent={recent} />

                    <SearchTrending trending={trending} />

                    {recent.length === 0 && trending.length === 0 && (
                        <SearchHomeEmpty onSelect={onSelectQuery} />
                    )}
                </>
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
