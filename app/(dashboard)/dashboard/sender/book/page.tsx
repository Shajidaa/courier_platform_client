import type { Metadata } from "next";
import { RoleGuard } from "@/components/layout/role-guard";
import { BookShipmentForm } from "@/components/shipments/book-shipment-form";

export const metadata: Metadata = {
  title: "Book New Shipment | CourierPro",
  description: "Create and dispatch a new parcel shipment",
};

export default function BookShipmentPage() {
  return (
    <RoleGuard allowedRoles={["SENDER"]}>
      <div className="space-y-6">
        <div>
          <h2 className="font-heading text-2xl font-bold text-foreground">
            Book New Shipment
          </h2>
          <p className="text-sm text-muted-foreground">
            Fill in delivery details, calculate shipping rates, and schedule courier pickup.
          </p>
        </div>

        <BookShipmentForm />
      </div>
    </RoleGuard>
  );
}
