"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, BadgeCheck, Building2, CalendarCheck, Clock3, Layers3, MapPin, Music2, RefreshCw, Search, Star, Users } from "lucide-react";

import BackButton from "@/constants/BackButton";
import { BeatCard } from "@/features/home/trending-beats";
import { BeatService, type BeatSummary } from "@/features/beatmarketplace";
import { ReviewList } from "@/features/reviews";
import type { Studio } from "@/features/studio";

import { ProducerProfileService } from "../services/producerProfile.service";
import type { ProducerProfile } from "../types/producer";

export function ProducerDetailPage({ producerId }: { producerId: string }) {
    const [producer, setProducer] = useState<ProducerProfile | null>(null);
    const [studios, setStudios] = useState<Studio[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true; 
        const id = Number(producerId);
        if (!Number.isInteger(id)) {
            setLoading(false);
            return;
        }
        void Promise.all([ProducerProfileService.getProfile(producerId), ProducerProfileService.getStudios(id)])
            .then(([profile, ownedStudios]) => {
                if (!active) return;
                setProducer(profile);
                setStudios(ownedStudios);
            })
            .catch(() => { if (active) setProducer(null); })
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, [producerId]);

    if (loading) return <ProducerLoading />;
    if (!producer) return <ProducerNotFound />;

    const avatar = producer.profileImageMedium || producer.profileImageLarge || producer.profileImage;
    const rated = studios.filter((studio) => (studio.averageRating || 0) > 0);
    const rating = rated.length ? rated.reduce((total, studio) => total + (studio.averageRating || 0), 0) / rated.length : 0;
    const bookings = studios.reduce((total, studio) => total + studio.bookings, 0);
    const available = studios.some((studio) => studio.available);

    return (
        <main className="min-h-screen bg-[#0f0f0f] text-[#f5f4f1]">
            <div className="mx-auto max-w-[1280px] px-6 py-7 lg:px-20 lg:py-10">
                <BackButton />

                <div className="mt-6 grid items-start gap-5 lg:grid-cols-2">
                <section className="relative overflow-hidden rounded-3xl border border-[#2a2825] bg-[#161513]">
                    <div className="absolute inset-x-0 top-0 h-24 overflow-hidden bg-[#191611]">
                        <div className="absolute -right-10 -top-24 h-64 w-64 rounded-full bg-[#e8a33d]/10 blur-3xl" />
                        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "linear-gradient(90deg, #e8a33d 1px, transparent 1px), linear-gradient(#e8a33d 1px, transparent 1px)", backgroundSize: "34px 34px" }} />
                        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#161513] to-transparent" />
                    </div>
                    <div className="relative px-5 pb-4 pt-7 sm:px-8">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                            <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4">
                                <div className="relative flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-[#161513] bg-[#e8a33d]/10 text-2xl font-bold text-[#e8a33d] shadow-xl shadow-black/30">{avatar ? <Image src={avatar} alt={`${producer.name} profile`} fill sizes="112px" unoptimized className="object-cover" /> : producer.name.charAt(0)}</div>
                                <div className="min-w-0"><p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#e8a33d]">Producer profile</p><div className="flex items-center gap-2"><h1 className="truncate text-2xl font-black tracking-tight sm:text-4xl">{producer.name}</h1>{producer.role === "PRODUCER" && <BadgeCheck size={19} className="shrink-0 text-[#5eead4]" />}</div>{producer.email && <p className="mt-1 truncate text-xs text-[#aaa69d]">{producer.email}</p>}<p className="mt-1 text-xs text-[#777168]">{producer.genre || "Music producer"}</p></div>
                            </div>
                            <span className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-semibold ${available ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300" : "border-[#3b352c] bg-[#27231e] text-[#9a978f]"}`}><span className={`h-1.5 w-1.5 rounded-full ${available ? "bg-emerald-300" : "bg-[#777]"}`} />{available ? "Available for work" : "Currently unavailable"}</span>
                        </div>
                        <div className="mt-4 grid gap-2 border-t border-[#2a2825] pt-3 sm:grid-cols-3">{producer.location && <HeroStat icon={<MapPin size={13} />} label="Based in" value={producer.location} />}<HeroStat icon={<Building2 size={13} />} label="Owned studios" value={`${studios.length}`} /><HeroStat icon={<Star size={13} />} label="Average rating" value={rating ? `${rating.toFixed(1)} / 5` : "New"} /></div>
                    </div>
                </section>
                    <OwnedStudiosPanel producerName={producer.name} studios={studios} />
                </div>

                <div className="mt-7 grid gap-7 lg:grid-cols-[minmax(0,1fr)_300px]">
                    <div className="space-y-7">
                        <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6"><div className="min-w-0 lg:flex-1"><Label>About the producer</Label><p className="mt-2 max-w-3xl text-xs leading-5 text-[#aaa69d]">{producer.bio || "A creative professional ready to help shape your next release."}</p></div><div className="flex flex-nowrap gap-2 overflow-x-auto lg:shrink-0"><ProducerMetric icon={<Users size={13} />} label="Followers" value={formatCount(producer.followerCount)} /><ProducerMetric icon={<Music2 size={13} />} label="Produced" value={formatCount(producer.producedCount)} /><ProducerMetric icon={<Music2 size={13} />} label="Beats made" value={formatCount(producer.beatCount)} /></div></section>
                        <section className="grid gap-3 sm:grid-cols-3"><Tile icon={<Star size={15} />} label="Rating" value={rating ? `${rating.toFixed(1)} average` : "New producer"} /><Tile icon={<Users size={15} />} label="Completed work" value={`${bookings.toLocaleString()} bookings`} /><Tile icon={<Clock3 size={15} />} label="Experience" value={producer.experience || "Available for briefs"} /></section>
                    </div>
                    <aside className="h-fit rounded-2xl border border-[#3b352c] bg-[#1b1916] p-4 sm:p-5 lg:sticky lg:top-24"><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#e8a33d]">Work with {producer.name.split(" ")[0]}</p><h2 className="mt-3 text-xl font-semibold">Bring your next idea to life.</h2><p className="mt-2 text-xs leading-5 text-[#8f887c]">Review their services and studios, then connect when you are ready to plan a session.</p><button type="button" disabled className="mt-5 inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-[#e8a33d]/50 px-3 py-2.5 text-xs font-semibold text-[#17130d]/70"><CalendarCheck size={15} />Contact flow coming soon</button>{producer.link && <a href={producer.link} target="_blank" rel="noreferrer" className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#3b352c] px-3 py-2.5 text-xs font-semibold text-[#d7d0c4] transition hover:bg-[#242019]">Visit external profile <ArrowUpRight size={14} /></a>}</aside>
                </div>
                <ProducerBeatsSection producerId={producerId} producerName={producer.name} />
                <div className="mt-8"><ReviewList target="PRODUCER" targetId={producerId} /></div>
            </div>
        </main>
    );
}

function ProducerBeatsSection({ producerId, producerName }: { producerId: string; producerName: string }) {
    const [beats, setBeats] = useState<BeatSummary[] | null>(null);
    const [error, setError] = useState(false);
    const [retry, setRetry] = useState(0);
    const [activeFilter, setActiveFilter] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        let active = true;
        setBeats(null);
        setError(false);

        async function loadProducerBeats() {
            try {
                const firstPage = await BeatService.browse({ producerId, page: 0, size: 50, sortBy: "NEWEST" });
                const remainingPages = await Promise.all(
                    Array.from({ length: Math.max(0, firstPage.totalPages - 1) }, (_, index) =>
                        BeatService.browse({ producerId, page: index + 1, size: 50, sortBy: "NEWEST" }),
                    ),
                );
                if (active) setBeats([...firstPage.content, ...remainingPages.flatMap((page) => page.content)]);
            } catch {
                if (active) setError(true);
            }
        }

        void loadProducerBeats();
        return () => { active = false; };
    }, [producerId, retry]);

    const visibleBeats = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();
        const filtered = (beats ?? []).filter((beat) => {
            const matchesSearch = !query || [beat.title, beat.genreName ?? "", beat.mood ?? ""]
                .some((value) => value.toLowerCase().includes(query));
            const matchesFilter = activeFilter === "All"
                || activeFilter === "Top rated"
                || beat.licenseType === activeFilter.toUpperCase();
            return matchesSearch && matchesFilter;
        });

        if (activeFilter === "Top rated") {
            return filtered.sort((a, b) => (b.averageRating ?? 0) - (a.averageRating ?? 0)
                || (b.reviewCount ?? 0) - (a.reviewCount ?? 0)
                || (b.likeCount ?? 0) - (a.likeCount ?? 0));
        }
        return filtered;
    }, [activeFilter, beats, searchTerm]);

    return (
        <section aria-labelledby="producer-beats-heading" className="mt-8 scroll-mt-24 rounded-2xl border border-[#2a2825] bg-[#141311] p-4 sm:p-5">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                <div>
                    <p className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#e8a33d]"><Music2 size={12} />Producer catalog</p>
                    <h2 id="producer-beats-heading" className="mt-1.5 text-xl font-bold tracking-tight text-[#f5f4f1] sm:text-2xl">Beats by {producerName}</h2>
                    <p className="mt-1 text-xs text-[#817b72]">Listen to their public catalog and find a sound for your next release.</p>
                </div>
                {beats && <span className="rounded-full border border-[#2a2825] bg-[#161513] px-3 py-1.5 font-mono text-[10px] text-[#aaa69d]">{visibleBeats.length} / {beats.length} beats</span>}
            </div>

            {beats && beats.length > 0 && !error && <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-1.5">{["All", "Top rated", "Basic", "Premium", "Exclusive"].map((filter) => <button key={filter} type="button" onClick={() => setActiveFilter(filter)} className={`rounded-full border px-3 py-1.5 text-[10px] font-medium transition ${activeFilter === filter ? "border-[#e8a33d]/40 bg-[#e8a33d]/10 text-[#e8a33d]" : "border-[#2a2825] bg-[#191816] text-[#918b81] hover:border-[#3a3630] hover:text-[#f5f4f1]"}`}>{filter}</button>)}</div>
                <label className="flex w-full items-center gap-2 rounded-full border border-[#2a2825] bg-[#191816] px-3 py-2 text-xs text-[#8f887c] sm:w-56"><Search size={13} className="shrink-0 text-[#e8a33d]" /><span className="sr-only">Search this producer&apos;s beats</span><input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search beats" className="min-w-0 flex-1 bg-transparent text-xs text-[#f5f4f1] outline-none placeholder:text-[#6b685f]" /></label>
            </div>}

            {beats === null && !error ? <ProducerBeatLoading /> : error ? (
                <div role="alert" className="relative flex min-h-[270px] items-center justify-center overflow-hidden rounded-2xl border border-[#49382b] bg-[#171513] px-5 py-9 text-center">
                    <div aria-hidden="true" className="absolute -right-12 -top-16 h-48 w-48 rounded-full bg-[#e8a33d]/[0.07] blur-3xl" />
                    <div className="relative max-w-sm">
                        <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl border border-[#e8a33d]/20 bg-[#e8a33d]/[0.08] text-[#e8a33d]"><RefreshCw size={18} /></span>
                        <p className="mt-4 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#e8a33d]">Signal interrupted</p>
                        <h3 className="mt-1.5 text-base font-semibold text-[#f0ece5]">The catalog didn’t load</h3>
                        <p className="mt-1.5 text-xs leading-5 text-[#918a7f]">We couldn’t reach {producerName}&apos;s beats right now. Your place is saved; try again in a moment.</p>
                        <button type="button" onClick={() => setRetry((value) => value + 1)} className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#e8a33d] px-4 py-2.5 text-xs font-semibold text-[#17130d] transition hover:bg-[#f0b458] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8a33d] focus-visible:ring-offset-2 focus-visible:ring-offset-[#171513]"><RefreshCw size={13} />Try again</button>
                    </div>
                </div>
            ) : beats === null ? <ProducerBeatLoading /> : beats.length === 0 ? (
                <div className="relative flex min-h-[270px] items-center justify-center overflow-hidden rounded-2xl border border-[#302c25] bg-[radial-gradient(ellipse_at_50%_0%,rgba(232,163,61,0.07),transparent_58%),#11100e] px-5 py-9 text-center">
                    <div className="max-w-sm">
                        <div aria-hidden="true" className="mx-auto flex h-12 w-12 items-center justify-center gap-[3px] rounded-2xl border border-[#302c25] bg-[#191714]">
                            {[12, 20, 15, 25, 13, 19, 10].map((height, index) => <span key={index} className="w-[3px] rounded-full bg-[#756346]" style={{ height }} />)}
                        </div>
                        <p className="mt-4 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#847764]">A catalog in the making</p>
                        <h3 className="mt-1.5 text-base font-semibold text-[#e6e1d8]">No public beats yet</h3>
                        <p className="mt-1.5 text-xs leading-5 text-[#777168]">{producerName}&apos;s marketplace releases will be ready to discover here.</p>
                    </div>
                </div>
            ) : visibleBeats.length === 0 ? (
                <div className="flex min-h-[230px] items-center justify-center rounded-2xl border border-dashed border-[#39332b] bg-[#11100e] px-4 py-8 text-center">
                    <div><span className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl border border-[#2a2825] bg-[#191714] text-[#8f887c]"><Search size={16} /></span><h3 className="mt-3 text-sm font-semibold text-[#e6e1d8]">No matches in this selection</h3><p className="mt-1 text-xs text-[#777168]">Try a different license or search term.</p><button type="button" onClick={() => { setActiveFilter("All"); setSearchTerm(""); }} className="mt-3 rounded-full px-3 py-1.5 text-xs font-semibold text-[#e8a33d] transition hover:bg-[#e8a33d]/10 hover:text-[#f0b458]">Clear filters</button></div>
                </div>
            ) : (
                <div aria-label={`${producerName}'s beats`} className="max-h-[720px] overflow-y-auto overscroll-contain pr-1" style={{ scrollbarWidth: "thin", scrollbarColor: "#514638 transparent" }}>
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
                        {visibleBeats.map((beat, index) => <BeatCard key={beat.id} {...toBeatCard(beat)} loading={index === 0 ? "eager" : "lazy"} />)}
                    </div>
                </div>
            )}
        </section>
    );
}

function toBeatCard(beat: BeatSummary) {
    return {
        id: beat.id,
        slug: beat.id,
        title: beat.title,
        producer: beat.producerName || "StudioOS producer",
        thumbnail: beat.thumbnailUrl || beat.coverUrl || "/images/beats.png",
        genre: beat.genreName || "Unclassified",
        bpm: beat.bpm ?? 0,
        musicalKey: beat.keySignature || "Key unset",
        price: beat.startingPrice == null ? "Price on request" : `KSh ${beat.startingPrice.toLocaleString()}`,
        plays: beat.playCount ?? 0,
        likes: beat.likeCount ?? 0,
        duration: formatBeatDuration(beat.duration),
        durationSeconds: beat.duration ?? 0,
        exclusive: beat.exclusive,
        verified: beat.verified,
        averageRating: beat.averageRating ?? 0,
        reviewCount: beat.reviewCount ?? 0,
    };
}

function formatBeatDuration(seconds?: number | null) {
    if (!seconds || seconds < 1) return "--:--";
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

function ProducerBeatLoading() {
    return (
        <div aria-label="Loading producer beats" aria-busy="true" className="overflow-hidden rounded-2xl border border-[#2a2825] bg-[#11100e]">
            <div className="flex items-center gap-3 border-b border-[#24221e] px-4 py-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#e8a33d]/10 text-[#e8a33d]"><Music2 size={14} /></span>
                <div className="flex-1"><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#c9c1b5]">Tuning the catalog</p><p className="mt-0.5 text-[10px] text-[#716c63]">Loading {"producer's"} public releases</p></div>
                <span className="flex items-end gap-[3px]" aria-hidden="true">{[10, 16, 8, 13].map((height, index) => <span key={index} className="w-[3px] animate-pulse rounded-full bg-[#e8a33d]/70" style={{ height, animationDelay: `${index * 120}ms` }} />)}</span>
            </div>
            <div className="grid max-h-[680px] grid-cols-2 gap-3 overflow-hidden p-3 sm:gap-4 sm:p-4 md:grid-cols-3 xl:grid-cols-4">{Array.from({ length: 8 }).map((_, index) => <div key={index} className="rounded-2xl border border-[#24221e] bg-[#161513] p-2"><div className="animate-pulse aspect-[4/3] rounded-xl bg-gradient-to-br from-[#1c1a17] via-[#27231e] to-[#1c1a17]" /><div className="mt-3 h-3.5 w-2/3 animate-pulse rounded bg-[#24211d]" /><div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-[#201e1b]" /><div className="mt-3 h-6 animate-pulse rounded-lg bg-[#1e1d1a]" /></div>)}</div>
        </div>
    );
}

const PACKAGE_SERVICE_ORDER = [
    ["beat creation", "beat production", "beat making"],
    ["recording", "vocal recording"],
    ["mixing", "mix and"],
    ["mastering", "master"],
];

function orderPackageServices(services: string[]) {
    return services
        .map((service, index) => ({ service, index }))
        .sort((a, b) => {
            const order = (name: string) => PACKAGE_SERVICE_ORDER.findIndex((aliases) =>
                aliases.some((alias) => name.trim().toLowerCase() === alias || name.trim().toLowerCase().startsWith(`${alias} `)),
            );
            const orderA = order(a.service);
            const orderB = order(b.service);
            return (orderA < 0 ? PACKAGE_SERVICE_ORDER.length : orderA)
                - (orderB < 0 ? PACKAGE_SERVICE_ORDER.length : orderB)
                || a.index - b.index;
        })
        .map(({ service }) => service);
}

function OwnedStudio({ studio }: { studio: Studio }) {
    const image = studio.profileImageMedium || studio.profileImage;
    const services = orderPackageServices(studio.services || []);
    const price = studio.productionPackagePrice
        ? `KSh ${studio.productionPackagePrice.toLocaleString()}`
        : "Price on request";

    return (
        <Link href={`/studios/${studio.id}`} className="group flex gap-3 rounded-xl border border-[#2a2825] bg-[#161513] p-3 transition hover:border-[#e8a33d]/40">
            <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-[#0e0d0c]">
                {image ? <Image src={image} alt="" fill sizes="80px" unoptimized className="object-cover transition group-hover:scale-105" /> : <div className="flex h-full items-center justify-center"><Building2 size={18} className="text-[#45413b]" /></div>}
            </div>
            <div className="min-w-0 flex-1 py-0.5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#f5f4f1]">{studio.studioName}</p>
                        <p className="mt-1 flex items-center gap-1 text-[10px] text-[#777]"><MapPin size={11} /><span className="truncate">{studio.location}</span></p>
                    </div>
                    <span className="shrink-0 rounded-lg border border-[#e8a33d]/25 bg-[#e8a33d]/10 px-2.5 py-1.5 font-mono text-xs font-semibold text-[#f0bd65]">{price}</span>
                </div>
                <div className="mt-3 border-t border-[#2a2825] pt-2.5">
                    <p className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#8f887c]"><Layers3 size={11} className="text-[#e8a33d]" />Production package</p>
                    {services.length > 0 ? <ol className="mt-2 flex flex-wrap gap-1.5">{services.map((service, index) => <li key={service} className="inline-flex items-center gap-1.5 rounded-md border border-[#2a2825] bg-[#11100e] px-2 py-1 text-[10px] text-[#c0bbb1]"><span className="font-mono text-[9px] text-[#e8a33d]">{String(index + 1).padStart(2, "0")}</span>{service}</li>)}</ol> : <p className="mt-2 text-[10px] text-[#777168]">No package services listed</p>}
                </div>
                <p className="mt-2 text-[10px] font-medium text-[#e8a33d]">View studio <ArrowUpRight size={11} className="inline" /></p>
            </div>
        </Link>
    );
}
function OwnedStudiosPanel({ producerName, studios }: { producerName: string; studios: Studio[] }) { return <section className="rounded-2xl border border-[#2a2825] bg-[#161513] p-4 sm:p-5"><div className="flex items-end justify-between gap-3"><div><Label>Owned studios</Label><p className="mt-2 text-xs leading-5 text-[#777]">Spaces managed by {producerName}</p></div><span className="shrink-0 text-[10px] text-[#777]">{studios.length} listed</span></div>{studios.length ? <div className="mt-4 space-y-3">{studios.map((studio) => <OwnedStudio key={studio.id} studio={studio} />)}</div> : <p className="mt-4 rounded-xl border border-dashed border-[#2a2825] px-4 py-8 text-center text-xs text-[#777]">This producer has not listed a studio yet.</p>}</section>; }
function formatCount(value?: number) { return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value ?? 0); }
function Label({ children }: { children: React.ReactNode }) { return <h2 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#e8a33d]">{children}</h2>; }
function HeroStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) { return <div className="flex min-w-0 items-center gap-2 rounded-xl bg-[#11100e]/60 px-3 py-2"><span className="shrink-0 text-[#e8a33d]">{icon}</span><div className="min-w-0"><p className="text-[9px] uppercase tracking-[0.14em] text-[#6b685f]">{label}</p><p className="truncate text-xs font-medium text-[#e5e1d8]">{value}</p></div></div>; }
function ProducerMetric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) { return <div className="flex min-w-[102px] items-center gap-1.5 rounded-lg border border-[#2a2825] bg-[#161513] px-2.5 py-2"><span className="shrink-0 text-[#e8a33d]">{icon}</span><div className="min-w-0"><p className="text-[8px] uppercase tracking-[0.1em] text-[#6b685f]">{label}</p><p className="truncate text-xs font-semibold text-[#e5e1d8]">{value}</p></div></div>; }
function Tile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) { return <div className="rounded-xl border border-[#2a2825] bg-[#161513] p-3"><span className="text-[#e8a33d]">{icon}</span><p className="mt-3 text-[9px] uppercase tracking-[0.16em] text-[#6b685f]">{label}</p><p className="mt-1 text-xs font-medium text-[#e5e1d8]">{value}</p></div>; }
function ProducerLoading() { return <main className="min-h-screen animate-pulse bg-[#0f0f0f] px-6 py-12 lg:px-20"><div className="h-4 w-28 rounded bg-[#24211d]" /><div className="mt-8 h-56 rounded-3xl bg-[#24211d]" /><div className="mt-8 h-5 w-40 rounded bg-[#24211d]" /></main>; }
function ProducerNotFound() { return <main className="flex min-h-screen items-center justify-center bg-[#0f0f0f] px-6 text-center text-[#f5f4f1]"><div><Music2 size={34} className="mx-auto text-[#e8a33d]" /><h1 className="mt-5 text-2xl font-bold">Producer not found</h1><p className="mt-2 text-sm text-[#888]">This producer profile is not available.</p><Link href="/producers" className="mt-6 inline-flex rounded-full bg-[#e8a33d] px-5 py-2.5 text-sm font-semibold text-[#17130d]">Browse producers</Link></div></main>; }
