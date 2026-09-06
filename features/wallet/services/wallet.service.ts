import { api } from "@/lib/api";

import type { ApiResponse, Wallet, WalletWithdrawal } from "../types/wallet";

export const WalletService = {
    async getWallet() {
        const response = await api.get<ApiResponse<Wallet>>("/wallets/me");
        return response.data.data as Wallet;
    },
    async requestWithdrawal(studioId: string, amount: number, phoneNumber: string) {
        const response = await api.post<ApiResponse<WalletWithdrawal>>(`/wallets/studios/${studioId}/withdrawals`, { amount, phoneNumber });
        return response.data.data as WalletWithdrawal;
    },
};
