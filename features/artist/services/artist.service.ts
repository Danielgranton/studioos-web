import { api } from "@/lib/api";

import type { Artist, ArtistPage } from "../types/artist";

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

        return {
            ...profileResponse.data.data,
            services: servicesResponse.data.data ?? [],
        } as Artist;
    }
}

export const ArtistService = new ArtistServiceClient();
