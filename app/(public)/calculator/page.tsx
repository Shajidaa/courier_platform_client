import type { Metadata } from "next";
import { CostCalculatorSection } from "@/components/home/cost-calculator-section";

export const metadata: Metadata = {
  title: "Delivery Rate Calculator | CourierPro",
  description: "Calculate delivery cost and shipping rates based on weight and speed",
};

export default function CalculatorPage() {
  return (
    <div className="py-12">
      <CostCalculatorSection />
    </div>
  );
}
