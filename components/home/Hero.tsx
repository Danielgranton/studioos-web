

"use client";

import HeroContent from "./HeroContent";
import HeroMedia from "./HeroMedia";

export default function Hero() {
    return (
        <section
            className="
                relative
                overflow-hidden
                bg-[#0f0f0f]
            "
        >
            {/* Background glow */}

            <div
                className="
                    absolute
                    left-1/2
                    top-0
                    h-[700px]
                    w-[700px]
                    -translate-x-1/2
                    rounded-full
                    bg-red-600/10
                    blur-[180px]
                "
            />

            <div
                className="
                    relative
                    mx-auto
                    flex
                    min-h-[calc(100vh-7rem)]
                    max-w-[1600px]
                    items-center
                    gap-20
                    px-6
                    py-16
                "
            >
                {/* Left */}

                <div className="flex-1">
                    <HeroContent />
                </div>

                {/* Right */}

                <div className="hidden flex-1 lg:block">
                    <HeroMedia />
                </div>
            </div>
        </section>
    );
}