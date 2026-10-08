"use client";

import { Package } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function DashboardNav() {
    const { user, logout } = useAuth();

    return (
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur">
            <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Package className="size-4" />
                </div>
                <span className="font-heading font-semibold text-foreground">CourierPro</span>
            </div>
            <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                    {user?.name ?? user?.email}
                </span>
                <ThemeToggle />
                <Button variant="outline" size="sm" onClick={logout}>
                    Sign out
                </Button>
            </div>
        </header>
    );
}
