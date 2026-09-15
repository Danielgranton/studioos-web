"use client";

import { useCallback, useEffect, useState } from "react";

import { NotificationService } from "../services/notification.service";
import type { Notification } from "../types/notification";

export function useNotifications(unreadOnly = false, enabled = true) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refresh = useCallback(async () => {
        if (!enabled) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const [page, count] = await Promise.all([
                NotificationService.getNotifications(0, 50, unreadOnly),
                NotificationService.getUnreadCount(),
            ]);
            setNotifications(page.content ?? []);
            setUnreadCount(count);
        } catch {
            setError("We could not load your notifications.");
        } finally {
            setLoading(false);
        }
    }, [enabled, unreadOnly]);

    useEffect(() => {
        void refresh();
    }, [refresh]);

    const markAsRead = useCallback(async (id: string) => {
        const existing = notifications.find((notification) => notification.id === id);
        if (!existing || existing.isRead) return;

        setNotifications((items) => items.map((item) => item.id === id ? { ...item, isRead: true } : item));
        setUnreadCount((count) => Math.max(0, count - 1));

        try {
            await NotificationService.markAsRead(id);
        } catch {
            setNotifications((items) => items.map((item) => item.id === id ? existing : item));
            setUnreadCount((count) => count + 1);
        }
    }, [notifications]);

    const markAllAsRead = useCallback(async () => {
        const previous = notifications;
        setNotifications((items) => items.map((item) => ({ ...item, isRead: true })));
        setUnreadCount(0);

        try {
            await NotificationService.markAllAsRead();
        } catch {
            setNotifications(previous);
            setUnreadCount(previous.filter((item) => !item.isRead).length);
        }
    }, [notifications]);

    const remove = useCallback(async (id: string) => {
        const previous = notifications;
        const target = previous.find((item) => item.id === id);
        setNotifications((items) => items.filter((item) => item.id !== id));
        if (target && !target.isRead) setUnreadCount((count) => Math.max(0, count - 1));

        try {
            await NotificationService.delete(id);
        } catch {
            setNotifications(previous);
            setUnreadCount(previous.filter((item) => !item.isRead).length);
        }
    }, [notifications]);

    return { notifications, unreadCount, loading, error, refresh, markAsRead, markAllAsRead, remove };
}
