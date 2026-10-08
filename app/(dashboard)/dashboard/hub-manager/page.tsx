import type { Metadata } from "next"
import { Package, Building2, Truck, ArrowLeftRight } from "lucide-react"
import { RoleGuard } from "@/components/layout/role-guard"
import { StatCard } from "@/components/dashboard/stat-card"

export const metadata: Metadata = { title: "Hub Manager Dashboard | CourierPro" }

export default function HubManagerDashboard() {
    return (
        <RoleGuard allowedRoles={["HUB_MANAGER"]}>
            <div className="flex flex-col gap-6">
                <div>
                    <h2 className="font-heading text-2xl font-semibold text-foreground">Hub Dashboard</h2>
                    <p className="text-sm text-muted-foreground">Manage your hub operations and transfers.</p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard label="Hub Shipments" value="—" icon={Package} iconClass="text-primary" />
                    <StatCard label="Active Riders" value="—" icon={Truck} iconClass="text-amber-500" />
                    <StatCard label="Pending Transfers" value="—" icon={ArrowLeftRight} iconClass="text-violet-500" />
                    <StatCard label="Hub Capacity" value="—" icon={Building2} iconClass="text-emerald-500" />
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <div className="rounded-xl border border-border bg-card p-6">
                        <h3 className="font-heading font-semibold text-foreground">Incoming Transfers</h3>
                        <p className="mt-2 text-sm text-muted-foreground">No incoming transfers.</p>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-6">
                        <h3 className="font-heading font-semibold text-foreground">Outgoing Transfers</h3>
                        <p className="mt-2 text-sm text-muted-foreground">No outgoing transfers.</p>
                    </div>
                </div>
            </div>
        </RoleGuard>
    )
}
