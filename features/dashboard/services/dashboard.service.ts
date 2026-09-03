import { api } from "@/lib/api";
import type { DashboardOverview, DashboardOverviewResponse } from "../types/overview";

class DashboardServiceClient {
    async getOverview(): Promise<DashboardOverview> {
        const response = await api.get<DashboardOverviewResponse>("/dashboard/overview");
        return response.data.data as DashboardOverview;
    }
}

export const DashboardService = new DashboardServiceClient();
