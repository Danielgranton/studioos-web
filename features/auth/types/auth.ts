export type RegisterRequest = {
    name: string;
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
};

export type OtpSentResponse = {
    message: string;
    maskedEmail?: string;
    maskedPhone?: string;
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
};

export type ApiResponse<T> = {
    success: boolean;
    message?: string;
    data?: T;
    errors?: Record<string, string>;
};
