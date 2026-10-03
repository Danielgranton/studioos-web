"use client";

import { useEffect, useState } from "react";

import { getStoredSession } from "../services/session.service";
import { clearSession } from "../services/session.service";
import { AuthService } from "../services/auth.service";
import type { AuthResponse, UserProfile } from "../types/auth";

const PROFILE_CACHE_TTL = 30_000;
const PROFILE_FAILURE_COOLDOWN = 5_000;
let profileRequest: Promise<UserProfile> | null = null;
let profileRequestKey: string | null = null;
let cachedProfile: { key: string; value: UserProfile; expiresAt: number } | null = null;
let profileFailure: { key: string; error: unknown; expiresAt: number } | null = null;

function profileKey(session: AuthResponse) {
    return session.accessToken || "cookie-session";
}

function getProfileOnce(session: AuthResponse): Promise<UserProfile> {
    const key = profileKey(session);
    const now = Date.now();
    if (cachedProfile?.key === key && cachedProfile.expiresAt > now) return Promise.resolve(cachedProfile.value);
    if (profileFailure?.key === key && profileFailure.expiresAt > now) return Promise.reject(profileFailure.error);
    if (profileRequest && profileRequestKey === key) return profileRequest;

    profileRequestKey = key;
    profileRequest = AuthService.getMyProfile()
        .then((profile) => {
            cachedProfile = { key, value: profile, expiresAt: Date.now() + PROFILE_CACHE_TTL };
            profileFailure = null;
            return profile;
        })
        .catch((error) => {
            profileFailure = { key, error, expiresAt: Date.now() + PROFILE_FAILURE_COOLDOWN };
            throw error;
        })
        .finally(() => {
            const request = profileRequest;
            window.setTimeout(() => {
                if (profileRequest === request) {
                    profileRequest = null;
                    profileRequestKey = null;
                }
            }, PROFILE_FAILURE_COOLDOWN);
        });

    return profileRequest;
}

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
                const profile = await getProfileOnce(storedSession);
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
        const validationTimer = window.setInterval(() => {
            if (document.visibilityState === "visible") void validateSession();
        }, revalidationInterval);
        window.addEventListener("storage", sync);
        window.addEventListener("studioos:session-change", sync);
        window.addEventListener("focus", revalidate);
        document.addEventListener("visibilitychange", revalidate);

        return () => {
            active = false;
            window.clearInterval(validationTimer);
            window.removeEventListener("storage", sync);
            window.removeEventListener("studioos:session-change", sync);
            window.removeEventListener("focus", revalidate);
            document.removeEventListener("visibilitychange", revalidate);
        };
    }, []);

    return { session, isAuthenticated: session !== null, isLoading };
}
