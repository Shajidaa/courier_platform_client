import type { Metadata } from "next";
import { RoleGuard } from "@/components/layout/role-guard";
import { PaymentsPage } from "@/components/payments/payments-page";

export const metadata: Metadata = {
  title: "My Payments | CourierPro",
  description: "View transaction records, bKash payments, and COD balances",
};

export default function SenderPaymentsPage() {
  return (
    <RoleGuard allowedRoles={["SENDER"]}>
      <PaymentsPage isSender={true} />
    </RoleGuard>
  );
}
