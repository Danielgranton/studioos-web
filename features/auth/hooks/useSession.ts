"use client";

import { useEffect, useState } from "react";

import { getStoredSession } from "../services/session.service";
import { clearSession } from "../services/session.service";
import { AuthService } from "../services/auth.service";
import { AuthResponse } from "../types/auth";

export function useSession() {
    const [session, setSession] = useState<AuthResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let active = true;
        let validating = false;
        let lastValidatedAt = 0;
        const revalidationInterval = 30_000;

        async function validateSession(showLoading = false) {
            const now = Date.now();
            if (validating || (now - lastValidatedAt < revalidationInterval && !showLoading)) return;
            validating = true;
            lastValidatedAt = now;
            const storedSession = getStoredSession();
            if (!storedSession) {
                if (active) {
                    setSession(null);
                    setIsLoading(false);
                }
                validating = false;
                return;
            }

            if (active) {
                setSession(storedSession);
                if (showLoading) setIsLoading(true);
            }
            try {
                const profile = await AuthService.getMyProfile();
                if (active) {
                    setSession({
                        ...storedSession,
                        userId: profile.id,
                        name: profile.name,
                        email: profile.email,
                        phone: profile.phone,
                        role: profile.role,
                    });
                }
            } catch (error) {
                const status = (error as { response?: { status?: number } }).response?.status;
                if (status === 401) {
                    clearSession();
                    if (active) setSession(null);
                }
            } finally {
                validating = false;
                if (active) setIsLoading(false);
            }
        }

        void validateSession(true);

        const sync = () => {
            const nextSession = getStoredSession();
            setSession(nextSession);
            if (!nextSession) setIsLoading(false);
        };
        const revalidate = () => {
            if (document.visibilityState === "visible") void validateSession();
        };
        window.addEventListener("storage", sync);
        window.addEventListener("studioos:session-change", sync);
        window.addEventListener("focus", revalidate);
        document.addEventListener("visibilitychange", revalidate);

        return () => {
            active = false;
            window.removeEventListener("storage", sync);
            window.removeEventListener("studioos:session-change", sync);
            window.removeEventListener("focus", revalidate);
            document.removeEventListener("visibilitychange", revalidate);
        };
    }, []);

    return { session, isAuthenticated: session !== null, isLoading };
}
