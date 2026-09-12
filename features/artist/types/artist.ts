export type ArtistService = {
    id: string;
    artistId: number;
    name: string;
    description?: string;
    price: number;
    currency: string;
    active: boolean;
};

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
