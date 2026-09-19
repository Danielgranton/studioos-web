"use client";

import Image from "next/image";
import Link from "next/link";
import {
    ArrowRight,
    BadgeCheck,
    Clock3,
    Heart,
    Loader2,
    Pause,
    Play,
    SkipBack,
    SkipForward,
    Star,
} from "lucide-react";
import { BeatService } from "@/features/beatmarketplace";
import { useEffect, useRef, useState } from "react";

interface BeatCardProps {
    id: number | string;
    slug: string;
    title: string;
    producer: string;
    thumbnail: string;
    genre: string;
    bpm: number;
    musicalKey: string;
    price: string;
    plays: number;
    likes: number;
    duration: string;
    durationSeconds?: number;
    exclusive: boolean;
    verified: boolean;
    loading?: "eager" | "lazy";
    averageRating?: number;
    reviewCount?: number;
}

export function BeatCard({
    id,
    slug,
    title,
    producer,
    thumbnail,
    genre,
    bpm,
    musicalKey,
    price,
    plays,
    likes,
    duration,
    durationSeconds = 0,
    exclusive,
    verified,
    loading = "lazy",
    averageRating = 0,
    reviewCount = 0,
}: BeatCardProps) {
    const [playing, setPlaying] = useState(false);
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(likes);
    const [likeLoading, setLikeLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [previewLoading, setPreviewLoading] = useState(false);
    const [previewError, setPreviewError] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const parsedDuration = Number(duration.split(":")[0]) * 60 + Number(duration.split(":")[1]);
    const [trackDuration, setTrackDuration] = useState(durationSeconds > 0 ? durationSeconds : parsedDuration > 0 ? parsedDuration : 70);
    const [autoplayPreview, setAutoplayPreview] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        let active = true;
        setLikeCount(likes);
        setLiked(false);
        void BeatService.getLikeState(String(id))
            .then((state) => {
                if (!active) return;
                setLiked(state.liked);
                setLikeCount(state.likeCount);
            })
            .catch(() => {
                // Anonymous visitors may not have a like state yet.
            });
        return () => { active = false; };
    }, [id, likes]);

    useEffect(() => {
        if (!previewUrl || !autoplayPreview || !audioRef.current) return;
        setAutoplayPreview(false);
        void audioRef.current.play().catch(() => { setPreviewError(true); setPlaying(false); });
    }, [previewUrl, autoplayPreview]);

    const handlePlayClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (previewLoading) return;
        setPreviewError(false);
        if (!previewUrl) {
            setPreviewLoading(true);
            setAutoplayPreview(true);
            try {
                setPreviewUrl(await BeatService.getPreviewUrl(String(id)));
            } catch {
                setPreviewError(true);
                setAutoplayPreview(false);
            } finally {
                setPreviewLoading(false);
            }
            return;
        }
        if (playing) audioRef.current?.pause();
        else void audioRef.current?.play().catch(() => setPreviewError(true));
    };

    const handleSeek = (value: string) => {
        const nextTime = Math.min(Number(value), trackDuration);
        if (audioRef.current) audioRef.current.currentTime = nextTime;
        setCurrentTime(nextTime);
    };

    const seekBy = (seconds: number) => handleSeek(String(Math.max(0, Math.min(currentTime + seconds, trackDuration))));

    const formatTime = (value: number) => `${Math.floor(value / 60)}:${Math.floor(value % 60).toString().padStart(2, "0")}`;
    const displayDuration = durationSeconds > 0 ? formatTime(durationSeconds) : duration;
    const accessibleDuration = Math.min(70, trackDuration);
    const playedPercent = trackDuration ? (currentTime / trackDuration) * 100 : 0;
    const accessiblePercent = trackDuration ? (accessibleDuration / trackDuration) * 100 : 100;

    const handleLikeClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (likeLoading) return;
        setLikeLoading(true);
        try {
            const state = liked
                ? await BeatService.unlikeBeat(String(id))
                : await BeatService.likeBeat(String(id));
            setLiked(state.liked);
            setLikeCount(state.likeCount);
        } catch {
            // Keep the current visual state when the API rejects the action.
        } finally {
            setLikeLoading(false);
        }
    };

    return (
        <Link
            href={`/marketplace/${slug}`}
            className="
                group
                relative
                flex
                flex-col
                overflow-hidden
                rounded-2xl
                border
                border-[#2a2825]
                bg-[#161513]
                p-2
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-[#e8a33d]/30
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#e8a33d]/60
            "
        >
            {/* Background glow */}
            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    -right-14
                    -top-14
                    h-28
                    w-28
                    rounded-full
                    bg-[#e8a33d]/10
                    opacity-0
                    blur-3xl
                    transition-opacity
                    duration-300
                    group-hover:opacity-100
                "
            />

            {/* Artwork */}
            <div
                className="
                    relative
                    aspect-[4/3]
                    w-full
                    overflow-hidden
                    rounded-xl
                    bg-[#0e0d0c]
                    sm:aspect-[16/11]
                "
            >
                <Image
                    src={thumbnail}
                    alt={title}
                    fill
                    loading={loading}
                    sizes="(min-width: 1000px) 20vw, (min-width: 700px) 30vw, 40vw"
                    className="
                        object-cover
                        transition-transform
                        duration-500
                        ease-out
                        group-hover:scale-[1.06]
                    "
                />

                <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent"
                />

                {/* License and rating — stacked so the purchase signal comes first */}
                <div className="absolute left-2 top-2 flex flex-col items-start gap-1">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/90 px-1.5 py-0.5 text-[9px] font-semibold text-white backdrop-blur-md">
                        {exclusive ? "Exclusive" : "Standard license"}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-black/65 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-white backdrop-blur-md">
                        <Star size={9} className="fill-[#e8a33d] text-[#e8a33d]" />
                        {averageRating > 0 ? averageRating.toFixed(1) : "New"}
                        {reviewCount > 0 && <span className="text-[#c3bfb5]">({reviewCount})</span>}
                    </span>
                </div>

                {/* BPM chip — mono readout, same slot as rating on the studio card */}
                <div
                    className="
                        absolute
                        right-2
                        top-2
                        flex
                        items-center
                        gap-0.5
                        rounded-full
                        bg-black/60
                        px-1.5
                        py-0.5
                        font-mono
                        text-[9px]
                        font-semibold
                        text-white
                        backdrop-blur-md
                    "
                >
                    {bpm} BPM
                </div>

                {/* Price */}
                <div className="absolute bottom-2 left-2">
                    <div className="rounded-lg bg-black/60 px-2 py-1 backdrop-blur-md">
                        <p className="font-mono text-xs font-bold leading-tight text-white">
                            {price}
                        </p>
                    </div>
                </div>

                {/* Like — stays red when active, that convention overrides the brand accent */}
                <button
                    onClick={handleLikeClick}
                    aria-label={liked ? "Unlike" : "Like"}
                    className="
                        absolute
                        right-2
                        bottom-2
                        z-10
                        flex
                        h-6
                        w-6
                        items-center
                        justify-center
                        rounded-full
                        bg-black/50
                        opacity-0
                        backdrop-blur-md
                        transition-all
                        duration-200
                        group-hover:opacity-100
                        hover:bg-black/70
                    "
                >
                    <Heart
                        size={12}
                        className={likeLoading ? "animate-pulse text-white/60" : liked ? "fill-red-500 text-red-500" : "text-white"}
                    />
                </button>
            </div>

            {/* Content — mirrors FeaturedStudioCard's structure exactly */}
            <div className="flex min-w-0 flex-1 flex-col p-2.5">

                {/* Header — title + verified badge, badge pill on the right */}
                <div className="flex items-start justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-1">
                        <h3 className="truncate text-sm font-semibold tracking-tight text-[#f5f4f1]">
                            {title}
                        </h3>
                        {verified && (
                            <BadgeCheck size={13} className="shrink-0 text-[#5eead4]" />
                        )}
                    </div>

                    <span
                        className="
                            shrink-0
                            rounded-full
                            border
                            border-[#e8a33d]/20
                            bg-[#e8a33d]/10
                            px-2
                            py-0.5
                            text-[10px]
                            font-semibold
                            text-[#e8a33d]
                        "
                    >
                        {genre}
                    </span>
                </div>

                {/* Producer + duration — same slot as location + bookings */}
                <div className="mt-1 flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[10px] text-[#9a978f]">
                    <span className="min-w-0 truncate">
                        by {producer}
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock3 size={11} />
                        {displayDuration}
                    </span>
                </div>

                <audio ref={audioRef} preload="metadata" src={previewUrl || undefined} onLoadedMetadata={(event) => { const duration = event.currentTarget.duration || 0; setTrackDuration((current) => Math.max(current, duration)); }} onTimeUpdate={(event) => { const media = event.currentTarget; const nextTime = Math.min(media.currentTime, accessibleDuration); if (media.currentTime >= accessibleDuration) { media.pause(); media.currentTime = accessibleDuration; setPlaying(false); } setCurrentTime(nextTime); }} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => { setPlaying(false); setCurrentTime(0); }} onError={() => { setPreviewError(true); setPlaying(false); }} className="hidden" />

                {/* Spotify-style inline transport with a visible private remainder */}
                <div className="mt-2" onClick={(event) => { event.preventDefault(); event.stopPropagation(); }}>
                    <div className="flex items-center justify-center gap-3"><span className="mr-1 flex items-center gap-1 font-mono text-[9px] text-[#777]"><span className="text-[#e8a33d]">{plays.toLocaleString()}</span><span className="hidden sm:inline">plays</span></span><button type="button" onClick={(event) => { event.preventDefault(); event.stopPropagation(); seekBy(-10); }} aria-label="Skip back 10 seconds" className="text-[#999] transition hover:text-white"><SkipBack size={13} fill="currentColor" /></button><button type="button" onClick={handlePlayClick} aria-label={playing ? "Pause preview" : "Play preview"} title={previewError ? "Preview unavailable" : "Play preview"} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1ed760] text-[#071b0d] transition hover:scale-105 hover:bg-[#1fdf66]">{previewLoading ? <Loader2 size={12} className="animate-spin" /> : playing ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" className="ml-0.5" />}</button><button type="button" onClick={(event) => { event.preventDefault(); event.stopPropagation(); seekBy(10); }} aria-label="Skip forward 10 seconds" className="text-[#999] transition hover:text-white"><SkipForward size={13} fill="currentColor" /></button><span className="ml-1 flex items-center gap-1 font-mono text-[9px] text-[#777]"><Heart size={10} className="text-red-400" />{likeCount.toLocaleString()}</span></div>
                    <div className="mt-2 flex items-center gap-2"><span className="w-7 text-right font-mono text-[9px] text-[#777]">{formatTime(currentTime)}</span><div className="relative min-w-0 flex-1"><input aria-label="Preview position" type="range" min="0" max={trackDuration} step="0.01" value={Math.min(currentTime, trackDuration)} onChange={(event) => handleSeek(event.target.value)} style={{ background: `linear-gradient(to right, #fff 0%, #fff ${playedPercent}%, #777 ${playedPercent}%, #777 ${accessiblePercent}%, #ef4444 ${accessiblePercent}%, #ef4444 100%)` }} className="relative z-10 h-1 w-full cursor-pointer appearance-none rounded-full accent-white" />{accessiblePercent < 100 && <span aria-hidden="true" className="pointer-events-none absolute top-1/2 z-20 h-2.5 w-px -translate-y-1/2 bg-red-400" style={{ left: `${accessiblePercent}%` }} />}</div><span className="w-7 font-mono text-[9px] text-[#777]">{formatTime(trackDuration)}</span></div>
                </div>

                {/* Footer — identical structure to FeaturedStudioCard's */}
                <div className="mt-2 flex items-center justify-between gap-2 border-t border-[#2a2825] pt-2">
                    <span className="truncate font-mono text-[10px] text-[#6b685f]">
                        {musicalKey}
                    </span>

                    <div
                        className="
                            flex
                            shrink-0
                            items-center
                            gap-1
                            rounded-full
                            bg-[#e8a33d]
                            px-2.5
                            py-1
                            text-[11px]
                            font-semibold
                            text-[#161513]
                            transition-all
                            duration-300
                            group-hover:gap-1.5
                            group-hover:bg-[#f0b458]
                        "
                    >
                        View Beat
                        <ArrowRight
                            size={12}
                            className="transition-transform duration-300 group-hover:translate-x-0.5"
                        />
                    </div>
                </div>

            </div>

        </Link>
    );
}
