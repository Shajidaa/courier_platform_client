export type TGender = "MALE" | "FEMALE" | "OTHER"
export type TPublicRole = "RIDER" | "SENDER"
export type TUserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED" | "BLOCKED" | "DELETED"

export interface IProfile {
    id: string
    userId: string
    bio?: string | null
    phoneNumber?: string | null
    nid?: string | null
    passport?: string | null
}

export interface IUser {
    id: string
    name: string
    email: string
    role: string
    gender: TGender
    status: TUserStatus
    emailVerified: boolean
    imageUrl: string
    needPasswordChange: boolean
    createdAt: string
    updatedAt: string
    profile?: IProfile | null
}

// ── Request payloads (match server validation exactly) ──────────────────────

export interface IForgotPasswordPayload {
    email: string
}

export interface IResetPasswordPayload {
    email: string
    otp: string
    newPassword: string
}

export interface IChangePasswordPayload {
    oldPassword: string
    newPassword: string
}

export interface IUpdateProfilePayload {
    name?: string
    gender?: TGender
    imageUrl?: string
    bio?: string
    phoneNumber?: string
    nid?: string
    passport?: string
}
