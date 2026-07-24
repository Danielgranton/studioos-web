
"use client";

import ExploreCard from "./ExploreCard";
import { exporeItems } from "./exploreData";

export default function ExploreSection() {
    return (
        <section
            className="
                relative
                overflow-hidden
                bg-[#0f0f0f]
                py-28
            "
        >
            {/* Background Glow */}

            <div
                className="
                    absolute
                    left-1/2
                    top-1/2
                    h-[700px]
                    w-[700px]
                    -translate-x-1/2
                    -translate-y-1/2
                    rounded-full
                    bg-blue-600/5
                    blur-[180px]
                "
            />

            <div
                className="
                    relative
                    mx-auto
                    max-w-[1600px]
                    px-6
                "
            >
                {/* Section Header */}

                <div className="mx-auto mb-16 max-w-3xl text-center">

                    <span
                        className="
                            inline-flex
                            items-center
                            rounded-full
                            border
                            border-blue-500/20
                            bg-blue-500/10
                            px-4
                            py-2
                            text-sm
                            font-medium
                            text-blue-400
                        "
                    >
                        🚀 Everything You Need
                    </span>

                    <h2
                        className="
                            mt-6
                            text-4xl
                            font-black
                            tracking-tight
                            text-white
                            md:text-5xl
                        "
                    >
                        Explore the Platform
                    </h2>

                    <p
                        className="
                            mt-6
                            text-lg
                            leading-8
                            text-slate-400
                        "
                    >
                        StudioOS brings every part of music creation into one
                        place—from finding studios and producers to buying
                        beats and growing your audience.
                    </p>

                </div>

                {/* Cards */}

                <div
                    className="
                        grid
                        grid-cols-1
                        gap-8
                        md:grid-cols-2
                    "
                >
                    {exporeItems.map((item) => (
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