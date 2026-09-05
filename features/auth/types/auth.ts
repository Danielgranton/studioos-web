export type RegisterRequest = {
    name: string;
    username?: string;
    email: string;
    phone: string;
    password?: string;
};

export type VerifyOtpRequest = {
    identifier: string;
    code: string;
};

export type LoginRequest = {
    identifier: string;
    password?: string;
};

export type ForgotPasswordRequest = {
    identifier: string;
};

export type ResetPasswordRequest = {
    token: string;
    newPassword: string;
};

export type OtpSentResponse = {
    message: string;
    maskedEmail?: string;
    maskedPhone?: string;
    otpSent?: boolean;
};

export type AuthResponse = {
    accessToken?: string;
    refreshToken?: string;
    userId: number;
    name: string;
    email: string;
    phone?: string;
    role: "USER" | "ARTIST" | "PRODUCER" | "ADMIN" | "SUPER_ADMIN";
};

export type UserProfile = {
    id: number;
    name: string;
    username?: string;
    email: string;
    phone?: string;
    role: AuthResponse["role"];
    profileImage?: string;
    profileImageLarge?: string;
    profileImageMedium?: string;
    profileImageThumbnail?: string;
    bio?: string;
    location?: string;
    genre?: string;
    experience?: string;
    instagram?: string;
    youtube?: string;
    link?: string;
};

export type AuthSession = {
    sessionId: string;
    userId: number;
    deviceId?: string;
    deviceName?: string;
    userAgent?: string;
    ipAddress?: string;
    deviceType?: "MOBILE" | "DESKTOP" | "UNKNOWN";
    browser?: string;
    operatingSystem?: string;
    createdAt: string;
    lastActiveAt?: string;
    expiresAt: string;
    revokedAt?: string;
    active: boolean;
    currentSession?: boolean;
};

export type ApiResponse<T> = {
    success: boolean;
    message?: string;
    data?: T;
    errors?: Record<string, string>;
};
