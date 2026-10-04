"use client";

import Link from "next/link";
import { ArrowLeft, BriefcaseBusiness, CheckCircle2, Search, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { ProducerCard, type ProducerCardProps } from "@/features/home";

import { ServiceCatalogService, type ServiceProvider } from "../services/service-catalog.service";
import type { ServiceCatalogItem } from "../types/service";

export function ServiceProvidersPage({ slug }: { slug: string }) {
    const [service, setService] = useState<ServiceCatalogItem | null>(null);
    const [providers, setProviders] = useState<ServiceProvider[] | null>(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        void Promise.all([ServiceCatalogService.getCatalog(), ServiceCatalogService.getProviders(slug)])
            .then(([catalog, matches]) => {
                setService(catalog.find((item) => item.slug === slug) ?? null);
                setProviders(matches);
            })
            .catch(() => setError(true));
    }, [slug]);

    const uniqueProviders = useMemo(() => {
        if (!providers) return [];

        // A producer can own more than one studio. Show the person once and
        // keep the first matching service offer as the card's price anchor.
        return Array.from(new Map(providers.map((provider) => [provider.providerId, provider])).values());
    }, [providers]);

    if (error) return <State title="Service unavailable" text="We could not load providers for this service." />;
    if (providers === null) return <Loading />;

    return (
        <main className="min-h-screen bg-[#0d0d0c] px-5 py-7 text-[#f5f4f1] sm:px-8 sm:py-10">
            <div className="mx-auto max-w-[1600px]">
                <Link href="/services" className="inline-flex items-center gap-2 text-xs font-semibold text-[#8f8b83] transition hover:text-white"><ArrowLeft size={14} /> All services</Link>

                <header className="mt-7 overflow-hidden rounded-3xl border border-white/[0.08] bg-[#171614] px-5 py-7 sm:px-8 sm:py-9">
                    <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
                        <div className="max-w-2xl">
                            <span className="inline-flex items-center gap-2 rounded-full border border-[#e8a33d]/20 bg-[#e8a33d]/[0.08] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-[#e8a33d]"><Sparkles size={12} /> StudioOS providers</span>
                            <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#77746e]">{service?.category || "Creative service"}</p>
                            <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] sm:text-5xl">{service?.name || slug.replaceAll("-", " ")}</h1>
                            <p className="mt-3 max-w-xl text-sm leading-6 text-[#99958d]">{service?.description || "Connect with a StudioOS professional offering this service."}</p>
                        </div>
                        <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-white/[0.08] bg-black/20 px-4 py-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e8a33d]/10 text-[#e8a33d]"><BriefcaseBusiness size={17} /></span><div><p className="text-lg font-bold text-white">{uniqueProviders.length}</p><p className="text-[10px] uppercase tracking-[0.14em] text-[#77746e]">people offering it</p></div></div>
                    </div>
                </header>

                {uniqueProviders.length === 0 ? <State title="No providers yet" text="This service is in the catalog. Check back as more professionals publish their offers." /> : <>
                    <div className="mt-8 flex items-center justify-between gap-4 border-b border-white/[0.08] pb-4"><div><h2 className="text-lg font-bold tracking-[-0.02em]">Available professionals</h2><p className="mt-1 text-xs text-[#77746e]">Artists and producers who can deliver {service?.name || "this service"}.</p></div><span className="hidden items-center gap-1.5 text-xs text-[#77746e] sm:flex"><Search size={13} /> Browse profiles</span></div>
                    <div className="mt-5 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-5">{uniqueProviders.map((provider) => <ServiceProviderCard key={`${provider.providerType}-${provider.providerId}`} provider={provider} />)}</div>
                </>}
            </div>
        </main>
    );
}

function ServiceProviderCard({ provider }: { provider: ServiceProvider }) {
    const isArtist = provider.providerType === "ARTIST";
    const providerId = Number(provider.providerId);
    const priceLabel = provider.price == null ? "Contact for rates" : `From ${provider.currency || "KES"} ${provider.price.toLocaleString()}`;
    const card: ProducerCardProps = {
        id: Number.isFinite(providerId) ? providerId : 0,
        slug: provider.providerId,
        name: provider.providerName,
        avatar: provider.profileImage || "/images/avatar.png",
        verified: provider.verified,
        genre: provider.serviceName,
        location: provider.location || "Location not listed",
        studioNames: [],
        available: true,
        rating: 0,
        reviews: 0,
        followerCount: 0,
        releaseCount: 0,
        beatCount: 0,
        responseTime: "Service available",
        priceLabel,
        badge: provider.verified ? "Verified" : isArtist ? "Artist" : "Producer",
        services: [provider.serviceName],
        servicesTitle: "Service offered",
        profileHref: isArtist ? `/artists/${provider.providerId}` : `/producers/${provider.providerId}`,
        creatorLabel: isArtist ? "artist" : "producer",
        showGenre: true,
        showPrice: true,
    };

    return <div className="relative"><ProducerCard {...card} /><span className="pointer-events-none absolute right-4 top-4 flex items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#77746e]"><CheckCircle2 size={11} className={provider.verified ? "text-[#5eead4]" : "text-[#57534d]"} />{isArtist ? "Artist" : "Producer"}</span></div>;
}

function Loading() {
    return <main className="min-h-screen bg-[#0d0d0c] px-5 py-12 sm:px-8"><div className="mx-auto max-w-[1600px] animate-pulse"><div className="h-4 w-24 rounded bg-[#211f1b]" /><div className="mt-8 h-52 rounded-3xl bg-[#171614]" /><div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-5">{Array.from({ length: 10 }, (_, index) => <div key={index} className="h-[250px] rounded-xl border border-white/[0.05] bg-[#161513]" />)}</div></div></main>;
}

function State({ title, text }: { title: string; text: string }) {
    return <main className="flex min-h-screen items-center justify-center bg-[#0d0d0c] px-6 text-center text-white"><div><h1 className="text-2xl font-bold">{title}</h1><p className="mt-2 text-sm text-[#777169]">{text}</p><Link href="/services" className="mt-5 inline-flex rounded-xl bg-[#e8a33d] px-4 py-2.5 text-xs font-bold text-[#17130c]">Browse services</Link></div></main>;
}
