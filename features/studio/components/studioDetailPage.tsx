"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
    ArrowUpRight,
    BadgeCheck,
    Building2,
    CalendarCheck,
    CheckCircle2,
    Clock3,
    LoaderCircle,
    Heart,
    MapPin,
    Play,
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

export function StudioDetailPage({ studioId }: { studioId: string }) {
    const { session, isAuthenticated } = useSession();
    const [studio, setStudio] = useState<Studio | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedMediaId, setSelectedMediaId] = useState<string | null>(null);
    const [bookingOpen, setBookingOpen] = useState(false);

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
                            <SectionLabel>What this studio offers</SectionLabel>
                            <div className="mt-3 flex flex-wrap gap-1.5">
                                {[...studio.services, ...studio.genres].map((item) => (
                                    <span key={item} className="rounded-full border border-[#302d28] bg-[#161513] px-2.5 py-1 text-[11px] text-[#c0bbb1]">
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </section>

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
                            <span className="text-xs uppercase tracking-[0.16em] text-[#777]">Starting from</span>
                            <span className="flex items-center gap-1 font-mono text-sm text-[#eee]">
                                <Star size={14} className="fill-[#e8a33d] text-[#e8a33d]" />
                                {studio.averageRating ? studio.averageRating.toFixed(1) : "New"}
                                {studio.totalRatings ? ` (${studio.totalRatings})` : ""}
                            </span>
                        </div>
                        <p className="mt-3 font-mono text-2xl font-semibold text-[#f5f4f1]">
                            KSh {studio.pricing.toLocaleString()}
                            <span className="ml-1 text-xs font-normal text-[#777]">/ hour</span>
                        </p>
                        <p className="mt-3 flex items-center gap-2 text-xs text-[#aaa69d]">
                            <Users size={15} className="text-[#e8a33d]" />
                            {studio.bookings.toLocaleString()} bookings completed
                        </p>
                        <p className="mt-3 flex items-center gap-2 text-xs text-[#aaa69d]">
                            <Heart size={15} className="text-red-300" />
                            {studio.likeCount?.toLocaleString() ?? "0"} likes
                        </p>
                        {!isAuthenticated ? <Link href={`/auth/signin?next=${encodeURIComponent(`/studios/${studioId}`)}`} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#e8a33d] px-3 py-2.5 text-xs font-semibold text-[#17130d] transition hover:bg-[#f0b458]"><CalendarCheck size={16} />Sign in to request a session</Link> : session?.role === "ARTIST" ? <button type="button" disabled={!studio.available} onClick={() => setBookingOpen(true)} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#e8a33d] px-3 py-2.5 text-xs font-semibold text-[#17130d] transition hover:bg-[#f0b458] disabled:cursor-not-allowed disabled:opacity-50"><CalendarCheck size={16} />{studio.available ? "Request a session" : "Studio unavailable"}</button> : <p className="mt-5 rounded-xl border border-white/[0.08] px-3 py-2.5 text-center text-[11px] text-[#888176]">Studio bookings are available to artist accounts.</p>}
                    </aside>
                </div>
                <div className="mt-7"><ReviewList target="STUDIO" targetId={studioId} /></div>
            </div>
            {bookingOpen && <StudioBookingDialog studio={studio} onClose={() => setBookingOpen(false)} />}
        </main>
    );
}

function StudioBookingDialog({ studio, onClose }: { studio: Studio; onClose: () => void }) {
    const [sessionDate, setSessionDate] = useState("");
    const [durationHours, setDurationHours] = useState(2);
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
                durationHours,
                notes: notes.trim() || undefined,
            });
            setCreated(true);
        } catch (cause) {
            setError((cause as { response?: { data?: { message?: string } } })?.response?.data?.message || "We could not send the request. Check the time and try again.");
        } finally {
            setSending(false);
        }
    }

    return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 px-4 py-6 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
        <section role="dialog" aria-modal="true" aria-labelledby="studio-booking-title" className="max-h-full w-full max-w-lg overflow-y-auto rounded-3xl border border-white/10 bg-[#171614] p-5 shadow-2xl sm:p-7">
            {created ? <div className="py-5 text-center"><span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-300/[0.08] text-emerald-200"><CheckCircle2 size={22} /></span><p className="mt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#e8a33d]">Request sent</p><h2 id="studio-booking-title" className="mt-2 text-2xl font-bold">The studio has your request</h2><p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#99958d]">The producer will review the time and confirm the total price. You can follow updates in your dashboard bookings.</p><div className="mt-6 flex justify-center gap-2"><Link href="/dashboard/bookings" onClick={onClose} className="rounded-xl bg-[#e8a33d] px-4 py-2.5 text-xs font-bold text-[#17130c]">View bookings</Link><button type="button" onClick={onClose} className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-semibold text-[#c9c5bd]">Close</button></div></div> : <>
                <div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#e8a33d]">Studio session request</p><h2 id="studio-booking-title" className="mt-2 text-2xl font-bold">Book {studio.studioName}</h2><p className="mt-2 text-xs text-[#888176]">KSh {studio.pricing.toLocaleString()} per hour · producer confirms final price</p></div><button type="button" onClick={onClose} aria-label="Close booking form" className="rounded-lg p-2 text-[#888] hover:bg-white/[0.06] hover:text-white"><X size={18} /></button></div>
                <form onSubmit={(event) => void submit(event)} className="mt-6 space-y-4">
                    <label className="block"><span className="text-xs font-semibold text-[#ccc7bd]">Session date and start time</span><input type="datetime-local" min={localDateTimeMinimum()} value={sessionDate} onChange={(event) => setSessionDate(event.target.value)} required className="mt-2 w-full rounded-xl border border-white/[0.1] bg-[#10100f] px-3 py-3 text-sm text-white outline-none focus:border-[#e8a33d]/50 [color-scheme:dark]" /></label>
                    <label className="block"><span className="text-xs font-semibold text-[#ccc7bd]">Session length</span><div className="mt-2 flex items-center gap-3"><select value={durationHours} onChange={(event) => setDurationHours(Number(event.target.value))} className="w-full rounded-xl border border-white/[0.1] bg-[#10100f] px-3 py-3 text-sm text-white outline-none focus:border-[#e8a33d]/50">{Array.from({ length: 12 }, (_, index) => index + 1).map((hours) => <option key={hours} value={hours}>{hours} {hours === 1 ? "hour" : "hours"}</option>)}</select><span className="shrink-0 text-xs text-[#99958d]">Estimate <strong className="ml-1 text-[#f0bd65]">KSh {(studio.pricing * durationHours).toLocaleString()}</strong></span></div></label>
                    <label className="block"><span className="text-xs font-semibold text-[#ccc7bd]">What are you working on? <span className="font-normal text-[#77746e]">Optional</span></span><textarea value={notes} onChange={(event) => setNotes(event.target.value)} maxLength={1000} rows={4} placeholder="Tell the producer about your session, setup needs, or project..." className="mt-2 w-full resize-y rounded-xl border border-white/[0.1] bg-[#10100f] px-3 py-3 text-sm leading-5 text-white outline-none placeholder:text-[#5f5c57] focus:border-[#e8a33d]/50" /></label>
                    {error && <p role="alert" className="rounded-xl border border-red-300/20 bg-red-300/[0.06] px-3 py-2.5 text-xs leading-5 text-red-200">{error}</p>}
                    <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-3.5 py-3 text-[11px] leading-5 text-[#88847c]">No payment is taken now. The producer reviews your request and sets the final total; you pay after approval.</div>
                    <button type="submit" disabled={sending} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#e8a33d] px-4 py-3 text-sm font-bold text-[#17130c] transition hover:bg-[#f0b458] disabled:cursor-wait disabled:opacity-60">{sending && <LoaderCircle size={16} className="animate-spin" />}{sending ? "Sending request..." : "Send booking request"}</button>
                </form>
            </>}
        </section>
    </div>;
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
