"use client";

import { useState } from "react";

import { AuthService } from "../services/auth.service";
import { saveSession } from "../services/session.service";
import { AuthResponse } from "../types/auth";

type RequestState = "idle" | "loading" | "success" | "error";

function getErrorMessage(error: unknown, fallback: string) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    return response?.data?.message || fallback;
}

export function usePasswordReset() {
    const [requestState, setRequestState] = useState<RequestState>("idle");
    const [resetState, setResetState] = useState<RequestState>("idle");
    const [error, setError] = useState("");
    const [session, setSession] = useState<AuthResponse | null>(null);

    async function requestReset(identifier: string) {
        setRequestState("loading");
        setError("");
        try {
            await AuthService.forgotPassword({ identifier: identifier.trim() });
            setRequestState("success");
            return true;
        } catch (requestError) {
            setError(getErrorMessage(requestError, "We could not send reset instructions."));
            setRequestState("error");
            return false;
        }
    }

    async function resetPassword(token: string, newPassword: string) {
        setResetState("loading");
        setError("");
        try {
            const result = await AuthService.resetPassword({ token: token.trim(), newPassword });
            saveSession(result);
            setSession(result);
            setResetState("success");
            return result;
        } catch (requestError) {
            setError(getErrorMessage(requestError, "That reset token is invalid or expired."));
            setResetState("error");
            return null;
        }
    }

    return { requestState, resetState, error, session, requestReset, resetPassword };
}
