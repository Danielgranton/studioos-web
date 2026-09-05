"use client";

import { useEffect, useRef, useState } from "react";

export type CountryOption = {
    value?: string;
    label?: string;
    divider?: boolean;
};

export function CountryPicker({ value, onChange, options, disabled, readOnly }: { value?: string; onChange: (value?: string) => void; options: CountryOption[]; disabled?: boolean; readOnly?: boolean }) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const pickerRef = useRef<HTMLDivElement>(null);
    const visibleOptions = options.filter((option) => !option.divider && option.label?.toLowerCase().includes(query.toLowerCase()));

    useEffect(() => {
        if (!open) return;
        function closeOnOutside(event: MouseEvent) {
            if (!pickerRef.current?.contains(event.target as Node)) setOpen(false);
        }
        document.addEventListener("mousedown", closeOnOutside);
        return () => document.removeEventListener("mousedown", closeOnOutside);
    }, [open]);

    return <div ref={pickerRef} className="relative shrink-0">
        <button type="button" disabled={disabled || readOnly} aria-label="Select country" aria-expanded={open} aria-haspopup="listbox" onClick={() => setOpen((current) => !current)} className="flex items-center gap-2 rounded-lg px-1.5 py-1 text-sm text-[#f1f1f1] outline-none transition hover:bg-[#1f1f1f] focus-visible:ring-2 focus-visible:ring-[#3ea6ff] disabled:opacity-50">
            <span aria-hidden="true" className="text-base">{countryFlag(value)}</span><span className="font-mono text-xs text-[#bdbdbd]">{value || "INT"}</span><span className="text-[10px] text-[#777]">▾</span>
        </button>
        {open && <div className="absolute left-0 top-[calc(100%+0.6rem)] z-50 w-64 overflow-hidden rounded-2xl border border-[#3f3f3f] bg-[#181818] p-2 shadow-2xl shadow-black/50">
            <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search country" aria-label="Search countries" className="mb-2 w-full rounded-xl border border-[#3f3f3f] bg-[#101010] px-3 py-2 text-xs text-[#f1f1f1] outline-none placeholder:text-[#717171] focus:border-[#3ea6ff]/70" />
            <div role="listbox" aria-label="Countries" className="max-h-56 overflow-y-auto">{visibleOptions.map((option) => <button key={option.value || option.label} type="button" role="option" aria-selected={option.value === value} onClick={() => { onChange(option.value); setOpen(false); setQuery(""); }} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-xs transition hover:bg-[#272727] ${option.value === value ? "bg-[#3ea6ff]/10 text-[#3ea6ff]" : "text-[#c9c9c9]"}`}><span aria-hidden="true" className="text-base">{countryFlag(option.value)}</span><span className="min-w-0 flex-1 truncate">{option.label}</span></button>)}</div>
        </div>}
    </div>;
}

function countryFlag(country?: string) {
    if (!country || country === "ZZ") return "🌐";
    return country.toUpperCase().split("").map((letter) => String.fromCodePoint(letter.charCodeAt(0) + 127397)).join("");
}
