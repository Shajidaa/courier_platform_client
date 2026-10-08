import {
    LayoutDashboard,
    Package,
    Truck,
    MapPin,
    Users,
    Settings,
    LifeBuoy,
    BarChart3,
    Building2,
    ClipboardList,
    ShieldCheck,
    Wallet,
    UserCircle,
} from "lucide-react"
import type { TRole } from "@/types/roles"

export interface NavItem {
    label: string
    href: string
    icon: React.ElementType
}

export const NAV_ITEMS: Record<TRole, NavItem[]> = {
    SENDER: [
        { label: "Overview", href: "/dashboard/sender", icon: LayoutDashboard },
        { label: "My Shipments", href: "/dashboard/sender/shipments", icon: Package },
        { label: "Payments", href: "/dashboard/sender/payments", icon: Wallet },
        { label: "Account", href: "/dashboard/profile", icon: UserCircle },
    ],
    RIDER: [
        { label: "Overview", href: "/dashboard/rider", icon: LayoutDashboard },
        { label: "My Deliveries", href: "/dashboard/rider/deliveries", icon: Truck },
        { label: "Earnings", href: "/dashboard/rider/earnings", icon: Wallet },
        { label: "Account", href: "/dashboard/profile", icon: UserCircle },
    ],
    HUB_MANAGER: [
        { label: "Overview", href: "/dashboard/hub-manager", icon: LayoutDashboard },
        { label: "Shipments", href: "/dashboard/hub-manager/shipments", icon: Package },
        { label: "Hub Transfers", href: "/dashboard/hub-manager/transfers", icon: Building2 },
        { label: "Riders", href: "/dashboard/hub-manager/riders", icon: Truck },
        { label: "Account", href: "/dashboard/profile", icon: UserCircle },
    ],
    OPS_MANAGER: [
        { label: "Overview", href: "/dashboard/ops-manager", icon: LayoutDashboard },
        { label: "All Shipments", href: "/dashboard/ops-manager/shipments", icon: Package },
        { label: "Hubs", href: "/dashboard/ops-manager/hubs", icon: MapPin },
        { label: "Vehicles", href: "/dashboard/ops-manager/vehicles", icon: Truck },
        { label: "Reports", href: "/dashboard/ops-manager/reports", icon: BarChart3 },
        { label: "Account", href: "/dashboard/profile", icon: UserCircle },
    ],
    SUPPORT_AGENT: [
        { label: "Overview", href: "/dashboard/support", icon: LayoutDashboard },
        { label: "Tickets", href: "/dashboard/support/tickets", icon: ClipboardList },
        { label: "Users", href: "/dashboard/support/users", icon: Users },
        { label: "Account", href: "/dashboard/profile", icon: UserCircle },
    ],
    ADMIN: [
        { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
        { label: "Users", href: "/dashboard/admin/users", icon: Users },
        { label: "Shipments", href: "/dashboard/admin/shipments", icon: Package },
        { label: "Hubs", href: "/dashboard/admin/hubs", icon: MapPin },
        { label: "Vehicles", href: "/dashboard/admin/vehicles", icon: Truck },
        { label: "Payments", href: "/dashboard/admin/payments", icon: Wallet },
        { label: "Reports", href: "/dashboard/admin/reports", icon: BarChart3 },
        { label: "Support", href: "/dashboard/admin/support", icon: LifeBuoy },
        { label: "Settings", href: "/dashboard/admin/settings", icon: Settings },
        { label: "Account", href: "/dashboard/profile", icon: UserCircle },
    ],
    SUPER_ADMIN: [
        { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
        { label: "Users", href: "/dashboard/admin/users", icon: Users },
        { label: "Shipments", href: "/dashboard/admin/shipments", icon: Package },
        { label: "Hubs", href: "/dashboard/admin/hubs", icon: MapPin },
        { label: "Vehicles", href: "/dashboard/admin/vehicles", icon: Truck },
        { label: "Payments", href: "/dashboard/admin/payments", icon: Wallet },
        { label: "Reports", href: "/dashboard/admin/reports", icon: BarChart3 },
        { label: "Support", href: "/dashboard/admin/support", icon: LifeBuoy },
        { label: "Permissions", href: "/dashboard/admin/permissions", icon: ShieldCheck },
        { label: "Settings", href: "/dashboard/admin/settings", icon: Settings },
        { label: "Account", href: "/dashboard/profile", icon: UserCircle },
    ],
}
