"use client";

import { useState } from "react";

import { AuthService } from "../services/auth.service";
import { saveSession } from "../services/session.service";
import { AuthResponse } from "../types/auth";

function getErrorMessage(error: unknown) {
    const response = (error as { response?: { data?: { message?: string } } })
        .response;
    return response?.data?.message || "That code could not be verified.";
}

export function useVerifyRegistration() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [user, setUser] = useState<AuthResponse | null>(null);

    async function verify(identifier: string, code: string) {
        setLoading(true);
        setError("");

        try {
            const result = await AuthService.verifyRegistration({ identifier, code });
            saveSession(result);
            setUser(result);
            return result;
        } catch (requestError) {
            setError(getErrorMessage(requestError));
            return null;
        } finally {
            setLoading(false);
        }
    }

    return { loading, error, user, verify };
}
