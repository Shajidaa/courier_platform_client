import { apiClient } from "@/lib/api-client";
import type {
    IApiResponse,
    ILoginPayload,
    ILoginResponse,
    IRefreshTokenResponse,
    IRegisterPayload,
    IVerifyEmailPayload,
    IVerifyEmailResponse,
} from "@/types/auth.types";

export const authApi = {
    login: (payload: ILoginPayload) =>
        apiClient<IApiResponse<ILoginResponse>>("/auth/login", {
            method: "POST",
            body: payload,
        }),

    register: (payload: IRegisterPayload) =>
        apiClient<IApiResponse<null>>("/user/register", {
            method: "POST",
            body: payload,
        }),

    verifyEmail: (payload: IVerifyEmailPayload) =>
        apiClient<IApiResponse<IVerifyEmailResponse>>("/user/verify-email", {
            method: "POST",
            body: payload,
        }),

    refreshToken: () =>
        apiClient<IApiResponse<IRefreshTokenResponse>>("/auth/refresh-token", {
            method: "POST",
        }),

    logout: () =>
        apiClient<IApiResponse>("/auth/logout", {
            method: "POST",
        }),
};
