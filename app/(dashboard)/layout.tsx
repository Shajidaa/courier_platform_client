import { AuthGuard } from "@/components/layout/auth-guard";
import { DashboardNav } from "@/components/layout/dashboard-nav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthGuard>
            <div className="flex min-h-screen flex-col bg-background">
                <DashboardNav />
                <main className="flex-1 p-6">{children}</main>
            </div>
        </AuthGuard>
    );
}
