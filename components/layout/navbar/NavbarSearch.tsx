"use client";

import { useCallback, useMemo, useRef } from "react";

import {
    SearchDropdown,
    SearchInput,
    useClickOutside,
    useSearch,
    useSearchHome,
    useSearchKeyboard,
    useSearchShortcuts,
} from "@/features/search";

export function NavbarSearch() {

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
            !home.hasLoaded
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

        onSelect: () => {
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
                query={search.query}
                suggestions={search.suggestions}
                results={search.results}
                recent={home.recent}
                trending={home.trending}
                onClose={search.close}
                onSelectQuery={search.setQuery}
            />

            {(search.error || home.error) && (

                <p className="mt-2 text-xs text-red-500">

                    {search.error ?? home.error}

                </p>

            )}

        </div>

    );

}
