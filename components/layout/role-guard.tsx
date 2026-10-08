"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { ROLE_HOME, type TRole } from "@/types/roles"

interface RoleGuardProps {
    children: React.ReactNode
    allowedRoles: TRole[]
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
    const { user, isAuthenticated, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (isLoading) return
        if (!isAuthenticated) {
            router.replace("/login")
            return
        }
        const role = user?.role as TRole
        if (!allowedRoles.includes(role)) {
            // Redirect to their own dashboard instead of a generic 403
            router.replace(ROLE_HOME[role] ?? "/login")
        }
    }, [isLoading, isAuthenticated, user, allowedRoles, router])

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (!isAuthenticated) return null

    const role = user?.role as TRole
    if (!allowedRoles.includes(role)) return null

    return <>{children}</>
}
