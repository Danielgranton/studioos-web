"use client";

import { useState } from "react";

import { AuthService } from "../services/auth.service";

function getErrorMessage(error: unknown) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    return response?.data?.message || "We could not verify your email.";
}

export function useEmailVerification() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [sent, setSent] = useState(false);
    const [verified, setVerified] = useState(false);

    async function requestCode() {
        setLoading(true);
        setError("");
        try {
            await AuthService.requestEmailVerification();
            setSent(true);
            return true;
        } catch (requestError) {
            setError(getErrorMessage(requestError));
            return false;
        } finally {
            setLoading(false);
        }
    }

    async function verify(identifier: string, code: string) {
        setLoading(true);
        setError("");
        try {
            await AuthService.verifyEmail({ identifier, code });
            setVerified(true);
            return true;
        } catch (requestError) {
            setError(getErrorMessage(requestError));
            return false;
        } finally {
            setLoading(false);
        }
    }

    return { loading, error, sent, verified, requestCode, verify };
}
