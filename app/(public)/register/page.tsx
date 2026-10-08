import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
    title: "Create Account | CourierPro",
    description: "Create your CourierPro account",
};

export default function RegisterPage() {
    return <RegisterForm />;
}
