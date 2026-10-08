"use client"

import { useCallback, useEffect, useState } from "react"
import { userApi } from "@/api/user.api"
import type { IUser, IUpdateProfilePayload, IChangePasswordPayload } from "@/types/user.types"

interface ProfileState {
    profile: IUser | null
    isLoading: boolean
    error: string | null
}

export function useProfile() {
    const [state, setState] = useState<ProfileState>({
        profile: null,
        isLoading: true,
        error: null,
    })

    const fetchProfile = useCallback(async () => {
        setState((s) => ({ ...s, isLoading: true, error: null }))
        try {
            const res = await userApi.getProfile()
            setState({ profile: res.data ?? null, isLoading: false, error: null })
        } catch (err) {
            setState({
                profile: null,
                isLoading: false,
                error: err instanceof Error ? err.message : "Failed to load profile",
            })
        }
    }, [])

    useEffect(() => {
        fetchProfile()
    }, [fetchProfile])

    const updateProfile = useCallback(
        async (payload: IUpdateProfilePayload): Promise<void> => {
            const res = await userApi.updateProfile(payload)
            setState((s) => ({ ...s, profile: res.data ?? s.profile }))
        },
        [],
    )

    const changePassword = useCallback(async (payload: IChangePasswordPayload): Promise<void> => {
        await userApi.changePassword(payload)
    }, [])

    return { ...state, updateProfile, changePassword, refetch: fetchProfile }
}
