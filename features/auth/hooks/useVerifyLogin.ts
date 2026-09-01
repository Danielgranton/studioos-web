"use client";

import { useState } from "react";

import { AuthService } from "../services/auth.service";
import { saveSession } from "../services/session.service";
import { AuthResponse } from "../types/auth";

export function useVerifyLogin() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [user, setUser] = useState<AuthResponse | null>(null);

    async function verify(identifier: string, code: string) {
        setLoading(true);
        setError("");
        try {
            const result = await AuthService.verifyLogin({ identifier, code });
            saveSession(result);
            setUser(result);
            return result;
        } catch (requestError) {
            const response = (requestError as { response?: { data?: { message?: string } } }).response;
            setError(response?.data?.message || "That code could not be verified.");
            return null;
        } finally {
            setLoading(false);
        }
    }

    return { loading, error, user, verify };
}
