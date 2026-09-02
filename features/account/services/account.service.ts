import { api } from "@/lib/api";
import type { ApiResponse, AuthResponse, VerifyOtpRequest } from "@/features/auth";

import type {
    AccountProfile,
    EmailChangeRequest,
    OtpSentResponse,
    PhoneChangeRequest,
    UpdateProfileRequest,
    UpdateUsernameRequest,
    ChangePasswordRequest,
    UpdateRoleRequest,
} from "../types/account";

class AccountServiceClient {
    async getMyProfile(): Promise<AccountProfile> {
        const response = await api.get<ApiResponse<AccountProfile>>("/users/profile");
        return response.data.data as AccountProfile;
    }

    async updateProfile(request: UpdateProfileRequest): Promise<AccountProfile> {
        const response = await api.put<ApiResponse<AccountProfile>>("/users/profile", request);
        return response.data.data as AccountProfile;
    }

    async updateProfileImage(file: File): Promise<AccountProfile> {
        const formData = new FormData();
        formData.append("file", file);
        const response = await api.post<ApiResponse<AccountProfile>>("/users/profile/image", formData);
        return response.data.data as AccountProfile;
    }

    async updateUsername(request: UpdateUsernameRequest): Promise<AccountProfile> {
        const response = await api.put<ApiResponse<AccountProfile>>("/users/username", request);
        return response.data.data as AccountProfile;
    }

    async requestEmailChange(request: EmailChangeRequest): Promise<OtpSentResponse> {
        const response = await api.post<ApiResponse<OtpSentResponse>>("/auth/email-change/request", request);
        return response.data.data as OtpSentResponse;
    }

    async verifyEmailChange(request: VerifyOtpRequest): Promise<AuthResponse> {
        const response = await api.post<ApiResponse<AuthResponse>>("/auth/email-change/verify", request);
        return response.data.data as AuthResponse;
    }

    async requestPhoneChange(request: PhoneChangeRequest): Promise<OtpSentResponse> {
        const response = await api.post<ApiResponse<OtpSentResponse>>("/auth/phone-change/request", request);
        return response.data.data as OtpSentResponse;
    }

    async verifyPhoneChange(request: VerifyOtpRequest): Promise<AuthResponse> {
        const response = await api.post<ApiResponse<AuthResponse>>("/auth/phone-change/verify", request);
        return response.data.data as AuthResponse;
    }

    async changePassword(request: ChangePasswordRequest): Promise<AuthResponse> {
        const response = await api.post<ApiResponse<AuthResponse>>("/auth/password/change", request);
        return response.data.data as AuthResponse;
    }

    async updateRole(request: UpdateRoleRequest): Promise<AuthResponse> {
        const response = await api.put<ApiResponse<AuthResponse>>("/users/role", request);
        return response.data.data as AuthResponse;
    }

    async deleteAccount(confirmation: string, currentPassword?: string): Promise<void> {
        await api.delete("/users/me", { data: { confirmation, currentPassword } });
    }

    async exportData(): Promise<Blob> {
        const response = await api.get<Blob>("/users/export", { responseType: "blob" });
        return response.data;
    }
}

export const AccountService = new AccountServiceClient();
