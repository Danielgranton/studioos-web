import type { HelpAudience, HelpCategory } from "./help";

export type HelpAdminArticle = {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    categorySlug: string;
    categoryName: string;
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    audience: HelpAudience;
    featured: boolean;
    displayOrder: number;
    readTimeMinutes: number;
    viewCount: number;
    helpfulCount: number;
    notHelpfulCount: number;
    publishedAt?: string | null;
    tags: string[];
    updatedAt: string;
};

export type HelpAdminPage = {
    content: HelpAdminArticle[];
    totalElements: number;
    totalPages: number;
};

export type HelpAdminRequest = {
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    categorySlug: string;
    audience: HelpAudience;
    featured: boolean;
    displayOrder: number;
    readTimeMinutes: number;
    tags: string[];
};

export type HelpAdminCategories = HelpCategory[];
