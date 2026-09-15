import { api } from "@/lib/api";

import type { BeatGenre, BeatLicense, BeatPage, BeatReview, BeatSale, BeatSummary } from "../types/beat";

class BeatServiceClient {
    async browse(params: { page?: number; size?: number; sortBy?: string } = {}): Promise<BeatPage> {
        const response = await api.get<BeatPage>("/beats", {
            params: { page: 0, size: 50, sortBy: "TRENDING", ...params },
        });
        return response.data;
    }

    async getMyBeats(): Promise<BeatSummary[]> { return (await api.get<BeatSummary[]>("/beats/my")).data; }
    async getMySales(): Promise<BeatSale[]> { return (await api.get<BeatSale[]>("/beats/my/sales")).data; }
    async getGenres(): Promise<BeatGenre[]> { return (await api.get<BeatGenre[]>("/beats/genres")).data; }
    async getReviews(beatId: string): Promise<BeatReview[]> { return (await api.get<BeatReview[]>(`/beats/${beatId}/reviews`)).data; }
    async getLicenses(beatId: string): Promise<BeatLicense[]> { return (await api.get<BeatLicense[]>(`/beats/${beatId}/licenses`)).data; }
    async createLicense(beatId: string, type: string, price: number): Promise<BeatLicense[]> {
        return (await api.post<BeatLicense[]>(`/beats/${beatId}/licenses`, { licenses: [{ type, price }] })).data;
    }

    async createUpload(request: { title: string; description?: string; genreId: string; bpm?: number; keySignature?: string; mood?: string; visibility: string; studioId: string }) {
        return (await api.post<{ beatId: string; beatUploadUrl: string; coverUploadUrl: string }>("/beats", request)).data;
    }

    async completeUpload(beatId: string) { return (await api.post<{ beatId: string; status: string }>(`/beats/${beatId}/upload-complete`)).data; }
}

export const BeatService = new BeatServiceClient();
