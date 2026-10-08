import Link from "next/link";
import { Package, Truck, MapPin, Shield, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Truck,
    title: "Real-Time Tracking",
    description: "Track every shipment across all hubs and routes with live status updates.",
  },
  {
    icon: MapPin,
    title: "Hub Management",
    description: "Manage your distribution network with smart hub-to-hub transfer routing.",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description: "Enterprise-grade security with role-based access for couriers, agents and admins.",
  },
];

const highlights = [
  "Multi-role access control",
  "Automated shipment routing",
  "Payment integration",
  "Email notifications",
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Nav */}
      < div className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Package className="size-4" />
          </div>
          <span className="font-heading font-semibold text-foreground">CourierPro</span>
        </div>
        <nav className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/login">Get started</Link>
          </Button>
        </nav>
      </div>

      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground">
          <span className="size-1.5 rounded-full bg-emerald-500" />
          Platform is live
        </div>
        <h1 className="font-heading max-w-2xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Courier logistics, managed from one place
        </h1>
        <p className="max-w-md text-base text-muted-foreground">
          CourierPro gives you full visibility over shipments, hubs, vehicles and payments — built for teams that move fast.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" asChild>
            <Link href="/login">
              Get started <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/dashboard">View dashboard</Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-10 text-center font-heading text-2xl font-semibold text-foreground">
            Everything you need to run a courier operation
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6"
              >
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
                <h3 className="font-heading font-semibold text-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="border-t border-border bg-muted/30 px-6 py-16">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
          <h2 className="font-heading text-xl font-semibold text-foreground">Built for scale</h2>
          <ul className="flex flex-wrap justify-center gap-4">
            {highlights.map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="size-4 text-primary" />
                {item}
              </li>
            ))}
          </ul>
          <Button size="lg" asChild>
            <Link href="/login">Sign in to your account</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-6 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} CourierPro. All rights reserved.
      </footer>
    </div>
  );
}
