"use client";

import { SearchResponse } from "../types/search";
import Image from "next/image";

interface SearchResultsProps {
    results: SearchResponse | null;
}

export default function SearchResults({
    results,
}: SearchResultsProps) {

    if (!results) return null;

    return (
        <div className="p-4 space-y-6">

            {results.studios.length > 0 && (

                <div>

                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Studios
                    </h3>

                    <div className="space-y-2">

                        {results.studios.map((studio) => (

                            <button
                                key={studio.id}
                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-slate-800"
                            >
                                <Image
                                    src={studio.coverImage}
                                    alt={studio.name}
                                    className="h-10 w-10 rounded-lg object-cover"
                                />

                                <div className="text-left">

                                    <p className="font-medium text-white">
                                        {studio.name}
                                    </p>

                                    <p className="text-xs text-slate-400">
                                        {studio.city}, {studio.county}
                                    </p>

                                </div>

                            </button>

                        ))}

                    </div>

                </div>

            )}

            {results.producers.length > 0 && (

                <div>

                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Producers
                    </h3>

                    <div className="space-y-2">

                        {results.producers.map((producer) => (

                            <button
                                key={producer.id}
                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-slate-800"
                            >
                                <Image
                                    src={producer.profilePicture}
                                    alt={producer.name}
                                    className="h-10 w-10 rounded-full object-cover"
                                />

                                <div className="text-left">

                                    <p className="font-medium text-white">
                                        {producer.name}
                                    </p>

                                    <p className="text-xs text-slate-400">
                                        @{producer.username}
                                    </p>

                                </div>

                            </button>

                        ))}

                    </div>

                </div>

            )}

            {results.beats.length > 0 && (

                <div>

                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Beats
                    </h3>

                    <div className="space-y-2">

                        {results.beats.map((beat) => (

                            <button
                                key={beat.id}
                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-slate-800"
                            >
                                <Image
                                    src={beat.coverImage}
                                    alt={beat.title}
                                    className="h-10 w-10 rounded-lg object-cover"
                                />

                                <div className="text-left">

                                    <p className="font-medium text-white">
                                        {beat.title}
                                    </p>

                                    <p className="text-xs text-slate-400">
                                        {beat.producerName}
                                    </p>

                                </div>

                            </button>

                        ))}

                    </div>

                </div>

            )}

        </div>
    );
}