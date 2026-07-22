"use client";

import { useEffect, useState } from "react";

import SearchService from "../services/search.service";

import {
    RecentSearch,
    SearchEntityType,
    TrendingSearch,
} from "../types/search";

export default function useSearchHome() {

    const [recent, setRecent] = useState<RecentSearch[]>([]);

    const [trending, setTrending] = useState<TrendingSearch[]>([]);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState<string | null>(null);

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

        } catch (err) {

            console.error(err);

            setError("Failed to load search data.");

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        void refresh();

    }, []);

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

        refresh,

        clearRecent,

    };

}