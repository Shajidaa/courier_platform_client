import type { Metadata } from "next"
import { ClipboardList, Clock, CheckCircle, Users } from "lucide-react"
import { RoleGuard } from "@/components/layout/role-guard"
import { StatCard } from "@/components/dashboard/stat-card"

export const metadata: Metadata = { title: "Support Dashboard | CourierPro" }

export default function SupportDashboard() {
    return (
        <RoleGuard allowedRoles={["SUPPORT_AGENT"]}>
            <div className="flex flex-col gap-6">
                <div>
                    <h2 className="font-heading text-2xl font-semibold text-foreground">Support Dashboard</h2>
                    <p className="text-sm text-muted-foreground">Manage customer tickets and inquiries.</p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard label="Open Tickets" value="—" icon={ClipboardList} iconClass="text-primary" />
                    <StatCard label="In Progress" value="—" icon={Clock} iconClass="text-amber-500" />
                    <StatCard label="Resolved" value="—" icon={CheckCircle} iconClass="text-emerald-500" />
                    <StatCard label="Total Users" value="—" icon={Users} iconClass="text-violet-500" />
                </div>

                <div className="rounded-xl border border-border bg-card p-6">
                    <h3 className="font-heading font-semibold text-foreground">Recent Tickets</h3>
                    <p className="mt-2 text-sm text-muted-foreground">No tickets assigned.</p>
                </div>
            </div>
        </RoleGuard>
    )
}
