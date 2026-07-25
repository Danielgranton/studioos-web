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
        >
            {/* Background — glow pair + grid. Mask lives HERE only, so it fades without touching HeroLeft/HeroAds */}
            <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                    WebkitMaskImage:
                        "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%), linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
                    WebkitMaskComposite: "source-in",
                    maskImage:
                        "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%), linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
                    maskComposite: "intersect",
                }}
            >
                <div
                    className="
                        absolute
                        left-1/4
                        top-0
                        h-[900px]
                        w-[900px]
                        -translate-x-1/2
                        rounded-full
                        bg-blue-600/10
                        blur-[200px]
                    "
                />
                <div
                    className="
                        absolute
                        right-0
                        top-1/3
                        h-[500px]
                        w-[500px]
                        translate-x-1/4
                        rounded-full
                        bg-blue-500/10
                        blur-[160px]
                    "
                />
                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage:
                            "linear-gradient(to right, #3b82f6 1px, transparent 1px), linear-gradient(to bottom, #3b82f6 1px, transparent 1px)",
                        backgroundSize: "56px 56px",
                    }}
                />
            </div>

            {/* Ambient waveform baseline — also decorative, keep it masked with the background */}
            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    inset-x-0
                    bottom-[20%]
                    flex
                    h-20
                    items-end
                    justify-center
                    gap-[3px]
                    opacity-[0.12]
                "
            >
                {[
                    14, 26, 10, 34, 18, 40, 12, 30, 20, 44, 16, 36, 10, 28,
                    15, 38, 22, 32, 12, 26, 18, 42, 14, 30,
                ].map((h, i) => (
                    <span
                        key={i}
                        className="w-[3px] animate-pulse rounded-full bg-blue-400"
                        style={{
                            height: `${h}px`,
                            animationDelay: `${i * 0.09}s`,
                            animationDuration: "1.6s",
                        }}
                    />
                ))}
            </div>

            {/* Content — full opacity, no mask, no fade */}
            <div
                className="
                    relative
                    z-10
                    mx-auto
                    flex
                    min-h-[calc(100vh-7rem)]
                    max-w-[1600px]
                    flex-col
                    items-center
                    gap-10
                    px-6
                    py-9
                    lg:flex-row
                    lg:items-stretch
                    lg:gap-9
                    lg:py-9
                "
            >
                {/* Left */}
                <div className="flex w-full items-center lg:w-1/2">
                    <HeroLeft />
                </div>

                {/* Right — video panel */}
                <div className="h-[380px] w-full sm:h-[460px] lg:h-auto lg:w-1/2">
                    <HeroAds />
                </div>
            </div>
        </section>
    );
}