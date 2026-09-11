export type ProducerSearchResult = {
    id: number;
    name: string;
    location?: string;
    genre?: string;
    bio?: string;
    profileImage?: string;
    profileImageThumbnail?: string;
    verified?: boolean;
    studioNames?: string[];
    studioCount?: number;
    available?: boolean;
    startingPrice?: number;
    responseTime?: string;
    services?: string[];
    averageRating?: number;
    reviewCount?: number;
    score?: number;
};

export type ProducerPage = {
    results: ProducerSearchResult[];
    page: number;
    size: number;
    total: number;
};

export type ProducerProfile = {
    id: number;
    name: string;
    username?: string;
    email?: string;
    phone?: string;
    role: "USER" | "ARTIST" | "PRODUCER" | "ADMIN" | "SUPER_ADMIN";
    bio?: string;
    location?: string;
    genre?: string;
    experience?: string;
    profileImage?: string;
    profileImageLarge?: string;
    profileImageMedium?: string;
    profileImageThumbnail?: string;
    instagram?: string;
    youtube?: string;
    link?: string;
};
