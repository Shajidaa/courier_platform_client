import type { Metadata } from "next";
import { RoleGuard } from "@/components/layout/role-guard";
import { AdminShipmentsTable } from "@/components/shipments/admin-shipments-table";

export const metadata: Metadata = {
  title: "Hub Shipments | CourierPro Hub Manager",
  description: "Manage hub parcels, check-ins, and local delivery dispatches",
};

export default function HubShipmentsPage() {
  return (
    <RoleGuard allowedRoles={["HUB_MANAGER", "ADMIN", "SUPER_ADMIN"]}>
      <AdminShipmentsTable />
    </RoleGuard>
  );
}
