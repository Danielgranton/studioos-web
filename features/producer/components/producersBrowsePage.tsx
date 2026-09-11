"use client";

import { useEffect, useState } from "react";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

import { TopProducers, type ProducerCardProps } from "@/features/home";

import { ProducerService } from "../services/producer.service";
import type { ProducerSearchResult } from "../types/producer";

export function ProducersBrowsePage() {
    const router = useRouter();
    const [producers, setProducers] = useState<ProducerCardProps[] | null>(null);
    const [error, setError] = useState(false);

    async function loadProducers() {
        setError(false);

        try {
            const response = await ProducerService.getProducers(0, 20);
            setProducers(response.results.map(toProducerCard));
        } catch {
            setError(true);
        }
    }

    useEffect(() => {
        void loadProducers();
    }, []);

    if (error) {
        return (
            <main className="min-h-screen bg-[#0f0f0f] px-6 py-24 text-[#f5f4f1] lg:px-20">
                <div className="mx-auto flex max-w-xl flex-col items-center rounded-2xl border border-[#3a3027] bg-[#181512] px-6 py-16 text-center">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8a33d]/10 text-[#e8a33d]">
                        <AlertCircle size={22} />
                    </span>
                    <h1 className="mt-5 text-lg font-semibold">Producers are taking a moment</h1>
                    <p className="mt-2 text-sm leading-6 text-[#888]">
                        We could not load the latest producer profiles.
                    </p>
                    <button
                        type="button"
                        onClick={() => void loadProducers()}
                        className="mt-6 inline-flex items-center gap-2 rounded-xl border border-[#4a4032] px-4 py-2.5 text-sm font-medium text-[#ddd] transition hover:bg-[#242019]"
                    >
                        <RefreshCw size={15} />
                        Try again
                    </button>
                </div>
            </main>
        );
    }

    if (!producers) return <ProducersLoading />;

    if (producers.length === 0) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#0f0f0f] px-6 text-center text-[#f5f4f1]">
                <div>
                    <h1 className="text-2xl font-bold">No producers are listed yet</h1>
                    <p className="mt-3 text-sm text-[#888]">Check back soon for new creative partners.</p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#0f0f0f] pt-6 text-[#f5f4f1]">
            <div className="px-4 sm:px-6 lg:px-8">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="group inline-flex items-center gap-2 rounded-full border border-[#302d28] bg-[#161513] px-3.5 py-2 text-[11px] font-semibold text-[#aaa69d] shadow-lg shadow-black/10 transition hover:border-[#e8a33d]/40 hover:bg-[#1c1a17] hover:text-[#f5f4f1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8a33d]/60"
                >
                    <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
                    Back
                </button>
            </div>
            <TopProducers
                producers={producers}
                showBrowseCta={false}
                showSearch
                showBadge={false}
            />
        </main>
    );
}

function toProducerCard(producer: ProducerSearchResult): ProducerCardProps {
    const services = producer.services?.length
        ? producer.services
        : producer.genre
            ? [producer.genre]
            : ["Music production"];

    return {
        id: producer.id,
        slug: String(producer.id),
        name: producer.name,
        avatar: producer.profileImageThumbnail || producer.profileImage || "/images/avatar.png",
        verified: producer.verified ?? false,
        genre: producer.genre || "Music producer",
        location: producer.location || "Location not listed",
        studioNames: producer.studioNames || [],
        available: producer.available ?? false,
        rating: producer.averageRating ?? 0,
        reviews: producer.reviewCount ?? 0,
        responseTime: producer.responseTime || "Response time varies",
        priceLabel: producer.startingPrice != null
            ? `From KSh ${producer.startingPrice.toLocaleString()}`
            : "Contact for rates",
        badge: producer.verified ? "Verified" : "Producer",
        services,
    };
}

function ProducersLoading() {
    return (
        <main className="min-h-screen bg-[#0f0f0f] px-6 py-14 lg:px-20">
            <div className="mx-auto max-w-[1600px] animate-pulse">
                <div className="h-4 w-32 rounded-full bg-[#24211d]" />
                <div className="mt-5 h-10 w-2/3 max-w-xl rounded-xl bg-[#24211d]" />
                <div className="mt-4 h-5 w-full max-w-2xl rounded bg-[#24211d]" />
                <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="min-h-[250px] rounded-xl border border-[#2a2825] bg-[#161513] p-3.5">
                            <div className="h-14 w-14 rounded-full bg-[#24211d]" />
                            <div className="mt-5 h-4 w-2/3 rounded bg-[#24211d]" />
                            <div className="mt-3 h-3 w-1/2 rounded bg-[#24211d]" />
                            <div className="mt-8 h-3 w-full rounded bg-[#24211d]" />
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
