"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    Package,
    Menu,
    X,
    LogOut,
    ChevronDown,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { NAV_ITEMS } from "@/config/nav.config"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { TRole } from "@/types/roles"

const ROLE_LABELS: Record<TRole, string> = {
    SENDER: "Sender",
    RIDER: "Rider",
    HUB_MANAGER: "Hub Manager",
    OPS_MANAGER: "Ops Manager",
    SUPPORT_AGENT: "Support Agent",
    ADMIN: "Admin",
    SUPER_ADMIN: "Super Admin",
}

const ROLE_COLORS: Record<TRole, string> = {
    SENDER: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    RIDER: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    HUB_MANAGER: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    OPS_MANAGER: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    SUPPORT_AGENT: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    ADMIN: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    SUPER_ADMIN: "bg-primary/10 text-primary",
}

function SidebarContent({ onNavClick }: { onNavClick?: () => void }) {
    const { user, logout } = useAuth()
    const pathname = usePathname()
    const role = (user?.role ?? "SENDER") as TRole
    const navItems = NAV_ITEMS[role] ?? []

    return (
        <div className="flex h-full flex-col">
            {/* Logo */}
            <div className="flex h-14 items-center gap-2.5 border-b border-border px-4">
                <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Package className="size-4" />
                </div>
                <span className="font-heading font-semibold text-foreground">CourierPro</span>
            </div>

            {/* User info */}
            <div className="border-b border-border px-4 py-3">
                <p className="truncate text-sm font-medium text-foreground">{user?.name}</p>
                <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
                <span
                    className={cn(
                        "mt-1.5 inline-block rounded-md px-2 py-0.5 text-xs font-medium",
                        ROLE_COLORS[role],
                    )}
                >
                    {ROLE_LABELS[role]}
                </span>
            </div>

            {/* Nav items */}
            <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-3">
                {navItems.map(({ label, href, icon: Icon }) => {
                    const active = pathname === href || (href !== "/dashboard/" + role.toLowerCase() && pathname.startsWith(href))
                    return (
                        <Link
                            key={href}
                            href={href}
                            onClick={onNavClick}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                active
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                            )}
                        >
                            <Icon className="size-4 shrink-0" />
                            {label}
                        </Link>
                    )
                })}
            </nav>

            {/* Sign out */}
            <div className="border-t border-border p-3">
                <button
                    onClick={logout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                    <LogOut className="size-4 shrink-0" />
                    Sign out
                </button>
            </div>
        </div>
    )
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
    const { user } = useAuth()
    const [mobileOpen, setMobileOpen] = useState(false)
    const role = (user?.role ?? "SENDER") as TRole

    return (
        <div className="flex min-h-screen bg-background">

            {/* ── Desktop Sidebar ── */}
            <aside className="hidden w-60 shrink-0 border-r border-border lg:flex lg:flex-col">
                <SidebarContent />
            </aside>

            {/* ── Mobile Sidebar overlay ── */}
            {mobileOpen && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => setMobileOpen(false)}
                    />
                    {/* Drawer */}
                    <aside className="absolute left-0 top-0 h-full w-60 bg-background shadow-xl">
                        <SidebarContent onNavClick={() => setMobileOpen(false)} />
                    </aside>
                </div>
            )}

            {/* ── Main ── */}
            <div className="flex flex-1 flex-col min-w-0">
                {/* Topbar */}
                <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur">
                    <button
                        className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
                        onClick={() => setMobileOpen(true)}
                        aria-label="Open menu"
                    >
                        <Menu className="size-5" />
                    </button>

                    {/* Mobile logo */}
                    <div className="flex items-center gap-2 lg:hidden">
                        <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                            <Package className="size-3.5" />
                        </div>
                        <span className="font-heading text-sm font-semibold">CourierPro</span>
                    </div>

                    <div className="flex items-center gap-2 lg:ml-auto">
                        <ThemeToggle />
                        {/* Role badge — desktop only */}
                        <span
                            className={cn(
                                "hidden rounded-md px-2.5 py-1 text-xs font-medium lg:inline-block",
                                ROLE_COLORS[role],
                            )}
                        >
                            {ROLE_LABELS[role]}
                        </span>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 p-6">{children}</main>
            </div>
        </div>
    )
}
