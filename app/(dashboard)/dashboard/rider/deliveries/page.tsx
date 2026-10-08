import type { Metadata } from "next";
import { RoleGuard } from "@/components/layout/role-guard";
import { AdminShipmentsTable } from "@/components/shipments/admin-shipments-table";

export const metadata: Metadata = {
  title: "Deliveries | CourierPro Rider",
  description: "View assigned deliveries and update delivery progress",
};

export default function RiderDeliveriesPage() {
  return (
    <RoleGuard allowedRoles={["RIDER", "ADMIN", "SUPER_ADMIN"]}>
      <AdminShipmentsTable />
    </RoleGuard>
  );
}
