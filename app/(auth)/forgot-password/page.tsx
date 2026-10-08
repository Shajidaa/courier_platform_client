import type { Metadata } from "next"
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"

export const metadata: Metadata = {
    title: "Forgot Password | CourierPro",
    description: "Reset your CourierPro account password",
}

export default function ForgotPasswordPage() {
    return <ForgotPasswordForm />
}
