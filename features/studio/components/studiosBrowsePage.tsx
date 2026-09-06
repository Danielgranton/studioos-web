"use client";

import { useEffect, useState } from "react";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";

import { FeaturedStudios, type FeaturedStudio } from "@/features/home";

import { StudioService } from "../services/studio.service";
import type { Studio } from "../types/studio";

export function StudiosBrowsePage() {
    const [studios, setStudios] = useState<FeaturedStudio[] | null>(null);
    const [error, setError] = useState(false);

    async function loadStudios() {
        setError(false);

        try {
            const response = await StudioService.getStudios({ page: 0, size: 12 });
            setStudios(response.content.map(toFeaturedStudio));
        } catch {
            setError(true);
        }
    }

    useEffect(() => {
        void loadStudios();
    }, []);

    if (error) {
        return (
            <main className="min-h-screen bg-[#0f0f0f] px-6 py-24 text-[#f5f4f1] lg:px-20">
                <div className="mx-auto flex max-w-xl flex-col items-center rounded-2xl border border-[#3a3027] bg-[#181512] px-6 py-16 text-center">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8a33d]/10 text-[#e8a33d]">
                        <AlertCircle size={22} />
                    </span>
                    <h1 className="mt-5 text-lg font-semibold">Studios are taking a moment</h1>
                    <p className="mt-2 text-sm leading-6 text-[#888]">
                        We could not load the latest studio listings.
                    </p>
                    <button
                        type="button"
                        onClick={() => void loadStudios()}
                        className="mt-6 inline-flex items-center gap-2 rounded-xl border border-[#4a4032] px-4 py-2.5 text-sm font-medium text-[#ddd] transition hover:bg-[#242019]"
                    >
                        <RefreshCw size={15} />
                        Try again
                    </button>
                </div>
            </main>
        );
    }

    if (!studios) {
        return <StudiosLoading />;
    }

    if (studios.length === 0) {
        return (
            <main className="min-h-screen bg-[#0f0f0f] px-6 py-24 text-center text-[#f5f4f1] lg:px-20">
                <h1 className="text-2xl font-bold">No studios are listed yet</h1>
                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#888]">
                    Check back soon for recording spaces ready for your next session.
                </p>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#0f0f0f] pt-6 text-[#f5f4f1]">
            <div className="px-4 sm:px-6 lg:px-8">
                <Link
                    href="/"
                    className="group inline-flex items-center gap-2 rounded-full border border-[#302d28] bg-[#161513] px-3.5 py-2 text-[11px] font-semibold text-[#aaa69d] shadow-lg shadow-black/10 transition hover:border-[#e8a33d]/40 hover:bg-[#1c1a17] hover:text-[#f5f4f1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8a33d]/60"
                >
                    <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
                    Back to home
                </Link>
            </div>
            <FeaturedStudios
                studios={studios}
                showBrowseCta={false}
                showFeaturedBadge={false}
                showSearch
            />
        </main>
    );
}

function toFeaturedStudio(studio: Studio): FeaturedStudio {
    const image =
        studio.profileImageLarge ||
        studio.profileImageMedium ||
        studio.profileImage ||
        studio.media?.find((media) => media.type === "IMAGE")?.largeUrl ||
        studio.media?.find((media) => media.type === "IMAGE")?.url ||
        "/images/beats.png";

    return {
        id: studio.id,
        slug: studio.id,
        name: studio.studioName,
        location: studio.location,
        rating: studio.averageRating ?? 0,
        reviews: studio.totalRatings ?? 0,
        bookings: studio.bookings,
        verified: studio.verified,
        badge: studio.badge || "Standard listing",
        available: studio.available,
        price: studio.pricing,
        priceLabel: `From KSh ${studio.pricing.toLocaleString()}/hr`,
        services: studio.services,
        genres: studio.genres,
        image,
    };
}

function StudiosLoading() {
    return (
        <main className="min-h-screen bg-[#0f0f0f] px-6 py-14 lg:px-20">
            <div className="mx-auto max-w-[1600px] animate-pulse">
                <div className="h-4 w-36 rounded-full bg-[#24211d]" />
                <div className="mt-5 h-12 w-2/3 max-w-xl rounded-xl bg-[#24211d]" />
                <div className="mt-4 h-5 w-full max-w-2xl rounded bg-[#24211d]" />
                <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <div
                            key={index}
                            className="rounded-2xl border border-[#2a2825] bg-[#161513] p-2.5"
                        >
                            <div className="aspect-[4/3] rounded-xl bg-[#24211d]" />
                            <div className="mt-4 h-4 w-2/3 rounded bg-[#24211d]" />
                            <div className="mt-3 h-3 w-1/2 rounded bg-[#24211d]" />
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
