export type ArtistService = {
    id: string;
    artistId: number;
    name: string;
    description?: string;
    price: number;
    currency: string;
    active: boolean;
};

export type VerificationStatus = "UNVERIFIED" | "PENDING_REVIEW" | "VERIFIED" | "REJECTED";
export type AvailabilityStatus = "AVAILABLE" | "AWAY" | "UNAVAILABLE";

export type Artist = {
    id: number;
    name: string;
    username?: string;
    location?: string;
    genre?: string;
    bio?: string;
    experience?: string;
    profileImage?: string;
    profileImageLarge?: string;
    profileImageMedium?: string;
    profileImageThumbnail?: string;
    verified: boolean;
    verificationStatus?: VerificationStatus;
    availabilityStatus?: AvailabilityStatus;
    averageRating: number;
    reviewCount: number;
    followerCount: number;
    popularityScore?: number;
    trendingScore?: number;
    featured?: boolean;
    releasedProjectCount: number;
    available: boolean;
    specialties: string[];
    services: ArtistService[];
};

export type ArtistPage = {
    content: Artist[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
    first: boolean;
};

export type ArtistServiceRequest = {
    id: string;
    serviceId: string;
    serviceName: string;
    requesterId: number;
    requesterName: string;
    requestNote?: string;
    amount: number;
    currency: string;
    status: "PENDING" | "PAID" | "DELIVERED" | "CANCELLED";
    createdAt: string;
    updatedAt: string;
};
