"use client";

import { useCallback, useEffect, useState } from "react";

import { DashboardService } from "../services/dashboard.service";
import type { DashboardOverview } from "../types/overview";

export function useDashboardOverview() {
    const [overview, setOverview] = useState<DashboardOverview | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<unknown>(null);

    const refresh = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            setOverview(await DashboardService.getOverview());
        } catch (requestError) {
            setError(requestError);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void refresh();
    }, [refresh]);

    return { overview, loading, error, refresh };
}
