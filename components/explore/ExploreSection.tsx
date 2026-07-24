
"use client";

import ExploreCard from "./ExploreCard";
import { exploreItems } from "./exploreData";

export default function ExploreSection() {
    return (
        <section
            className="
                relative
                overflow-hidden
                py-15
            "
        >
            <div className="mx-auto max-w-[1600px] px-6">

                {/* Header */}

                <div
                    className="
                        mb-10
                        flex
                        items-end
                        justify-between
                        gap-10
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
                                font-medium
                                uppercase
                                tracking-widest
                                text-blue-400
                            "
                        >
                            Explore
                        </span>

                        <h2
                            className="
                                mt-3
                                text-3xl
                                font-bold
                                tracking-tight
                                text-white
                                md:text-4xl
                            "
                        >
                            Everything you need to create music.
                        </h2>

                        <p
                            className="
                                mt-2
                                max-w-xl
                                text-sm
                                leading-7
                                text-slate-400
                            "
                        >
                            Discover studios, producers, artists, beats,
                            creative services and promotional tools—all in
                            one platform.
                        </p>

                    </div>
<div
    className="
        hidden
        lg:flex
        items-center
        gap-4
        rounded-full
        border
        border-[#262626]
        bg-[#171717]
        px-4
        py-2
    "
>
    <div className="flex -space-x-2">

        <div className="h-7 w-7 rounded-full border-2 border-[#171717] bg-blue-500" />

        <div className="h-7 w-7 rounded-full border-2 border-[#171717] bg-purple-500" />

        <div className="h-7 w-7 rounded-full border-2 border-[#171717] bg-green-500" />

        <div className="h-7 w-7 rounded-full border-2 border-[#171717] bg-orange-500" />

    </div>

    <div>

        <p className="text-xs font-semibold text-white">
            Join 250K+ creators
        </p>

        <p className="text-[11px] text-slate-500">
            Studios • Artists • Producers
        </p>

    </div>
</div>

                </div>

                {/* Cards */}

                <div
                    className="
                        grid
                        gap-5
                        sm:grid-cols-2
                        md:grid-cols-3
                        xl:grid-cols-4
                        
                    "
                >
                    {exploreItems.map((item) => (
                        <ExploreCard
                            key={item.title}
                            {...item}
                        />
                    ))}
                </div>

            </div>
        </section>
    );
}

