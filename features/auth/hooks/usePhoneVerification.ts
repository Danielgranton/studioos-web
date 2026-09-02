"use client";

import { useState } from "react";

import { AuthService } from "../services/auth.service";

function message(error: unknown) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    return response?.data?.message || "We could not verify your phone number.";
}

export function usePhoneVerification() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [sent, setSent] = useState(false);
    const [verified, setVerified] = useState(false);

    async function requestCode() {
        setLoading(true);
        setError("");
        try {
            await AuthService.requestPhoneVerification();
            setSent(true);
            return true;
        } catch (requestError) {
            setError(message(requestError));
            return false;
        } finally {
            setLoading(false);
        }
    }

    async function verify(identifier: string, code: string) {
        setLoading(true);
        setError("");
        try {
            await AuthService.verifyPhone({ identifier, code });
            setVerified(true);
            return true;
        } catch (requestError) {
            setError(message(requestError));
            return false;
        } finally {
            setLoading(false);
        }
    }

    return { loading, error, sent, verified, requestCode, verify };
}
