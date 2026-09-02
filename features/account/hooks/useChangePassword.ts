"use client";

import { useState } from "react";

import { saveSession } from "@/features/auth";
import { AccountService } from "../services/account.service";

export function useChangePassword() {
    const [loading, setLoading] = useState(false);

    async function changePassword(currentPassword: string, newPassword: string) {
        setLoading(true);
        try {
            const session = await AccountService.changePassword({
                currentPassword: currentPassword || undefined,
                newPassword,
            });
            saveSession(session);
        } finally {
            setLoading(false);
        }
    }

    return { loading, changePassword };
}
