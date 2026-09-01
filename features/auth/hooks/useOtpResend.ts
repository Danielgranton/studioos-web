"use client";

import { useState } from "react";

import { AuthService } from "../services/auth.service";

const MAX_RESENDS = 3;

export function useOtpResend() {
    const [resendCount, setResendCount] = useState(0);
    const [resending, setResending] = useState(false);

    async function resend(identifier: string) {
        if (resending || resendCount >= MAX_RESENDS) return false;
        setResending(true);
        try {
            await AuthService.resendOtp(identifier);
            setResendCount((count) => count + 1);
            return true;
        } finally {
            setResending(false);
        }
    }

    return {
        resend,
        resendCount,
        resending,
        remaining: MAX_RESENDS - resendCount,
        canResend: resendCount < MAX_RESENDS,
    };
}
