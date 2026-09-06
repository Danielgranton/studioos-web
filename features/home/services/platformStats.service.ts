import { api } from "@/lib/api";

export type PlatformStats = {
    studios: number;
    producers: number;
    beats: number;
    artists: number;
};

type ApiResponse<T> = {
    data: T;
};

class PlatformStatsServiceClient {
    async getStats(): Promise<PlatformStats> {
        const response = await api.get<ApiResponse<PlatformStats>>("/platform/stats");
        return response.data.data;
    }
}

export const PlatformStatsService = new PlatformStatsServiceClient();
