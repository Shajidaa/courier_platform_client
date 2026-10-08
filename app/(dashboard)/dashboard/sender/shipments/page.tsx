import type { Metadata } from "next";
import { RoleGuard } from "@/components/layout/role-guard";
import { SenderShipmentsTable } from "@/components/shipments/sender-shipments-table";

export const metadata: Metadata = {
  title: "My Shipments | CourierPro",
  description: "View and manage all booked parcels",
};

export default function SenderShipmentsPage() {
  return (
    <RoleGuard allowedRoles={["SENDER"]}>
      <SenderShipmentsTable />
    </RoleGuard>
  );
}
