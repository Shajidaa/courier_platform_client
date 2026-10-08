import type { Metadata } from "next";
import { RoleGuard } from "@/components/layout/role-guard";
import { VehiclesPage } from "@/components/vehicles/vehicles-page";

export const metadata: Metadata = {
  title: "Fleet & Vehicles | CourierPro Admin",
  description: "Manage dispatch vehicles and driver assignments",
};

export default function AdminVehiclesPage() {
  return (
    <RoleGuard allowedRoles={["ADMIN", "SUPER_ADMIN", "OPS_MANAGER", "HUB_MANAGER"]}>
      <VehiclesPage />
    </RoleGuard>
  );
}
