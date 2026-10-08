import Link from "next/link";
import {
  Truck,
  MapPin,
  Shield,
  Zap,
  Building2,
  Wallet,
  CheckCircle2,
  ArrowRight,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import HeroSection from "@/components/home/hero";
import { TrackShipmentSection } from "@/components/home/track-shipment-section";
import { CostCalculatorSection } from "@/components/home/cost-calculator-section";
import { CoverageSection } from "@/components/home/coverage-section";

const features = [
  {
    icon: Truck,
    title: "Multi-Hub Routing & Transfers",
    description:
      "Automated inter-hub dispatching and batch transfers ensure parcels move seamlessly across districts.",
  },
  {
    icon: Zap,
    title: "Real-Time Tracking & Logs",
    description:
      "Full transparent timeline of every scan, hub arrival, and courier handover with timestamped logs.",
  },
  {
    icon: Wallet,
    title: "bKash & COD Checkout",
    description:
      "Instant online bKash payments or flexible Cash on Delivery collection with automated settlement.",
  },
  {
    icon: Building2,
    title: "Fleet & Driver Allocation",
    description:
      "Dedicated management for transport vehicles, capacity utilization, and courier rider assignments.",
  },
  {
    icon: Shield,
    title: "Role-Based Security",
    description:
      "Tailored dashboard workflows for Senders, Riders, Hub Managers, Ops Managers, and Administrators.",
  },
  {
    icon: Package,
    title: "Rate Calculator & Coverage",
    description:
      "Predictable weight-based rate calculations with nationwide postal code service coverage.",
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Hero Section */}
      <HeroSection />

      {/* Live Parcel Tracking Tool */}
      <TrackShipmentSection />

      {/* Cost & Delivery Calculator */}
      <CostCalculatorSection />

      {/* Core Features */}
      <section className="py-20 border-t border-border bg-background">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
              Engineered for Enterprise Courier Operations
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Everything required to operate a reliable parcel delivery network with complete operational control.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="group flex flex-col gap-3 rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/40 hover:shadow-md"
              >
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="size-5" />
                </div>
                <h3 className="font-heading font-semibold text-foreground text-base mt-1">
                  {title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coverage & Service Area Search */}
      <CoverageSection />

      {/* Final Call to Action */}
      <section className="border-t border-border bg-muted/30 px-6 py-20 text-center">
        <div className="mx-auto max-w-3xl space-y-6">
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground">
            Ready to Streamline Your Deliveries?
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
            Join thousands of senders, couriers, and merchants delivering across the country with CourierPro.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Button size="lg" asChild className="h-12 px-8 rounded-xl font-semibold shadow-lg shadow-primary/20 gap-2">
              <Link href="/register">
                <span>Create Free Account</span>
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="h-12 px-8 rounded-xl font-semibold">
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
