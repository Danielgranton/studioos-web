"use client";

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

    const current = videos[currentIndex];

    useEffect(() => {
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
    }, [currentIndex]);

    const upNext = [1, 2, 3].map(
        (offset) => videos[(currentIndex + offset) % videos.length]
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
                border-slate-800
                bg-[#171717]
            "
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

                    <p className="mt-1 text-sm text-slate-300">
                        {current.tag}
                    </p>
                </div>
            </div>

            {/* Progress bar */}
            <div className="h-1 w-full shrink-0 bg-slate-800">
                <div
                    className="h-full bg-red-500 transition-[width] ease-linear"
                    style={{
                        width: `${progress}%`,
                        transitionDuration: `${AD_DURATION}s`,
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
                    border-slate-800
                    bg-[#141414]
                    p-3
                "
            >
                {upNext.map((video, i) => {
                    const realIndex = videos.findIndex(
                        (v) => v.id === video.id
                    );

                    return (
                        <button
                            key={`${video.id}-queue`}
                            onClick={() => setCurrentIndex(realIndex)}
                            className={`
                                flex
                                min-w-0
                                flex-1
                                items-center
                                gap-2
                                rounded-xl
                                border
                                border-slate-800
                                bg-[#171717]
                                p-2
                                text-left
                                transition
                                hover:border-red-500/40
                                ${i === 0 ? "opacity-100" : "opacity-60 hover:opacity-100"}
                            `}
                        >
                            <div
                                className="
                                    flex
                                    h-9
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
                                <p className="truncate text-xs font-semibold text-slate-200">
                                    {video.title}
                                </p>
                                <p className="truncate text-[10px] text-slate-500">
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