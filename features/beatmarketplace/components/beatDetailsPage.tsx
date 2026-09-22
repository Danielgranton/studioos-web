"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import {
    ArrowLeft,
    ArrowDownWideNarrow,
    BadgeCheck,
    Check,
    Clock3,
    Heart,
    Loader2,
    MessageCircleMore,
    Pause,
    Play,
    Radio,
    RefreshCw,
    ShoppingBag,
    Star,
    ShieldCheck,
    ThumbsUp,
    Users,
} from "lucide-react";

import BackButton from "@/constants/BackButton";

import { BeatService } from "../services/beat.service";
import type { BeatLicense, BeatReview, BeatSummary } from "../types/beat";

type BeatDetailsPageProps = { beatId: string };

export function BeatDetailsPage({ beatId }: BeatDetailsPageProps) {
    const [beat, setBeat] = useState<BeatSummary | null>(null);
    const [licenses, setLicenses] = useState<BeatLicense[]>([]);
    const [reviews, setReviews] = useState<BeatReview[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [likeLoading, setLikeLoading] = useState(false);
    const [selectedLicense, setSelectedLicense] = useState<string | null>(null);

    const loadBeat = useCallback(async () => {
        setLoading(true);
        setError(false);
        try {
            const [loadedBeat, loadedLicenses, loadedReviews, likeState] = await Promise.all([
                BeatService.getPublicBeat(beatId),
                BeatService.getLicenses(beatId),
                BeatService.getReviews(beatId),
                BeatService.getLikeState(beatId),
            ]);
            setBeat(loadedBeat);
            setLicenses(loadedLicenses.filter((license) => license.active));
            setReviews(loadedReviews);
            setLiked(likeState.liked);
            setLikeCount(likeState.likeCount);
            setSelectedLicense(loadedLicenses.find((license) => license.active)?.id ?? null);
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    }, [beatId]);

    useEffect(() => {
        void loadBeat();
    }, [loadBeat]);

    async function toggleLike() {
        if (likeLoading) return;
        setLikeLoading(true);
        try {
            const state = liked
                ? await BeatService.unlikeBeat(beatId)
                : await BeatService.likeBeat(beatId);
            setLiked(state.liked);
            setLikeCount(state.likeCount);
        } finally {
            setLikeLoading(false);
        }
    }

    if (loading) return <DetailsLoading />;
    if (error || !beat) return <DetailsError onRetry={() => void loadBeat()} />;

    return (
        <main className="min-h-screen bg-[#0f0f0f] px-4 py-7 text-[#f5f4f1] sm:px-6 sm:py-10">
            <div className="mx-auto max-w-[1180px]">
                <div className="mb-7 flex items-center gap-3">
                    <BackButton />
                    <Link href="/marketplace" className="inline-flex items-center gap-2 text-xs font-semibold text-[#918d84] transition hover:text-white">
                        <ArrowLeft size={14} /> Back to marketplace
                    </Link>
                </div>

                <section className="relative overflow-hidden rounded-[24px] border border-[#2b2925] bg-[#171614] shadow-[0_26px_80px_rgba(0,0,0,0.3)]">
                    <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[#e8a33d]/10 blur-3xl" />
                    <div className="relative grid gap-4 p-3 sm:p-5 lg:grid-cols-[minmax(0,0.92fr)_minmax(380px,1.08fr)] lg:gap-6 lg:p-5">
                        <div>
                            <div className="relative aspect-[16/9] overflow-hidden rounded-lg border border-white/10 bg-[#0d0c0b] shadow-2xl">
                                <Image src={beat.coverUrl || beat.thumbnailUrl || "/images/beats.png"} alt={beat.title} fill priority sizes="(min-width: 1024px) 48vw, 92vw" className="object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />
                                <div className="absolute bottom-3 left-3 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-white/75">
                                    <Radio size={12} className="text-[#e8a33d]" /> StudioOS original
                                </div>
                            </div>
                            <div className="mt-2 grid grid-cols-3 divide-x divide-[#302d28] rounded-lg border border-[#2d2a26] bg-[#131210] py-1.5">
                                <DetailStat icon={<Radio size={14} />} value={(beat.playCount ?? 0).toLocaleString()} label="plays" />
                                <DetailStat icon={<Heart size={14} />} value={likeCount.toLocaleString()} label="likes" />
                                <DetailStat icon={<Star size={14} />} value={beat.averageRating ? beat.averageRating.toFixed(1) : "New"} label={`${beat.reviewCount ?? 0} reviews`} />
                            </div>
                        </div>

                        <div className="flex min-w-0 flex-col justify-center">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="rounded-full bg-[#e8a33d]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#e8a33d]">{beat.genreName || "Instrumental"}</span>
                                {beat.exclusive && <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-300">Exclusive available</span>}
                            </div>
                            <h1 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">{beat.title}</h1>
                            <Link href={beat.producerId ? `/producers/${beat.producerId}` : "#"} className="mt-2 inline-flex w-fit items-center gap-2 text-xs text-[#a7a198] transition hover:text-white">
                                by <span className="font-semibold text-white">{beat.producerName || "StudioOS producer"}</span>
                                {beat.verified && <BadgeCheck size={16} className="text-[#5eead4]" />}
                            </Link>

                            <PreviewPlayer beat={beat} />

                            <div className="mt-4 flex flex-wrap gap-1.5 text-[11px] text-[#aba59b]">
                                <InfoPill label="BPM" value={beat.bpm ? String(beat.bpm) : "Unset"} />
                                <InfoPill label="Key" value={beat.keySignature || "Unset"} />
                                <InfoPill label="Length" value={formatDuration(beat.duration)} />
                                {beat.mood && <InfoPill label="Mood" value={beat.mood} />}
                            </div>

                            <div className="mt-4 flex items-center gap-3">
                                <button type="button" onClick={() => void toggleLike()} disabled={likeLoading} className={`inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-xs font-semibold transition ${liked ? "border-red-400/30 bg-red-400/10 text-red-300" : "border-[#3a3630] bg-[#211f1b] text-[#d7d1c8] hover:border-[#e8a33d]/40 hover:text-white"}`}>
                                    {likeLoading ? <Loader2 size={16} className="animate-spin" /> : <Heart size={16} className={liked ? "fill-current" : ""} />}
                                    {liked ? "Liked" : "Save beat"}
                                </button>
                                <span className="text-xs text-[#777169]">{likeCount.toLocaleString()} listeners saved this</span>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
                    <section className="rounded-2xl border border-[#2b2925] bg-[#151412] p-4 sm:p-5">
                        <SectionHeading eyebrow="About the beat" title="Built for the next record" />
                        <p className="mt-3 whitespace-pre-line text-xs leading-6 text-[#aaa49a]">{beat.description || "No description has been added for this beat yet. Preview the sound above and choose the license that fits your release."}</p>
                        <div className="mt-4 grid gap-2 sm:grid-cols-2">
                            <Feature icon={<Users size={15} />} title="Producer-made" text="Original production from the StudioOS marketplace." />
                            <Feature icon={<Clock3 size={15} />} title="Instant preview" text="Listen before choosing the right license." />
                        </div>
                    </section>

                    <section className="rounded-2xl border border-[#2b2925] bg-[#151412] p-4 sm:p-5">
                        <SectionHeading eyebrow="Choose your rights" title="Licenses" />
                        {licenses.length === 0 ? <p className="mt-4 rounded-xl border border-dashed border-[#3a3630] px-4 py-6 text-center text-xs text-[#777169]">Licenses are not available right now.</p> : <div className="mt-4 space-y-2">{licenses.map((license) => <LicenseOption key={license.id} license={license} selected={selectedLicense === license.id} onSelect={() => setSelectedLicense(license.id)} />)}</div>}
                        <button type="button" disabled={!selectedLicense} className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#e8a33d] px-4 py-2.5 text-xs font-bold text-[#17130c] transition hover:bg-[#f0b458] disabled:cursor-not-allowed disabled:opacity-40"><ShoppingBag size={14} /> Continue with license</button>
                    </section>
                </div>

                <ReviewsSection reviews={reviews} rating={beat.averageRating ?? 0} reviewCount={beat.reviewCount ?? 0} />
            </div>
        </main>
    );
}

function PreviewPlayer({ beat }: { beat: BeatSummary }) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [url, setUrl] = useState<string | null>(null);
    const [playing, setPlaying] = useState(false);
    const [loading, setLoading] = useState(false);
    const [current, setCurrent] = useState(0);
    const [duration, setDuration] = useState(beat.duration ?? 0);

    async function togglePlay() {
        if (loading) return;
        if (!url) {
            setLoading(true);
            try {
                const previewUrl = await BeatService.getPreviewUrl(beat.id);
                setUrl(previewUrl);
                setTimeout(() => void audioRef.current?.play().catch(() => setPlaying(false)), 0);
            } finally {
                setLoading(false);
            }
            return;
        }
        if (playing) audioRef.current?.pause();
        else void audioRef.current?.play();
    }

    const percent = duration > 0 ? Math.min(100, (current / duration) * 100) : 0;
    const format = (value: number) => `${Math.floor(value / 60)}:${String(Math.floor(value % 60)).padStart(2, "0")}`;

    return (
                            <div className="mt-4 rounded-lg border border-[#302d28] bg-[#12110f] p-2.5 sm:p-3">
            <audio ref={audioRef} src={url || undefined} preload="metadata" onLoadedMetadata={(event) => setDuration(event.currentTarget.duration || beat.duration || 0)} onTimeUpdate={(event) => setCurrent(event.currentTarget.currentTime)} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => { setPlaying(false); setCurrent(0); }} />
            <div className="flex items-center gap-3">
                <button type="button" onClick={() => void togglePlay()} aria-label={playing ? "Pause preview" : "Play preview"} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1ed760] text-[#071b0d] shadow-[0_0_24px_rgba(30,215,96,0.16)] transition hover:scale-105 hover:bg-[#1fdf66]">{loading ? <Loader2 size={14} className="animate-spin" /> : playing ? <Pause size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" className="ml-0.5" />}</button>
                <div className="min-w-0 flex-1"><div className="flex justify-between text-[10px] font-mono text-[#777169]"><span>{playing ? "Now previewing" : "Preview this beat"}</span><span>{format(current)} / {format(duration)}</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#3a3732]"><div className="h-full rounded-full bg-white transition-[width]" style={{ width: `${percent}%` }} /></div></div>
            </div>
            <p className="mt-1.5 text-[9px] leading-4 text-[#706b63]">Preview playback is limited to the public preview section.</p>
        </div>
    );
}

function LicenseOption({ license, selected, onSelect }: { license: BeatLicense; selected: boolean; onSelect: () => void }) {
    return <button type="button" onClick={onSelect} className={`w-full rounded-xl border p-3 text-left transition ${selected ? "border-[#e8a33d]/60 bg-[#e8a33d]/[0.08]" : "border-[#302d28] bg-[#1b1916] hover:border-[#4a443b]"}`}><div className="flex items-start justify-between gap-3"><div><div className="flex items-center gap-2"><span className="text-xs font-bold text-white">{license.type}</span>{selected && <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#e8a33d] text-[#17130c]"><Check size={11} strokeWidth={3} /></span>}</div><p className="mt-1 text-[11px] text-[#858078]">{license.exclusive ? "Full exclusivity for your release." : license.commercialUse ? "Commercial use included." : "Standard usage rights."}</p></div><span className="font-mono text-xs font-bold text-[#e8a33d]">KSh {license.price.toLocaleString()}</span></div><div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[9px] text-[#777169]">{license.maxStreams != null && <span>{license.maxStreams.toLocaleString()} streams</span>}{license.allowModification && <span>Modifications allowed</span>}{license.allowMusicVideo && <span>Music video</span>}</div></button>;
}

function ReviewsSection({ reviews, rating, reviewCount }: { reviews: BeatReview[]; rating: number; reviewCount: number }) {
    const [filter, setFilter] = useState<BeatReviewFilter>("ALL");
    const filteredReviews = filterBeatReviews(reviews, filter);
    const calculatedRating = reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : rating;
    const recommendationRate = reviews.length ? Math.round((reviews.filter((review) => review.rating >= 4).length / reviews.length) * 100) : 0;

    return <section className="mt-6 rounded-3xl border border-[#2a2825] bg-[#161513] p-5 sm:p-8">
        <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#e8a33d]">Community feedback</p>
            <h2 className="mt-2 text-xl font-semibold text-[#f5f4f1]">Reviews{reviewCount > 0 ? ` (${reviewCount})` : ""}</h2>
        </div>

        <div className="mt-6 flex flex-col gap-5 border-y border-[#2a2825] py-4 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
            <div className="grid flex-1 gap-1 sm:grid-cols-3">
                <ReviewMetric icon={<Star size={17} className="fill-[#e8a33d] text-[#e8a33d]" />} value={calculatedRating ? calculatedRating.toFixed(1) : "0.0"} label="Average rating" />
                <ReviewMetric icon={<MessageCircleMore size={17} className="text-[#5eead4]" />} value={reviewCount.toLocaleString()} label="Reviews" />
                <ReviewMetric icon={<ThumbsUp size={17} className="text-emerald-400" />} value={`${recommendationRate}%`} label="4+ star experiences" />
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-2" aria-label="Review filters">
                <span className="mr-1 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6b685f]"><ArrowDownWideNarrow size={13} />Filter</span>
                {BEAT_REVIEW_FILTERS.map((item) => { const Icon = item.icon; return <button key={item.value} type="button" onClick={() => setFilter(item.value)} className={`inline-flex h-7 items-center gap-1.5 rounded-full px-3 text-[11px] font-medium transition ${filter === item.value ? "bg-[#e8a33d] text-[#161513]" : "border border-[#2a2825] bg-[#1c1a17] text-[#9a978f] hover:border-[#e8a33d]/30 hover:text-[#f5f4f1]"}`}>{Icon && <Icon size={12} className="fill-current" />}{item.label}</button>; })}
            </div>
        </div>

        {reviews.length === 0 ? <div className="relative mt-6 overflow-hidden rounded-2xl border border-[#2a2825] bg-[#1c1a17] px-5 py-6 sm:px-7 sm:py-7"><div aria-hidden="true" className="absolute -right-12 -top-16 h-36 w-36 rounded-full bg-[#e8a33d]/10 blur-3xl" /><div className="relative flex items-start gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#e8a33d]/25 bg-[#e8a33d]/10 text-[#e8a33d]"><Star size={18} /></span><div><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#e8a33d]">A quiet page for now</p><h3 className="mt-1 text-sm font-semibold text-[#f5f4f1]">No reviews yet</h3><p className="mt-1 max-w-xl text-xs leading-5 text-[#938e84]">Reviews appear after completed purchases, so every note reflects a real StudioOS listener.</p></div></div><div className="relative mt-5 flex items-center gap-2 border-t border-[#2a2825] pt-4 text-[11px] text-[#777168]"><ShieldCheck size={14} className="text-[#e8a33d]" />Authentic feedback from verified beat buyers</div></div> : filteredReviews.length > 0 ? <div className="mt-6 space-y-3">{filteredReviews.map((review) => <BeatReviewItem key={review.id} review={review} />)}</div> : <div className="relative mt-6 overflow-hidden rounded-2xl border border-[#2a2825] bg-[#1c1a17] px-5 py-6 sm:px-7 sm:py-7"><div className="flex items-start gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#e8a33d]/25 bg-[#e8a33d]/10 text-[#e8a33d]"><Star size={18} /></span><div><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#e8a33d]">No matching feedback</p><h3 className="mt-1 text-sm font-semibold text-[#f5f4f1]">No {filter === "HIGHEST" ? "top-rated" : `${filter}-star`} reviews yet</h3><p className="mt-1 text-xs leading-5 text-[#938e84]">Try another filter to see more experiences from the StudioOS community.</p></div></div></div>}
    </section>;
}

type BeatReviewFilter = "ALL" | "5" | "4" | "3" | "HIGHEST";
const BEAT_REVIEW_FILTERS: { value: BeatReviewFilter; label: string; icon?: typeof Star }[] = [
    { value: "ALL", label: "All reviews" },
    { value: "5", label: "5 stars", icon: Star },
    { value: "4", label: "4 stars", icon: Star },
    { value: "3", label: "3 stars", icon: Star },
    { value: "HIGHEST", label: "Top rated", icon: ArrowDownWideNarrow },
];

function filterBeatReviews(reviews: BeatReview[], filter: BeatReviewFilter) {
    if (filter === "ALL") return reviews;
    if (filter === "HIGHEST") return [...reviews].sort((left, right) => right.rating - left.rating);
    return reviews.filter((review) => Math.round(review.rating) === Number(filter));
}

function ReviewMetric({ icon, value, label }: { icon: ReactNode; value: string; label: string }) {
    return <div className="flex items-center gap-2 rounded-xl px-1 py-1"><span>{icon}</span><div><p className="font-mono text-sm font-semibold text-[#f5f4f1]">{value}</p><p className="text-[10px] text-[#6b685f]">{label}</p></div></div>;
}

function BeatReviewItem({ review }: { review: BeatReview }) {
    const date = new Date(review.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
    return <article className="rounded-2xl border border-[#2a2825] bg-[#1c1a17] p-4 sm:p-5"><div className="flex items-start justify-between gap-3"><div className="flex min-w-0 items-center gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#e8a33d]/20 bg-[#e8a33d]/10 text-sm font-bold text-[#e8a33d]">{review.userId ? "B" : "S"}</div><div className="min-w-0"><p className="truncate text-sm font-semibold text-[#f5f4f1]">Verified buyer</p><p className="truncate text-[10px] text-[#777168]">StudioOS listener · {date}</p></div></div><div className="flex shrink-0 items-center gap-0.5" aria-label={`${review.rating} out of 5 stars`}>{Array.from({ length: Math.round(review.rating) }).map((_, index) => <Star key={index} size={13} className="fill-[#e8a33d] text-[#e8a33d]" />)}</div></div>{review.comment && <p className="mt-4 text-sm leading-6 text-[#c4c1b8]">{review.comment}</p>}<div className="mt-4 flex items-center gap-2 text-[10px] text-[#777168]"><span className="inline-flex items-center gap-1 rounded-full px-2 py-1"><ShieldCheck size={13} className="text-emerald-400" />Verified purchase</span></div></article>;
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) { return <div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#e8a33d]">{eyebrow}</p><h2 className="mt-2 text-xl font-bold tracking-tight text-white">{title}</h2></div>; }
function DetailStat({ icon, value, label }: { icon: ReactNode; value: string; label: string }) { return <div className="flex flex-col items-center gap-1 text-[#777169]"><span className="text-[#e8a33d]">{icon}</span><span className="font-mono text-xs font-bold text-white">{value}</span><span className="text-[10px]">{label}</span></div>; }
function InfoPill({ label, value }: { label: string; value: string }) { return <span className="rounded-lg border border-[#302d28] bg-[#1c1a17] px-2.5 py-1.5"><span className="mr-1.5 text-[#706b63]">{label}</span><span className="font-semibold text-[#d4cec4]">{value}</span></span>; }
function Feature({ icon, title, text }: { icon: ReactNode; title: string; text: string }) { return <div className="flex gap-2.5 rounded-xl border border-[#2d2a26] bg-[#1b1916] p-3"><span className="mt-0.5 text-[#e8a33d]">{icon}</span><div><h3 className="text-[11px] font-bold text-white">{title}</h3><p className="mt-1 text-[10px] leading-4 text-[#777169]">{text}</p></div></div>; }
function formatDuration(seconds?: number | null) { if (!seconds || seconds < 0) return "--:--"; return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`; }
function DetailsLoading() { return <main className="min-h-screen bg-[#0f0f0f] px-4 py-10 sm:px-6"><div className="mx-auto max-w-[1180px] animate-pulse"><div className="h-5 w-28 rounded bg-[#292621]" /><div className="mt-7 grid gap-8 rounded-[28px] border border-[#2b2925] bg-[#171614] p-5 sm:p-10 lg:grid-cols-2"><div className="aspect-square rounded-2xl bg-[#292621]" /><div className="flex flex-col justify-center"><div className="h-4 w-28 rounded bg-[#292621]" /><div className="mt-5 h-12 w-3/4 rounded bg-[#292621]" /><div className="mt-4 h-4 w-1/2 rounded bg-[#292621]" /><div className="mt-8 h-24 rounded-2xl bg-[#292621]" /></div></div></div></main>; }
function DetailsError({ onRetry }: { onRetry: () => void }) { return <main className="flex min-h-screen items-center justify-center bg-[#0f0f0f] px-6 text-center text-white"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#e8a33d]">Beat unavailable</p><h1 className="mt-3 text-2xl font-bold">This beat could not be loaded</h1><p className="mt-2 text-sm text-[#888176]">It may have been archived or the marketplace is temporarily unavailable.</p><button type="button" onClick={onRetry} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#e8a33d] px-4 py-2.5 text-sm font-bold text-[#17130c]"><RefreshCw size={15} /> Try again</button></div></main>; }
