"use client";

import Image from "next/image";
import { SearchEntityType, SearchResponse } from "../types/search";

interface SearchResultsProps {
    results: SearchResponse | null;
}

export default function SearchResults({
    results,
}: SearchResultsProps) {

    if (!results || results.results.length === 0) {
        return null;
    }

    return (
        <div className="p-4 space-y-2">

            {results.results.map((item) => (

                <button
                    key={`${item.entityType}-${item.id}`}
                    className="
                        flex
                        w-full
                        items-center
                        gap-3
                        rounded-xl
                        px-3
                        py-2
                        transition
                        hover:bg-slate-800
                    "
                >

                    <Image
                        src="/images/avatar.png"
                        alt={item.title}
                        width={40}
                        height={40}
                        className="rounded-lg object-cover"
                    />

                    <div className="flex-1 text-left">

                        <p className="font-medium text-white">
                            {item.title}
                        </p>

                        <p className="text-xs text-slate-400">
                            {item.subtitle}
                        </p>

                    </div>

                    <span
                        className="
                            rounded-full
                            bg-slate-800
                            px-2
                            py-1
                            text-[10px]
                            font-semibold
                            uppercase
                            text-slate-300
                        "
                    >
                        {item.entityType === SearchEntityType.STUDIO && "Studio"}
                        {item.entityType === SearchEntityType.PRODUCER && "Producer"}
                        {item.entityType === SearchEntityType.BEAT && "Beat"}
                        {item.entityType === SearchEntityType.ADVERTISEMENT && "Ad"}
                        {item.entityType === SearchEntityType.PROJECT && "Project"}
                        {item.entityType === SearchEntityType.SESSION && "Session"}
                        {item.entityType === SearchEntityType.USER && "User"}
                    </span>

                </button>

            ))}

        </div>
    );
}