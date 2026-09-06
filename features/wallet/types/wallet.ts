export type WalletStudio = {
    studioId: string;
    studioName: string;
    availableBalance: number;
    pendingBalance: number;
    reservedBalance: number;
    withdrawnBalance: number;
};

export type WalletTransaction = {
    id: string;
    studioId: string;
    type: string;
    status: string;
    amount: number;
    description?: string;
    mpesaReceiptNumber?: string;
    createdAt?: string;
};

export type WalletWithdrawal = {
    id: string;
    studioId: string;
    amount: number;
    status: string;
    mpesaPhoneNumber?: string;
    mpesaReceiptNumber?: string;
    rejectionReason?: string;
    createdAt?: string;
};

export type Wallet = {
    availableBalance: number;
    pendingBalance: number;
    reservedBalance: number;
    withdrawnBalance: number;
    studios: WalletStudio[];
    transactions: WalletTransaction[];
    withdrawals: WalletWithdrawal[];
};

export type ApiResponse<T> = { success: boolean; message?: string; data?: T };
