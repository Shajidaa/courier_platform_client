import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Truck,
  MapPin,
  Building2,
  Wallet,
  UserCircle,
  Send,
  Navigation,
} from "lucide-react";
import type { TRole } from "@/types/roles";

export interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

export const NAV_ITEMS: Record<TRole, NavItem[]> = {
  SENDER: [
    { label: "Overview", href: "/dashboard/sender", icon: LayoutDashboard },
    { label: "Book Shipment", href: "/dashboard/sender/book", icon: PlusCircle },
    { label: "My Shipments", href: "/dashboard/sender/shipments", icon: Package },
    { label: "Payments", href: "/dashboard/sender/payments", icon: Wallet },
    { label: "Account", href: "/dashboard/profile", icon: UserCircle },
  ],
  RIDER: [
    { label: "Overview", href: "/dashboard/rider", icon: LayoutDashboard },
    { label: "Deliveries", href: "/dashboard/rider/deliveries", icon: Truck },
    { label: "Account", href: "/dashboard/profile", icon: UserCircle },
  ],
  HUB_MANAGER: [
    { label: "Overview", href: "/dashboard/hub-manager", icon: LayoutDashboard },
    { label: "Shipments", href: "/dashboard/hub-manager/shipments", icon: Package },
    { label: "Hub Transfers", href: "/dashboard/hub-manager/transfers", icon: Building2 },
    { label: "Account", href: "/dashboard/profile", icon: UserCircle },
  ],
  OPS_MANAGER: [
    { label: "Overview", href: "/dashboard/ops-manager", icon: LayoutDashboard },
    { label: "All Shipments", href: "/dashboard/ops-manager/shipments", icon: Package },
    { label: "Hubs & Coverage", href: "/dashboard/admin/hubs", icon: MapPin },
    { label: "Hub Transfers", href: "/dashboard/admin/transfers", icon: Send },
    { label: "Vehicles & Fleet", href: "/dashboard/admin/vehicles", icon: Truck },
    { label: "Account", href: "/dashboard/profile", icon: UserCircle },
  ],
  SUPPORT_AGENT: [
    { label: "Overview", href: "/dashboard/support", icon: LayoutDashboard },
    { label: "All Shipments", href: "/dashboard/admin/shipments", icon: Package },
    { label: "Account", href: "/dashboard/profile", icon: UserCircle },
  ],
  ADMIN: [
    { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "Shipments", href: "/dashboard/admin/shipments", icon: Package },
    { label: "Hubs", href: "/dashboard/admin/hubs", icon: Building2 },
    { label: "Service Areas", href: "/dashboard/admin/areas", icon: MapPin },
    { label: "Hub Transfers", href: "/dashboard/admin/transfers", icon: Send },
    { label: "Fleet & Vehicles", href: "/dashboard/admin/vehicles", icon: Truck },
    { label: "Account", href: "/dashboard/profile", icon: UserCircle },
  ],
  SUPER_ADMIN: [
    { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "Shipments", href: "/dashboard/admin/shipments", icon: Package },
    { label: "Hubs", href: "/dashboard/admin/hubs", icon: Building2 },
    { label: "Service Areas", href: "/dashboard/admin/areas", icon: MapPin },
    { label: "Hub Transfers", href: "/dashboard/admin/transfers", icon: Send },
    { label: "Fleet & Vehicles", href: "/dashboard/admin/vehicles", icon: Truck },
    { label: "Account", href: "/dashboard/profile", icon: UserCircle },
  ],
};
