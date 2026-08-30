"use client";

import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useEffect, useState } from "react";

const AD_DURATION = 5;

const videos = [
    { id: 1, title: "Pulse Studio", emoji: "🎙️", tag: "Recording • Afrobeat session", meta: "Nairobi" },
    { id: 2, title: "Dream Records", emoji: "🎚️", tag: "Mixing • 2 producers online", meta: "Lagos" },
    { id: 3, title: "Studio One", emoji: "🎹", tag: "Mastering • Hip-Hop EP", meta: "Accra" },
    { id: 4, title: "Elite Sound", emoji: "🎤", tag: "Live tracking • Gospel choir", meta: "Kampala" },
];

export function HeroAds() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [paused, setPaused] = useState(false);
    const [muted, setMuted] = useState(true);

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

    const upNext = Array.from({ length: videos.length - 1 }, (_, i) =>
        videos[(currentIndex + i + 1) % videos.length]
    );

    return (
        <div
            className="
                group
                relative
                h-full
                w-full
                overflow-hidden
                rounded-[28px]
                border
                border-white/[0.08]
                bg-[#0a0a0a]
                shadow-[0_25px_70px_-20px_rgba(0,0,0,0.7)]
                ring-1
                ring-black/5
            "
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            {/* Media layer — swap for <video> / <Image fill /> later */}
            <div
                key={current.id}
                className="
                    hero-ads-fade
                    absolute
                    inset-0
                    flex
                    items-center
                    justify-center
                    bg-[radial-gradient(circle_at_50%_40%,#1c1c1c,#050505)]
                "
            >
                <span
                    className="
                        hero-ads-emoji
                        text-[8rem]
                        leading-none
                        drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]
                        sm:text-[10rem]
                        lg:text-[11rem]
                    "
                >
                    {current.emoji}
                </span>
            </div>

            {/* Fine grain + vignette for depth and legibility */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay"
                style={{
                    backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                }}
            />
            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-black
                    via-black/5
                    to-black/40
                "
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent"
            />

            {/* Top bar — progress, index counter, live badge, controls */}
            <div className="absolute inset-x-0 top-0 z-10 flex flex-col gap-3 p-4">
                <div className="flex items-center gap-3">
                    <div className="flex flex-1 gap-1">
                        {videos.map((video, i) => (
                            <div
                                key={video.id}
                                className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/15"
                            >
                                <div
                                    className="h-full rounded-full bg-white transition-[width] ease-linear"
                                    style={{
                                        width:
                                            i < currentIndex
                                                ? "100%"
                                                : i === currentIndex
                                                    ? `${progress}%`
                                                    : "0%",
                                        transitionDuration:
                                            i === currentIndex && !paused
                                                ? `${AD_DURATION}s`
                                                : "0s",
                                    }}
                                />
                            </div>
                        ))}
                    </div>

                    <div
                        className="
                            inline-flex
                            shrink-0
                            items-center
                            gap-1.5
                            rounded-full
                            border
                            border-red-500/30
                            bg-red-500/15
                            px-2.5
                            py-1
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-wider
                            text-red-400
                            backdrop-blur-md
                        "
                    >
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500" />
                        </span>
                        Live
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium tracking-wide text-white/50">
                        {String(currentIndex + 1).padStart(2, "0")} / {String(videos.length).padStart(2, "0")}
                    </span>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setMuted((m) => !m)}
                            aria-label={muted ? "Unmute" : "Mute"}
                            className="
                                flex
                                h-8
                                w-8
                                items-center
                                justify-center
                                rounded-full
                                bg-white/10
                                text-white
                                opacity-0
                                backdrop-blur-md
                                transition
                                hover:bg-white/20
                                group-hover:opacity-100
                            "
                        >
                            {muted ? <VolumeX size={13} /> : <Volume2 size={13} />}
                        </button>

                        <button
                            onClick={() => setPaused((p) => !p)}
                            aria-label={paused ? "Resume" : "Pause"}
                            className="
                                flex
                                h-8
                                w-8
                                items-center
                                justify-center
                                rounded-full
                                bg-white/10
                                text-white
                                backdrop-blur-md
                                transition
                                hover:bg-white/20
                            "
                        >
                            {paused ? <Play size={13} /> : <Pause size={13} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Center pause affordance */}
            {paused && (
                <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/50 backdrop-blur-md">
                        <Play size={24} className="translate-x-0.5 text-white" />
                    </div>
                </div>
            )}

            {/* Bottom panel — title block + up-next rail */}
            <div className="absolute inset-x-0 bottom-0 z-10 p-4 pt-8">
                <div className="mb-4 flex items-end justify-between gap-3">
                    <div className="min-w-0">
                        <div className="mb-1.5 flex items-center gap-2">
                            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-blue-400">
                                Featured Studio
                            </span>
                            <span className="text-[10px] text-white/30">•</span>
                            <span className="text-[10px] font-medium text-white/50">
                                {current.meta}
                            </span>
                        </div>
                        <p className="truncate text-xl font-bold text-white sm:text-2xl">
                            {current.title}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-white/60 sm:text-sm">
                            {current.tag}
                        </p>
                    </div>

                    <button
                        className="
                            hidden
                            shrink-0
                            items-center
                            gap-1.5
                            rounded-full
                            bg-blue-500
                            px-4
                            py-2
                            text-xs
                            font-semibold
                            text-white
                            transition
                            hover:bg-white/90
                            sm:flex
                        "
                    >
                        View
                    </button>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {upNext.map((video) => {
                        const realIndex = videos.findIndex((v) => v.id === video.id);

                        return (
                            <button
                                key={`${video.id}-queue`}
                                onClick={() => setCurrentIndex(realIndex)}
                                aria-label={`Play ${video.title}`}
                                className="
                                    flex
                                    shrink-0
                                    items-center
                                    gap-2
                                    rounded-2xl
                                    border
                                    border-white/[0.08]
                                    bg-white/[0.06]
                                    py-1.5
                                    pl-1.5
                                    pr-3.5
                                    backdrop-blur-md
                                    transition-all
                                    duration-200
                                    hover:scale-[1.03]
                                    hover:border-white/20
                                    hover:bg-white/[0.12]
                                "
                            >
                                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-base">
                                    {video.emoji}
                                </span>
                                <span className="whitespace-nowrap text-[11px] font-semibold text-white">
                                    {video.title}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Outer glow ring on hover — subtle premium touch */}
            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    inset-0
                    rounded-[28px]
                    ring-1
                    ring-inset
                    ring-white/[0.06]
                    transition
                    group-hover:ring-white/[0.12]
                "
            />

            <style>{`
                .hero-ads-fade {
                    animation: hero-ads-fade-in 0.7s ease-out;
                }
                .hero-ads-emoji {
                    animation: hero-ads-emoji-in 0.8s cubic-bezier(0.16, 1, 0.3, 1);
                }
                @media (prefers-reduced-motion: reduce) {
                    .hero-ads-fade,
                    .hero-ads-emoji {
                        animation: none;
                    }
                }
                @keyframes hero-ads-fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes hero-ads-emoji-in {
                    from {
                        opacity: 0;
                        transform: scale(1.08);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
            `}</style>
        </div>
    );
}
