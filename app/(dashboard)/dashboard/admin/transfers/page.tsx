import type { Metadata } from "next";
import { RoleGuard } from "@/components/layout/role-guard";
import { TransfersPage } from "@/components/transfers/transfers-page";

export const metadata: Metadata = {
  title: "Hub-to-Hub Transfers | CourierPro Admin",
  description: "Manage inter-hub parcel transfers and batch dispatches",
};

export default function AdminTransfersPage() {
  return (
    <RoleGuard allowedRoles={["ADMIN", "SUPER_ADMIN", "OPS_MANAGER", "HUB_MANAGER"]}>
      <TransfersPage />
    </RoleGuard>
  );
}
