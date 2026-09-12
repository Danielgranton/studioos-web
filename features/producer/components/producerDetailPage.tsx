"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, BadgeCheck, Building2, CalendarCheck, Clock3, MapPin, Music2, Star, Users } from "lucide-react";

import BackButton from "@/constants/BackButton";
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
    const services = Array.from(new Set(studios.flatMap((studio) => studio.services)));
    const genres = Array.from(new Set(studios.flatMap((studio) => studio.genres)));
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
                        <section><Label>About the producer</Label><p className="mt-3 max-w-3xl text-[13px] leading-6 text-[#aaa69d]">{producer.bio || "A creative professional ready to help shape your next release."}</p></section>
                        <section className="grid gap-3 sm:grid-cols-3"><Tile icon={<Star size={15} />} label="Rating" value={rating ? `${rating.toFixed(1)} average` : "New producer"} /><Tile icon={<Users size={15} />} label="Completed work" value={`${bookings.toLocaleString()} bookings`} /><Tile icon={<Clock3 size={15} />} label="Experience" value={producer.experience || "Available for briefs"} /></section>
                        {(services.length || genres.length) > 0 && <section><Label>Specialties</Label><div className="mt-3 flex flex-wrap gap-1.5">{[...services, ...genres].map((item) => <span key={item} className="rounded-full border border-[#302d28] bg-[#161513] px-2.5 py-1 text-[11px] text-[#c0bbb1]">{item}</span>)}</div></section>}
                    </div>
                    <aside className="h-fit rounded-2xl border border-[#3b352c] bg-[#1b1916] p-4 sm:p-5 lg:sticky lg:top-24"><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#e8a33d]">Work with {producer.name.split(" ")[0]}</p><h2 className="mt-3 text-xl font-semibold">Bring your next idea to life.</h2><p className="mt-2 text-xs leading-5 text-[#8f887c]">Review their services and studios, then connect when you are ready to plan a session.</p><button type="button" disabled className="mt-5 inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-[#e8a33d]/50 px-3 py-2.5 text-xs font-semibold text-[#17130d]/70"><CalendarCheck size={15} />Contact flow coming soon</button>{producer.link && <a href={producer.link} target="_blank" rel="noreferrer" className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#3b352c] px-3 py-2.5 text-xs font-semibold text-[#d7d0c4] transition hover:bg-[#242019]">Visit external profile <ArrowUpRight size={14} /></a>}</aside>
                </div>
            </div>
        </main>
    );
}

function OwnedStudio({ studio }: { studio: Studio }) { const image = studio.profileImageMedium || studio.profileImage; const price = studio.pricing > 0 ? `From KSh ${studio.pricing.toLocaleString()}/hr` : "Contact for rates"; return <Link href={`/studios/${studio.id}`} className="group flex gap-3 rounded-xl border border-[#2a2825] bg-[#161513] p-2.5 transition hover:border-[#e8a33d]/40"><div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-[#0e0d0c]">{image ? <Image src={image} alt="" fill sizes="80px" unoptimized className="object-cover transition group-hover:scale-105" /> : <div className="flex h-full items-center justify-center"><Building2 size={18} className="text-[#45413b]" /></div>}</div><div className="min-w-0 py-1"><p className="truncate text-sm font-semibold text-[#f5f4f1]">{studio.studioName}</p><p className="mt-1 flex items-center gap-1 text-[10px] text-[#777]"><MapPin size={11} /><span className="truncate">{studio.location}</span></p><p className="mt-2 inline-flex rounded-md border border-[#e8a33d]/25 bg-[#e8a33d]/10 px-2 py-1 text-[11px] font-semibold text-[#f0bd65]">{price}</p><p className="mt-2 text-[10px] text-[#e8a33d]">View studio <ArrowUpRight size={11} className="inline" /></p></div></Link>; }
function OwnedStudiosPanel({ producerName, studios }: { producerName: string; studios: Studio[] }) { return <section className="rounded-2xl border border-[#2a2825] bg-[#161513] p-4 sm:p-5"><div className="flex items-end justify-between gap-3"><div><Label>Owned studios</Label><p className="mt-2 text-xs leading-5 text-[#777]">Spaces managed by {producerName}</p></div><span className="shrink-0 text-[10px] text-[#777]">{studios.length} listed</span></div>{studios.length ? <div className="mt-4 space-y-3">{studios.map((studio) => <OwnedStudio key={studio.id} studio={studio} />)}</div> : <p className="mt-4 rounded-xl border border-dashed border-[#2a2825] px-4 py-8 text-center text-xs text-[#777]">This producer has not listed a studio yet.</p>}</section>; }
function Label({ children }: { children: React.ReactNode }) { return <h2 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#e8a33d]">{children}</h2>; }
function HeroStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) { return <div className="flex min-w-0 items-center gap-2 rounded-xl bg-[#11100e]/60 px-3 py-2"><span className="shrink-0 text-[#e8a33d]">{icon}</span><div className="min-w-0"><p className="text-[9px] uppercase tracking-[0.14em] text-[#6b685f]">{label}</p><p className="truncate text-xs font-medium text-[#e5e1d8]">{value}</p></div></div>; }
function Tile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) { return <div className="rounded-xl border border-[#2a2825] bg-[#161513] p-3"><span className="text-[#e8a33d]">{icon}</span><p className="mt-3 text-[9px] uppercase tracking-[0.16em] text-[#6b685f]">{label}</p><p className="mt-1 text-xs font-medium text-[#e5e1d8]">{value}</p></div>; }
function ProducerLoading() { return <main className="min-h-screen animate-pulse bg-[#0f0f0f] px-6 py-12 lg:px-20"><div className="h-4 w-28 rounded bg-[#24211d]" /><div className="mt-8 h-56 rounded-3xl bg-[#24211d]" /><div className="mt-8 h-5 w-40 rounded bg-[#24211d]" /></main>; }
function ProducerNotFound() { return <main className="flex min-h-screen items-center justify-center bg-[#0f0f0f] px-6 text-center text-[#f5f4f1]"><div><Music2 size={34} className="mx-auto text-[#e8a33d]" /><h1 className="mt-5 text-2xl font-bold">Producer not found</h1><p className="mt-2 text-sm text-[#888]">This producer profile is not available.</p><Link href="/producers" className="mt-6 inline-flex rounded-full bg-[#e8a33d] px-5 py-2.5 text-sm font-semibold text-[#17130d]">Browse producers</Link></div></main>; }
