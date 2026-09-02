"use client";

import { useCallback, useEffect, useState } from "react";

import { PrivacyService } from "../services/privacy.service";
import type { PrivacySettings } from "../types/privacy";

export function usePrivacySettings() {
    const [settings, setSettings] = useState<PrivacySettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<unknown>(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            setSettings(await PrivacyService.getSettings());
        } catch (requestError) {
            setError(requestError);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void load();
    }, [load]);

    function toggle(key: keyof PrivacySettings) {
        setSettings((current) => current ? { ...current, [key]: !current[key] } : current);
    }

    async function save() {
        if (!settings) return;
        setSaving(true);
        try {
            setSettings(await PrivacyService.updateSettings(settings));
        } finally {
            setSaving(false);
        }
    }

    return { settings, loading, saving, error, toggle, save };
}
