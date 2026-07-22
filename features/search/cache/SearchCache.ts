import {
    AutocompleteSuggestion,
    SearchResponse,
} from "../types/search";

interface CachedSearch {

    query: string;

    results: SearchResponse;

    suggestions: AutocompleteSuggestion[];

    timestamp: number;

}

class SearchCache {

    private readonly TTL = 1000 * 60 * 5;

    private readonly MAX_ITEMS = 100;

    private cache = new Map<string, CachedSearch>();

    get(query: string): CachedSearch | null {

        const key = query.toLowerCase().trim();

        const item = this.cache.get(key);

        if (!item) return null;

        if (Date.now() - item.timestamp > this.TTL) {

            this.cache.delete(key);

            return null;

        }

        // Move to end (LRU)

        this.cache.delete(key);

        this.cache.set(key, item);

        return item;

    }

    set(
        query: string,
        results: SearchResponse,
        suggestions: AutocompleteSuggestion[]
    ) {

        const key = query.toLowerCase().trim();

        if (this.cache.has(key)) {

            this.cache.delete(key);

        }

        this.cache.set(key, {

            query: key,

            results,

            suggestions,

            timestamp: Date.now(),

        });

        if (this.cache.size > this.MAX_ITEMS) {

            const oldest = this.cache.keys().next().value;

            if (oldest) {

                this.cache.delete(oldest);

            }

        }

    }

    has(query: string) {

        return this.get(query) !== null;

    }

    delete(query: string) {

        this.cache.delete(query.toLowerCase().trim());

    }

    clear() {

        this.cache.clear();

    }

    size() {

        return this.cache.size;

    }

}

export default new SearchCache();