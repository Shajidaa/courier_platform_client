import type { Metadata } from "next"
import { RoleGuard } from "@/components/layout/role-guard"
import { HubsPage } from "@/components/hubs/hubs-page"

export const metadata: Metadata = { title: "Hubs | CourierPro" }

export default function AdminHubsPage() {
    return (
        <RoleGuard allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
            <HubsPage userRole="ADMIN" />
        </RoleGuard>
    )
}
