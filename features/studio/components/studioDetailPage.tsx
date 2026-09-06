"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, BadgeCheck, Building2, CalendarCheck, MapPin, Star } from "lucide-react";

import { StudioService } from "../services/studio.service";
import type { Studio } from "../types/studio";

export function StudioDetailPage({ studioId }: { studioId: string }) {
    const [studio, setStudio] = useState<Studio | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        void StudioService.getStudio(studioId).then(setStudio).finally(() => setLoading(false));
    }, [studioId]);

    if (loading) return <div className="min-h-screen bg-[#0f0f0f] p-8 text-sm text-[#888]">Loading studio...</div>;
    if (!studio) return <div className="min-h-screen bg-[#0f0f0f] p-8 text-sm text-[#888]">Studio not found.</div>;

    const image = studio.profileImageLarge || studio.profileImageMedium || studio.profileImage || studio.media?.find((item) => item.type === "IMAGE")?.largeUrl;
    return <main className="min-h-screen bg-[#0f0f0f] text-[#f5f4f1]"><div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12"><Link href="/studios" className="inline-flex items-center gap-2 text-sm text-[#999] transition hover:text-white"><ArrowLeft size={16} /> All studios</Link><div className="mt-7 overflow-hidden rounded-[28px] border border-[#2a2825] bg-[#161513]"><div className="relative h-[320px] bg-[#0e0d0c] sm:h-[480px]">{image ? <Image src={image} alt={`${studio.studioName} studio`} fill sizes="100vw" unoptimized className="object-cover" /> : <div className="flex h-full items-center justify-center"><Building2 size={48} className="text-[#45413b]" /></div>}<div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" /><div className="absolute bottom-6 left-6 right-6 flex flex-col gap-4 sm:left-10 sm:right-10 sm:flex-row sm:items-end sm:justify-between"><div><div className="flex items-center gap-2"><h1 className="text-3xl font-bold sm:text-5xl">{studio.studioName}</h1>{studio.verified && <BadgeCheck size={21} className="text-[#75d6c6]" />}</div><p className="mt-2 flex items-center gap-2 text-sm text-[#d1cec8]"><MapPin size={15} />{studio.location}</p></div><span className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold text-white ${studio.available ? "bg-emerald-500/90" : "bg-orange-500/90"}`}><span className="h-1.5 w-1.5 rounded-full bg-white" />{studio.available ? "Available" : "Busy"}</span></div></div><div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[1.25fr_0.75fr]"><div><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#e8a33d]">About this studio</p><p className="mt-4 text-sm leading-7 text-[#999]">{studio.description}</p><div className="mt-6 flex flex-wrap gap-2">{studio.services.map((service) => <span key={service} className="rounded-full border border-[#302d28] bg-[#11100e] px-3 py-1.5 text-xs text-[#aaa]">{service}</span>)}</div>{studio.equipment.length > 0 && <div className="mt-8"><h2 className="text-lg font-semibold">Equipment & capabilities</h2><p className="mt-3 text-sm leading-7 text-[#999]">{studio.equipment.join(" · ")}</p></div>}</div><aside className="h-fit rounded-2xl border border-[#3b352c] bg-[#1b1916] p-5 sm:p-6"><div className="flex items-center justify-between"><span className="text-xs uppercase tracking-[0.16em] text-[#777]">Starting from</span><span className="flex items-center gap-1 font-mono text-sm text-[#eee]"><Star size={14} className="fill-[#e8a33d] text-[#e8a33d]" />{studio.averageRating ? studio.averageRating.toFixed(1) : "New"}</span></div><p className="mt-3 font-mono text-2xl font-semibold">KSh {studio.pricing.toLocaleString()}<span className="ml-1 text-xs font-normal text-[#777]">/ hour</span></p><p className="mt-3 text-xs leading-5 text-[#888]">{studio.availability}</p><button type="button" disabled className="mt-6 inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-[#e8a33d]/50 px-4 py-3 text-sm font-semibold text-[#17130d]/70"><CalendarCheck size={16} /> Booking flow coming soon</button></aside></div></div></div></main>;
}
