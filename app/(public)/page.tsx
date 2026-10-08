import Link from "next/link";
import { CheckCircle, MapPin, Shield, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

import HeroSection from "@/components/home/hero";

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
     
     
    <HeroSection/>

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

 
    
    </div>
  );
}
