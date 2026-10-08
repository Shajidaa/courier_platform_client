import type { Metadata } from "next"
import { RoleGuard } from "@/components/layout/role-guard"
import { HubsPage } from "@/components/hubs/hubs-page"

export const metadata: Metadata = { title: "Hubs | CourierPro" }

export default function OpsManagerHubsPage() {
    return (
        <RoleGuard allowedRoles={["OPS_MANAGER"]}>
            <HubsPage userRole="OPS_MANAGER" />
        </RoleGuard>
    )
}
