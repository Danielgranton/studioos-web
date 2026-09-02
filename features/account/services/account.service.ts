import { api } from "@/lib/api";
import type { ApiResponse, AuthResponse, VerifyOtpRequest } from "@/features/auth";

import type {
    AccountProfile,
    EmailChangeRequest,
    OtpSentResponse,
    PhoneChangeRequest,
    UpdateProfileRequest,
    UpdateUsernameRequest,
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
}

export const AccountService = new AccountServiceClient();
