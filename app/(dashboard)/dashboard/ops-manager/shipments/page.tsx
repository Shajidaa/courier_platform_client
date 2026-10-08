import type { Metadata } from "next";
import { RoleGuard } from "@/components/layout/role-guard";
import { AdminShipmentsTable } from "@/components/shipments/admin-shipments-table";

export const metadata: Metadata = {
  title: "Shipments Management | CourierPro Operations",
  description: "Operations control for all parcel shipments",
};

export default function OpsShipmentsPage() {
  return (
    <RoleGuard allowedRoles={["OPS_MANAGER", "ADMIN", "SUPER_ADMIN"]}>
      <AdminShipmentsTable />
    </RoleGuard>
  );
}
