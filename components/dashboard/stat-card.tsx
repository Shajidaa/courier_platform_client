import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
    label: string
    value: string
    icon: LucideIcon
    iconClass?: string
    trend?: string
}

export function StatCard({ label, value, icon: Icon, iconClass, trend }: StatCardProps) {
    return (
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{label}</span>
                <Icon className={cn("size-5", iconClass ?? "text-primary")} />
            </div>
            <span className="font-heading text-3xl font-semibold text-foreground">{value}</span>
            {trend && <span className="text-xs text-muted-foreground">{trend}</span>}
        </div>
    )
}
