import { api } from "@/lib/api";

import type { HelpArticle, HelpArticleSummary, HelpCategory, HelpPage } from "../types/help";

class HelpServiceClient {
    async getCategories(): Promise<HelpCategory[]> {
        return (await api.get<HelpCategory[]>("/help/categories")).data;
    }

    async getArticle(slug: string): Promise<HelpArticle> {
        return (await api.get<HelpArticle>(`/help/articles/${encodeURIComponent(slug)}`)).data;
    }

    async searchArticles(params: {
        query?: string;
        category?: string;
        audience?: string;
        page?: number;
        size?: number;
    } = {}): Promise<HelpPage> {
        return (await api.get<HelpPage>("/help/articles", {
            params: {
                page: 0,
                size: 50,
                ...params,
            },
        })).data;
    }

    async getPopularArticles(limit = 3): Promise<HelpArticleSummary[]> {
        const page = (await api.get<{ content: HelpArticleSummary[] }>("/help/articles/popular", {
            params: { size: limit },
        })).data;
        return page.content;
    }

    async submitFeedback(slug: string, helpful: boolean): Promise<void> {
        await api.post(`/help/articles/${encodeURIComponent(slug)}/feedback`, { helpful });
    }
}

export const HelpService = new HelpServiceClient();
