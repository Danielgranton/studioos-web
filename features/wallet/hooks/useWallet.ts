"use client";

import { useCallback, useEffect, useState } from "react";

import { WalletService } from "../services/wallet.service";
import type { Wallet } from "../types/wallet";

export function useWallet() {
    const [wallet, setWallet] = useState<Wallet | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<unknown>(null);

    const refresh = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            setWallet(await WalletService.getWallet());
        } catch (requestError) {
            setError(requestError);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { void refresh(); }, [refresh]);

    return { wallet, loading, error, refresh };
}
