import { api } from "@/lib/api";

import {
    AdvertisementSearchResult,
    AutocompleteSuggestion,
    BeatSearchRequest,
    BeatSearchResult,
    ProducerSearchResult,
    PaginatedSearchResponse,
    RecentSearch,
    SearchEntityType,
    SearchRequest,
    SearchResponse,
    StudioSearchRequest,
    StudioSearchResult,
    TrendingSearch,
} from "../types/search";

type PaginatedPayload<T> = PaginatedSearchResponse<T> | T[];

function normalizePage<T>(
    data: PaginatedPayload<T>,
    page = 0,
    size = 20,
): PaginatedSearchResponse<T> {
    if (Array.isArray(data)) {
        return {
            results: data,
            page,
            size,
            total: data.length,
        };
    }

    return data;
}

class SearchServiceClient {

    // Global Search
    async search(request: SearchRequest): Promise<SearchResponse> {

        const response = await api.get<SearchResponse>(
            "/search",
            {
                params: request,
            }
        );

        return response.data;
    }

    // Suggestions
    async suggestions(q: string): Promise<AutocompleteSuggestion[]> {

        const response = await api.get<AutocompleteSuggestion[]>(
            "/search/suggestions",
            {
                params: { q },
            }
        );

        return response.data;
    }

    // Studios
    async studios(
        request: StudioSearchRequest,
    ): Promise<PaginatedSearchResponse<StudioSearchResult>> {

        const response = await api.get<PaginatedPayload<StudioSearchResult>>(
            "/search/studios",
            {
                params: request,
            }
        );

        return normalizePage(response.data, request.page, request.size);
    }

    // Beats
    async beats(
        request: BeatSearchRequest,
    ): Promise<PaginatedSearchResponse<BeatSearchResult>> {

        const response = await api.get<PaginatedPayload<BeatSearchResult>>(
            "/search/beats",
            {
                params: request,
            }
        );

        return normalizePage(response.data, request.page, request.size);
    }

    // Producers
    async producers(
        q?: string,
        page = 0,
        size = 20,
    ): Promise<PaginatedSearchResponse<ProducerSearchResult>> {

        const response = await api.get<PaginatedPayload<ProducerSearchResult>>(
            "/search/producers",
            {
                params: {
                    q,
                    page,
                    size,
                },
            }
        );

        return normalizePage(response.data, page, size);
    }

    // Advertisements
    async advertisements(
        q?: string,
        page = 0,
        size = 20,
    ): Promise<PaginatedSearchResponse<AdvertisementSearchResult>> {

        const response = await api.get<PaginatedPayload<AdvertisementSearchResult>>(
            "/search/advertisements",
            {
                params: {
                    q,
                    page,
                    size,
                },
            }
        );

        return normalizePage(response.data, page, size);
    }

    // Trending
    async trending(
        entityType: SearchEntityType,
        limit = 10,
    ): Promise<TrendingSearch[]> {

        const response = await api.get<TrendingSearch[]>(
            "/search/trending",
            {
                params: {
                    entityType,
                    limit,
                },
            }
        );

        return response.data;
    }

    // Recent Searches
    async recent(): Promise<RecentSearch[]> {

        const response = await api.get<RecentSearch[]>(
            "/search/recent"
        );

        return response.data;
    }

    // Clear Recent Searches
    async clearRecent(): Promise<void> {

        await api.delete("/search/recent");
    }

}

export const SearchService = new SearchServiceClient();
