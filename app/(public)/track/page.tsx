import type { Metadata } from "next";
import { TrackShipmentSection } from "@/components/home/track-shipment-section";

export const metadata: Metadata = {
  title: "Track Shipment | CourierPro",
  description: "Live real-time parcel tracking and delivery status",
};

export default function TrackPage() {
  return (
    <div className="py-12">
      <TrackShipmentSection />
    </div>
  );
}
