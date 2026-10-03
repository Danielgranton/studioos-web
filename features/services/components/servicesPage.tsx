"use client";

import Link from "next/link";
import {
    ArrowUpRight,
    AudioLines,
    BriefcaseBusiness,
    Camera,
    Check,
    ChevronLeft,
    ChevronRight,
    Command,
    Disc3,
    GraduationCap,
    Layers3,
    Megaphone,
    Mic2,
    PenTool,
    Search,
    SlidersHorizontal,
    Sparkles,
    Video,
    X,
    type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { ServiceCatalogService } from "../services/service-catalog.service";
import type { ServiceCatalogItem } from "../types/service";

const categoryIcons: Record<string, LucideIcon> = {
    "Recording & Audio": AudioLines,
    "Music Production": Disc3,
    Songwriting: PenTool,
    "Session Musicians": Mic2,
    "Video Production": Video,
    "Branding & Design": Layers3,
    "Marketing & Promotion": Megaphone,
    Distribution: BriefcaseBusiness,
    "Podcast Services": AudioLines,
    Photography: Camera,
    Education: GraduationCap,
};

const accents = ["#e8a33d", "#77b7a3", "#b18bd1", "#d57b68", "#6f9fca"];

export function ServicesPage() {
    const [services, setServices] = useState<ServiceCatalogItem[] | null>(null);
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("All services");
    const [error, setError] = useState(false);
    const categoryRailRef = useRef<HTMLDivElement>(null);

    const scrollCategories = (amount: number) => {
        categoryRailRef.current?.scrollBy({ left: amount, behavior: "smooth" });
    };

    useEffect(() => {
        void ServiceCatalogService.getCatalog().then(setServices).catch(() => setError(true));
    }, []);

    const categories = useMemo(
        () => ["All services", ...new Set((services ?? []).map((service) => service.category))],
        [services],
    );
    const visible = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();
        return (services ?? []).filter((service) => {
            const matchesCategory = category === "All services" || service.category === category;
            const matchesQuery = !normalizedQuery || `${service.name} ${service.description ?? ""} ${service.category}`.toLowerCase().includes(normalizedQuery);
            return matchesCategory && matchesQuery;
        });
    }, [category, query, services]);
    const featured = visible.slice(0, 3);

    return (
        <main className="min-h-screen overflow-hidden bg-[#0d0d0c] text-[#f4f1eb]">
            <div className="pointer-events-none fixed inset-0 -z-0 opacity-60" aria-hidden="true">
                <div className="absolute left-[12%] top-[-12rem] h-[34rem] w-[34rem] rounded-full bg-[#d98c32]/[0.08] blur-[120px]" />
                <div className="absolute right-[-10rem] top-[32rem] h-[28rem] w-[28rem] rounded-full bg-[#648da5]/[0.06] blur-[110px]" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:linear-gradient(to_bottom,black,transparent_75%)]" />
            </div>

            <section className="relative z-10 border-b border-white/[0.07]">
                <div className="mx-auto max-w-[1320px] px-5 pb-6 pt-5 sm:px-8 sm:pb-9 sm:pt-7 lg:px-10">
                    <div className="flex items-center justify-between gap-4">
                        <Link href="/" className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#928e86] transition hover:text-white">
                            <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-[#e8a33d]">S</span>
                            StudioOS / Services
                        </Link>
                        <span className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#77746e] sm:inline-flex">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#75c5a3] shadow-[0_0_10px_#75c5a3]" />
                            Creative network
                        </span>
                    </div>

                    <div className="mt-7 grid gap-6 lg:grid-cols-[1fr_390px] lg:items-center lg:gap-14">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full border border-[#e8a33d]/20 bg-[#e8a33d]/[0.07] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#e8a33d]"><Sparkles size={13} /> The StudioOS service desk</div>
                            <h1 className="mt-4 max-w-2xl text-[2rem] font-black leading-[0.98] tracking-[-0.05em] text-[#f7f4ee] sm:text-[2.75rem] lg:text-[3.5rem]">Move the music<span className="block text-[#8e8a83]">forward.</span></h1>
                            <p className="mt-4 max-w-xl text-xs leading-6 text-[#9b978f] sm:text-sm">Find the artists, producers, and studios who can turn your next idea into a finished release.</p>
                            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#77746e]"><span><strong className="mr-1.5 font-mono text-[#d4d0c8]">01</strong> Choose a craft</span><span><strong className="mr-1.5 font-mono text-[#d4d0c8]">02</strong> Find your fit</span><span><strong className="mr-1.5 font-mono text-[#d4d0c8]">03</strong> Make it real</span></div>
                        </div>
                        <div className="relative overflow-hidden rounded-2xl border border-white/[0.1] bg-[#171614]/90 p-3.5 shadow-2xl shadow-black/20 backdrop-blur-xl">
                            <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#e8a33d]/[0.08] blur-3xl" />
                            <div className="relative flex items-center justify-between px-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#77746e]"><span>Find a service</span><Command size={13} /></div>
                            <label className="relative mt-2.5 flex items-center gap-3 rounded-xl border border-white/[0.1] bg-[#0f0f0e] px-3.5 py-3 focus-within:border-[#e8a33d]/50"><Search size={16} className="shrink-0 text-[#e8a33d]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Mixing, artwork, lessons..." className="w-full bg-transparent text-xs text-white outline-none placeholder:text-[#5f5c57]" />{query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search" className="text-[#77746e] hover:text-white"><X size={15} /></button>}</label>
                            <div className="relative mt-4 flex items-center gap-2 text-[11px] text-[#77746e]"><SlidersHorizontal size={13} className="text-[#e8a33d]" /> Browse by discipline or search above</div>
                            <div className="relative mt-4 flex items-center gap-1.5 border-t border-white/[0.07] pt-3"><span className="h-1.5 w-1.5 rounded-full bg-[#75c5a3]" /><span className="text-[10px] text-[#77746e]">Built for artists, producers, and studios</span></div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="relative z-10 mx-auto max-w-[1320px] px-5 py-6 sm:px-8 sm:py-9 lg:px-10">
                <div className="flex items-start justify-between gap-5"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#e8a33d]">Explore the network</p><h2 className="mt-2 text-2xl font-bold tracking-[-0.03em] sm:text-3xl">What are you building?</h2></div>{services && <p className="pt-2 text-right text-xs text-[#77746e]"><span className="font-mono text-[#d4d0c8]">{services.length}</span> services in the catalog</p>}</div>
                <div className="relative mt-5">
                    <button type="button" onClick={() => scrollCategories(-260)} aria-label="Previous service categories" className="absolute left-0 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-[#171614] text-[#aaa59c] shadow-xl transition hover:border-[#e8a33d]/40 hover:text-white"><ChevronLeft size={15} /></button>
                    <div ref={categoryRailRef} style={{ scrollbarWidth: "none", msOverflowStyle: "none" }} className="-mx-5 flex gap-1.5 overflow-x-auto px-12 pb-1.5 [&::-webkit-scrollbar]:hidden sm:-mx-8 sm:px-12 lg:-mx-10 lg:px-14">
                        {categories.map((item, index) => { const Icon = categoryIcons[item] ?? BriefcaseBusiness; const active = category === item; return <button key={item} type="button" onClick={() => setCategory(item)} className={`group flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-[11px] font-semibold transition ${active ? "border-[#e8a33d]/45 bg-[#e8a33d]/[0.12] text-[#f0bd65] shadow-[0_0_24px_rgba(232,163,61,0.08)]" : "border-white/[0.08] bg-white/[0.025] text-[#8c8982] hover:border-white/20 hover:text-white"}`}><Icon size={13} className={active ? "text-[#e8a33d]" : "text-[#65615b] group-hover:text-[#aaa59c]"} />{item}{index === 0 && <span className="ml-1 rounded-md bg-black/20 px-1.5 py-0.5 font-mono text-[9px]">{services?.length ?? "--"}</span>}</button>; })}
                    </div>
                    <button type="button" onClick={() => scrollCategories(260)} aria-label="Next service categories" className="absolute right-0 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-[#171614] text-[#aaa59c] shadow-xl transition hover:border-[#e8a33d]/40 hover:text-white"><ChevronRight size={15} /></button>
                </div>

                {error ? <ErrorState /> : services === null ? <Loading /> : visible.length === 0 ? <EmptyState query={query} onClear={() => { setQuery(""); setCategory("All services"); }} /> : <>
                    {!query && category === "All services" && <section className="mt-6 grid gap-2.5 lg:grid-cols-[1.35fr_0.8fr_0.8fr]"><div className="relative overflow-hidden rounded-2xl border border-[#e8a33d]/25 bg-[#1c1811] p-4 sm:p-5 lg:row-span-2"><div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#e8a33d]/10 blur-3xl" /><div className="relative flex h-full flex-col justify-between"><div><span className="inline-flex rounded-full border border-[#e8a33d]/25 px-2 py-1 text-[8px] font-bold uppercase tracking-[0.17em] text-[#e8a33d]">Start here</span><h3 className="mt-5 max-w-sm text-xl font-black leading-tight tracking-[-0.04em] sm:text-2xl">From a rough idea to a record people remember.</h3><p className="mt-2 max-w-sm text-[11px] leading-5 text-[#a79a86]">Choose a discipline, compare the people behind it, and connect with the right creative partner.</p></div><div className="mt-6 flex items-center gap-2.5 text-[10px] font-semibold text-[#f0bd65]"><span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#e8a33d]/30"><ArrowUpRight size={12} /></span> Find your next collaborator</div></div></div>{featured.map((service, index) => <FeaturedCard key={service.id} service={service} accent={accents[index + 1] ?? accents[0]} />)}</section>}
                    <section className={`${!query && category === "All services" ? "mt-12" : "mt-8"}`}><div className="flex items-center justify-between border-b border-white/[0.08] pb-4"><div className="flex items-center gap-2"><h2 className="text-lg font-bold tracking-[-0.02em]">{category === "All services" ? "All services" : category}</h2><span className="rounded-md bg-white/[0.06] px-2 py-1 font-mono text-[10px] text-[#85817a]">{visible.length}</span></div><span className="text-xs text-[#68655f]">Sorted for discovery</span></div><div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{visible.map((service, index) => <ServiceCard key={service.id} service={service} accent={accents[index % accents.length]} />)}</div></section>
                </>}
            </div>
        </main>
    );
}

function FeaturedCard({ service, accent }: { service: ServiceCatalogItem; accent: string }) { const Icon = categoryIcons[service.category] ?? BriefcaseBusiness; return <Link href={`/services/service/${service.slug}`} className="group relative flex min-h-[140px] flex-col justify-between overflow-hidden rounded-xl border border-white/[0.09] bg-[#151514] p-4 transition duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-[#1a1917]"><div className="absolute -right-10 -top-10 h-24 w-24 rounded-full opacity-10 blur-2xl transition group-hover:opacity-20" style={{ backgroundColor: accent }} /><div><div className="flex items-start justify-between"><span className="flex h-7 w-7 items-center justify-center rounded-lg border" style={{ color: accent, borderColor: `${accent}45`, backgroundColor: `${accent}12` }}><Icon size={14} /></span><ArrowUpRight size={14} className="text-[#68655f] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" /></div><p className="mt-4 text-[8px] font-bold uppercase tracking-[0.17em] text-[#77746e]">{service.category}</p><h3 className="mt-1 text-sm font-bold tracking-[-0.02em]">{service.name}</h3></div><span className="mt-4 text-[10px] font-semibold" style={{ color: accent }}>Explore service <ChevronRight size={11} className="ml-1 inline transition group-hover:translate-x-1" /></span></Link>; }

function ServiceCard({ service, accent }: { service: ServiceCatalogItem; accent: string }) { const Icon = categoryIcons[service.category] ?? BriefcaseBusiness; return <Link href={`/services/service/${service.slug}`} className="group flex min-h-[150px] flex-col rounded-xl border border-white/[0.08] bg-[#151514]/90 p-4 transition duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-[#191816]"><div className="flex items-start justify-between gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-lg border" style={{ color: accent, borderColor: `${accent}35`, backgroundColor: `${accent}10` }}><Icon size={14} /></span><span className="rounded-full border border-white/[0.08] px-1.5 py-0.5 text-[8px] font-semibold text-[#77746e]">{service.artistAllowed && service.studioAllowed ? "Artists + studios" : service.studioAllowed ? "Studios" : "Artists"}</span></div><div className="mt-auto pt-5"><p className="truncate text-[8px] font-bold uppercase tracking-[0.16em] text-[#77746e]">{service.category}</p><div className="mt-1.5 flex items-center justify-between gap-3"><h3 className="truncate text-[13px] font-bold text-[#e9e5de]">{service.name}</h3><ArrowUpRight size={14} className="shrink-0 text-[#66635d] transition group-hover:text-white" /></div><p className="mt-1.5 line-clamp-1 text-[11px] text-[#77746e]">{service.description || "Find a StudioOS professional for this service."}</p></div></Link>; }

function Loading() { return <div className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 9 }, (_, index) => <div key={index} className="h-[178px] animate-pulse rounded-2xl border border-white/[0.05] bg-white/[0.035]" />)}</div>; }
function ErrorState() { return <div className="mt-10 rounded-3xl border border-[#d57b68]/25 bg-[#241816] px-6 py-16 text-center"><div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-[#d57b68]/30 text-[#d57b68]"><X size={18} /></div><h2 className="mt-5 text-lg font-bold">The service desk is offline</h2><p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#a88c86]">We could not load the StudioOS catalog. Refresh the page and try again.</p></div>; }
function EmptyState({ query, onClear }: { query: string; onClear: () => void }) { return <div className="mt-10 rounded-3xl border border-dashed border-white/[0.14] px-6 py-16 text-center"><div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-[#85817a]"><Search size={17} /></div><h2 className="mt-5 text-lg font-bold">No services found</h2><p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#77746e]">Nothing matches {query ? `“${query}”` : "this discipline"}. Try a different search.</p><button type="button" onClick={onClear} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#e8a33d] px-4 py-2.5 text-xs font-bold text-[#17130c] transition hover:bg-[#f0b458]"><Check size={14} /> Show all services</button></div>; }
