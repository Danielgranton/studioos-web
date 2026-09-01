"use client";

import { useRef, useState } from "react";

import { AuthService } from "../services/auth.service";
import { OtpSentResponse, RegisterRequest } from "../types/auth";

type RegistrationState = "idle" | "loading" | "success" | "error";

function getErrorMessage(error: unknown) {
    const response = (error as { response?: { data?: { message?: string } } })
        .response;
    return response?.data?.message || "We could not start your registration.";
}

export function useRegistration() {
    const [state, setState] = useState<RegistrationState>("idle");
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [otpDelivery, setOtpDelivery] = useState<OtpSentResponse | null>(null);
    const submittingRef = useRef(false);

    async function register(request: RegisterRequest) {
        if (submittingRef.current) return null;

        submittingRef.current = true;
        setState("loading");
        setError("");
        setFieldErrors({});

        try {
            const result = await AuthService.register(request);
            setOtpDelivery(result);
            setState("success");
            return result;
        } catch (requestError) {
            const response = (requestError as {
                response?: { data?: { message?: string; errors?: Record<string, string> } };
            }).response;
            setError(response?.data?.message || getErrorMessage(requestError));
            setFieldErrors(response?.data?.errors || {});
            setState("error");
            return null;
        } finally {
            submittingRef.current = false;
        }
    }

    return { state, error, fieldErrors, otpDelivery, register };
}
