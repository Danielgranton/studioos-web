import type { AuthResponse, ApiResponse } from "@/features/auth";

export type DashboardOverview = {
    user: DashboardUserSummary;
    profile: ProfileCompletion;
    metrics: DashboardMetrics;
    upcomingBookings: DashboardBooking[];
    recentActivity: DashboardActivity[];
    recommendations: DashboardRecommendation[];
    workspace: RoleWorkspace;
};

export type DashboardUserSummary = {
    id: number;
    name: string;
    username?: string;
    role: AuthResponse["role"];
    profileImage?: string;
};

export type ProfileCompletion = {
    percentage: number;
    missingItems: string[];
};

export type DashboardMetrics = {
    upcomingBookings: number;
    activeProjects: number;
    savedItems: number;
    profileViews?: number;
};

export type DashboardBooking = {
    id: number | string;
    title: string;
    counterpartyName: string;
    location?: string;
    startsAt: string;
    status: "PENDING" | "APPROVED" | "EXPIRED" | "RECORDING" | "MIXING" | "READY" | "DELIVERED" | "CANCELLED";
};

export type DashboardActivity = {
    id: number | string;
    type: "BOOKING" | "PROJECT" | "PURCHASE" | "PROFILE" | "SYSTEM";
    title: string;
    description?: string;
    occurredAt: string;
};

export type DashboardRecommendation = {
    id: number | string;
    type: "STUDIO" | "PRODUCER" | "BEAT" | "PROJECT";
    title: string;
    subtitle?: string;
    imageUrl?: string;
    href: string;
};

export type RoleWorkspace =
    | { role: "USER"; recommendationsCount: number }
    | { role: "ARTIST"; releaseCount: number; activeProjectCount: number }
    | { role: "PRODUCER"; pendingRequestCount: number; serviceCount: number };

export type DashboardOverviewResponse = ApiResponse<DashboardOverview>;
