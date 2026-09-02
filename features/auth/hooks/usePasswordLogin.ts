"use client";

import { useRef, useState } from "react";

import { AuthService } from "../services/auth.service";
import { saveSession } from "../services/session.service";
import { AuthResponse } from "../types/auth";

function getErrorMessage(error: unknown) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    return response?.data?.message || "We could not sign you in.";
}

export function usePasswordLogin() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [user, setUser] = useState<AuthResponse | null>(null);
    const submittingRef = useRef(false);

    async function login(identifier: string, password: string) {
        if (submittingRef.current) return null;
        submittingRef.current = true;
        setLoading(true);
        setError("");
        try {
            const result = await AuthService.passwordLogin({ identifier: identifier.trim(), password });
            saveSession(result);
            setUser(result);
            return result;
        } catch (requestError) {
            setError(getErrorMessage(requestError));
            return null;
        } finally {
            submittingRef.current = false;
            setLoading(false);
        }
    }

    return { loading, error, user, login };
}
