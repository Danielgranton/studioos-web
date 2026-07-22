"use client";

import HeroButtons from "./HeroButtons";
import HeroStats from "./HeroStats";

export default function HeroContent() {
    return (
        <div className="max-w-2xl">

            {/* Badge */}

            <div
                className="
                    mb-6
                    inline-flex
                    items-center
                    rounded-full
                    border
                    border-red-500/20
                    bg-red-500/10
                    px-4
                    py-2
                    text-sm
                    font-medium
                    text-red-400
                "
            >
                🎵 The Complete Music Production Platform
            </div>

            {/* Heading */}

            <h1
                className="
                    text-5xl
                    font-black
                    leading-tight
                    tracking-tight
                    text-white
                    md:text-6xl
                    xl:text-7xl
                "
            >
                Create Music

                <span className="block text-red-500">
                    Without Limits
                </span>
            </h1>

            {/* Description */}

            <p
                className="
                    mt-8
                    max-w-xl
                    text-lg
                    leading-8
                    text-slate-400
                "
            >
                Book professional studios, hire talented producers,
                discover exclusive beats, and collaborate with artists—
                all in one platform built for creators.
            </p>

            {/* Buttons */}

            <div className="mt-10">
                <HeroButtons />
            </div>

            {/* Stats */}

            <div className="mt-14">
                <HeroStats />
            </div>

        </div>
    );
}