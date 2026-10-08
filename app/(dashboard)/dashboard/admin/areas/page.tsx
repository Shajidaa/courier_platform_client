import type { Metadata } from "next";
import { RoleGuard } from "@/components/layout/role-guard";
import { AreasPage } from "@/components/areas/areas-page";

export const metadata: Metadata = {
  title: "Service Areas & Postal Codes | CourierPro Admin",
  description: "Manage delivery service territory and postal codes",
};

export default function AdminAreasPage() {
  return (
    <RoleGuard allowedRoles={["ADMIN", "SUPER_ADMIN", "OPS_MANAGER"]}>
      <AreasPage />
    </RoleGuard>
  );
}
