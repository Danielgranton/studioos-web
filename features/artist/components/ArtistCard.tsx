import { ProducerCard, type ProducerCardProps } from "@/features/home";

import type { Artist } from "../types/artist";

export function ArtistCard({ artist }: { artist: Artist }) {
    const services = artist.services ?? [];
    const specialties = artist.specialties ?? [];
    const serviceNames = services.slice(0, 3).map((service) => service.name);
    const lowestService = services
        .filter((service) => service.active)
        .sort((first, second) => first.price - second.price)[0];

    const card: ProducerCardProps = {
        id: artist.id,
        slug: String(artist.id),
        name: artist.name,
        avatar: artist.profileImageThumbnail || artist.profileImage || "/images/avatar.png",
        verified: artist.verified,
        genre: artist.genre || "Music artist",
        location: artist.location || "Location not listed",
        studioNames: [],
        available: artist.available ?? services.some((service) => service.active),
        rating: artist.averageRating ?? 0,
        reviews: artist.reviewCount ?? 0,
        followerCount: artist.followerCount ?? 0,
        releaseCount: artist.releasedProjectCount ?? 0,
        popularityScore: artist.popularityScore ?? 0,
        trendingScore: artist.trendingScore ?? 0,
        featured: artist.featured ?? false,
        responseTime: artist.experience || "Open to collaborations",
        priceLabel: lowestService
            ? `From ${lowestService.currency} ${lowestService.price.toLocaleString()}`
            : "Services on profile",
        badge: artist.verified ? "Verified" : "Artist",
        services: serviceNames.length > 0 ? serviceNames : specialties.slice(0, 3),
        profileHref: `/artists/${artist.id}`,
        creatorLabel: "artist",
        showGenre: false,
        showPrice: false,
        servicesTitle: "Services",
    };

    return <ProducerCard {...card} />;
}
