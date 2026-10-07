import { api } from "@/lib/api";

import type { ServiceCatalogItem } from "../types/service";

export type ServiceProvider = {
    providerType: "ARTIST" | "PRODUCER";
    providerId: string;
    providerName: string;
    location?: string;
    profileImage?: string;
    serviceName: string;
    description?: string;
    price?: number;
    currency?: string;
    verified: boolean;
    listingId: string;
    studioId?: string | null;
    catalogServiceId?: string | null;
    priceType?: "SERVICE" | "PRODUCTION_PACKAGE" | "ADD_ON";
};

type ApiResponse<T> = { data?: T };

class ServiceCatalogClient {
    async getCatalog(): Promise<ServiceCatalogItem[]> {
        const response = await api.get<ApiResponse<ServiceCatalogItem[]>>("/services/catalog");
        return response.data.data ?? [];
    }

    async addCustomService(request: { name: string; category: string; description?: string }): Promise<ServiceCatalogItem> {
        const response = await api.post<ApiResponse<ServiceCatalogItem>>("/services/catalog/custom", request);
        return response.data.data as ServiceCatalogItem;
    }

    async getProviders(slug: string): Promise<ServiceProvider[]> {
        const response = await api.get<ApiResponse<ServiceProvider[]>>(`/services/catalog/${encodeURIComponent(slug)}/providers`);
        return response.data.data ?? [];
    }
}

export const ServiceCatalogService = new ServiceCatalogClient();
