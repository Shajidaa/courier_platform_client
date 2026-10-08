import type { Metadata } from "next";
import { RoleGuard } from "@/components/layout/role-guard";
import { TransfersPage } from "@/components/transfers/transfers-page";

export const metadata: Metadata = {
  title: "Hub Transfers | CourierPro Hub Manager",
  description: "Receive incoming transfers and dispatch batches to other hubs",
};

export default function HubTransfersPage() {
  return (
    <RoleGuard allowedRoles={["HUB_MANAGER", "ADMIN", "SUPER_ADMIN"]}>
      <TransfersPage />
    </RoleGuard>
  );
}
