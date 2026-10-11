import { api } from "@/lib/api";

type ApiResponse<T> = { data?: T };

export type CampaignDraft = {
    title: string;
    description?: string;
    studioId?: string;
    placement: "HOME_BANNER" | "BEAT_PLAYER" | "SEARCH_RESULTS" | "STUDIO_PROFILE" | "EXPLORE_PAGE";
    startDate: string;
    endDate: string;
    totalBudget: number;
    dailyBudget?: number;
};

export type AdvertisementDraft = {
    type: "IMAGE" | "VIDEO" | "AUDIO";
    headline: string;
    description?: string;
    ctaText?: string;
    ctaUrl?: string;
    contentType: string;
};

export type CampaignReport = {
    campaignId: string;
    title: string;
    status: string;
    paymentStatus: string;
    totalBudget: number;
    spentBudget: number;
    remainingBudget: number;
    advertisementCount: number;
    impressions: number;
    clicks: number;
    clickThroughRate: number;
};

export const AdvertisingService = {
    async createCampaign(request: CampaignDraft) {
        const response = await api.post<ApiResponse<{ campaignId: string; status: string }>>("/ads/campaigns", request);
        return response.data.data!;
    },
    async createAdvertisement(campaignId: string, request: AdvertisementDraft) {
        const response = await api.post<ApiResponse<{ advertisementId: string; uploadUrl: string; uploadSessionId: string }>>(
            `/ads/campaigns/${encodeURIComponent(campaignId)}/advertisements`, request,
        );
        return response.data.data!;
    },
    async completeUpload(advertisementId: string) {
        const response = await api.post<ApiResponse<{ advertisementId: string; status: string }>>(
            `/ads/advertisements/${encodeURIComponent(advertisementId)}/upload-complete`,
        );
        return response.data.data!;
    },
    async payForCampaign(campaignId: string, phoneNumber: string) {
        const response = await api.post<ApiResponse<{ transactionId: string; status: string }>>(
            `/ads/campaigns/${encodeURIComponent(campaignId)}/pay`, { phoneNumber },
        );
        return response.data.data!;
    },
    async getReport(campaignId: string) {
        const response = await api.get<ApiResponse<CampaignReport>>(`/ads/campaigns/${encodeURIComponent(campaignId)}/report`);
        return response.data.data!;
    },
    uploadFile(uploadUrl: string, file: File, onProgress: (percent: number) => void) {
        return new Promise<void>((resolve, reject) => {
            const request = new XMLHttpRequest();
            request.open("PUT", uploadUrl);
            request.setRequestHeader("Content-Type", file.type || "application/octet-stream");
            request.upload.onprogress = (event) => {
                if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 100));
            };
            request.onload = () => request.status >= 200 && request.status < 300
                ? resolve()
                : reject(new Error(`File upload failed (${request.status})`));
            request.onerror = () => reject(new Error("Could not connect to file storage"));
            request.onabort = () => reject(new Error("File upload was cancelled"));
            request.send(file);
        });
    },
};
