"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
    ArrowLeft,
    BadgeCheck,
    Building2,
    CalendarCheck,
    CheckCircle2,
    Clock3,
    MapPin,
    Play,
    Star,
    Users,
} from "lucide-react";

import { StudioService } from "../services/studio.service";
import type { Studio, StudioMedia } from "../types/studio";

type GalleryItem = {
    id: string;
    type: "IMAGE" | "VIDEO";
    url: string;
    thumbnailUrl: string;
};

export function StudioDetailPage({ studioId }: { studioId: string }) {
    const [studio, setStudio] = useState<Studio | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedMediaId, setSelectedMediaId] = useState<string | null>(null);

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
                <Link
                    href="/studios"
                    className="inline-flex items-center gap-2 text-xs text-[#9a978f] transition hover:text-white"
                >
                    <ArrowLeft size={16} />
                    All studios
                </Link>

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
                        <div className="flex items-center gap-2 rounded-xl border border-[#2a2825] bg-[#161513] px-2.5 py-2">
                            <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#e8a33d]/10 text-[11px] font-semibold text-[#e8a33d]">
                                {studio.ownerProfileImageThumbnail ? (
                                    <Image
                                        src={studio.ownerProfileImageThumbnail}
                                        alt={`${studio.ownerName} profile`}
                                        fill
                                        sizes="32px"
                                        unoptimized
                                        className="object-cover"
                                    />
                                ) : (
                                    studio.ownerName?.charAt(0).toUpperCase() || "P"
                                )}
                            </div>
                            <div className="pr-1">
                                <p className="text-[9px] uppercase tracking-[0.14em] text-[#6b685f]">Meet the producer</p>
                                <p className="mt-0.5 max-w-[130px] truncate text-xs font-semibold text-[#f5f4f1]">{studio.ownerName || "Studio producer"}</p>
                            </div>
                        </div>
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
                        <button type="button" disabled className="mt-5 inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-[#e8a33d]/50 px-3 py-2.5 text-xs font-semibold text-[#17130d]/70">
                            <CalendarCheck size={16} />
                            Booking flow coming soon
                        </button>
                    </aside>
                </div>
            </div>
        </main>
    );
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

    const video = media.find((item) => item.type === "VIDEO");
    if (video) items.push(toGalleryItem(video, items[0]?.url));

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
