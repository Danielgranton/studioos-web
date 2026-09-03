"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect } from "react";

import { useSession } from "@/features/auth";
import type { AuthResponse } from "@/features/auth";
import { isDashboardRole } from "../config/navigation";

const DashboardSessionContext = createContext<AuthResponse | null>(null);

export function useDashboardSession() {
    return useContext(DashboardSessionContext);
}

export function DashboardAuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { session, isAuthenticated, isLoading } = useSession();

    const hasDashboardAccess = isAuthenticated && isDashboardRole(session?.role);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            const next = pathname || "/dashboard";
            router.replace(`/auth/signin?next=${encodeURIComponent(next)}`);
        } else if (!isLoading && isAuthenticated && !hasDashboardAccess) {
            router.replace("/");
        }
    }, [hasDashboardAccess, isAuthenticated, isLoading, pathname, router]);

    if (isLoading || !hasDashboardAccess) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center text-sm text-[#888]">
                Checking your session...
            </div>
        );
    }

    return (
        <DashboardSessionContext.Provider value={session}>
            {children}
        </DashboardSessionContext.Provider>
    );
}
