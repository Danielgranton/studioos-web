"use client";

import { useCallback, useEffect, useState } from "react";

import { AccountService } from "../services/account.service";
import type { AccountProfile } from "../types/account";

export function useAccountProfile() {
    const [profile, setProfile] = useState<AccountProfile | null>(null);
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(async () => {
        setLoading(true);
        try {
            setProfile(await AccountService.getMyProfile());
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void refresh();
    }, [refresh]);

    return { profile, setProfile, loading, refresh };
}
