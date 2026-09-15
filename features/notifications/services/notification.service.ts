import { api } from "@/lib/api";
import type { ApiResponse } from "@/features/auth";

import type { Notification, NotificationPage } from "../types/notification";

type NotificationPayload<T> = ApiResponse<T> | T;

function unwrap<T>(payload: NotificationPayload<T>): T {
    return (payload as ApiResponse<T>).data ?? payload as T;
}

class NotificationServiceClient {
    async getNotifications(page = 0, size = 20, unreadOnly = false): Promise<NotificationPage> {
        const response = await api.get<NotificationPayload<NotificationPage>>(
            unreadOnly ? "/notifications/unread" : "/notifications",
            { params: { page, size } },
        );

        return unwrap(response.data);
    }

    async getUnreadCount(): Promise<number> {
        const response = await api.get<NotificationPayload<number>>("/notifications/unread/count");
        return unwrap(response.data) ?? 0;
    }

    async markAsRead(id: string): Promise<Notification> {
        const response = await api.patch<NotificationPayload<Notification>>(`/notifications/${id}/read`);
        return unwrap(response.data);
    }

    async markAllAsRead(): Promise<void> {
        await api.patch("/notifications/read/all");
    }

    async delete(id: string): Promise<void> {
        await api.delete(`/notifications/${id}`);
    }
}

export const NotificationService = new NotificationServiceClient();
