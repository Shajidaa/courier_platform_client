import type { Metadata } from "next";
import { RoleGuard } from "@/components/layout/role-guard";
import { PaymentsPage } from "@/components/payments/payments-page";

export const metadata: Metadata = {
  title: "All Payments & Billing | CourierPro Admin",
  description: "View nationwide payment transactions and settlement",
};

export default function AdminPaymentsPage() {
  return (
    <RoleGuard allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
      <PaymentsPage isSender={false} />
    </RoleGuard>
  );
}
