import { api } from "@/lib/api";

import type { ReviewComment, ReviewInteraction, ReviewPage, ReviewReaction, ReviewTarget } from "../types/review";

type ApiResponse<T> = { data?: T };

class ReviewServiceClient {
    async getReviews(target: ReviewTarget, targetId: string | number, page = 0, size = 20): Promise<ReviewPage> {
        const resource = target === "ARTIST" ? "artists" : target === "PRODUCER" ? "producers" : "studios";
        const response = await api.get<ApiResponse<ReviewPage> | ReviewPage>(
            `/${resource}/${targetId}/reviews`,
            { params: { page, size } },
        );

        const payload = response.data;
        const reviewPage = (payload as ApiResponse<ReviewPage>).data ?? (payload as ReviewPage);
        return reviewPage ?? {
            content: [],
            number: page,
            size,
            totalElements: 0,
            totalPages: 0,
            last: true,
        };
    }

    async react(target: ReviewTarget, reviewId: string, reaction: ReviewReaction): Promise<ReviewInteraction> {
        const response = await api.post<ApiResponse<ReviewInteraction>>(`/reviews/${target}/${reviewId}/reaction`, { reaction });
        return response.data.data as ReviewInteraction;
    }

    async clearReaction(target: ReviewTarget, reviewId: string): Promise<ReviewInteraction> {
        const response = await api.delete<ApiResponse<ReviewInteraction>>(`/reviews/${target}/${reviewId}/reaction`);
        return response.data.data as ReviewInteraction;
    }

    async addComment(target: ReviewTarget, reviewId: string, body: string): Promise<ReviewComment> {
        const response = await api.post<ApiResponse<ReviewComment>>(`/reviews/${target}/${reviewId}/comments`, { body });
        return response.data.data as ReviewComment;
    }
}

export const ReviewService = new ReviewServiceClient();
