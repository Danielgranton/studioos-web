import { api } from "@/lib/api";
import type { ApiResponse } from "@/features/auth";
import type { PrivacySettings } from "../types/privacy";

class PrivacyServiceClient {
    async getSettings(): Promise<PrivacySettings> {
        const response = await api.get<ApiResponse<PrivacySettings>>("/users/privacy");
        return response.data.data as PrivacySettings;
    }

    async updateSettings(settings: Partial<PrivacySettings>): Promise<PrivacySettings> {
        const response = await api.put<ApiResponse<PrivacySettings>>("/users/privacy", settings);
        return response.data.data as PrivacySettings;
    }
}

export const PrivacyService = new PrivacyServiceClient();
