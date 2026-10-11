"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
    ArrowUpRight,
    AlertCircle,
    AudioLines,
    BadgeCheck,
    Building2,
    CalendarCheck,
    CheckCircle2,
    Clock3,
    LoaderCircle,
    Heart,
    MapPin,
    Play,
    ShieldCheck,
    Star,
    Users,
    X,
} from "lucide-react";

import { StudioService } from "../services/studio.service";
import type { Studio, StudioMedia } from "../types/studio";
import BackButton from "@/constants/BackButton";
import { ReviewList } from "@/features/reviews";
import { useSession } from "@/features/auth";
import { BookingService } from "@/features/booking";

type GalleryItem = {
    id: string;
    type: "IMAGE" | "VIDEO";
    url: string;
    thumbnailUrl: string;
};

const PRODUCTION_STAGE_ORDER = ["Beat creation", "Recording", "Mixing", "Mastering"];

function orderedPackageServices(studio: Studio) {
    return (studio.serviceDetails || [])
        .filter((item) => item.active)
        .sort((a, b) => {
            const aIndex = PRODUCTION_STAGE_ORDER.findIndex((name) => name.toLowerCase() === a.name.toLowerCase());
            const bIndex = PRODUCTION_STAGE_ORDER.findIndex((name) => name.toLowerCase() === b.name.toLowerCase());
            return (aIndex < 0 ? PRODUCTION_STAGE_ORDER.length : aIndex) - (bIndex < 0 ? PRODUCTION_STAGE_ORDER.length : bIndex);
        });
}

export function StudioDetailPage({ studioId }: { studioId: string }) {
    const { session, isAuthenticated } = useSession();
    const [studio, setStudio] = useState<Studio | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedMediaId, setSelectedMediaId] = useState<string | null>(null);
    const [bookingOpen, setBookingOpen] = useState(false);
    const [rulesAccepted, setRulesAccepted] = useState(false);
    const [rulesNeedAttention, setRulesNeedAttention] = useState(false);
    const rulesSectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        let active = true;

        void StudioService.getStudio(studioId)
            .then((data) => {
                if (active) {
                    setStudio(data);
                    setSelectedMediaId(toGallery(data)[0]?.id || null);
                }
            })
            .catch(() => {
                if (active) setStudio(null);
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, [studioId]);

    if (loading) return <StudioDetailLoading />;
    if (!studio) return <StudioNotFound />;

    const gallery = toGallery(studio);
    const selectedMedia = gallery.find((media) => media.id === selectedMediaId) || gallery[0];
    const imageCount = gallery.filter((media) => media.type === "IMAGE").length;
    const videoCount = gallery.filter((media) => media.type === "VIDEO").length;
    const packageServices = orderedPackageServices(studio);
    const studioRules = studio.rules || [];

    function openBooking() {
        if (studioRules.length > 0 && !rulesAccepted) {
            setRulesNeedAttention(true);
            toast.error("Read and accept the studio rules first", {
                description: "Review the rules section on this page, then try booking again.",
            });
            rulesSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
            return;
        }
        setRulesNeedAttention(false);
        setBookingOpen(true);
    }

    return (
        <main className="min-h-screen bg-[#0f0f0f] text-[#f5f4f1]">
            <div className="mx-auto max-w-[1280px] px-6 py-6 lg:px-20 lg:py-9">
                <BackButton />

                <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-black tracking-tight sm:text-4xl">
                                {studio.studioName}
                            </h1>
                            {studio.verified && <BadgeCheck size={19} className="text-[#75d6c6]" />}
                        </div>
                        <p className="mt-2 flex items-center gap-2 text-xs text-[#aaa69d]">
                            <MapPin size={14} className="text-[#e8a33d]" />
                            {studio.location}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-end gap-2">
                        <Link
                            href={`/producers/${studio.ownerId}`}
                            aria-label={`View ${studio.ownerName || "studio producer"}'s profile`}
                            className="group flex min-w-[220px] items-center gap-3 rounded-2xl border border-[#302d28] bg-[#191714] px-3 py-2.5 text-left transition hover:border-[#e8a33d]/50 hover:bg-[#211e19]"
                        >
                            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#e8a33d]/20 bg-[#e8a33d]/10 text-xs font-bold text-[#e8a33d]">
                                {studio.ownerProfileImageThumbnail ? (
                                    <Image
                                        src={studio.ownerProfileImageThumbnail}
                                        alt={`${studio.ownerName} profile`}
                                        fill
                                        sizes="40px"
                                        unoptimized
                                        className="object-cover"
                                    />
                                ) : (
                                    studio.ownerName?.charAt(0).toUpperCase() || "P"
                                )}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#e8a33d]">Studio producer</p>
                                <p className="mt-1 truncate text-sm font-semibold text-[#f5f4f1]">{studio.ownerName || "Studio producer"}</p>
                                <span className="mt-1 inline-flex items-center gap-1 text-[10px] text-[#888176]">View profile <ArrowUpRight size={11} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#e8a33d]" /></span>
                            </div>
                        </Link>
                        {studio.badge && (
                            <span className="rounded-full border border-[#e8a33d]/20 bg-[#e8a33d]/10 px-2.5 py-1 text-[10px] font-semibold text-[#e8a33d]">
                                {studio.badge}
                            </span>
                        )}
                        <span
                            className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[10px] font-semibold text-white ${
                                studio.available ? "bg-emerald-500/90" : "bg-orange-500/90"
                            }`}
                        >
                            <span className="h-1.5 w-1.5 rounded-full bg-white" />
                            {studio.available ? "Available today" : "Currently busy"}
                        </span>
                    </div>
                </div>

                <section className="mt-6 rounded-3xl border border-[#2a2825] bg-[#141310] p-2.5 shadow-[0_20px_70px_rgba(0,0,0,0.18)] sm:p-3">
                    <div className="mb-3 flex items-center justify-between px-1">
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#e8a33d]">Studio showcase</p>
                            <p className="mt-1 text-xs text-[#777]">A closer look at the room and the setup</p>
                        </div>
                        <span className="rounded-full border border-[#2a2825] bg-[#1b1916] px-2.5 py-1 text-[10px] text-[#aaa69d]">
                            {imageCount} photos{videoCount ? ` · ${videoCount} video` : ""}
                        </span>
                    </div>

                    <div className="grid gap-2.5 lg:grid-cols-[minmax(0,1fr)_250px]">
                        <div className="relative aspect-[16/8] overflow-hidden rounded-2xl bg-[#0e0d0c]">
                            {selectedMedia ? (
                                selectedMedia.type === "VIDEO" ? (
                                    <video
                                        key={selectedMedia.id}
                                        className="h-full w-full object-cover"
                                        controls
                                        playsInline
                                        poster={gallery.find((media) => media.type === "IMAGE")?.url}
                                        src={selectedMedia.url}
                                    />
                                ) : (
                                    <Image
                                        src={selectedMedia.url}
                                        alt={`${studio.studioName} studio view`}
                                        fill
                                        sizes="(min-width: 1024px) 75vw, 100vw"
                                        unoptimized
                                        className="object-cover transition duration-500"
                                    />
                                )
                            ) : (
                                <EmptyGallery />
                            )}
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10" />
                            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
                                <div className="rounded-lg border border-white/10 bg-black/55 px-2.5 py-1.5 text-[10px] text-white backdrop-blur-md">
                                    {selectedMedia?.type === "VIDEO" ? "Studio video" : "Main studio view"}
                                </div>
                                <span className="text-[10px] text-white/70">Click a tile to explore</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-5 gap-2 lg:grid-cols-2 lg:grid-rows-3">
                        {gallery.map((media, index) => (
                            <button
                                key={media.id}
                                type="button"
                                onClick={() => setSelectedMediaId(media.id)}
                                className={`group relative aspect-[4/3] overflow-hidden rounded-xl border bg-[#161513] text-left transition ${
                                    selectedMedia?.id === media.id
                                        ? "border-[#e8a33d] ring-1 ring-[#e8a33d]/50"
                                        : "border-[#2a2825] hover:border-[#777066]"
                                }`}
                                aria-label={`View ${media.type.toLowerCase()} ${index + 1}`}
                            >
                                {media.type === "IMAGE" ? (
                                    <Image
                                        src={media.thumbnailUrl}
                                        alt=""
                                        fill
                                        sizes="(min-width: 1024px) 220px, 20vw"
                                        unoptimized
                                        className="object-cover transition duration-300 group-hover:scale-105"
                                    />
                                ) : (
                                    <>
                                        <Image
                                            src={media.thumbnailUrl}
                                            alt=""
                                            fill
                                            sizes="(min-width: 1024px) 220px, 20vw"
                                            unoptimized
                                            className="object-cover brightness-50"
                                        />
                                        <span className="absolute inset-0 flex items-center justify-center">
                                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#17130d]">
                                                <Play size={12} fill="currentColor" />
                                            </span>
                                        </span>
                                    </>
                                )}
                                <span className="absolute bottom-1.5 left-1.5 rounded-md bg-black/60 px-1.5 py-0.5 text-[9px] font-medium text-white backdrop-blur-sm">
                                    {media.type === "VIDEO" ? "Video" : `0${index + 1}`}
                                </span>
                            </button>
                        ))}
                        </div>
                    </div>
                </section>

                <div className="mt-8 grid gap-7 lg:grid-cols-[minmax(0,1fr)_300px]">
                    <div className="space-y-7">
                        <section>
                            <SectionLabel>About the studio</SectionLabel>
                            <p className="mt-3 max-w-3xl text-[13px] leading-6 text-[#aaa69d]">
                                {studio.description || "A professional creative space ready for your next session."}
                            </p>
                        </section>

                        <section className="grid gap-3 sm:grid-cols-3">
                            <InfoTile icon={<Building2 size={15} />} label="Rooms" value={studio.rooms ? `${studio.rooms} rooms` : "Flexible setup"} />
                            <InfoTile icon={<Clock3 size={15} />} label="Response time" value={studio.responseTime || "Response varies"} />
                            <InfoTile icon={<CalendarCheck size={15} />} label="Next opening" value={studio.nextAvailable || studio.availability || "Check availability"} />
                        </section>

                        <section>
                            <SectionLabel>Music production package</SectionLabel>
                            <div className="relative mt-3 overflow-hidden rounded-2xl border border-[#3b352c] bg-[#151411]">
                                <div aria-hidden="true" className="absolute -right-16 -top-24 h-64 w-64 rounded-full bg-[#e8a33d]/[0.07] blur-3xl" />
                                <div className="relative flex flex-col gap-4 border-b border-[#302c25] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                                    <div className="flex items-start gap-3">
                                        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#e8a33d]/20 bg-[#e8a33d]/[0.08] text-[#e8a33d]"><AudioLines size={17} /></span>
                                        <div><p className="text-[9px] font-semibold uppercase tracking-[0.19em] text-[#e8a33d]">From first idea to final master</p><h2 className="mt-1 text-base font-semibold tracking-tight text-[#f2eee7]">A release-ready production</h2><p className="mt-1 max-w-md text-[11px] leading-5 text-[#898378]">One clear price for every selected stage. No separate per-service charges.</p></div>
                                    </div>
                                    <div className="flex items-center justify-between gap-4 rounded-xl border border-[#e8a33d]/20 bg-[#e8a33d]/[0.06] px-3.5 py-2.5 sm:min-w-[190px] sm:flex-col sm:items-start sm:gap-0">
                                        <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#a89b84]">Package total</span>
                                        <span className="font-mono text-lg font-bold tracking-tight text-[#f0bd65]">{studio.productionPackagePrice != null && studio.productionPackagePrice > 0 ? `KSh ${studio.productionPackagePrice.toLocaleString()}` : "Price on request"}</span>
                                    </div>
                                </div>
                                {packageServices.length > 0 ? <div className="relative p-4 sm:p-5">
                                    <div className="mb-3 flex items-center justify-between"><p className="text-[9px] font-semibold uppercase tracking-[0.17em] text-[#8d867b]">Included in this package</p><span className="rounded-full border border-[#302c25] bg-[#1b1916] px-2 py-1 font-mono text-[9px] text-[#aaa195]">{String(packageServices.length).padStart(2, "0")} services</span></div>
                                    <ol className="grid gap-2 sm:grid-cols-2">
                                        {packageServices.map((item, index) => {
                                            const stageIndex = PRODUCTION_STAGE_ORDER.findIndex((name) => name.toLowerCase() === item.name.toLowerCase());
                                            const isCoreStage = stageIndex >= 0;
                                            const number = isCoreStage ? stageIndex + 1 : PRODUCTION_STAGE_ORDER.length + packageServices.slice(0, index).filter((service) => !PRODUCTION_STAGE_ORDER.some((name) => name.toLowerCase() === service.name.toLowerCase())).length + 1;
                                            return <li key={item.id || item.name} className="group flex min-w-0 items-center gap-3 rounded-xl border border-[#302c25] bg-[#1a1916] px-3 py-3 transition-colors hover:border-[#514431]">
                                                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg font-mono text-[10px] font-semibold ${isCoreStage ? "border border-[#e8a33d]/20 bg-[#e8a33d]/[0.08] text-[#e8a33d]" : "border border-[#37332c] bg-[#24221e] text-[#a9a196]"}`}>{String(number).padStart(2, "0")}</span>
                                                <span className="min-w-0 flex-1"><span className="block truncate text-xs font-semibold text-[#e5dfd5]">{item.name}</span><span className="mt-0.5 block text-[9px] uppercase tracking-[0.12em] text-[#777168]">{isCoreStage ? `Stage ${stageIndex + 1} · Production` : "Additional service"}</span></span>
                                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#75d6c6]/[0.09] text-[#75d6c6]"><CheckCircle2 size={12} /></span>
                                            </li>;
                                        })}
                                    </ol>
                                </div> : <div className="px-5 py-8 text-center"><p className="text-xs font-medium text-[#c7c0b5]">Package details are being updated</p><p className="mt-1 text-[10px] text-[#777168]">Contact the studio to confirm which production stages are included.</p></div>}
                            </div>
                            <div className="mt-4 flex flex-wrap gap-1.5">{studio.genres.map((item) => <span key={item} className="rounded-full border border-[#302d28] bg-[#161513] px-2.5 py-1 text-[11px] text-[#c0bbb1]">{item}</span>)}</div>
                        </section>

                        {studioRules.length > 0 && <section ref={rulesSectionRef} className="scroll-mt-24">
                            <SectionLabel>Studio rules</SectionLabel>
                            <div className={`mt-3 rounded-2xl border bg-[#151411] p-4 transition-all duration-300 sm:p-5 ${rulesNeedAttention ? "border-[#e8a33d]/70 ring-2 ring-[#e8a33d]/60 shadow-[0_0_32px_rgba(232,163,61,0.16)]" : "border-[#302d28]"}`}>
                                <div className="flex items-start gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#e8a33d]/20 bg-[#e8a33d]/[0.08] text-[#e8a33d]"><ShieldCheck size={17} /></span><div><h2 className="text-sm font-semibold text-[#f0ece5]">A few things to know before your visit</h2><p className="mt-1 text-[11px] leading-5 text-[#898378]">Please follow these guidelines while using the studio.</p></div></div>
                                <ol className="mt-4 grid gap-2 sm:grid-cols-2">{studioRules.map((rule, index) => <li key={`${index}-${rule}`} className="flex items-start gap-3 rounded-xl border border-[#302c25] bg-[#1a1916] px-3 py-3"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-[#e8a33d]/[0.08] font-mono text-[9px] text-[#e8a33d]">{String(index + 1).padStart(2, "0")}</span><span className="text-xs leading-5 text-[#c7c0b5]">{rule}</span></li>)}</ol>
                                <label className="mt-4 flex cursor-pointer items-start gap-2.5 border-t border-[#302c25] pt-3.5"><input type="checkbox" checked={rulesAccepted} onChange={(event) => { setRulesAccepted(event.target.checked); if (event.target.checked) setRulesNeedAttention(false); }} className="mt-0.5 h-4 w-4 shrink-0 accent-[#e8a33d]" /><span className="text-[11px] leading-5 text-[#d8d1c5]">I have read and agree to follow these studio rules.</span></label>
                            </div>
                        </section>}

                        {studio.equipment.length > 0 && (
                            <section>
                                <SectionLabel>Equipment and capabilities</SectionLabel>
                                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                    {studio.equipment.map((item) => (
                                    <div key={item} className="flex items-center gap-2 rounded-xl border border-[#2a2825] bg-[#161513] px-3 py-2.5 text-xs text-[#aaa69d]">
                                            <CheckCircle2 size={14} className="text-[#75d6c6]" />
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                    </div>

                    <aside className="h-fit rounded-2xl border border-[#3b352c] bg-[#1b1916] p-4 sm:p-5 lg:sticky lg:top-24">
                        <div className="flex items-center justify-between">
                            <span className="text-xs uppercase tracking-[0.16em] text-[#777]">Full-production package</span>
                            <span className="flex items-center gap-1 font-mono text-sm text-[#eee]">
                                <Star size={14} className="fill-[#e8a33d] text-[#e8a33d]" />
                                {studio.averageRating ? studio.averageRating.toFixed(1) : "New"}
                                {studio.totalRatings ? ` (${studio.totalRatings})` : ""}
                            </span>
                        </div>
                        <p className="mt-3 font-mono text-2xl font-semibold text-[#f5f4f1]">
                            {studio.productionPackagePrice && studio.productionPackagePrice > 0 ? `KSh ${studio.productionPackagePrice.toLocaleString()}` : "Price not set"}
                            <span className="ml-1 text-xs font-normal text-[#777]">/ production package</span>
                        </p>
                        <p className="mt-3 flex items-center gap-2 text-xs text-[#aaa69d]">
                            <Users size={15} className="text-[#e8a33d]" />
                            {studio.bookings.toLocaleString()} bookings completed
                        </p>
                        <p className="mt-3 flex items-center gap-2 text-xs text-[#aaa69d]">
                            <Heart size={15} className="text-red-300" />
                            {studio.likeCount?.toLocaleString() ?? "0"} likes
                        </p>
                        {!isAuthenticated ? <Link href={`/auth/signin?next=${encodeURIComponent(`/studios/${studioId}`)}`} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#e8a33d] px-3 py-2.5 text-xs font-semibold text-[#17130d] transition hover:bg-[#f0b458]"><CalendarCheck size={16} />Sign in to book package</Link> : session?.role === "ARTIST" ? <button type="button" disabled={!studio.available || !studio.productionPackagePrice} onClick={openBooking} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#e8a33d] px-3 py-2.5 text-xs font-semibold text-[#17130d] transition hover:bg-[#f0b458] disabled:cursor-not-allowed disabled:opacity-50"><CalendarCheck size={16} />{!studio.productionPackagePrice ? "Package price unavailable" : studio.available ? "Book production package" : "Studio unavailable"}</button> : <p className="mt-5 rounded-xl border border-white/[0.08] px-3 py-2.5 text-center text-[11px] text-[#888176]">Studio bookings are available to artist accounts.</p>}
                    </aside>
                </div>
                <div className="mt-7"><ReviewList target="STUDIO" targetId={studioId} /></div>
            </div>
            {bookingOpen && <StudioBookingDialog studio={studio} rulesAccepted={rulesAccepted} onClose={() => setBookingOpen(false)} />}
        </main>
    );
}

function StudioBookingDialog({ studio, rulesAccepted, onClose }: { studio: Studio; rulesAccepted: boolean; onClose: () => void }) {
    const [sessionDate, setSessionDate] = useState("");
    const [notes, setNotes] = useState("");
    const [error, setError] = useState("");
    const [sending, setSending] = useState(false);
    const [created, setCreated] = useState(false);

    async function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        const requestedTime = new Date(sessionDate).getTime();
        if (!sessionDate || !Number.isFinite(requestedTime) || requestedTime <= Date.now()) {
            setError("Choose a future date and time for your session.");
            return;
        }

        setSending(true);
        try {
            await BookingService.createBooking({
                studioId: studio.id,
                sessionDate: toLocalDateTime(sessionDate),
                rulesAccepted,
                notes: notes.trim() || undefined,
            });
            setCreated(true);
        } catch (cause) {
            setError((cause as { response?: { data?: { message?: string } } })?.response?.data?.message || "We could not send the request. Check the time and try again.");
        } finally {
            setSending(false);
        }
    }

    return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 px-3 py-4 backdrop-blur-sm sm:px-5 sm:py-6" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
        <section role="dialog" aria-modal="true" aria-labelledby="studio-booking-title" className="flex max-h-[calc(100dvh-2rem)] w-full max-w-xl flex-col overflow-hidden rounded-[26px] border border-white/[0.1] bg-[#151411] shadow-[0_32px_100px_rgba(0,0,0,0.65)] sm:max-h-[calc(100dvh-3rem)]">
            {created ? <div className="overflow-y-auto p-6 sm:p-9">
                <div className="mx-auto max-w-sm text-center"><span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-300/[0.08] text-emerald-200"><CheckCircle2 size={24} /></span><p className="mt-5 text-[9px] font-bold uppercase tracking-[0.22em] text-emerald-300">Request received</p><h2 id="studio-booking-title" className="mt-2 text-2xl font-bold tracking-tight text-[#f5f1e9]">You’re on the studio’s calendar</h2><p className="mt-3 text-sm leading-6 text-[#99958d]">{studio.studioName} will review your request. You won’t be charged unless the producer approves it and you continue to payment.</p>
                    <div className="mt-6 rounded-2xl border border-[#302c25] bg-[#1b1916] p-4 text-left"><p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#837b6e]">Requested start</p><p className="mt-2 text-sm font-semibold text-[#e9e3d8]">{formatBookingDate(sessionDate)}</p><p className="mt-1 text-xs text-[#938b7f]">Fixed package total · KSh {studio.productionPackagePrice?.toLocaleString()}</p></div>
                    <div className="mt-6 grid gap-2 sm:grid-cols-2"><Link href="/dashboard/bookings" onClick={onClose} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#e8a33d] px-4 py-3 text-xs font-bold text-[#17130c] transition hover:bg-[#f0b458]">Track request <ArrowUpRight size={14} /></Link><button type="button" onClick={onClose} className="rounded-xl border border-white/10 px-4 py-3 text-xs font-semibold text-[#c9c5bd] transition hover:bg-white/[0.04]">Back to studio</button></div>
                </div>
            </div> : <>
                <header className="relative border-b border-white/[0.07] px-5 pb-4 pt-5 sm:px-7 sm:pb-5 sm:pt-6">
                    <div aria-hidden="true" className="pointer-events-none absolute right-0 top-0 h-32 w-48 bg-[radial-gradient(ellipse_at_top_right,rgba(232,163,61,0.12),transparent_70%)]" />
                    <div className="relative flex items-start justify-between gap-4"><div><p className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-[#e8a33d]"><span className="h-1.5 w-1.5 rounded-full bg-[#e8a33d]" />Booking request <span className="text-[#625b50]">/</span> Step 1 of 1</p><h2 id="studio-booking-title" className="mt-2 text-xl font-bold tracking-tight text-[#f5f1e9] sm:text-2xl">Plan your studio session</h2><p className="mt-1 text-xs text-[#928b80]">Choose a time and share anything the producer should know.</p></div><button type="button" onClick={onClose} aria-label="Close booking form" className="relative rounded-xl border border-white/[0.07] p-2 text-[#888176] transition hover:bg-white/[0.05] hover:text-white"><X size={17} /></button></div>
                    <div className="relative mt-4 flex items-center justify-between gap-3 rounded-xl border border-[#3a342a] bg-[#1c1a16] px-3.5 py-3"><div className="min-w-0"><p className="truncate text-xs font-semibold text-[#e8e2d8]">{studio.studioName}</p><p className="mt-1 flex items-center gap-1.5 truncate text-[10px] text-[#8b8479]"><MapPin size={11} className="shrink-0 text-[#e8a33d]" />{studio.location}</p></div><div className="shrink-0 text-right"><p className="font-mono text-sm font-bold text-[#f0bd65]">KSh {studio.productionPackagePrice?.toLocaleString()}</p><p className="mt-0.5 text-[9px] uppercase tracking-[0.12em] text-[#777168]">Full package</p></div></div>
                </header>

                <form onSubmit={(event) => void submit(event)} className="flex min-h-0 flex-1 flex-col">
                    <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-7">
                        <section aria-labelledby="booking-time-heading"><div className="mb-2.5 flex items-center gap-2"><span className="grid h-6 w-6 place-items-center rounded-lg bg-[#e8a33d]/[0.09] font-mono text-[9px] text-[#e8a33d]">01</span><div><h3 id="booking-time-heading" className="text-xs font-semibold text-[#e8e2d8]">When works for you?</h3><p className="text-[10px] text-[#777168]">Pick your preferred start date and time.</p></div></div>
                            <label className="block"><span className="sr-only">Session date and start time</span><input type="datetime-local" min={localDateTimeMinimum()} value={sessionDate} onChange={(event) => setSessionDate(event.target.value)} required aria-describedby="booking-time-help" className="w-full rounded-xl border border-white/[0.1] bg-[#0d0d0c] px-3.5 py-3 text-sm text-white outline-none transition focus:border-[#e8a33d]/60 focus:ring-2 focus:ring-[#e8a33d]/10 [color-scheme:dark]" /><span id="booking-time-help" className="mt-1.5 block text-[10px] text-[#777168]">Choose a time at least 30 minutes from now.</span></label>
                        </section>

                        <section aria-labelledby="booking-notes-heading"><div className="mb-2.5 flex items-center gap-2"><span className="grid h-6 w-6 place-items-center rounded-lg bg-[#e8a33d]/[0.09] font-mono text-[9px] text-[#e8a33d]">02</span><div><h3 id="booking-notes-heading" className="text-xs font-semibold text-[#e8e2d8]">Anything to prepare? <span className="font-normal text-[#777168]">Optional</span></h3><p className="text-[10px] text-[#777168]">Share project needs, setup details, or context.</p></div></div>
                            <textarea value={notes} onChange={(event) => setNotes(event.target.value)} maxLength={1000} rows={3} placeholder="A short note for the producer..." className="w-full resize-y rounded-xl border border-white/[0.1] bg-[#0d0d0c] px-3.5 py-3 text-sm leading-5 text-white outline-none transition placeholder:text-[#5f5c57] focus:border-[#e8a33d]/50 focus:ring-2 focus:ring-[#e8a33d]/10" /><p className="mt-1 text-right text-[9px] text-[#666158]">{notes.length}/1000</p>
                        </section>

                        <div className="flex items-start gap-2.5 rounded-xl border border-[#30302b] bg-[#1b1a16] px-3.5 py-3"><CheckCircle2 size={14} className="mt-0.5 shrink-0 text-[#75d6c6]" /><p className="text-[10px] leading-4 text-[#928b80]">No payment is taken with this request. If approved, you can pay the <strong className="font-semibold text-[#d8d0c2]">full package price of KSh {studio.productionPackagePrice?.toLocaleString()}</strong>.</p></div>
                        {error && <p role="alert" className="flex items-start gap-2 rounded-xl border border-red-300/20 bg-red-300/[0.06] px-3.5 py-3 text-xs leading-5 text-red-200"><AlertCircle size={15} className="mt-0.5 shrink-0" />{error}</p>}
                    </div>
                    <footer className="border-t border-white/[0.07] bg-[#151411] px-5 py-4 sm:px-7"><div className="flex items-center justify-between gap-4"><div className="min-w-0"><p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[#777168]">You’ll request</p><p className="mt-0.5 truncate text-xs font-semibold text-[#eee6d9]">{sessionDate ? formatBookingDate(sessionDate) : "Choose a session time"}</p></div><button type="submit" disabled={sending} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#e8a33d] px-4 py-3 text-xs font-bold text-[#17130c] transition hover:bg-[#f0b458] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8a33d] focus-visible:ring-offset-2 focus-visible:ring-offset-[#151411] disabled:cursor-wait disabled:opacity-60 sm:px-5">{sending ? <><LoaderCircle size={15} className="animate-spin" />Sending</> : <>Send request <ArrowUpRight size={14} /></>}</button></div></footer>
                </form>
            </>}
        </section>
    </div>;
}

function formatBookingDate(value: string) {
    const date = new Date(value);
    if (!value || Number.isNaN(date.getTime())) return "Choose a session time";
    return new Intl.DateTimeFormat("en-KE", { weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }).format(date);
}

function localDateTimeMinimum() {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30);
    return toLocalDateTime(now);
}

function toLocalDateTime(value: string | Date) {
    const date = value instanceof Date ? value : new Date(value);
    const pad = (part: number) => String(part).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
}

function toGallery(studio: Studio): GalleryItem[] {
    const profileImage = studio.profileImageLarge || studio.profileImageMedium || studio.profileImage;
    const items: GalleryItem[] = profileImage
        ? [{ id: "profile", type: "IMAGE", url: profileImage, thumbnailUrl: studio.profileImageThumbnail || studio.profileImageMedium || profileImage }]
        : [];

    const media = [...(studio.media || [])].sort((a, b) => a.displayOrder - b.displayOrder);
    for (const item of media) {
        if (item.type === "IMAGE" && items.filter((entry) => entry.type === "IMAGE").length < 5) {
            items.push(toGalleryItem(item));
        }
    }

    media.filter((item) => item.type === "VIDEO").forEach((video) => {
        items.push(toGalleryItem(video, items[0]?.url));
    });

    return items;
}

function toGalleryItem(media: StudioMedia, fallbackThumbnail = "/images/beats.png"): GalleryItem {
    return {
        id: media.id,
        type: media.type,
        url: media.url,
        thumbnailUrl: media.thumbnailUrl || media.mediumUrl || media.url || fallbackThumbnail,
    };
}

function SectionLabel({ children }: { children: React.ReactNode }) {
    return <h2 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#e8a33d]">{children}</h2>;
}

function InfoTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="rounded-xl border border-[#2a2825] bg-[#161513] p-3">
            <span className="text-[#e8a33d]">{icon}</span>
            <p className="mt-3 text-[9px] uppercase tracking-[0.16em] text-[#6b685f]">{label}</p>
            <p className="mt-1 text-xs font-medium text-[#e5e1d8]">{value}</p>
        </div>
    );
}

function EmptyGallery() {
    return (
        <div className="flex h-full items-center justify-center">
            <Building2 size={48} className="text-[#45413b]" />
        </div>
    );
}

function StudioDetailLoading() {
    return (
        <main className="min-h-screen animate-pulse bg-[#0f0f0f] px-6 py-12 lg:px-20">
            <div className="h-4 w-24 rounded bg-[#24211d]" />
            <div className="mt-8 h-12 w-72 rounded-xl bg-[#24211d]" />
            <div className="mt-8 aspect-[16/7] rounded-3xl bg-[#24211d]" />
            <div className="mt-10 h-5 w-40 rounded bg-[#24211d]" />
            <div className="mt-4 h-24 max-w-2xl rounded-xl bg-[#24211d]" />
        </main>
    );
}

function StudioNotFound() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-[#0f0f0f] px-6 text-center text-[#f5f4f1]">
            <div>
                <Building2 size={34} className="mx-auto text-[#e8a33d]" />
                <h1 className="mt-5 text-2xl font-bold">Studio not found</h1>
                <p className="mt-2 text-sm text-[#888]">This studio may have been removed or is not available.</p>
                <Link href="/studios" className="mt-6 inline-flex rounded-full bg-[#e8a33d] px-5 py-2.5 text-sm font-semibold text-[#17130d]">
                    Browse studios
                </Link>
            </div>
        </main>
    );
}
