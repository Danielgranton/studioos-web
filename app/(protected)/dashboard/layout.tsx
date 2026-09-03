import { DashboardAuthGuard, DashboardShell } from "@/features/dashboard";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <DashboardAuthGuard>
            <DashboardShell>{children}</DashboardShell>
        </DashboardAuthGuard>
    );
}
