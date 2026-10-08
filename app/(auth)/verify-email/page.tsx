import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { VerifyEmailForm } from "@/components/auth/verify-email-form";

export const metadata: Metadata = {
    title: "Verify Email | CourierPro",
    description: "Enter the OTP sent to your email to activate your account",
};

interface Props {
    searchParams: Promise<{ email?: string }>;
}

export default async function VerifyEmailPage({ searchParams }: Props) {
    const { email } = await searchParams;

    // If no email in URL, someone landed here directly — send them to register
    if (!email) {
        redirect("/register");
    }

    return <VerifyEmailForm email={decodeURIComponent(email)} />;
}
