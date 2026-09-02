"use client";

import { useCallback, useEffect, useState } from "react";

import { NotificationService } from "../services/notification.service";
import type { NotificationPreference, NotificationPreferenceUpdate } from "../types/notification";

export function useNotificationPreferences() {
    const [preferences, setPreferences] = useState<NotificationPreference[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<unknown>(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            setPreferences(await NotificationService.getPreferences());
        } catch (requestError) {
            setError(requestError);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void load();
    }, [load]);

    function toggle(notificationType: string, channel: "inAppEnabled" | "emailEnabled" | "smsEnabled") {
        setPreferences((current) => current.map((preference) => preference.notificationType === notificationType
            ? { ...preference, [channel]: !preference[channel] }
            : preference));
    }

    async function save() {
        setSaving(true);
        try {
            const updates: NotificationPreferenceUpdate[] = preferences.map(({ notificationType, inAppEnabled, emailEnabled, smsEnabled }) => ({
                notificationType,
                inAppEnabled,
                emailEnabled,
                smsEnabled,
            }));
            setPreferences(await NotificationService.updatePreferences(updates));
        } finally {
            setSaving(false);
        }
    }

    async function reset() {
        setSaving(true);
        try {
            setPreferences(await NotificationService.resetPreferences());
        } finally {
            setSaving(false);
        }
    }

    return { preferences, loading, saving, error, toggle, save, reset };
}
