export interface ILoginPayload {
  email: string
  password: string
}

export interface IRegisterPayload {
  name: string
  email: string
  password: string
  gender: "MALE" | "FEMALE" | "OTHER"
  role?: "RIDER" | "SENDER"
}

export interface IVerifyEmailPayload {
  email: string
  otp: string
}

export interface ILoginResponse {
  accessToken: string
  refreshToken: string
  needPasswordChange: boolean
}

export interface IVerifyEmailResponse {
  accessToken: string
  refreshToken: string
}

export interface IRefreshTokenResponse {
  accessToken: string
}

export interface IApiResponse<T = unknown> {
  success: boolean
  statusCode: number
  message: string
  data?: T
}

export interface IJwtPayload {
  userId: string
  name: string
  email: string
  role: string
  iat: number
  exp: number
}
