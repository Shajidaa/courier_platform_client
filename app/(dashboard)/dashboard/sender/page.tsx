import type { Metadata } from "next"
import { Package, Clock, CheckCircle, Wallet } from "lucide-react"
import { RoleGuard } from "@/components/layout/role-guard"
import { StatCard } from "@/components/dashboard/stat-card"

export const metadata: Metadata = { title: "Sender Dashboard | CourierPro" }

export default function SenderDashboard() {
    return (
        <RoleGuard allowedRoles={["SENDER"]}>
            <div className="flex flex-col gap-6">
                <div>
                    <h2 className="font-heading text-2xl font-semibold text-foreground">My Dashboard</h2>
                    <p className="text-sm text-muted-foreground">Track your shipments and payments.</p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard label="Total Shipments" value="—" icon={Package} iconClass="text-primary" />
                    <StatCard label="In Transit" value="—" icon={Clock} iconClass="text-amber-500" />
                    <StatCard label="Delivered" value="—" icon={CheckCircle} iconClass="text-emerald-500" />
                    <StatCard label="Total Spent" value="—" icon={Wallet} iconClass="text-violet-500" />
                </div>

                <div className="rounded-xl border border-border bg-card p-6">
                    <h3 className="font-heading font-semibold text-foreground">Recent Shipments</h3>
                    <p className="mt-2 text-sm text-muted-foreground">No shipments yet.</p>
                </div>
            </div>
        </RoleGuard>
    )
}
