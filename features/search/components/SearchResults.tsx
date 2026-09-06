"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { StudioService } from "@/features/studio";
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

export function SearchResults({
    results,
}: SearchResultsProps) {
    const router = useRouter();

    if (!results || results.results.length === 0) {
        return null;
    }

    function openResult(entityType: SearchEntityType, id: string) {
        if (entityType === SearchEntityType.STUDIO) {
            router.push(`/studios/${id}`);
        }
    }

    return (
        <div className="space-y-1 p-2">

            {results.results.map((item) => (

                <button
                    key={`${item.entityType}-${item.id}`}
                    type="button"
                    onClick={() => openResult(item.entityType, item.id)}
                    disabled={item.entityType !== SearchEntityType.STUDIO}
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

                    <SearchResultImage item={item} />

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

function SearchResultImage({ item }: { item: SearchResponse["results"][number] }) {
    const [image, setImage] = useState(item.image || "/images/avatar.png");

    useEffect(() => {
        if (item.entityType !== SearchEntityType.STUDIO || item.image) return;

        let active = true;
        void StudioService.getStudio(item.id)
            .then((studio) => {
                if (!active) return;
                setImage(
                    studio.profileImageThumbnail ||
                        studio.profileImageMedium ||
                        studio.profileImage ||
                        "/images/avatar.png",
                );
            })
            .catch(() => undefined);

        return () => {
            active = false;
        };
    }, [item.entityType, item.id, item.image]);

    return (
        <Image
            src={image}
            alt={item.title}
            width={40}
            height={40}
            unoptimized
            className="h-10 w-10 rounded-md object-cover"
        />
    );
}
