import type { Metadata } from "next"
import { Users, Package, MapPin, Wallet, Truck, ClipboardList } from "lucide-react"
import { RoleGuard } from "@/components/layout/role-guard"
import { StatCard } from "@/components/dashboard/stat-card"

export const metadata: Metadata = { title: "Admin Dashboard | CourierPro" }

export default function AdminDashboard() {
    return (
        <RoleGuard allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
            <div className="flex flex-col gap-6">
                <div>
                    <h2 className="font-heading text-2xl font-semibold text-foreground">Admin Overview</h2>
                    <p className="text-sm text-muted-foreground">Full platform visibility and control.</p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <StatCard label="Total Users" value="—" icon={Users} iconClass="text-primary" />
                    <StatCard label="Total Shipments" value="—" icon={Package} iconClass="text-amber-500" />
                    <StatCard label="Active Hubs" value="—" icon={MapPin} iconClass="text-emerald-500" />
                    <StatCard label="Revenue" value="—" icon={Wallet} iconClass="text-violet-500" />
                    <StatCard label="Fleet Size" value="—" icon={Truck} iconClass="text-rose-500" />
                    <StatCard label="Open Tickets" value="—" icon={ClipboardList} iconClass="text-orange-500" />
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <div className="rounded-xl border border-border bg-card p-6">
                        <h3 className="font-heading font-semibold text-foreground">Recent Users</h3>
                        <p className="mt-2 text-sm text-muted-foreground">No data available.</p>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-6">
                        <h3 className="font-heading font-semibold text-foreground">Recent Shipments</h3>
                        <p className="mt-2 text-sm text-muted-foreground">No data available.</p>
                    </div>
                </div>
            </div>
        </RoleGuard>
    )
}
