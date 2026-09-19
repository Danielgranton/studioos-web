"use client";

import Image from "next/image";
import { createContext, useContext, useRef, useState, type ReactNode } from "react";
import { Pause, Play, SkipBack, SkipForward, Volume2, X } from "lucide-react";

type ProducerTrack = { id: string; title: string; thumbnailUrl?: string | null; audioUrl: string };
type PlaybackContextValue = {
    track: ProducerTrack | null;
    playing: boolean;
    currentTime: number;
    duration: number;
    bufferedTime: number;
    setTrack: (track: ProducerTrack) => void;
    toggle: () => void;
    restart: () => void;
    skipForward: () => void;
    seek: (time: number) => void;
    dismiss: () => void;
};

const PlaybackContext = createContext<PlaybackContextValue | null>(null);

export function ProducerPlaybackProvider({ children }: { children: ReactNode }) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [track, setTrackState] = useState<ProducerTrack | null>(null);
    const [playing, setPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [bufferedTime, setBufferedTime] = useState(0);

    function setTrack(nextTrack: ProducerTrack) {
        setTrackState((current) => current?.id === nextTrack.id && current.audioUrl === nextTrack.audioUrl ? current : nextTrack);
        if (track?.id !== nextTrack.id) {
            setPlaying(false);
            setCurrentTime(0);
            setDuration(0);
            setBufferedTime(0);
        }
    }

    function toggle() {
        if (!audioRef.current) return;
        if (playing) audioRef.current.pause();
        else void audioRef.current.play();
    }

    function restart() {
        if (audioRef.current) audioRef.current.currentTime = 0;
    }

    function skipForward() {
        if (audioRef.current) audioRef.current.currentTime = Math.min(audioRef.current.currentTime + 10, duration);
    }

    function seek(time: number) {
        if (audioRef.current) audioRef.current.currentTime = time;
    }

    function dismiss() {
        audioRef.current?.pause();
        setTrackState(null);
        setPlaying(false);
        setCurrentTime(0);
    }

    const value = { track, playing, currentTime, duration, bufferedTime, setTrack, toggle, restart, skipForward, seek, dismiss };

    return <PlaybackContext.Provider value={value}>
        {children}
        {track && <audio ref={audioRef} preload="metadata" src={track.audioUrl} onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)} onProgress={(event) => { const media = event.currentTarget; if (media.buffered.length) setBufferedTime(media.buffered.end(media.buffered.length - 1)); }} onTimeUpdate={(event) => { const media = event.currentTarget; setCurrentTime(media.currentTime); if (media.buffered.length) setBufferedTime(media.buffered.end(media.buffered.length - 1)); }} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => { setPlaying(false); setCurrentTime(0); }} className="hidden" />}
        <DashboardPlaybackDock />
    </PlaybackContext.Provider>;
}

export function useProducerPlayback() {
    const context = useContext(PlaybackContext);
    if (!context) throw new Error("useProducerPlayback must be used within ProducerPlaybackProvider");
    return context;
}

function DashboardPlaybackDock() {
    const { track, playing, currentTime, duration, toggle, restart, skipForward, seek, dismiss } = useProducerPlayback();
    if (!track) return null;
    const playedPercent = duration ? Math.min(100, (currentTime / duration) * 100) : 0;

    return <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 min-h-24 bg-gradient-to-b from-transparent via-[#101010]/75 to-[#101010] px-3 pb-2 pt-3 backdrop-blur-[3px] sm:px-6 sm:pb-3 sm:pt-4">
        <div className="pointer-events-auto mx-auto grid max-w-6xl items-end gap-x-8 gap-y-3 sm:grid-cols-[minmax(170px,0.8fr)_minmax(300px,1.5fr)_minmax(70px,0.35fr)]">
            <div className="flex min-w-0 items-center gap-3"><div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-[#282828]">{track.thumbnailUrl ? <Image src={track.thumbnailUrl} alt="" fill sizes="48px" className="object-cover" unoptimized /> : <div className="flex h-full items-center justify-center text-[#a7a7a7]"><Volume2 size={16} /></div>}</div><div className="min-w-0"><p className="truncate text-sm font-medium text-white">{track.title}</p><p className="mt-1 truncate text-[10px] uppercase tracking-[0.14em] text-[#777]">Producer playback · Full master</p></div></div>
            <div className="min-w-0"><div className="flex items-center justify-center gap-5 text-[#b3b3b3]"><button type="button" aria-label="Restart beat" onClick={restart} className="transition hover:text-white"><SkipBack size={16} fill="currentColor" /></button><button type="button" aria-label={playing ? "Pause beat" : "Play beat"} onClick={toggle} className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black transition hover:scale-105">{playing ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}</button><button type="button" aria-label="Skip forward 10 seconds" onClick={skipForward} className="transition hover:text-white"><SkipForward size={16} fill="currentColor" /></button></div><div className="mt-2 flex items-center gap-2"><span className="w-8 text-right font-mono text-[10px] text-[#a7a7a7]">{formatTime(currentTime)}</span><input aria-label="Beat playback position" type="range" min="0" max={duration || 0} step="0.01" value={Math.min(currentTime, duration || 0)} onChange={(event) => seek(Number(event.target.value))} style={{ background: `linear-gradient(to right, #fff 0%, #fff ${playedPercent}%, #5f5f5f ${playedPercent}%, #5f5f5f 100%)` }} className="h-1 w-full cursor-pointer appearance-none rounded-full accent-white" /><span className="w-8 font-mono text-[10px] text-[#a7a7a7]">{formatTime(duration)}</span></div></div>
            <div className="flex items-center justify-end gap-3 text-[#888] sm:pb-5"><span className="hidden text-[10px] uppercase tracking-[0.12em] sm:inline">Private</span><button type="button" aria-label="Dismiss playback" onClick={dismiss} className="transition hover:text-white"><X size={18} /></button></div>
        </div>
    </div>;
}

function formatTime(value: number) {
    if (!Number.isFinite(value)) return "0:00";
    return `${Math.floor(value / 60)}:${Math.floor(value % 60).toString().padStart(2, "0")}`;
}
