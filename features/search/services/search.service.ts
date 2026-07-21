import api from "@/lib/axios";

import {
    AdvertisementSearchResult,
    AutocompleteSuggestion,
    BeatSearchRequst,
    BeatSearchResult,
    ProducerSearchResult,
    RecentSearch,
    SearchEntityType,
    SearchRequest,
    SearchResponse,
    StudioSearchRequest,
    StudioSearchResult,
    TrendingSearch,
} from "../types/search"

class SearchService {

    // global search 
    async search(request: SearchRequest): Promise<SearchResponse> {
        const response = await api.get<SearchResponse>("/search", { params: request ,});

        return response.data;
    }

    // suggetions 
    async suggestions(q: string): Promise<AutocompleteSuggestion[]>{
        const response = await api.get<AutocompleteSuggestion[]>(
            "/search/suggetions", { params: {q}, }
        );

        return response.data;
    }

    // studios 
    async studios(request: StudioSearchRequest): Promise<StudioSearchResult[]> {
        const response = await api.get<StudioSearchResult[]>(
            "/search/studios", { params: request ,}
        );

        return response.data;
    }

    // beats
    async beats(request: BeatSearchRequst): Promise<BeatSearchResult[]>{
        const response = await api.get<BeatSearchResult[]>(
            "/search/beats", { params: request, }
        );

        return response.data;
    }

    // producers
    async producers(
        q?: string,
        page = 0,
        size = 20
    ): Promise<ProducerSearchResult[]> {
        const response = await api.get<ProducerSearchResult[]> (
            "/search/producers",
            {
                params: {
                    q,
                    page,
                    size
                },
            }
        );

        return response.data;
    }

    // advertisement
    async advertisement(
        q?: string,
        page = 0,
        size = 20,
    ): Promise<AdvertisementSearchResult[]> {
        const response = await api.get<AdvertisementSearchResult[]> (
            "search/advertisements",
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

    // trending
    async trending(
        entityType: SearchEntityType,
        limit = 10
    ): Promise<TrendingSearch[]> {
        const response = await api.get<TrendingSearch[]> (
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

    // recent search 
    async recent(): Promise<RecentSearch[]> {
        const response = await api.get<RecentSearch[]> (
            "/search/recent"
        );

        return response.data;
    }

    // clear recent 
    async clearRecent(): Promise<void> {
        await api.delete("/search/recent");
    }

    // reindex
    async reindex(){
        const response = await api.post(
            "/search/reindex"
        );

        return response.data;
    }

}

export default new SearchService();