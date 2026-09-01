import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
});

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

export { api };
