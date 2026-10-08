import type { Metadata } from "next";
import { Package, Truck, MapPin, Users } from "lucide-react";

export const metadata: Metadata = {
    title: "Dashboard | CourierPro",
};

const stats = [
    { label: "Total Shipments", value: "—", icon: Package, color: "text-primary" },
    { label: "In Transit", value: "—", icon: Truck, color: "text-amber-500" },
    { label: "Hubs", value: "—", icon: MapPin, color: "text-emerald-500" },
    { label: "Users", value: "—", icon: Users, color: "text-violet-500" },
];

export default function DashboardPage() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h2 className="font-heading text-2xl font-semibold text-foreground">Overview</h2>
                <p className="text-sm text-muted-foreground">Welcome back to CourierPro.</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map(({ label, value, icon: Icon, color }) => (
                    <div
                        key={label}
                        className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 shadow-xs"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">{label}</span>
                            <Icon className={`size-5 ${color}`} />
                        </div>
                        <span className="font-heading text-3xl font-semibold text-foreground">{value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
