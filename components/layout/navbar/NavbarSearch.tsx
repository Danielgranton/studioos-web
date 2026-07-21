"use client";

import { useMemo, useRef } from "react";

import SearchInput from "@/features/search/components/SearchInput";
import SearchDropdown from "@/features/search/components/SearchDropdown";

import useSearch from "@/features/search/hooks/useSearch";
import { useSearchShortcuts } from "@/features/search/hooks/useSearchShortcuts";
import { useSearchKeyboard } from "@/features/search/hooks/useSearchKeyboard";
import { useClickOutside } from "@/features/search/hooks/useClickOutside";

export default function NavbarSearch() {

    const containerRef = useRef<HTMLDivElement>(null);

    const inputRef = useRef<HTMLInputElement>(null);

    const {
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
    } = useSearch();

    useSearchShortcuts({
        inputRef,
        open,
        close,
    });

    useClickOutside(containerRef, close);

    const keyboardItems = useMemo(() => {

        if (!results) return suggestions;

        return [
            ...suggestions,
            ...results.studios,
            ...results.producers,
            ...results.beats,
            ...results.advertisements,
        ];

    }, [results, suggestions]);

    useSearchKeyboard({
        items: keyboardItems,
        onSelect: (item) => {

            console.log("Selected:", item);

            // TODO:
            // router.push(...)
            // depending on item type

        },
    });

    return (

        <div
            ref={containerRef}
            className="relative w-full max-w-2xl"
        >

            <SearchInput
                inputRef={inputRef}
                value={query}
                loading={loading}
                onChange={setQuery}
                onFocus={open}
                onClear={clear}
            />

            <SearchDropdown
                open={isOpen}
                loading={loading}
                query={query}
                suggestions={suggestions}
                results={results}
                recent={[]}
                trending={[]}
                onClose={close}
            />

            {error && (
                <p className="mt-2 text-xs text-red-500">
                    {error}
                </p>
            )}

        </div>

    );
}