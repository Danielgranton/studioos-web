"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useState } from "react";

const AD_DURATION = 5;

const videos = [
    {
        id: 1,
        title: "Pulse Studio",
        video: "🎥",
        tag: "Recording • Afrobeat session",
    },
    {
        id: 2,
        title: "Dream Records",
        video: "🎥",
        tag: "Mixing • 2 producers online",
    },
    {
        id: 3,
        title: "Studio One",
        video: "🎥",
        tag: "Mastering • Hip-Hop EP",
    },
    {
        id: 4,
        title: "Elite Sound",
        video: "🎥",
        tag: "Live tracking • Gospel choir",
    },
];

export default function HeroAds() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [paused, setPaused] = useState(false);

    const current = videos[currentIndex];

    useEffect(() => {

        if (paused) return;

        setProgress(0);

        const startFrame = requestAnimationFrame(() => {
            requestAnimationFrame(() => setProgress(100));
        });

        const advance = setTimeout(() => {
            setCurrentIndex((i) => (i + 1) % videos.length);
        }, AD_DURATION * 1000);

        return () => {
            cancelAnimationFrame(startFrame);
            clearTimeout(advance);
        };

    }, [currentIndex, paused]);

    // Show the OTHER videos, not the one currently playing
    const upNext = Array.from({ length: videos.length - 1 }, (_, i) =>
        videos[(currentIndex + i + 1) % videos.length]
    );

    return (
        <div
            className="
                flex
                h-full
                w-full
                flex-col
                overflow-hidden
                rounded-3xl
                border
                border-b-blue-700
                border-[#272727]
                bg-[#171717]
            "
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >

            {/* Stage — currently playing ad, fills remaining space */}
            <div
                className="
                    relative
                    flex
                    flex-1
                    min-h-0
                    items-center
                    justify-center
                    bg-[#0f0f0f]
                    text-8xl
                "
            >
                {current.video}

                <div
                    className="
                        absolute
                        left-4
                        top-4
                        inline-flex
                        items-center
                        gap-1.5
                        rounded-full
                        border
                        border-red-500/20
                        bg-red-500/10
                        px-3
                        py-1
                        text-xs
                        font-medium
                        text-red-400
                    "
                >
                    <span className="relative flex h-1.5 w-1.5">
                        <span
                            className="
                                absolute
                                inline-flex
                                h-full
                                w-full
                                animate-ping
                                rounded-full
                                bg-green-500
                                opacity-75
                            "
                        />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" />
                    </span>
                    LIVE
                </div>

                <button
                    onClick={() => setPaused((p) => !p)}
                    aria-label={paused ? "Resume" : "Pause"}
                    className="
                        absolute
                        right-4
                        top-4
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-full
                        bg-black/50
                        text-white
                        backdrop-blur
                        transition
                        hover:bg-black/70
                    "
                >
                    {paused ? <Play size={14} /> : <Pause size={14} />}
                </button>

                <div
                    className="
                        absolute
                        bottom-0
                        left-0
                        right-0
                        bg-gradient-to-t
                        from-black/70
                        to-transparent
                        p-4
                        pt-10
                    "
                >
                    <p className="font-semibold text-white">
                        {current.title}
                    </p>

                    <p className="mt-1 text-sm text-[#aaaaaa]">
                        {current.tag}
                    </p>
                </div>
            </div>

            {/* Progress bar */}
            <div className="h-1 w-full  shrink-0 bg-[#272727]">
                <div
                    className="h-full bg-red-400 transition-[width] ease-linear"
                    style={{
                        width: `${progress}%`,
                        transitionDuration: paused ? "0s" : `${AD_DURATION}s`,
                    }}
                />
            </div>

            {/* Up next — same container, footer row */}
            <div
                className="
                    flex
                    shrink-0
                    gap-2
                    border-t
                    border-[#272727]
                    bg-[#141414]
                    p-4
                "
            >
                {upNext.map((video) => {
                    const realIndex = videos.findIndex((v) => v.id === video.id);

                    return (
                        <button
                            key={`${video.id}-queue`}
                            onClick={() => setCurrentIndex(realIndex)}
                            className="
                                flex
                                min-w-0
                                flex-1
                                items-center
                                gap-2
                                rounded-xl
                                border
                                border-green-800/60
                                bg-[#171717]
                                p-2
                                text-left
                                opacity-60
                                transition
                                hover:border-red-500/40
                                hover:opacity-100
                            "
                        >
                            <div
                                className="
                                    flex
                                    h-14
                                    w-9
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-[#0f0f0f]
                                    text-lg
                                "
                            >
                                {video.video}
                            </div>

                            <div className="min-w-0">
                                <p className="truncate text-xs font-semibold text-[#f1f1f1]">
                                    {video.title}
                                </p>
                                <p className="truncate text-[10px] text-[#717171]">
                                    {video.tag}
                                </p>
                            </div>
                        </button>
                    );
                })}
            </div>

        </div>
    );
}