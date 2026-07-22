export enum SearchEntityType {
    STUDIO = "STUDIO",
    PRODUCER = "PRODUCER",
    BEAT = "BEAT",
    ADVERTISEMENT = "ADVERTISEMENT",
    PROJECT = "PROJECT",
    SESSION = "SESSION",
    USER = "USER",
}

export interface SearchRequest {
    q?: string;
    page?: number;
    size?: number;
}

export interface SearchResultItem {
    entityType: SearchEntityType;
    id: string;
    title: string;
    subtitle: string;
    score: number;
    image?: string;
    href?: string;
}

export interface SearchResponse {
    results: SearchResultItem[];
    page: number;
    size: number;
    total: number;
}

export interface AutocompleteSuggestion {
    value: string;
    entityType: SearchEntityType;
}

export interface RecentSearch {
    id: string;
    query: string;
    entityType: SearchEntityType;
}

export interface TrendingSearch {
    title: string;
    entityType: SearchEntityType;
    score: number;
}

/* ---------- Entity Search DTOs ---------- */

export interface StudioSearchRequest {
    q?: string;
    page?: number;
    size?: number;
}

export interface StudioSearchResult {
    id: string;
    studioName: string;
    location: string;
    pricing: number;
    averageRating: number;
    score: number;
}

export interface BeatSearchRequest {
    q?: string;
    page?: number;
    size?: number;
}

export interface BeatSearchResult {
    id: string;
    title: string;
    producerName: string;
    price: number;
    genre: string;
    coverImage: string;
    score: number;
}

export interface ProducerSearchResult {
    id: number;
    name: string;
    location: string;
    genre: string;
    bio: string;
    profileImage: string;
    averageRating: number;
    reviewCount: number;
    score: number;
}

export interface AdvertisementSearchResult {
    id: string;
    title: string;
    company: string;
    score: number;
}