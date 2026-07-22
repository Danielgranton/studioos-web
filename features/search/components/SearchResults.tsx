"use client";

import Image from "next/image";
import { SearchEntityType, SearchResponse } from "../types/search";

interface SearchResultsProps {
    results: SearchResponse | null;
}

const ENTITY_LABELS: Record<SearchEntityType, string> = {
    [SearchEntityType.STUDIO]: "Studio",
    [SearchEntityType.PRODUCER]: "Producer",
    [SearchEntityType.BEAT]: "Beat",
    [SearchEntityType.ADVERTISEMENT]: "Ad",
    [SearchEntityType.PROJECT]: "Project",
    [SearchEntityType.SESSION]: "Session",
    [SearchEntityType.USER]: "User",
};

export default function SearchResults({
    results,
}: SearchResultsProps) {

    if (!results || results.results.length === 0) {
        return null;
    }

    return (
        <div className="space-y-1 p-2">

            {results.results.map((item) => (

                <button
                    key={`${item.entityType}-${item.id}`}
                    className="
                        flex
                        w-full
                        items-center
                        gap-3
                        rounded-lg
                        px-3
                        py-2
                        transition
                        hover:bg-[#272727]
                    "
                >

                    <Image
                        src={item.imageUrl || "/images/avatar.png"}
                        alt={item.title}
                        width={40}
                        height={40}
                        className="rounded-md object-cover"
                    />

                    <div className="flex-1 text-left">

                        <p className="text-sm font-medium text-white">
                            {item.title}
                        </p>

                        <p className="text-xs text-[#aaaaaa]">
                            {item.subtitle}
                        </p>

                    </div>

                    <span
                        className="
                            rounded-full
                            bg-[#272727]
                            px-2
                            py-1
                            text-[10px]
                            font-semibold
                            uppercase
                            text-[#aaaaaa]
                        "
                    >
                        {ENTITY_LABELS[item.entityType]}
                    </span>

                </button>

            ))}

        </div>
    );
}