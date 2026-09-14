"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { BadgeCheck, BriefcaseBusiness, CalendarCheck, Check, Disc3, MapPin, Sparkles, Star, Users, X } from "lucide-react";

import BackButton from "@/constants/BackButton";
import { ReviewList } from "@/features/reviews";

import { ArtistService } from "../services/artist.service";
import type { Artist } from "../types/artist";

export function ArtistDetailPage({ artistId }: { artistId: string }) {
    const [artist, setArtist] = useState<Artist | null>(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        void ArtistService.getArtist(artistId).then(setArtist).catch(() => setError(true));
    }, [artistId]);

    if (error) {
        return <main className="min-h-screen bg-[#0f0f0f] px-6 py-16 text-center text-[#f5f4f1]"><p className="text-sm text-[#9a978f]">This artist profile is unavailable.</p><BackButton /></main>;
    }

    if (!artist) return <main className="min-h-screen animate-pulse bg-[#0f0f0f] px-6 py-16"><div className="mx-auto h-72 max-w-5xl rounded-3xl bg-[#181715]" /></main>;

    const isAvailable = artist.available ?? artist.services.some((service) => service.active);

    return (
        <main className="min-h-screen bg-[#0f0f0f] px-4 py-6 text-[#f5f4f1] sm:px-6 lg:px-20">
            <BackButton />
            <section className="mx-auto mt-8 flex max-w-5xl flex-col items-stretch gap-4 rounded-3xl border border-[#2a2825] bg-[#161513] p-5 sm:gap-5 sm:p-8 lg:flex-row lg:items-stretch">
                <div className="relative h-56 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-[#211e19] sm:h-64 lg:h-auto lg:w-[220px]">
                    <Image src={artist.profileImageMedium || artist.profileImage || "/images/avatar.png"} alt={artist.name} fill sizes="220px" unoptimized className="object-cover" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-[#2a2825] bg-[#1c1a17] lg:flex-row">
                    <div className="flex min-w-0 flex-1 flex-col justify-center p-5 sm:p-6">
                        <p className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#e8a33d]"><Sparkles size={12} />Artist profile</p>
                        <h1 className="mt-3 flex items-center gap-2 text-3xl font-black tracking-tight">{artist.name}{artist.verified && <BadgeCheck className="text-[#5eead4]" size={22} />}</h1>
                        <p className="mt-2 text-sm text-[#9a978f]">{artist.genre || "Independent artist"}</p>
                        {artist.location && <p className="mt-4 flex items-center gap-2 text-sm text-[#9a978f]"><MapPin size={15} className="text-[#e8a33d]" />{artist.location}</p>}
                        {artist.bio && <p className="mt-5 max-w-2xl text-sm leading-7 text-[#b8b4aa]">{artist.bio}</p>}
                    </div>
                    <div className="w-full shrink-0 border-t border-[#2a2825] p-4 lg:w-[420px] lg:border-l lg:border-t-0">
                        <div className="flex items-center justify-between gap-3"><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6b685f]">Artist snapshot</p><span className="h-1.5 w-1.5 rounded-full bg-[#e8a33d] shadow-[0_0_12px_#e8a33d]" /></div>
                        <div className="mt-3 flex w-full flex-nowrap items-start gap-2 pb-1">
                            <ArtistFact icon={<BadgeCheck size={15} />} label="Verification" value={artist.verified ? "Verified" : "Unverified"} tone={artist.verified ? "text-[#5eead4]" : "text-[#9a978f]"} />
                            <ArtistFact icon={<Users size={15} />} label="Followers" value={formatCount(artist.followerCount)} />
                            <ArtistFact icon={<Disc3 size={15} />} label="Releases" value={formatCount(artist.releasedProjectCount)} />
                            <ArtistFact icon={<Star size={15} />} label="Rating" value={artist.reviewCount > 0 ? `${artist.averageRating.toFixed(1)} / 5` : "No ratings"} tone="text-[#f0bd65]" />
                            <ArtistFact icon={isAvailable ? <Check size={15} /> : <X size={15} />} label="Availability" value={isAvailable ? "Available" : "Busy"} tone={isAvailable ? "text-[#86efac]" : "text-[#9a978f]"} />
                        </div>
                    </div>
                </div>
            </section>
            <section className="mx-auto mt-6 max-w-5xl rounded-3xl border border-[#2a2825] bg-[#161513] p-5 sm:p-8">
                <div className="flex items-center gap-2"><BriefcaseBusiness size={17} className="text-[#e8a33d]" /><h2 className="text-lg font-semibold">Services</h2></div>
                {artist.services.length > 0 ? <div className="mt-5 grid gap-3 sm:grid-cols-2">{artist.services.map((service) => <div key={service.id} className="rounded-2xl border border-[#2a2825] bg-[#1c1a17] p-4"><div className="flex items-start justify-between gap-4"><h3 className="font-medium">{service.name}</h3><span className="whitespace-nowrap rounded-full bg-[#e8a33d]/10 px-2.5 py-1 text-xs font-semibold text-[#f0bd65]">{service.currency} {service.price.toLocaleString()}</span></div>{service.description && <p className="mt-2 text-xs leading-6 text-[#9a978f]">{service.description}</p>}<div className="mt-4 flex items-center justify-between gap-3 border-t border-[#2a2825] pt-3"><span className="text-[10px] uppercase tracking-[0.12em] text-[#6b685f]">Booking flow</span><button type="button" disabled className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-lg border border-[#3a352d] bg-[#27231e] px-3 py-2 text-[10px] font-semibold text-[#8f887c]"><CalendarCheck size={13} />Coming soon</button></div></div>)}</div> : <p className="mt-4 text-sm text-[#888176]">Services will appear here as this artist adds them.</p>}
            </section>
            <div className="mx-auto mt-6 max-w-5xl"><ReviewList target="ARTIST" targetId={artistId} /></div>
        </main>
    );
}

function ArtistFact({ icon, label, value, tone = "text-[#f5f4f1]" }: { icon: ReactNode; label: string; value: string; tone?: string }) {
    return <div className="flex min-w-0 flex-1 flex-col gap-1"><span className="text-[#e8a33d]">{icon}</span><p className="truncate text-[8px] uppercase tracking-[0.08em] text-[#6b685f]" title={label}>{label}</p><p className={`truncate text-[11px] font-semibold ${tone}`} title={value}>{value}</p></div>;
}

function formatCount(value: number) {
    return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value ?? 0);
}
