"use client";

import { useState } from "react";

import { SearchService } from "../services";

import {
    RecentSearch,
    SearchEntityType,
    TrendingSearch,
} from "../types/search";

export function useSearchHome() {

    const [recent, setRecent] = useState<RecentSearch[]>([]);

    const [trending, setTrending] = useState<TrendingSearch[]>([]);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState<string | null>(null);

    const [hasLoaded, setHasLoaded] = useState(false);

    const refresh = async () => {

        try {

            setLoading(true);

            setError(null);

            const [recentResults, trendingResults] = await Promise.all([

                SearchService.recent(),

                SearchService.trending(SearchEntityType.STUDIO, 10),

            ]);

            setRecent(recentResults);

            setTrending(trendingResults);

            setHasLoaded(true);

        } catch (err) {

            console.error(err);

            setError("Failed to load search data.");

        } finally {

            setLoading(false);

        }

    };

    const clearRecent = async () => {

        try {

            await SearchService.clearRecent();

            setRecent([]);

        } catch (err) {

            console.error(err);

            setError("Unable to clear recent searches.");

        }

    };

    return {

        recent,

        trending,

        loading,

        error,

        hasLoaded,

        refresh,

        clearRecent,

    };

}
