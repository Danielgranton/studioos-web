import { api } from "@/lib/api";

export type PlatformStats = {
    studios: number;
    producers: number;
    beats: number;
    artists: number;
};

export type FeaturedCreator = {
    id: number;
    name: string;
    role: "ARTIST" | "PRODUCER";
    profileImageThumbnail?: string;
    verified: boolean;
};

export type FeaturedCreators = {
    creators: FeaturedCreator[];
    creatorCount: number;
    averageRating?: number;
};

type ApiResponse<T> = {
    data: T;
};

class PlatformStatsServiceClient {
    async getStats(): Promise<PlatformStats> {
        const response = await api.get<ApiResponse<PlatformStats>>("/platform/stats");
        return response.data.data;
    }

    async getFeaturedCreators(limit = 4): Promise<FeaturedCreators> {
        const response = await api.get<ApiResponse<FeaturedCreators>>("/platform/featured-creators", {
            params: { limit: Math.min(limit, 4) },
        });
        return response.data.data;
    }
}

export const PlatformStatsService = new PlatformStatsServiceClient();
