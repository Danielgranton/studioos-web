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
    async getPreviewUrl(beatId: string): Promise<string> { return (await api.get<{ previewUrl: string }>(`/beats/${beatId}/preview`)).data.previewUrl; }
    async getOwnerAudioUrl(beatId: string): Promise<string> { return (await api.get<{ previewUrl: string }>(`/beats/${beatId}/owner-audio`)).data.previewUrl; }
    async updateBeat(beatId: string, request: { title: string; description?: string; genreId: string; bpm?: number; keySignature?: string; mood?: string; visibility: string }): Promise<void> {
        await api.put(`/beats/${beatId}`, request);
    }
    async createLicense(beatId: string, type: string, price: number): Promise<BeatLicense[]> {
        return (await api.post<BeatLicense[]>(`/beats/${beatId}/licenses`, { licenses: [{ type, price }] })).data;
    }
    async updateLicense(beatId: string, licenseId: string, request: { type: string; price: number }): Promise<BeatLicense> {
        return (await api.put<BeatLicense>(`/beats/${beatId}/licenses/${licenseId}`, request)).data;
    }

    async createUpload(request: { title: string; description?: string; genreId: string; bpm?: number; keySignature?: string; mood?: string; visibility: string; studioId: string }) {
        return (await api.post<{ beatId: string; beatUploadUrl: string; coverUploadUrl: string }>("/beats", request)).data;
    }

    async completeUpload(beatId: string) { return (await api.post<{ beatId: string; status: string }>(`/beats/${beatId}/upload-complete`)).data; }
    async cancelUpload(beatId: string): Promise<void> { await api.delete(`/beats/${beatId}/upload`); }
    async archiveBeat(beatId: string): Promise<void> { await api.delete(`/beats/${beatId}`); }
    async deleteArchivedBeat(beatId: string): Promise<void> { await api.delete(`/beats/${beatId}/permanent`); }
    async retryProcessing(beatId: string): Promise<void> { await api.post(`/beats/${beatId}/processing/retry`); }
    async getProcessingStatus(beatId: string): Promise<{ operation: string; status: string; errorMessage?: string | null }[]> {
        return (await api.get(`/beats/${beatId}/processing`)).data;
    }
}

export const BeatService = new BeatServiceClient();
