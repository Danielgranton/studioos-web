import { api } from "@/lib/api";

import {
    ApiResponse,
    AuthResponse,
    LoginRequest,
    OtpSentResponse,
    RegisterRequest,
    VerifyOtpRequest,
    UserProfile,
} from "../types/auth";

class AuthServiceClient {
    async login(request: LoginRequest): Promise<OtpSentResponse> {
        const response = await api.post<ApiResponse<OtpSentResponse>>("/auth/login", request);
        return response.data.data as OtpSentResponse;
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
}

export const AuthService = new AuthServiceClient();
