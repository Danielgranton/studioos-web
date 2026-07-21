
export interface SearchRequest {
    q: string;
    page? : number;
    size? :number;
}

export interface StudioSearchRequest extends SearchRequest {
    city?: string;
    county?: string;
    verified?: boolean;
}

export interface BeatSearchRequst extends SearchRequest {
    genre?: string;
    bmpMin?: number;
    bmpMax?: number;
    minPrice?: number;
    maxprice?: number;
}

export interface SearchPagination {
    page : number;
    size : number;
    totalElements : number;
    totalPages: number;
}

export interface AutocompleteSuggestion {
    id: string;
    title: string;
    type: SearchEntityType;
}

export interface RecentSearch {
    id: string;
    query: string;
    searchedAt: string;
}

export interface TrendingSearch {
    keyword: string;
    searchCount: number;
    entityType: SearchEntityType;
}

export interface StudioSearchResult {
    id: string;
    name: string;
    slug: string;

    city: string;
    county: string;

    verified: boolean;

    rating: number;

    coverImage: string;
}

export interface ProducerSearchResult {
    id: string;

    name: string;

    username: string;

    verified: boolean;

    profilePicture: string;
}

export interface BeatSearchResult {
    id: string;

    title: string;

    producerName: string;

    coverImage: string;

    genre: string;

    bpm: number;

    price: number;
}

export interface AdvertisementSearchResult {
    id: string;

    title: string;

    thumbnail: string;

    redirectUrl: string;
}

export interface SearchResponse {
    studios: StudioSearchResult[];

    producers: ProducerSearchResult[];

    beats: BeatSearchResult[];

    advertisements: AdvertisementSearchResult[];
}

export enum SearchEntityType {
    STUDIO = "STUDIO",

    PRODUCER = "PRODUCER",

    BEAT = "BEAT",

    ADVERTISEMENT = "ADVERTISEMENT",
}