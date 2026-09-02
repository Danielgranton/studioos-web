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

        async function validateSession() {
            const storedSession = getStoredSession();
            if (!storedSession) {
                if (active) setIsLoading(false);
                return;
            }

            if (active) setSession(storedSession);
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
                if (status === 401) clearSession();
            } finally {
                if (active) setIsLoading(false);
            }
        }

        void validateSession();

        const sync = () => {
            const nextSession = getStoredSession();
            setSession(nextSession);
            if (!nextSession) setIsLoading(false);
        };
        window.addEventListener("storage", sync);
        window.addEventListener("studioos:session-change", sync);

        return () => {
            active = false;
            window.removeEventListener("storage", sync);
            window.removeEventListener("studioos:session-change", sync);
        };
    }, []);

    return { session, isAuthenticated: session !== null, isLoading };
}
