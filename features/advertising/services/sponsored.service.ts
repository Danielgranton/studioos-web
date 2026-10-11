import { api } from "@/lib/api";

export type SponsoredAd = {
    advertisementId: string;
    type: "IMAGE" | "VIDEO" | "AUDIO";
    headline: string;
    ctaText?: string | null;
    ctaUrl?: string | null;
    mediaUrl?: string | null;
    thumbnailUrl?: string | null;
    impressionToken: string;
};

export const SponsoredService = {
    async getFeaturedAd(): Promise<SponsoredAd | null> {
        const response = await api.get<SponsoredAd | null>("/ads/serve", {
            params: { placement: "EXPLORE_PAGE" },
        });
        return response.data;
    },
    async recordClick(advertisementId: string): Promise<string> {
        const response = await api.post<string>(`/ads/${encodeURIComponent(advertisementId)}/click`);
        return response.data;
    },
    async confirmImpression(token: string): Promise<boolean> {
        const response = await api.post<{ recorded: boolean }>(
            `/ads/impressions/${encodeURIComponent(token)}/confirm`,
        );
        return response.data.recorded;
    },
};
