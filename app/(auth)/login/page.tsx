import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
    title: "Sign In | CourierPro",
    description: "Sign in to your CourierPro account",
};

export default function LoginPage() {
    return <LoginForm />;
}
