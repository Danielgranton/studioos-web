"use client";

import { SearchResponse } from "../types/search";

interface SearchEmptyProps {
    query: string;
    results: SearchResponse | null;
}

export default function SearchEmpty({
    query,
    results,
}: SearchEmptyProps) {

    if (!results) return null;

    if (results.results.length > 0) {
        return null;
    }

    return (
        <div className="p-10 text-center">

            <p className="text-lg font-semibold text-white">
                No results found
            </p>

            <p className="mt-2 text-sm text-slate-400">
                No matches for{" "}
                <span className="font-medium text-white">
                    &ldquo;{query}&rdquo;
                </span>
            </p>

        </div>
    );
}