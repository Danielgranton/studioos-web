export { DashboardAuthGuard, useDashboardSession } from "./components/dashboardAuthGuard";
export { DashboardShell } from "./components/dashboardShell";
export { DashboardSidebar } from "./components/dashboardSidebar";
export { DashboardWelcome } from "./components/dashboardWelcome";
export { DashboardMetricCards } from "./components/dashboardMetrics";
export { DashboardActivityPanels } from "./components/dashboardActivityPanels";
export { RoleWorkspacePanel } from "./components/roleWorkspacePanel";
export { DashboardDiscovery } from "./components/dashboardDiscovery";
export { DashboardErrorState, DashboardLoadingState } from "./components/dashboardStates";
export { useDashboardOverview } from "./hooks/useDashboardOverview";
export { DashboardService } from "./services/dashboard.service";
export { filterDashboardItems, getDashboardNavigation, isDashboardRole } from "./config/navigation";
export type {
    DashboardIcon,
    DashboardNavigationGroup,
    DashboardNavigationItem,
} from "./config/navigation";
export type { DashboardNavGroup, DashboardNavItem, DashboardRole } from "./types/dashboard";
export type {
    DashboardActivity,
    DashboardBooking,
    DashboardMetrics,
    DashboardOverview,
    DashboardOverviewResponse,
    DashboardRecommendation,
    DashboardUserSummary,
    ProfileCompletion,
    RoleWorkspace,
} from "./types/overview";
