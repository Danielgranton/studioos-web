"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { BadgeCheck, BriefcaseBusiness, CalendarCheck, Check, Disc3, LoaderCircle, MapPin, Sparkles, Star, Users, X } from "lucide-react";
import { toast } from "sonner";

import BackButton from "@/constants/BackButton";
import { useSession } from "@/features/auth";
import { ReviewList } from "@/features/reviews";
import { ServiceBookingService } from "@/features/services";

import { ArtistService } from "../services/artist.service";
import type { Artist } from "../types/artist";

export function ArtistDetailPage({ artistId }: { artistId: string }) {
    const [artist, setArtist] = useState<Artist | null>(null);
    const [error, setError] = useState(false);
    const [requestedServiceId, setRequestedServiceId] = useState<string | null>(null);
    const [preferredDate, setPreferredDate] = useState("");
    const [requestDetails, setRequestDetails] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const { session } = useSession();
    const router = useRouter();

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
                {artist.services.filter((service) => service.active).length > 0 ? <div className="mt-5 grid gap-3 sm:grid-cols-2">{artist.services.filter((service) => service.active).map((service) => <div key={service.id} className="rounded-2xl border border-[#2a2825] bg-[#1c1a17] p-4"><div className="flex items-start justify-between gap-4"><h3 className="font-medium">{service.name}</h3><span className="whitespace-nowrap rounded-full bg-[#e8a33d]/10 px-2.5 py-1 text-xs font-semibold text-[#f0bd65]">{service.currency} {service.price.toLocaleString()}</span></div>{service.description && <p className="mt-2 text-xs leading-6 text-[#9a978f]">{service.description}</p>}<div className="mt-4 flex items-center justify-between gap-3 border-t border-[#2a2825] pt-3"><span className="text-[10px] uppercase tracking-[0.12em] text-[#6b685f]">Starting price</span><button type="button" disabled={session?.userId === artist.id} onClick={() => {
                    if (!session) {
                        router.push(`/login?redirect=${encodeURIComponent(`/artists/${artistId}`)}`);
                        return;
                    }
                    setRequestedServiceId(service.id);
                    setPreferredDate(defaultArtistServiceDate());
                    setRequestDetails("");
                }} className="inline-flex items-center gap-1.5 rounded-lg bg-[#e8a33d] px-3 py-2 text-[10px] font-bold text-[#17130c] transition hover:bg-[#f0b458] disabled:cursor-not-allowed disabled:opacity-50"><CalendarCheck size={13} />{session?.userId === artist.id ? "Your service" : "Request service"}</button></div></div>)}</div> : <p className="mt-4 text-sm text-[#888176]">Services will appear here as this artist adds them.</p>}
            </section>
            <div className="mx-auto mt-6 max-w-5xl"><ReviewList target="ARTIST" targetId={artistId} /></div>
            {requestedServiceId && artist && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget && !submitting) setRequestedServiceId(null); }}>
                <section role="dialog" aria-modal="true" aria-labelledby="artist-service-request-title" className="max-h-full w-full max-w-lg overflow-y-auto rounded-3xl border border-white/10 bg-[#171614] p-5 shadow-2xl sm:p-7">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#e8a33d]">Service request · {artist.name}</p>
                    <h2 id="artist-service-request-title" className="mt-2 text-xl font-bold text-white">Request {artist.services.find((service) => service.id === requestedServiceId)?.name}</h2>
                    <p className="mt-2 text-sm leading-6 text-[#99958d]">Choose a preferred date and share what you need. The artist will accept with a confirmed price or decline. Payment is requested only after acceptance.</p>
                    <form className="mt-5 space-y-4" onSubmit={async (event) => {
                        event.preventDefault();
                        const service = artist.services.find((item) => item.id === requestedServiceId);
                        if (!service || !preferredDate || requestDetails.trim().length < 10) return;
                        setSubmitting(true);
                        try {
                            await ServiceBookingService.create({
                                providerType: "ARTIST",
                                providerId: artist.id,
                                listingId: service.id,
                                catalogServiceId: service.catalogServiceId,
                                serviceName: service.name,
                                preferredDate: `${preferredDate}:00`,
                                requestDetails: requestDetails.trim(),
                            });
                            setRequestedServiceId(null);
                            toast.success("Request sent", { description: "Track the artist's response from Dashboard → Bookings." });
                        } catch {
                            toast.error("Could not send request", { description: "Check your connection and try again." });
                        } finally {
                            setSubmitting(false);
                        }
                    }}>
                        <label className="block"><span className="text-xs font-semibold text-[#ccc7bd]">Preferred date and time</span><input type="datetime-local" required min={defaultArtistServiceDate()} value={preferredDate} onChange={(event) => setPreferredDate(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-[#10100f] px-3 py-3 text-sm text-white outline-none focus:border-[#e8a33d]/50 [color-scheme:dark]" /></label>
                        <label className="block"><span className="text-xs font-semibold text-[#ccc7bd]">What do you need?</span><textarea required minLength={10} maxLength={2000} rows={4} value={requestDetails} onChange={(event) => setRequestDetails(event.target.value)} placeholder="Share your goals, references, and any details the artist should know." className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-[#10100f] px-3 py-3 text-sm leading-5 text-white outline-none placeholder:text-[#625e57] focus:border-[#e8a33d]/50" /></label>
                        <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end"><button type="button" disabled={submitting} onClick={() => setRequestedServiceId(null)} className="rounded-xl border border-white/10 px-4 py-3 text-xs font-semibold text-[#aaa59c] hover:text-white">Cancel</button><button type="submit" disabled={submitting || requestDetails.trim().length < 10} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#e8a33d] px-4 py-3 text-xs font-bold text-[#17130c] disabled:opacity-50">{submitting && <LoaderCircle size={14} className="animate-spin" />}Send request</button></div>
                    </form>
                </section>
            </div>}
        </main>
    );
}

function ArtistFact({ icon, label, value, tone = "text-[#f5f4f1]" }: { icon: ReactNode; label: string; value: string; tone?: string }) {
    return <div className="flex min-w-0 flex-1 flex-col gap-1"><span className="text-[#e8a33d]">{icon}</span><p className="truncate text-[8px] uppercase tracking-[0.08em] text-[#6b685f]" title={label}>{label}</p><p className={`truncate text-[11px] font-semibold ${tone}`} title={value}>{value}</p></div>;
}

function formatCount(value: number) {
    return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value ?? 0);
}

function defaultArtistServiceDate() {
    const date = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
    return local.toISOString().slice(0, 16);
}
