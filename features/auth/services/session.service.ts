import { AuthResponse } from "../types/auth";

const SESSION_KEY = "studioos.auth.session";

export function getStoredSession(): AuthResponse | null {
    if (typeof window === "undefined") return null;

    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;

    try {
        return JSON.parse(raw) as AuthResponse;
    } catch {
        window.localStorage.removeItem(SESSION_KEY);
        return null;
    }
}

export function saveSession(session: AuthResponse) {
    const userSession = { ...session };
    delete userSession.accessToken;
    delete userSession.refreshToken;
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(userSession));
    window.dispatchEvent(new Event("studioos:session-change"));
}

export function clearSession() {
    window.localStorage.removeItem(SESSION_KEY);
    window.dispatchEvent(new Event("studioos:session-change"));
}
