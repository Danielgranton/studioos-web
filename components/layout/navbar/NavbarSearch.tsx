"use client";

import { useCallback, useMemo, useRef } from "react";

import SearchInput from "@/features/search/components/SearchInput";
import SearchDropdown from "@/features/search/components/SearchDropdown";

import useSearch from "@/features/search/hooks/useSearch";
import useSearchHome from "@/features/search/hooks/useSearchHome";

import { useSearchShortcuts } from "@/features/search/hooks/useSearchShortcuts";
import { useSearchKeyboard } from "@/features/search/hooks/useSearchKeyboard";
import { useClickOutside } from "@/features/search/hooks/useClickOutside";

export default function NavbarSearch() {

    const containerRef = useRef<HTMLDivElement>(null);

    const inputRef = useRef<HTMLInputElement>(null);

    const search = useSearch();

    const home = useSearchHome();

    /**
     * Open search and lazily load
     * recent + trending only once.
     */
    const handleOpen = useCallback(() => {

        search.open();

        if (
            !home.loading &&
            home.recent.length === 0 &&
            home.trending.length === 0
        ) {
            void home.refresh();
        }

    }, [search, home]);

    useSearchShortcuts({
        inputRef,
        open: handleOpen,
        close: search.close,
    });

    useClickOutside(containerRef, search.close);

   const keyboardItems = useMemo(() => {

    if (!search.results) {
        return search.suggestions;
    }

    return [
        ...search.suggestions,
        ...search.results.results,
    ];

    }, [search.results, search.suggestions]);

    useSearchKeyboard({

        items: keyboardItems,

        onSelect: (item) => {

            console.log("Selected:", item);

            /**
             * TODO
             *
             * router.push(...)
             * search.close();
             */

        },

    });

    return (

        <div
            ref={containerRef}
            className="relative w-full max-w-2xl"
        >

            <SearchInput
                inputRef={inputRef}
                value={search.query}
                loading={search.loading}
                onChange={search.setQuery}
                onFocus={handleOpen}
                onClear={search.clear}
            />

            <SearchDropdown
                open={search.isOpen}
                loading={search.loading || home.loading}
                query={search.query}
                suggestions={search.suggestions}
                results={search.results}
                recent={home.recent}
                trending={home.trending}
                onClose={search.close}
            />

            {(search.error || home.error) && (

                <p className="mt-2 text-xs text-red-500">

                    {search.error ?? home.error}

                </p>

            )}

        </div>

    );

}