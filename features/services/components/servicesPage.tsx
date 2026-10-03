"use client";

import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, Search, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { ServiceCatalogService } from "../services/service-catalog.service";
import type { ServiceCatalogItem } from "../types/service";

export function ServicesPage() {
    const [services, setServices] = useState<ServiceCatalogItem[] | null>(null);
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("All");
    const [error, setError] = useState(false);

    useEffect(() => { void ServiceCatalogService.getCatalog().then(setServices).catch(() => setError(true)); }, []);
    const categories = ["All", ...new Set((services ?? []).map((service) => service.category))];
    const visible = useMemo(() => (services ?? []).filter((service) => (category === "All" || service.category === category) && (!query.trim() || `${service.name} ${service.description ?? ""}`.toLowerCase().includes(query.trim().toLowerCase()))), [category, query, services]);

    return <main className="min-h-screen bg-[#0f0f0f] text-[#f5f4f1]"><section className="border-b border-[#292722]"><div className="mx-auto max-w-[1240px] px-5 py-12 sm:px-8 sm:py-16"><span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#e8a33d]"><Sparkles size={13} /> StudioOS services</span><h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight sm:text-6xl">Find the right person for the next part of your music.</h1><p className="mt-4 max-w-2xl text-sm leading-7 text-[#aaa49a] sm:text-base">Explore trusted creative services from artists, producers, and studios. Choose a service to see who can deliver it.</p><label className="mt-8 flex max-w-xl items-center gap-3 rounded-2xl border border-[#3a342a] bg-[#171512] px-4 py-3.5"><Search size={17} className="text-[#e8a33d]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search services" className="w-full bg-transparent text-sm outline-none placeholder:text-[#777169]" /></label></div></section><div className="mx-auto max-w-[1240px] px-5 py-9 sm:px-8 sm:py-12"><div className="flex gap-2 overflow-x-auto pb-2">{categories.map((item) => <button key={item} type="button" onClick={() => setCategory(item)} className={`shrink-0 rounded-full border px-3.5 py-2 text-xs transition ${category === item ? "border-[#e8a33d]/40 bg-[#e8a33d]/10 text-[#e8a33d]" : "border-[#2b2925] bg-[#161513] text-[#99938a] hover:text-white"}`}>{item}</button>)}</div>{error ? <State title="Services are unavailable" text="We could not load the StudioOS service catalog." /> : services === null ? <Loading /> : visible.length === 0 ? <State title="No matching services" text="Try another search or category." /> : <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{visible.map((service) => <Link key={service.id} href={`/services/service/${service.slug}`} className="group rounded-2xl border border-[#2b2925] bg-[#161513] p-5 transition hover:-translate-y-0.5 hover:border-[#e8a33d]/40"><span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e8a33d]/20 bg-[#e8a33d]/10 text-[#e8a33d]"><BriefcaseBusiness size={18} /></span><p className="mt-5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#c5a66c]">{service.category}</p><h2 className="mt-2 text-base font-bold">{service.name}</h2><p className="mt-2 line-clamp-2 text-xs leading-5 text-[#858078]">{service.description || "Find StudioOS professionals offering this service."}</p><span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-[#e8a33d]">View providers <ArrowRight size={14} className="transition group-hover:translate-x-1" /></span></Link>)}</div>}</div></main>;
}

function Loading() { return <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{[1, 2, 3, 4, 5, 6].map((item) => <div key={item} className="h-48 animate-pulse rounded-2xl bg-[#161513]" />)}</div>; }
function State({ title, text }: { title: string; text: string }) { return <div className="mt-8 rounded-2xl border border-dashed border-[#3a3027] px-6 py-14 text-center"><h2 className="font-semibold">{title}</h2><p className="mt-2 text-sm text-[#777169]">{text}</p></div>; }
