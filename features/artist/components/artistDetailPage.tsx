"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { BadgeCheck, BriefcaseBusiness, MapPin, Sparkles } from "lucide-react";

import BackButton from "@/constants/BackButton";

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

    return (
        <main className="min-h-screen bg-[#0f0f0f] px-4 py-6 text-[#f5f4f1] sm:px-6 lg:px-20">
            <BackButton />
            <section className="mx-auto mt-8 grid max-w-5xl gap-8 rounded-3xl border border-[#2a2825] bg-[#161513] p-5 sm:p-8 lg:grid-cols-[260px_1fr]">
                <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-[#211e19]">
                    <Image src={artist.profileImageMedium || artist.profileImage || "/images/avatar.png"} alt={artist.name} fill sizes="260px" unoptimized className="object-cover" />
                </div>
                <div className="flex flex-col justify-center">
                    <p className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#e8a33d]"><Sparkles size={12} />Artist profile</p>
                    <h1 className="mt-3 flex items-center gap-2 text-3xl font-black tracking-tight">{artist.name}{artist.verified && <BadgeCheck className="text-[#5eead4]" size={22} />}</h1>
                    <p className="mt-2 text-sm text-[#9a978f]">{artist.genre || "Independent artist"}</p>
                    {artist.location && <p className="mt-4 flex items-center gap-2 text-sm text-[#9a978f]"><MapPin size={15} className="text-[#e8a33d]" />{artist.location}</p>}
                    {artist.bio && <p className="mt-5 max-w-2xl text-sm leading-7 text-[#b8b4aa]">{artist.bio}</p>}
                </div>
            </section>
            <section className="mx-auto mt-6 max-w-5xl rounded-3xl border border-[#2a2825] bg-[#161513] p-5 sm:p-8">
                <div className="flex items-center gap-2"><BriefcaseBusiness size={17} className="text-[#e8a33d]" /><h2 className="text-lg font-semibold">Services</h2></div>
                {artist.services.length > 0 ? <div className="mt-5 grid gap-3 sm:grid-cols-2">{artist.services.map((service) => <div key={service.id} className="rounded-2xl border border-[#2a2825] bg-[#1c1a17] p-4"><div className="flex items-start justify-between gap-4"><h3 className="font-medium">{service.name}</h3><span className="whitespace-nowrap rounded-full bg-[#e8a33d]/10 px-2.5 py-1 text-xs font-semibold text-[#f0bd65]">{service.currency} {service.price.toLocaleString()}</span></div>{service.description && <p className="mt-2 text-xs leading-6 text-[#9a978f]">{service.description}</p>}</div>)}</div> : <p className="mt-4 text-sm text-[#888176]">Services will appear here as this artist adds them.</p>}
            </section>
        </main>
    );
}
