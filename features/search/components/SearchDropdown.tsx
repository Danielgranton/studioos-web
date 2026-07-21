"use client";

import SearchEmpty from "./SearchEmpty";
import SearchLoading from "./SearchLoading";
import SearchRecent from "./SearchRecent";
import SearchResults from "./SearchResults";
import SearchSuggestions from "./SearchSuggestions";
import SearchTrending from "./SearchTrending";

import {
    AutocompleteSuggestion,
    RecentSearch,
    SearchResponse,
    TrendingSearch,
} from "../types/search";

interface SearchDropdownProps {
    open: boolean;

    loading: boolean;

    query: string;

    suggestions: AutocompleteSuggestion[];

    results: SearchResponse | null;

    recent: RecentSearch[];

    trending: TrendingSearch[];

    onClose: () => void;
}

export default function SearchDropdown({
    open,
    loading,
    query,
    suggestions,
    results,
    recent,
    trending,
}: SearchDropdownProps) {
    if (!open) return null;

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
                border
                border-slate-700
                bg-slate-900
                shadow-2xl
                z-50
            "
        >
            {/* Loading */}
            {loading && <SearchLoading />}

            {/* Empty Query */}
            {!loading && query.trim() === "" && (
                <>
                    <SearchRecent recent={recent} />

                    <SearchTrending trending={trending} />
                </>
            )}

            {/* Search */}
            {!loading && query.trim() !== "" && (
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