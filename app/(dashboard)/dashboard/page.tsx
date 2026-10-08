"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { ROLE_HOME, type TRole } from "@/types/roles"

export default function DashboardIndexPage() {
    const { user, isAuthenticated, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (isLoading) return
        if (!isAuthenticated) { router.replace("/login"); return }
        const home = ROLE_HOME[user!.role as TRole] ?? "/login"
        router.replace(home)
    }, [isLoading, isAuthenticated, user, router])

    return (
        <div className="flex min-h-[60vh] items-center justify-center">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
    )
}
