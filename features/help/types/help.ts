export type HelpAudience = "ALL" | "PRODUCER" | "ARTIST" | "STUDIO_MANAGER" | "BUYER";

export type HelpCategory = {
    id: string;
    slug: string;
    name: string;
    description: string;
    displayOrder: number;
};

export type HelpArticleSummary = {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    categorySlug: string;
    categoryName: string;
    audience: HelpAudience;
    readTimeMinutes: number;
    featured: boolean;
    viewCount: number;
    publishedAt?: string | null;
    tags: string[];
};

export type HelpArticle = HelpArticleSummary & {
    content: string;
    relatedArticles: HelpArticleSummary[];
};

export type HelpPage = {
    content: HelpArticleSummary[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
    first: boolean;
    last: boolean;
};
