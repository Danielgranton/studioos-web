import { api } from "@/lib/api";
import type { ApiResponse } from "@/features/auth";
import type { Studio } from "@/features/studio";
import type { ProducerProfile } from "../types/producer";

class ProducerProfileServiceClient {
    async getProfile(id: string): Promise<ProducerProfile> {
        const response = await api.get<ApiResponse<ProducerProfile>>(`/users/${id}`);
        return response.data.data as ProducerProfile;
    }

    async getStudios(ownerId: number): Promise<Studio[]> {
        const response = await api.get<ApiResponse<{ content: Studio[] }>>("/studios", { params: { page: 0, size: 50 } });
        return (response.data.data?.content || []).filter((studio) => studio.ownerId === ownerId);
    }
}

export const ProducerProfileService = new ProducerProfileServiceClient();
