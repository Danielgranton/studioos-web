import { ProducerCard, type ProducerCardProps } from "@/features/home";

import type { Artist } from "../types/artist";

export function ArtistCard({ artist }: { artist: Artist }) {
    const lowestService = artist.services
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
        available: artist.services.some((service) => service.active),
        rating: 0,
        reviews: 0,
        responseTime: artist.experience || "Open to collaborations",
        priceLabel: lowestService
            ? `From ${lowestService.currency} ${lowestService.price.toLocaleString()}`
            : "Services on profile",
        badge: artist.verified ? "Verified" : "Artist",
        services: artist.services.length > 0
            ? artist.services.slice(0, 3).map((service) => service.name)
            : [artist.genre || "Creative services"],
        profileHref: `/artists/${artist.id}`,
        creatorLabel: "artist",
    };

    return <ProducerCard {...card} />;
}
