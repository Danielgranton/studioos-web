
"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import FeaturedStudioCard from "./featuredStudioCard";
import { featuredStudios } from "./featuredStudiosData";

export default function FeaturedStudios() {
    return (
        <section
            className="
                relative
                py-24
            "
        >
            <div
                className="
                    mx-auto
                    max-w-[1600px]
                    px-6
                "
            >
                {/* Header */}

                <div
                    className="
                        mb-14
                        flex
                        flex-col
                        gap-8
                        lg:flex-row
                        lg:items-end
                        lg:justify-between
                    "
                >
                    <div className="max-w-2xl">

                        <span
                            className="
                                inline-flex
                                items-center
                                rounded-full
                                border
                                border-blue-500/20
                                bg-blue-500/10
                                px-3
                                py-1
                                text-xs
                                font-semibold
                                uppercase
                                tracking-[0.2em]
                                text-blue-400
                            "
                        >
                            Featured Studios
                        </span>

                        <h2
                            className="
                                mt-5
                                text-3xl
                                font-black
                                tracking-tight
                                text-white
                                md:text-4xl
                            "
                        >
                            Record in Kenya&apos;s best studios.
                        </h2>

                        <p
                            className="
                                mt-4
                                max-w-xl
                                text-base
                                leading-7
                                text-slate-400
                            "
                        >
                            Discover professional recording spaces trusted by
                            artists, producers and labels. Book instantly and
                            bring your next project to life.
                        </p>

                    </div>

                    <Link
                        href="/studios"
                        className="
                            inline-flex
                            items-center
                            gap-2
                            self-start
                            rounded-full
                            border
                            border-[#2b2b2b]
                            bg-[#171717]
                            px-5
                            py-3
                            text-sm
                            font-semibold
                            text-white
                            transition-all
                            hover:border-blue-500/40
                            hover:bg-[#202020]
                        "
                    >
                        View all studios

                        <ArrowRight
                            size={17}
                            className="transition-transform group-hover:translate-x-1"
                        />
                    </Link>

                </div>

                {/* Grid */}

                <div
                    className="
                        grid
                        gap-6
                        md:grid-cols-2
                        xl:grid-cols-3
                    "
                >
                    {featuredStudios.map((studio) => (
                        <FeaturedStudioCard
                            key={studio.id}
                            {...studio}
                        />
                    ))}
                </div>

            </div>
        </section>
    );
}

