"use client";

import HeroLeft from "./HeroLeft";
import HeroAds from "./HeroAds";

export default function Hero() {
    return (
        <section
            className="
                relative
                overflow-hidden
                bg-[#0f0f0f]
            "
            style={{
                WebkitMaskImage:
                    "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
                maskImage:
                    "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
            }}
        >
            {/* Background Glow */}
            <div
                className="
                    absolute
                    left-1/2
                    top-0
                    h-[900px]
                    w-[900px]
                    -translate-x-1/2
                    rounded-full
                    bg-blue-600/10
                    blur-[200px]
                    py-10
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
                    gap-16
                    px-6
                    py-10
                "
            >
                {/* Left */}
                <div className="w-1/2">
                    <HeroLeft />
                </div>

                {/* Right */}
                <div className="hidden h-[600px] w-1/2 lg:block">
                    <HeroAds />
                </div>
            </div>
        </section>
    );
}