import { api } from "@/lib/api";
import type { ApiResponse } from "@/features/auth";

import type { HelpAdminArticle, HelpAdminPage, HelpAdminRequest } from "../types/admin-help";

class AdminHelpServiceClient {
    async getArticles(): Promise<HelpAdminPage> {
        const response = await api.get<ApiResponse<HelpAdminPage> | HelpAdminPage>("/admin/help/articles", {
            params: { page: 0, size: 50, sort: "updatedAt,desc" },
        });
        return (response.data as ApiResponse<HelpAdminPage>).data ?? response.data as HelpAdminPage;
    }

    async createArticle(request: HelpAdminRequest): Promise<HelpAdminArticle> {
        const response = await api.post<ApiResponse<HelpAdminArticle>>("/admin/help/articles", request);
        return response.data.data as HelpAdminArticle;
    }

    async updateArticle(id: string, request: HelpAdminRequest): Promise<HelpAdminArticle> {
        const response = await api.put<ApiResponse<HelpAdminArticle>>(`/admin/help/articles/${id}`, request);
        return response.data.data as HelpAdminArticle;
    }

    async publishArticle(id: string): Promise<HelpAdminArticle> {
        const response = await api.post<ApiResponse<HelpAdminArticle>>(`/admin/help/articles/${id}/publish`);
        return response.data.data as HelpAdminArticle;
    }

    async archiveArticle(id: string): Promise<HelpAdminArticle> {
        const response = await api.post<ApiResponse<HelpAdminArticle>>(`/admin/help/articles/${id}/archive`);
        return response.data.data as HelpAdminArticle;
    }
}

export const AdminHelpService = new AdminHelpServiceClient();
