"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ArrowRight, ArrowUpRight, Megaphone, RefreshCw, ShieldCheck, Sparkles, Volume2 } from "lucide-react";

import { SponsoredService, type SponsoredAd } from "../services/sponsored.service";

export function SponsoredPage() {
    const [ad, setAd] = useState<SponsoredAd | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [clicking, setClicking] = useState(false);
    const [mediaFailed, setMediaFailed] = useState(false);
    const adCardRef = useRef<HTMLElement>(null);

    async function loadAd() {
        setLoading(true);
        setError(false);
        setAd(null);
        setMediaFailed(false);
        try {
            setAd(await SponsoredService.getFeaturedAd());
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        void loadAd();
    }, []);

    useEffect(() => {
        const token = ad?.impressionToken;
        const card = adCardRef.current;
        if (!token || !card || typeof IntersectionObserver === "undefined") return;

        let isIntersecting = false;
        let timer: ReturnType<typeof setTimeout> | undefined;
        let confirmed = false;

        const stopTimer = () => {
            if (timer) clearTimeout(timer);
            timer = undefined;
        };
        const updateTimer = () => {
            if (!isIntersecting || document.visibilityState !== "visible" || confirmed || timer) return;
            timer = setTimeout(() => {
                timer = undefined;
                if (!isIntersecting || document.visibilityState !== "visible" || confirmed) return;
                confirmed = true;
                void SponsoredService.confirmImpression(token).catch(() => {
                    confirmed = false;
                    updateTimer();
                });
            }, 1000);
        };
        const observer = new IntersectionObserver(([entry]) => {
            isIntersecting = entry.isIntersecting && entry.intersectionRatio >= 0.5;
            if (isIntersecting) updateTimer();
            else stopTimer();
        }, { threshold: [0, 0.5, 1] });
        const onVisibilityChange = () => {
            if (document.visibilityState === "visible") updateTimer();
            else stopTimer();
        };

        observer.observe(card);
        document.addEventListener("visibilitychange", onVisibilityChange);
        return () => {
            stopTimer();
            observer.disconnect();
            document.removeEventListener("visibilitychange", onVisibilityChange);
        };
    }, [ad?.impressionToken]);

    async function followCta() {
        if (!ad || clicking) return;
        setClicking(true);
        try {
            const destination = await SponsoredService.recordClick(ad.advertisementId);
            const safeUrl = new URL(destination || ad.ctaUrl || "");
            if (safeUrl.protocol !== "https:" && safeUrl.protocol !== "http:") {
                throw new Error("The advertiser link is unavailable.");
            }
            window.location.assign(safeUrl.toString());
        } catch {
            setClicking(false);
            toast.error("Could not open this sponsor", { description: "The destination may be temporarily unavailable." });
        }
    }

    return (
        <main className="relative isolate min-h-[calc(100vh-7rem)] overflow-hidden bg-[#0f0f0f] px-4 py-8 text-[#f4f2ec] sm:px-7 sm:py-12">
            <div aria-hidden="true" className="pointer-events-none absolute -right-48 -top-56 -z-10 h-[34rem] w-[34rem] rounded-full border border-[#d9a94f]/[0.08] sm:h-[46rem] sm:w-[46rem]">
                <div className="absolute inset-12 rounded-full border border-[#d9a94f]/[0.06]" />
                <div className="absolute inset-28 rounded-full bg-[radial-gradient(circle,rgba(217,169,79,0.11),transparent_68%)]" />
            </div>
            <div className="mx-auto max-w-7xl">
                <header className="border-b border-white/[0.09] pb-6 sm:pb-8">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <Link href="/" className="inline-flex items-center gap-2.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#9da5a5] transition hover:text-white">
                            <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-[11px] font-bold tracking-normal text-[#e1bd79]">S</span>
                            StudioOS <span className="text-white/20">/</span> Sponsored
                        </Link>
                        <span className="inline-flex items-center gap-2 rounded-full border border-[#d9a94f]/20 bg-[#d9a94f]/[0.06] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-[#e1bd79]">
                            <ShieldCheck size={12} /> Paid placement
                        </span>
                    </div>
                    <div className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end lg:gap-12">
                        <div>
                            <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#d9b66f]">The StudioOS spotlight</p>
                            <h1 className="mt-3 max-w-3xl text-[2.15rem] font-semibold leading-[1.04] tracking-[-0.045em] sm:text-4xl lg:text-[3.25rem]">
                                Good work deserves<br className="hidden sm:block" /> <span className="text-[#e1bd79]">its moment.</span>
                            </h1>
                            <p className="mt-3 max-w-xl text-sm leading-6 text-[#9da5a5]">
                                Discover a promoted offering from the people building the StudioOS music community.
                            </p>
                        </div>
                        <div className="flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 sm:p-5">
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#d9a94f]/20 bg-[#d9a94f]/[0.07] text-[#e1bd79]"><Megaphone size={19} strokeWidth={1.5} /></span>
                            <div>
                                <p className="text-[9px] font-bold uppercase tracking-[0.17em] text-[#818a89]">Community powered</p>
                                <p className="mt-1 text-xs leading-5 text-[#d5d5cf]">A space for independent music work to be discovered.</p>
                            </div>
                        </div>
                    </div>
                </header>

                <section aria-live="polite" className="mt-7 sm:mt-9">
                    {loading ? <SponsoredLoading /> : error ? <SponsoredError onRetry={() => void loadAd()} /> : !ad ? <SponsoredEmpty /> : (
                        <article ref={adCardRef} className="group grid overflow-hidden rounded-[28px] border border-white/[0.11] bg-[#131a1e] shadow-[0_35px_100px_rgba(0,0,0,0.32)] lg:grid-cols-[1.16fr_0.84fr]">
                            <div className="relative min-h-[270px] overflow-hidden bg-[#090d10] sm:min-h-[400px] lg:min-h-[530px]">
                                {ad.type === "IMAGE" && ad.mediaUrl && !mediaFailed ? (
                                    <Image src={ad.mediaUrl} alt={ad.headline} fill priority unoptimized sizes="(max-width: 1024px) 100vw, 65vw" onError={() => setMediaFailed(true)} className="object-cover transition duration-700 group-hover:scale-[1.025]" />
                                ) : null}
                                {ad.type === "VIDEO" && ad.mediaUrl && !mediaFailed ? (
                                    <video controls playsInline preload="metadata" poster={ad.thumbnailUrl || undefined} onError={() => setMediaFailed(true)} className="absolute inset-0 h-full w-full bg-black object-contain"><source src={ad.mediaUrl} /></video>
                                ) : null}
                                {ad.type === "AUDIO" && ad.mediaUrl && !mediaFailed ? (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_50%_38%,#39402f_0%,#1a2424_38%,#0a1013_78%)] p-7 sm:p-10">
                                        <div aria-hidden="true" className="absolute inset-x-[12%] top-[12%] h-[55%] rounded-[50%] border border-[#d9b66f]/10 [transform:rotate(-9deg)] sm:inset-x-[20%]">
                                            <div className="absolute inset-5 rounded-[50%] border border-[#d9b66f]/10" />
                                            <div className="absolute inset-10 rounded-[50%] border border-[#d9b66f]/10" />
                                        </div>
                                        <div className="relative mb-8 flex h-24 w-24 items-center justify-center rounded-full border border-[#d9b66f]/25 bg-[#d9b66f]/[0.09] text-[#e5c581] shadow-[0_0_70px_rgba(217,182,111,0.12)] sm:h-32 sm:w-32"><Volume2 size={42} strokeWidth={1.2} /></div>
                                        <p className="relative max-w-md text-center text-xl font-semibold tracking-tight text-white sm:text-2xl">{ad.headline}</p>
                                        <audio controls preload="metadata" onError={() => setMediaFailed(true)} className="relative mt-7 w-full max-w-md accent-[#d9b66f]"><source src={ad.mediaUrl} /></audio>
                                    </div>
                                ) : null}
                                {(!ad.mediaUrl || mediaFailed) && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_50%_36%,#35403a_0%,#182124_48%,#090d10_100%)] p-8 text-center">
                                        <div aria-hidden="true" className="absolute h-64 w-64 rounded-full border border-[#d9b66f]/10 sm:h-80 sm:w-80"><div className="absolute inset-7 rounded-full border border-[#d9b66f]/10" /></div>
                                        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-[#d9b66f]/25 bg-[#d9b66f]/[0.08] text-[#e1bd79]"><Megaphone size={27} strokeWidth={1.4} /></div>
                                        <p className="relative mt-5 max-w-md text-xl font-semibold text-white sm:text-2xl">{ad.headline}</p>
                                        <p className="relative mt-2 text-xs text-[#9da5a5]">A StudioOS community spotlight</p>
                                    </div>
                                )}
                                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/55 to-transparent" />
                                <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-[#080b0d]/70 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.17em] text-white backdrop-blur-md"><Sparkles size={11} className="text-[#e1bd79]" /> Sponsored</span>
                                <span className="absolute bottom-4 right-4 rounded-full border border-white/15 bg-black/40 px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.13em] text-white/75 backdrop-blur-md">Community spotlight / 01</span>
                            </div>

                            <div className="relative flex flex-col justify-between p-6 sm:p-9 lg:p-10 xl:p-12">
                                <div aria-hidden="true" className="absolute right-0 top-0 h-48 w-48 bg-[radial-gradient(circle_at_top_right,rgba(217,169,79,0.09),transparent_68%)]" />
                                <div className="relative">
                                    <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-[#d9b66f]"><span className="h-px w-6 bg-[#d9b66f]/60" /> The featured offering</div>
                                    <h2 className="mt-5 break-words text-3xl font-semibold leading-[1.06] tracking-[-0.035em] text-[#f5f3ed] sm:text-4xl">{ad.headline}</h2>
                                    <p className="mt-5 max-w-md text-sm leading-7 text-[#a3acab]">Take a closer look at this promoted offering from the StudioOS community.</p>
                                </div>
                                <div className="relative mt-10 border-t border-white/[0.09] pt-6">
                                    {ad.ctaUrl ? (
                                        <button type="button" onClick={() => void followCta()} disabled={clicking} className="group/cta inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-xl bg-[#e1bd79] px-5 py-3 text-sm font-bold text-[#151a19] transition duration-200 hover:bg-[#f0d394] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e1bd79] focus-visible:ring-offset-2 focus-visible:ring-offset-[#131a1e] disabled:cursor-wait disabled:opacity-60 sm:w-auto sm:min-w-56">
                                            {clicking ? "Opening offering..." : ad.ctaText || "Explore the offering"}
                                            {!clicking && <ArrowUpRight size={17} className="transition-transform group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" />}
                                        </button>
                                    ) : (
                                        <p className="inline-flex items-center gap-2 text-xs text-[#858e8d]"><ShieldCheck size={14} className="text-[#d9b66f]" /> This placement has no destination link.</p>
                                    )}
                                    <div className="mt-6 flex items-center gap-3 text-[10px] leading-5 text-[#7f8988]">
                                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.035] text-[#d9b66f]"><Megaphone size={13} /></span>
                                        Paid placement supporting independent music businesses on StudioOS.
                                    </div>
                                </div>
                            </div>
                        </article>
                    )}
                </section>

                <footer className="mt-7 flex flex-col gap-4 border-t border-white/[0.08] pt-5 sm:mt-9 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2 text-[10px] text-[#7f8988]"><ShieldCheck size={13} className="text-[#9db4a0]" /> Sponsored content is clearly labeled and reviewed before it appears.</div>
                    <Link href="/dashboard/advertising" className="group inline-flex items-center gap-2 self-start text-[10px] font-bold uppercase tracking-[0.13em] text-[#d9b66f] transition hover:text-[#f0d394] sm:self-auto">
                        Put your work in the spotlight <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                </footer>
            </div>
        </main>
    );
}

function SponsoredLoading() {
    return <div aria-label="Loading sponsored spotlight" className="grid animate-pulse overflow-hidden rounded-[28px] border border-white/[0.09] bg-[#131a1e] lg:grid-cols-[1.16fr_0.84fr]"><div className="min-h-[270px] bg-[#1b2427] sm:min-h-[400px] lg:min-h-[530px]" /><div className="space-y-5 p-6 sm:p-9 lg:p-12"><div className="h-3 w-36 rounded-full bg-white/10" /><div className="h-9 w-4/5 rounded-lg bg-white/10" /><div className="h-4 w-full rounded bg-white/[0.07]" /><div className="h-4 w-3/4 rounded bg-white/[0.07]" /><div className="mt-16 h-12 w-52 rounded-xl bg-[#d9b66f]/20" /></div></div>;
}

function SponsoredError({ onRetry }: { onRetry: () => void }) {
    return <div className="rounded-[28px] border border-[#b66a5d]/25 bg-[#131a1e] px-6 py-14 text-center sm:py-20"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#b66a5d]/25 bg-[#b66a5d]/[0.08] text-[#e1a093]"><RefreshCw size={22} /></div><h2 className="mt-5 text-lg font-semibold text-[#f2f0e9]">The spotlight is temporarily offline</h2><p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#929c9b]">We couldn’t load a sponsored offering. Give it another try in a moment.</p><button type="button" onClick={onRetry} className="mt-6 inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-xs font-semibold text-white transition hover:border-[#d9b66f]/50 hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d9b66f]"><RefreshCw size={14} /> Reload spotlight</button></div>;
}

function SponsoredEmpty() {
    return <div className="rounded-[28px] border border-white/[0.09] bg-[#131a1e] px-6 py-14 text-center sm:py-20"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[20px] border border-[#d9b66f]/20 bg-[#d9b66f]/[0.07] text-[#e1bd79]"><Megaphone size={25} strokeWidth={1.4} /></div><p className="mt-6 text-[9px] font-bold uppercase tracking-[0.2em] text-[#d9b66f]">A quiet moment</p><h2 className="mt-2 text-xl font-semibold tracking-tight text-[#f2f0e9] sm:text-2xl">No spotlight is live just yet.</h2><p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#929c9b]">When a campaign is approved for this space, you’ll find it here. In the meantime, explore the studios, producers, and sounds across StudioOS.</p><Link href="/studios" className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-xs font-semibold text-[#f2f0e9] transition hover:border-[#d9b66f]/50 hover:bg-white/[0.04]">Explore studios <ArrowRight size={14} /></Link></div>;
}
