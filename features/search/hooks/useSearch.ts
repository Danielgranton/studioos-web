"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { SearchService } from "../services";
import { SearchCache } from "../cache";

import {
    AutocompleteSuggestion,
    SearchResponse,
} from "../types/search";

export function useSearch() {

    // State

    const [query, setQuery] = useState("");

    const [results, setResults] = useState<SearchResponse | null>(null);

    const [suggestions, setSuggestions] = useState<
        AutocompleteSuggestion[]
    >([]);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState<string | null>(null);

    const [isOpen, setIsOpen] = useState(false);

    // Debounce

    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    // Prevent slower responses from older queries replacing newer results.
    const requestIdRef = useRef(0);

    // Search

    const search = useCallback(async (value: string) => {

        const requestId = ++requestIdRef.current;

        const normalized = value.trim();

        if (!normalized) {

            setResults(null);

            setSuggestions([]);

            setLoading(false);

            return;

        }

        // Check cache first

        const cached = SearchCache.get(normalized);

        if (cached) {

            setResults(cached.results);

            setSuggestions(cached.suggestions);

            setError(null);

            setLoading(false);

            return;

        }

        try {

            setLoading(true);

            setError(null);

            const [searchResponse, suggestionsResponse] = await Promise.allSettled([

                SearchService.search({
                    q: normalized,
                }),

                SearchService.suggestions(normalized),

            ]);

            if (requestId !== requestIdRef.current) return;

            const searchSucceeded = searchResponse.status === "fulfilled";
            const suggestionsSucceeded = suggestionsResponse.status === "fulfilled";

            if (searchSucceeded) {
                setResults(searchResponse.value);
            } else {
                setError("Failed to search.");
            }

            if (suggestionsSucceeded) {
                setSuggestions(suggestionsResponse.value);
            } else if (searchSucceeded) {
                setError("Failed to load suggestions.");
            }

            // Cache only complete responses so a temporary failure can retry.
            if (searchSucceeded && suggestionsSucceeded) {
                SearchCache.set(
                    normalized,
                    searchResponse.value,
                    suggestionsResponse.value,
                );
            }

        } catch (err) {

            if (requestId !== requestIdRef.current) return;

            console.error(err);

            setError("Failed to search.");

        } finally {

            if (requestId === requestIdRef.current) {
                setLoading(false);
            }

        }

    }, []);

    // Debounced Search

    useEffect(() => {

        if (debounceRef.current) {

            clearTimeout(debounceRef.current);

        }

        debounceRef.current = setTimeout(() => {

            void search(query);

        }, 300);

        return () => {

            if (debounceRef.current) {

                clearTimeout(debounceRef.current);

            }

        };

    }, [query, search]);

    // Actions

    const open = () => setIsOpen(true);

    const close = () => setIsOpen(false);

    const clear = () => {

        ++requestIdRef.current;

        setQuery("");

        setResults(null);

        setSuggestions([]);

        setError(null);

        setLoading(false);

    };

    // Return

    return {

        query,

        setQuery,

        results,

        suggestions,

        loading,

        error,

        isOpen,

        open,

        close,

        clear,

    };

}
