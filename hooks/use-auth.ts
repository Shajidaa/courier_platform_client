"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { authApi } from "@/api/auth.api"
import { parseJwt, tokenStorage } from "@/lib/token"
import type {
  IJwtPayload,
  ILoginPayload,
  IRegisterPayload,
  IVerifyEmailPayload,
} from "@/types/auth.types"

interface AuthState {
  user: IJwtPayload | null
  isAuthenticated: boolean
  isLoading: boolean
}

export function useAuth() {
  const router = useRouter()
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  })

  useEffect(() => {
    const token = tokenStorage.get()
    if (token) {
      const user = parseJwt(token)
      setState({ user, isAuthenticated: !!user, isLoading: false })
    } else {
      setState((s) => ({ ...s, isLoading: false }))
    }
  }, [])

  const login = useCallback(
    async (payload: ILoginPayload) => {
      const res = await authApi.login(payload)
      const { accessToken } = res.data!
      tokenStorage.set(accessToken)
      const user = parseJwt(accessToken)
      setState({ user, isAuthenticated: true, isLoading: false })
      router.push("/dashboard")
    },
    [router]
  )

  const register = useCallback(
    async (payload: IRegisterPayload) => {
      await authApi.register(payload)
      router.push(`/verify-email?email=${encodeURIComponent(payload.email)}`)
    },
    [router]
  )

  const verifyEmail = useCallback(
    async (payload: IVerifyEmailPayload) => {
      const res = await authApi.verifyEmail(payload)
      const { accessToken } = res.data!
      tokenStorage.set(accessToken)
      const user = parseJwt(accessToken)
      setState({ user, isAuthenticated: true, isLoading: false })
      router.push("/dashboard")
    },
    [router]
  )

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } finally {
      tokenStorage.remove()
      setState({ user: null, isAuthenticated: false, isLoading: false })
      router.push("/login")
    }
  }, [router])

  return { ...state, login, register, verifyEmail, logout }
}
