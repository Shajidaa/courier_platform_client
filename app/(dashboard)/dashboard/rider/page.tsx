import type { Metadata } from "next"
import { Truck, Clock, CheckCircle, Wallet } from "lucide-react"
import { RoleGuard } from "@/components/layout/role-guard"
import { StatCard } from "@/components/dashboard/stat-card"

export const metadata: Metadata = { title: "Rider Dashboard | CourierPro" }

export default function RiderDashboard() {
    return (
        <RoleGuard allowedRoles={["RIDER"]}>
            <div className="flex flex-col gap-6">
                <div>
                    <h2 className="font-heading text-2xl font-semibold text-foreground">Rider Dashboard</h2>
                    <p className="text-sm text-muted-foreground">Manage your deliveries and track earnings.</p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard label="Assigned" value="—" icon={Truck} iconClass="text-primary" />
                    <StatCard label="In Progress" value="—" icon={Clock} iconClass="text-amber-500" />
                    <StatCard label="Completed" value="—" icon={CheckCircle} iconClass="text-emerald-500" />
                    <StatCard label="Earnings" value="—" icon={Wallet} iconClass="text-violet-500" />
                </div>

                <div className="rounded-xl border border-border bg-card p-6">
                    <h3 className="font-heading font-semibold text-foreground">Active Deliveries</h3>
                    <p className="mt-2 text-sm text-muted-foreground">No active deliveries.</p>
                </div>
            </div>
        </RoleGuard>
    )
}
