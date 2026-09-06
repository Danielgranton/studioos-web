import { api } from "@/lib/api";

import type {
    ApiResponse,
    CreateStudioRequest,
    Studio,
    StudioPage,
    StudioMedia,
    UpdateStudioRequest,
} from "../types/studio";

class StudioServiceClient {
    async getMyStudios(): Promise<Studio[]> {
        const response = await api.get<ApiResponse<Studio[]>>("/studios/my");
        return response.data.data || [];
    }

    async getStudios(params: { location?: string; maxPrice?: number; page?: number; size?: number } = {}): Promise<StudioPage> {
        const response = await api.get<ApiResponse<StudioPage>>("/studios", { params });
        return response.data.data as StudioPage;
    }

    async getStudio(studioId: string): Promise<Studio> {
        const response = await api.get<ApiResponse<Studio>>(`/studios/${studioId}`);
        return response.data.data as Studio;
    }

    async createStudio(request: CreateStudioRequest): Promise<Studio> {
        const response = await api.post<ApiResponse<Studio>>("/studios", request);
        return response.data.data as Studio;
    }

    async updateStudio(studioId: string, request: UpdateStudioRequest): Promise<Studio> {
        const response = await api.put<ApiResponse<Studio>>(`/studios/${studioId}`, request);
        return response.data.data as Studio;
    }

    async updateStudioImage(studioId: string, file: File): Promise<Studio> {
        const formData = new FormData();
        formData.append("file", file);
        const response = await api.post<ApiResponse<Studio>>(`/studios/${studioId}/image`, formData);
        return response.data.data as Studio;
    }

    async uploadGalleryImage(studioId: string, file: File): Promise<StudioMedia> {
        const formData = new FormData();
        formData.append("file", file);
        const response = await api.post<ApiResponse<StudioMedia>>(`/studios/${studioId}/media/images`, formData);
        return response.data.data as StudioMedia;
    }

    async uploadGalleryVideo(studioId: string, file: File): Promise<StudioMedia> {
        const session = await api.post<ApiResponse<{ mediaId: string; uploadUrl: string }>>(
            `/studios/${studioId}/media/video/upload`,
            null,
            { params: { contentType: file.type, contentLength: file.size } },
        );
        const upload = session.data.data as { mediaId: string; uploadUrl: string };
        const uploadResponse = await fetch(upload.uploadUrl, { method: "PUT", headers: { "Content-Type": file.type }, body: file });
        if (!uploadResponse.ok) throw new Error("Video upload failed");
        const response = await api.post<ApiResponse<StudioMedia>>(`/studios/${studioId}/media/video/${upload.mediaId}/complete`);
        return response.data.data as StudioMedia;
    }

    async deleteStudioMedia(studioId: string, mediaId: string): Promise<void> {
        await api.delete(`/studios/${studioId}/media/${mediaId}`);
    }
}

export const StudioService = new StudioServiceClient();
