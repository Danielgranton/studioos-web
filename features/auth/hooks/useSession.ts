"use client";

import { useEffect, useState } from "react";

import { getStoredSession } from "../services/session.service";
import { AuthResponse } from "../types/auth";

export function useSession() {
    const [session, setSession] = useState<AuthResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const sync = () => setSession(getStoredSession());
        sync();
        setIsLoading(false);
        window.addEventListener("storage", sync);
        window.addEventListener("studioos:session-change", sync);

        return () => {
            window.removeEventListener("storage", sync);
            window.removeEventListener("studioos:session-change", sync);
        };
    }, []);

    return { session, isAuthenticated: session !== null, isLoading };
}
