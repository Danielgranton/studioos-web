import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
});

let refreshPromise: Promise<unknown> | null = null;

function clearLocalSession() {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem("studioos.auth.session");
    window.dispatchEvent(new Event("studioos:session-change"));
}

api.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        try {
            const rawSession = window.localStorage.getItem("studioos.auth.session");
            const session = rawSession ? JSON.parse(rawSession) as { accessToken?: string } : null;
            if (session?.accessToken) {
                config.headers.Authorization = `Bearer ${session.accessToken}`;
            }
        } catch {
            // Ignore malformed local session data; the request can still proceed.
        }
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const request = error.config as (typeof error.config & { _retry?: boolean }) | undefined;
        const status = error.response?.status;
        const url = request?.url || "";
        const isAuthRequest = url.includes("/auth/login")
            || url.includes("/auth/register")
            || url.includes("/auth/refresh")
            || url.includes("/auth/verification/");

        if (status !== 401 || !request || request._retry || isAuthRequest) {
            return Promise.reject(error);
        }

        request._retry = true;
        refreshPromise ??= api.post("/auth/refresh")
            .finally(() => {
                refreshPromise = null;
            });

        try {
            await refreshPromise;
            return api(request);
        } catch (refreshError) {
            clearLocalSession();
            return Promise.reject(refreshError);
        }
    },
);

export { api };
