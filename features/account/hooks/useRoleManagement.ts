"use client";

import { useState } from "react";

import { saveSession } from "@/features/auth";
import { AccountService } from "../services/account.service";
import type { AuthResponse } from "@/features/auth";

export function useRoleManagement() {
    const [loading, setLoading] = useState(false);

    async function updateRole(role: AuthResponse["role"]) {
        setLoading(true);
        try {
            const session = await AccountService.updateRole({ role });
            saveSession(session);
        } finally {
            setLoading(false);
        }
    }

    return { loading, updateRole };
}
