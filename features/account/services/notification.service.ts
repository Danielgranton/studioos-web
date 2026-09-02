import { api } from "@/lib/api";
import type { ApiResponse } from "@/features/auth";
import type { NotificationPreference, NotificationPreferenceUpdate } from "../types/notification";

class NotificationServiceClient {
    async getPreferences(): Promise<NotificationPreference[]> {
        const response = await api.get<ApiResponse<NotificationPreference[]>>("/notifications/preferences");
        return response.data.data || [];
    }

    async updatePreferences(preferences: NotificationPreferenceUpdate[]): Promise<NotificationPreference[]> {
        const response = await api.put<ApiResponse<NotificationPreference[]>>("/notifications/preferences", { preferences });
        return response.data.data || [];
    }

    async resetPreferences(): Promise<NotificationPreference[]> {
        const response = await api.post<ApiResponse<NotificationPreference[]>>("/notifications/preferences/reset");
        return response.data.data || [];
    }
}

export const NotificationService = new NotificationServiceClient();
