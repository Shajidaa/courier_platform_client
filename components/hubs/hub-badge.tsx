import { MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

export function HubBadge({ name, className }: { name: string; className?: string }) {
    return (
        <span className={cn(
            "inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary",
            className,
        )}>
            <MapPin className="size-3 shrink-0" />
            {name}
        </span>
    )
}
