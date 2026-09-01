"use client";

import { useRef, useState } from "react";

import { AuthService } from "../services/auth.service";
import { OtpSentResponse } from "../types/auth";

function getErrorMessage(error: unknown) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    return response?.data?.message || "We could not start your login.";
}

export function useLogin() {
    const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [error, setError] = useState("");
    const [delivery, setDelivery] = useState<OtpSentResponse | null>(null);
    const submittingRef = useRef(false);

    async function login(identifier: string) {
        if (submittingRef.current) return null;
        submittingRef.current = true;
        setState("loading");
        setError("");
        try {
            const result = await AuthService.login({ identifier: identifier.trim() });
            setDelivery(result);
            setState("success");
            return result;
        } catch (requestError) {
            setError(getErrorMessage(requestError));
            setState("error");
            return null;
        } finally {
            submittingRef.current = false;
        }
    }

    return { state, error, delivery, login };
}
