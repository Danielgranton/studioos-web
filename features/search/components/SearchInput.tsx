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
        <div className="relative w-full">

            {/* Search Icon */}
            <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            {/* Input */}
            <input
                ref={inputRef}
                type="text"
                value={value}
                placeholder={placeholder}
                onFocus={onFocus}
                onChange={(e) => onChange(e.target.value)}
                className="
                    w-full
                    rounded-full
                    border
                    border-slate-700
                    bg-slate-800
                    py-3
                    pl-11
                    pr-20
                    text-sm
                    text-white
                    placeholder:text-slate-400
                    outline-none
                    transition-all
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-500/20
                "
            />

            <div className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center">

                {loading ? (

                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-500 border-t-blue-500" />

                ) : value ? (

                    <button
                        type="button"
                        onClick={onClear}
                        className="text-slate-400 transition hover:text-white"
                    >
                        <X size={18} />
                    </button>

                ) : (

                    <kbd
                        className="
                            hidden
                            rounded-md
                            border
                            border-slate-600
                            bg-slate-900
                            px-2
                            py-1
                            text-[10px]
                            font-medium
                            tracking-wide
                            text-slate-400
                            md:inline-flex
                        "
                    >
                        Ctrl&nbsp;K
                    </kbd>

                )}

            </div>

        </div>
    );
}