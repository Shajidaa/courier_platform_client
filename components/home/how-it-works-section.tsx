"use client";

import { useState } from "react";
import {
  PackagePlus,
  ScanBarcode,
  Route,
  CheckCircle2,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    step: "01",
    icon: PackagePlus,
    title: "Book Parcel & Dynamic Rate",
    subtitle: "Weight & Distance Engine",
    description:
      "Enter package dimensions, pick from Standard to Same-Day delivery tiers, and get automated upfront pricing with dynamic barcode creation.",
    badge: "1-Click Dispatch",
    color: "from-blue-500/20 to-indigo-500/20",
    iconColor: "text-blue-500",
  },
  {
    step: "02",
    icon: ScanBarcode,
    title: "Hub Ingestion & Optical Scan",
    subtitle: "Automated Sorting Center",
    description:
      "Packages arrive at regional distribution centers where high-speed scanners register origin, weight check, and auto-route to destination bins.",
    badge: "99.85% Sorting Accuracy",
    color: "from-indigo-500/20 to-purple-500/20",
    iconColor: "text-indigo-500",
  },
  {
    step: "03",
    icon: Route,
    title: "Smart Inter-Hub Transit",
    subtitle: "GPS Route Optimization",
    description:
      "Batched vehicle dispatches move seamlessly between district hubs with automated manifest handovers and real-time transit telemetry logs.",
    badge: "64 Districts Connected",
    color: "from-purple-500/20 to-pink-500/20",
    iconColor: "text-purple-500",
  },
  {
    step: "04",
    icon: CheckCircle2,
    title: "Last-Mile Delivery & OTP",
    subtitle: "Doorstep Verification",
    description:
      "Dedicated local riders receive optimized delivery routes. Handover is finalized using secure OTP verification and instant COD payout reconciliation.",
    badge: "100% Verified Handover",
    color: "from-emerald-500/20 to-teal-500/20",
    iconColor: "text-emerald-500",
  },
];

export function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState<number>(0);

  return (
    <section className="py-20 border-t border-border bg-muted/20 relative overflow-hidden">
      <div className="absolute top-1/2 -left-20 w-[350px] h-[350px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
            <Sparkles className="size-3.5" />
            <span>End-to-End Delivery Pipeline</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            How Intelligent Logistics Works
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            From initial booking to recipient doorstep handover, our automated pipeline ensures transparency, security, and velocity at every checkpoint.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 relative">
          {STEPS.map((item, idx) => {
            const Icon = item.icon;
            const isSelected = activeStep === idx;

            return (
              <div
                key={item.step}
                onMouseEnter={() => setActiveStep(idx)}
                className={cn(
                  "group relative flex flex-col justify-between rounded-2xl border p-6 transition-all duration-300 cursor-pointer",
                  isSelected
                    ? "border-primary bg-card shadow-lg ring-2 ring-primary/20 -translate-y-1"
                    : "border-border bg-card/60 hover:border-border hover:bg-card hover:-translate-y-0.5"
                )}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="font-mono text-2xl font-black text-muted-foreground/40 group-hover:text-primary/70 transition-colors">
                      {item.step}
                    </span>
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary">
                      {item.badge}
                    </span>
                  </div>

                  <div
                    className={cn(
                      "flex size-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 mb-4",
                      `bg-gradient-to-br ${item.color} ${item.iconColor}`
                    )}
                  >
                    <Icon className="size-6" />
                  </div>

                  <h3 className="font-heading text-base font-bold text-foreground group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs font-medium text-muted-foreground/80 mt-0.5 mb-2.5">
                    {item.subtitle}
                  </p>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-border/60 flex items-center justify-between text-[11px] font-semibold text-muted-foreground group-hover:text-primary transition-colors">
                  <span>Explore Workflow</span>
                  <ChevronRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
