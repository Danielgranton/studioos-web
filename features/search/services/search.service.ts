import api from "@/lib/axios";

import {
    AdvertisementSearchResult,
    AutocompleteSuggestion,
    BeatSearchRequest,
    BeatSearchResult,
    ProducerSearchResult,
    RecentSearch,
    SearchEntityType,
    SearchRequest,
    SearchResponse,
    StudioSearchRequest,
    StudioSearchResult,
    TrendingSearch,
} from "../types/search";

class SearchService {

    // Global Search
    async search(request: SearchRequest): Promise<SearchResponse> {

        const response = await api.get<SearchResponse>(
            "/search",
            {
                params: request,
            }
        );

        console.log("Search response:", response.data);

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
    ): Promise<StudioSearchResult[]> {

        const response = await api.get<StudioSearchResult[]>(
            "/search/studios",
            {
                params: request,
            }
        );

        return response.data;
    }

    // Beats
    async beats(
        request: BeatSearchRequest,
    ): Promise<BeatSearchResult[]> {

        const response = await api.get<BeatSearchResult[]>(
            "/search/beats",
            {
                params: request,
            }
        );

        return response.data;
    }

    // Producers
    async producers(
        q?: string,
        page = 0,
        size = 20,
    ): Promise<ProducerSearchResult[]> {

        const response = await api.get<ProducerSearchResult[]>(
            "/search/producers",
            {
                params: {
                    q,
                    page,
                    size,
                },
            }
        );

        return response.data;
    }

    // Advertisements
    async advertisement(
        q?: string,
        page = 0,
        size = 20,
    ): Promise<AdvertisementSearchResult[]> {

        const response = await api.get<AdvertisementSearchResult[]>(
            "/search/advertisements",
            {
                params: {
                    q,
                    page,
                    size,
                },
            }
        );

        return response.data;
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

    // Reindex Search
    async reindex(): Promise<unknown> {

        const response = await api.post(
            "/search/reindex"
        );

        return response.data;
    }

}

export default new SearchService();