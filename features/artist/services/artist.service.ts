import { api } from "@/lib/api";

import type { Artist, ArtistPage, ArtistServiceRequest } from "../types/artist";

type ApiResponse<T> = { data?: T };

class ArtistServiceClient {
    async getArtists(page = 0, size = 20): Promise<ArtistPage> {
        const response = await api.get<ApiResponse<ArtistPage>>("/artists", {
            params: { page, size },
        });

        return response.data.data ?? {
            content: [],
            page,
            size,
            totalElements: 0,
            totalPages: 0,
            last: true,
            first: page === 0,
        };
    }

    async getArtist(id: string): Promise<Artist> {
        const [profileResponse, servicesResponse] = await Promise.all([
            api.get<ApiResponse<Omit<Artist, "services">>>(`/users/${id}`),
            api.get<ApiResponse<Artist["services"]>>(`/artists/${id}/services`),
        ]);

        const profile = profileResponse.data.data;

        return {
            ...profile,
            verified: profile?.verified ?? profile?.verificationStatus === "VERIFIED",
            services: servicesResponse.data.data ?? [],
        } as Artist;
    }

    async getMyServices(): Promise<Artist["services"]> {
        const response = await api.get<ApiResponse<Artist["services"]>>("/artists/me/services");
        return response.data.data ?? [];
    }

    async createService(request: Omit<Artist["services"][number], "id" | "artistId">): Promise<Artist["services"][number]> {
        const response = await api.post<ApiResponse<Artist["services"][number]>>("/artists/me/services", request);
        return response.data.data as Artist["services"][number];
    }

    async updateService(id: string, request: Omit<Artist["services"][number], "id" | "artistId">): Promise<Artist["services"][number]> {
        const response = await api.put<ApiResponse<Artist["services"][number]>>(`/artists/me/services/${id}`, request);
        return response.data.data as Artist["services"][number];
    }

    async deleteService(id: string): Promise<void> {
        await api.delete(`/artists/me/services/${id}`);
    }

    async getMyServiceRequests(): Promise<ArtistServiceRequest[]> {
        const response = await api.get<ApiResponse<ArtistServiceRequest[]>>("/artists/me/service-requests");
        return response.data.data ?? [];
    }

    async updateServiceRequest(id: string, status: ArtistServiceRequest["status"]): Promise<ArtistServiceRequest> {
        const response = await api.patch<ApiResponse<ArtistServiceRequest>>(`/artists/me/service-requests/${id}`, { status });
        return response.data.data as ArtistServiceRequest;
    }
}

export const ArtistService = new ArtistServiceClient();
