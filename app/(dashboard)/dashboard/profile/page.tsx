import type { Metadata } from "next"
import { ProfilePage } from "@/components/dashboard/profile-page"

export const metadata: Metadata = { title: "Account Settings | CourierPro" }

export default function AccountSettingsPage() {
    return <ProfilePage />
}
