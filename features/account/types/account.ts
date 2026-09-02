import type { AuthResponse, AuthSession, OtpSentResponse, VerifyOtpRequest } from "@/features/auth";

export type AccountProfile = {
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

export type UpdateProfileRequest = {
    bio?: string;
    location?: string;
    genre?: string;
    experience?: string;
    instagram?: string;
    youtube?: string;
    link?: string;
};

export type UpdateUsernameRequest = { username: string };
export type EmailChangeRequest = { newEmail: string };
export type PhoneChangeRequest = { newPhone: string };
export type ChangePasswordRequest = {
    currentPassword?: string;
    newPassword: string;
};
export type UpdateRoleRequest = { role: AuthResponse["role"] };

export type { AuthResponse, AuthSession, OtpSentResponse, VerifyOtpRequest };
