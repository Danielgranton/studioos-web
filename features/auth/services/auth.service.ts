import { api } from "@/lib/api";

import {
    ApiResponse,
    AuthResponse,
    ForgotPasswordRequest,
    LoginRequest,
    OtpSentResponse,
    RegisterRequest,
    ResetPasswordRequest,
    VerifyOtpRequest,
    UserProfile,
    AuthSession,
} from "../types/auth";

class AuthServiceClient {
    async login(request: LoginRequest): Promise<OtpSentResponse> {
        const response = await api.post<ApiResponse<OtpSentResponse>>("/auth/login", request);
        return response.data.data as OtpSentResponse;
    }

    async passwordLogin(request: LoginRequest): Promise<AuthResponse> {
        const response = await api.post<ApiResponse<AuthResponse>>("/auth/password/login", request);
        return response.data.data as AuthResponse;
    }

    async register(request: RegisterRequest): Promise<OtpSentResponse> {
        const response = await api.post<ApiResponse<OtpSentResponse>>(
            "/auth/register",
            request,
        );

        return response.data.data as OtpSentResponse;
    }

    async verifyRegistration(request: VerifyOtpRequest): Promise<AuthResponse> {
        const response = await api.post<ApiResponse<AuthResponse>>(
            "/auth/verification/register",
            request,
        );

        return response.data.data as AuthResponse;
    }

    async resendOtp(identifier: string): Promise<OtpSentResponse> {
        const response = await api.post<ApiResponse<OtpSentResponse>>(
            "/auth/otp/resend",
            { identifier },
        );

        return response.data.data as OtpSentResponse;
    }

    async verifyLogin(request: VerifyOtpRequest): Promise<AuthResponse> {
        const response = await api.post<ApiResponse<AuthResponse>>(
            "/auth/verification/login",
            request,
        );
        return response.data.data as AuthResponse;
    }

    async getMyProfile(): Promise<UserProfile> {
        const response = await api.get<ApiResponse<UserProfile>>("/users/profile");
        return response.data.data as UserProfile;
    }

    async logout(allDevices = false): Promise<void> {
        await api.post("/auth/logout", { allDevices });
    }

    async getSessions(): Promise<AuthSession[]> {
        const response = await api.get<ApiResponse<AuthSession[]>>("/auth/sessions");
        return response.data.data || [];
    }

    async revokeSession(sessionId: string): Promise<void> {
        await api.delete(`/auth/sessions/${encodeURIComponent(sessionId)}`);
    }

    async forgotPassword(request: ForgotPasswordRequest): Promise<OtpSentResponse> {
        const response = await api.post<ApiResponse<OtpSentResponse>>("/auth/password/forgot", request);
        return response.data.data as OtpSentResponse;
    }

    async resetPassword(request: ResetPasswordRequest): Promise<AuthResponse> {
        const response = await api.post<ApiResponse<AuthResponse>>("/auth/password/reset", request);
        return response.data.data as AuthResponse;
    }

    async requestEmailVerification(): Promise<OtpSentResponse> {
        const response = await api.post<ApiResponse<OtpSentResponse>>("/auth/email-verification/request");
        return response.data.data as OtpSentResponse;
    }

    async verifyEmail(request: VerifyOtpRequest): Promise<void> {
        await api.post<ApiResponse<void>>("/auth/email-verification/verify", request);
    }

    async requestPhoneVerification(): Promise<OtpSentResponse> {
        const response = await api.post<ApiResponse<OtpSentResponse>>("/auth/phone-verification/request");
        return response.data.data as OtpSentResponse;
    }

    async verifyPhone(request: VerifyOtpRequest): Promise<void> {
        await api.post<ApiResponse<void>>("/auth/phone-verification/verify", request);
    }
}

export const AuthService = new AuthServiceClient();
