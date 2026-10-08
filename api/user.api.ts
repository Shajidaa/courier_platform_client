import { apiClient } from "@/lib/api-client"
import type { IApiResponse } from "@/types/auth.types"
import type {
    IChangePasswordPayload,
    IForgotPasswordPayload,
    IResetPasswordPayload,
    IUpdateProfilePayload,
    IUser,
} from "@/types/user.types"
import { tokenStorage } from "@/lib/token"

function authHeaders(): Record<string, string> {
    const token = tokenStorage.get()
    return token ? { Authorization: `Bearer ${token}` } : {}
}

export const userApi = {
    /** GET /user/me — requires auth */
    getProfile: () =>
        apiClient<IApiResponse<IUser>>("/user/me", {
            headers: authHeaders(),
        }),

    /** PATCH /user/me — requires auth */
    updateProfile: (payload: IUpdateProfilePayload) =>
        apiClient<IApiResponse<IUser>>("/user/me", {
            method: "PATCH",
            body: payload,
            headers: authHeaders(),
        }),

    /** POST /user/change-password — requires auth */
    changePassword: (payload: IChangePasswordPayload) =>
        apiClient<IApiResponse<null>>("/user/change-password", {
            method: "POST",
            body: payload,
            headers: authHeaders(),
        }),

    /** POST /user/forgot-password — public */
    forgotPassword: (payload: IForgotPasswordPayload) =>
        apiClient<IApiResponse<null>>("/user/forgot-password", {
            method: "POST",
            body: payload,
        }),

    /** POST /user/reset-password — public */
    resetPassword: (payload: IResetPasswordPayload) =>
        apiClient<IApiResponse<null>>("/user/reset-password", {
            method: "POST",
            body: payload,
        }),
}
