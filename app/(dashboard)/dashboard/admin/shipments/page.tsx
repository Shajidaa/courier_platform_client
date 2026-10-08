import type { Metadata } from "next";
import { RoleGuard } from "@/components/layout/role-guard";
import { AdminShipmentsTable } from "@/components/shipments/admin-shipments-table";

export const metadata: Metadata = {
  title: "Shipments Management | CourierPro Admin",
  description: "Operations control for all parcel shipments",
};

export default function AdminShipmentsPage() {
  return (
    <RoleGuard allowedRoles={["ADMIN", "SUPER_ADMIN", "OPS_MANAGER", "HUB_MANAGER"]}>
      <AdminShipmentsTable />
    </RoleGuard>
  );
}
