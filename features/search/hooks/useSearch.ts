"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import SearchService from "../services/search.service";
import SearchCache from "../cache/SearchCache";

import {
    AutocompleteSuggestion,
    SearchResponse,
} from "../types/search";

export default function useSearch() {

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

    // Search

    const search = useCallback(async (value: string) => {

        const normalized = value.trim();

        if (!normalized) {

            setResults(null);

            setSuggestions([]);

            return;

        }

        // Check cache first

        const cached = SearchCache.get(normalized);

        if (cached) {

            setResults(cached.results);

            setSuggestions(cached.suggestions);

            setError(null);

            return;

        }

        try {

            setLoading(true);

            setError(null);

            const [

                searchResults,

                searchSuggestions,

            ] = await Promise.all([

                SearchService.search({
                    q: normalized,
                }),

                SearchService.suggestions(normalized),

            ]);

            // Save to cache

            SearchCache.set(

                normalized,

                searchResults,

                searchSuggestions,

            );

            setResults(searchResults);

            setSuggestions(searchSuggestions);

        } catch (err) {

            console.error(err);

            setError("Failed to search.");

        } finally {

            setLoading(false);

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

        setQuery("");

        setResults(null);

        setSuggestions([]);

        setError(null);

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