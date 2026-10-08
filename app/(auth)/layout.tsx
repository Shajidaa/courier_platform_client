import { AuthLayout } from "@/components/auth/auth-layout";
import { ThemeProvider } from "@/components/theme-provider";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <AuthLayout>{children}</AuthLayout>
        </ThemeProvider>
    );
}
