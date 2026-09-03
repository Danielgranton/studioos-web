import type { AuthResponse } from "@/features/auth";

export type DashboardRole = Extract<AuthResponse["role"], "USER" | "ARTIST" | "PRODUCER">;

export type DashboardNavItem = {
    label: string;
    href: string;
    description: string;
    roles?: DashboardRole[];
    comingSoon?: boolean;
};

export type DashboardNavGroup = {
    label: string;
    items: DashboardNavItem[];
};
