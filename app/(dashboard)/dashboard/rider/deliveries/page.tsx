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
      <div className="space-y-6">
        <div>
          <h2 className="font-heading text-2xl font-bold text-foreground">
            My Delivery Runs
          </h2>
          <p className="text-sm text-muted-foreground">
            Track and update parcels assigned to your courier runs.
          </p>
        </div>

        <AdminShipmentsTable />
      </div>
    </RoleGuard>
  );
}
