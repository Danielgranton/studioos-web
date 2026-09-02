"use client";

import { useState } from "react";

import { AccountService } from "../services/account.service";

export function useDeleteAccount() {
    const [loading, setLoading] = useState(false);

    async function deleteAccount(confirmation: string, currentPassword?: string) {
        setLoading(true);
        try {
            await AccountService.deleteAccount(confirmation, currentPassword);
        } finally {
            setLoading(false);
        }
    }

    return { loading, deleteAccount };
}
