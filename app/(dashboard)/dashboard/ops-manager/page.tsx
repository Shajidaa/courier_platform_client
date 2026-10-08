import type { Metadata } from "next"
import { Package, MapPin, Truck, BarChart3 } from "lucide-react"
import { RoleGuard } from "@/components/layout/role-guard"
import { StatCard } from "@/components/dashboard/stat-card"

export const metadata: Metadata = { title: "Ops Manager Dashboard | CourierPro" }

export default function OpsManagerDashboard() {
    return (
        <RoleGuard allowedRoles={["OPS_MANAGER"]}>
            <div className="flex flex-col gap-6">
                <div>
                    <h2 className="font-heading text-2xl font-semibold text-foreground">Operations Dashboard</h2>
                    <p className="text-sm text-muted-foreground">Monitor the full logistics network.</p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard label="All Shipments" value="—" icon={Package} iconClass="text-primary" />
                    <StatCard label="Active Hubs" value="—" icon={MapPin} iconClass="text-emerald-500" />
                    <StatCard label="Fleet Size" value="—" icon={Truck} iconClass="text-amber-500" />
                    <StatCard label="On-Time Rate" value="—" icon={BarChart3} iconClass="text-violet-500" />
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <div className="rounded-xl border border-border bg-card p-6">
                        <h3 className="font-heading font-semibold text-foreground">Hub Activity</h3>
                        <p className="mt-2 text-sm text-muted-foreground">No data available.</p>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-6">
                        <h3 className="font-heading font-semibold text-foreground">Fleet Status</h3>
                        <p className="mt-2 text-sm text-muted-foreground">No data available.</p>
                    </div>
                </div>
            </div>
        </RoleGuard>
    )
}
