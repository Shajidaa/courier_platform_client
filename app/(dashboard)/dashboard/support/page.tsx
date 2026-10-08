import type { Metadata } from "next";
import { RoleGuard } from "@/components/layout/role-guard";
import { AdminShipmentsTable } from "@/components/shipments/admin-shipments-table";

export const metadata: Metadata = {
  title: "Support Portal | CourierPro",
  description: "Customer service and shipment tracking support",
};

export default function SupportDashboardPage() {
  return (
    <RoleGuard allowedRoles={["SUPPORT_AGENT", "ADMIN", "SUPER_ADMIN"]}>
      <div className="space-y-6">
        <div>
          <h2 className="font-heading text-2xl font-bold text-foreground">
            Support Operations
          </h2>
          <p className="text-sm text-muted-foreground">
            Look up user parcels, trace tracking timeline logs, and assist customer inquiries.
          </p>
        </div>
        <AdminShipmentsTable />
      </div>
    </RoleGuard>
  );
}
