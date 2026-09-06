"use client";

import { useCallback, useEffect, useState } from "react";

import { StudioService } from "../services/studio.service";
import type { CreateStudioRequest, Studio, UpdateStudioRequest } from "../types/studio";

export function useMyStudios() {
    const [studios, setStudios] = useState<Studio[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<unknown>(null);

    const refresh = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            setStudios(await StudioService.getMyStudios());
        } catch (requestError) {
            setError(requestError);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void refresh();
    }, [refresh]);

    async function create(request: CreateStudioRequest) {
        setSaving(true);
        try {
            const studio = await StudioService.createStudio(request);
            setStudios((current) => [...current, studio]);
            return studio;
        } finally {
            setSaving(false);
        }
    }

    async function update(studioId: string, request: UpdateStudioRequest) {
        setSaving(true);
        try {
            const studio = await StudioService.updateStudio(studioId, request);
            setStudios((current) => current.map((item) => item.id === studioId ? studio : item));
            return studio;
        } finally {
            setSaving(false);
        }
    }

    async function uploadImage(studioId: string, file: File) {
        setSaving(true);
        try {
            const studio = await StudioService.updateStudioImage(studioId, file);
            setStudios((current) => current.map((item) => item.id === studioId ? studio : item));
            return studio;
        } finally {
            setSaving(false);
        }
    }

    return { studios, loading, saving, error, refresh, create, update, uploadImage };
}
