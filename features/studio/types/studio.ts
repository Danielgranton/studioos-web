export type Studio = {
    id: string;
    studioName: string;
    location: string;
    pricing: number;
    availability: string;
    description: string;
    badge?: string;
    genres: string[];
    equipment: string[];
    rooms?: number;
    yearsActive?: number;
    responseTime?: string;
    available: boolean;
    nextAvailable?: string;
    bookings: number;
    verified: boolean;
    verificationStatus?: "UNVERIFIED" | "PENDING_REVIEW" | "VERIFIED" | "REJECTED";
    availabilityStatus?: "AVAILABLE" | "AWAY" | "UNAVAILABLE";
    popularityScore?: number;
    trendingScore?: number;
    featured?: boolean;
    profileImage?: string;
    profileImageLarge?: string;
    profileImageMedium?: string;
    profileImageThumbnail?: string;
    ownerId: number;
    ownerName: string;
    ownerProfileImageThumbnail?: string;
    services: string[];
    media?: StudioMedia[];
    averageRating?: number;
    totalRatings?: number;
    createdAt?: string;
};

export type StudioMedia = {
    id: string;
    type: "IMAGE" | "VIDEO";
    url: string;
    largeUrl?: string;
    mediumUrl?: string;
    thumbnailUrl?: string;
    displayOrder: number;
};

export type StudioFormValues = {
    studioName: string;
    location: string;
    pricing: string;
    availability: string;
    description: string;
    services: string;
    badge: string;
    genres: string;
    equipment: string;
    rooms: string;
    yearsActive: string;
    responseTime: string;
    available: boolean;
    nextAvailable: string;
    profileImage?: File;
};

export type CreateStudioRequest = {
    studioName: string;
    location: string;
    pricing: number;
    availability: string;
    description: string;
    services: string[];
    badge?: string;
    genres?: string[];
    equipment?: string[];
    rooms?: number;
    yearsActive?: number;
    responseTime?: string;
    available?: boolean;
    nextAvailable?: string;
};

export type UpdateStudioRequest = Partial<CreateStudioRequest>;

export type ApiResponse<T> = {
    success: boolean;
    message?: string;
    data?: T;
};

export type StudioPage = {
    content: Studio[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
    first: boolean;
};
