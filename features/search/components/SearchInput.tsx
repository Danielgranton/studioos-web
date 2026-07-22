"use client";

import { Search, X } from "lucide-react";

interface SearchInputProps {
    inputRef: React.RefObject<HTMLInputElement | null>;
    value: string;
    loading: boolean;
    placeholder?: string;

    onChange: (value: string) => void;
    onFocus: () => void;
    onClear: () => void;
}

export default function SearchInput({
    inputRef,
    value,
    loading,
    placeholder = "Search studios, producers, beats...",
    onChange,
    onFocus,
    onClear,
}: SearchInputProps) {
    return (
        <div className="flex w-full">

            <div className="relative flex-1">

                <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    placeholder={placeholder}
                    onFocus={onFocus}
                    onChange={(e) => onChange(e.target.value)}
                    className="
                        w-full
                        rounded-l-full
                        border
                        border-[#3f3f3f]
                        bg-[#121212]
                        py-2.5
                        pl-5
                        pr-16
                        text-sm
                        text-white
                        placeholder:text-[#717171]
                        outline-none
                        transition-all
                        focus:border-[#3ea6ff]
                    "
                />

                <div className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center">

                    {loading ? (

                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#5a5a5a] border-t-[#3ea6ff]" />

                    ) : value ? (

                        <button
                            type="button"
                            onClick={onClear}
                            className="text-[#717171] transition hover:text-white"
                        >
                            <X size={18} />
                        </button>

                    ) : (

                        <kbd
                            className="
                                hidden
                                rounded-md
                                border
                                border-[#3f3f3f]
                                px-2
                                py-1
                                text-[10px]
                                font-medium
                                tracking-wide
                                text-[#717171]
                                md:inline-flex
                            "
                        >
                            Ctrl&nbsp;K
                        </kbd>

                    )}

                </div>

            </div>

            <button
                type="button"
                aria-label="Search"
                className="
                    flex
                    items-center
                    justify-center
                    rounded-r-full
                    border
                    border-l-0
                    border-[#3f3f3f]
                    bg-[#222222]
                    px-6
                    transition
                    hover:bg-[#3f3f3f]
                "
            >
                <Search size={18} className="text-[#f1f1f1]" />
            </button>

        </div>
    );
}