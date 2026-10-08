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

export interface IRider {
    id: string
    userId: string
    name: string
    email: string
    phone?: string
    address?: string
    status?: string
    imageUrl?: string
    hubId?: string | null
    hubName?: string | null
    hubCity?: string | null
    vehicleType?: string | null
    vehicleNumber?: string | null
    totalDeliveries?: number
    averageRating?: number | null
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
