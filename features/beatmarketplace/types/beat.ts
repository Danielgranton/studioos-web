export type BeatSummary = {
    id: string;
    title: string;
    coverUrl?: string | null;
    thumbnailUrl?: string | null;
    genreName?: string | null;
    bpm?: number | null;
    keySignature?: string | null;
    startingPrice?: number | null;
    licenseType?: "BASIC" | "PREMIUM" | "EXCLUSIVE" | null;
    likeCount?: number | null;
    playCount?: number | null;
    producerId: string;
    producerName?: string | null;
    duration?: number | null;
    waveformUrl?: string | null;
    previewAvailable: boolean;
    exclusive: boolean;
    verified: boolean;
    averageRating?: number | null;
    reviewCount?: number | null;
    description?: string | null;
    mood?: string | null;
    studioId?: string | null;
    genreId?: string | null;
    status?: string | null;
    visibility?: string | null;
};

export type BeatGenre = { id: string; name: string };
export type BeatSale = { id: string; beatId: string; beatTitle: string; amount: number; status: string; exclusive: boolean; purchasedAt: string };
export type BeatReview = { id: string; beatId: string; userId: number; purchaseId?: string; rating: number; comment?: string; createdAt: string };
export type BeatLicense = { id: string; beatId: string; type: string; price: number; exclusive: boolean; active: boolean };

export type BeatPage = {
    content: BeatSummary[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
    first: boolean;
    last: boolean;
};
