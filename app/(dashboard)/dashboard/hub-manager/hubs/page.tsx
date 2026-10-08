import type { Metadata } from "next"
import { RoleGuard } from "@/components/layout/role-guard"
import { HubsPage } from "@/components/hubs/hubs-page"

export const metadata: Metadata = { title: "Hubs | CourierPro" }

export default function HubManagerHubsPage() {
    return (
        <RoleGuard allowedRoles={["HUB_MANAGER"]}>
            <HubsPage userRole="HUB_MANAGER" />
        </RoleGuard>
    )
}
