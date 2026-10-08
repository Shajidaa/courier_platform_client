"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Store,
  Bike,
  Building2,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PERSONAS = [
  {
    id: "senders",
    label: "For E-Commerce & Senders",
    icon: Store,
    title: "Accelerate Your E-Commerce Delivery Operations",
    subtitle: "Built specifically to maximize customer satisfaction and reduce return rates.",
    highlights: [
      "Instant parcel booking with weight-based automated pricing",
      "Automated customer SMS & WhatsApp tracking updates",
      "Next-day COD disbursement with zero hidden deduction fees",
      "Bulk CSV order imports and shipping label PDF printing",
      "Dedicated merchant analytics & delivery performance tracking",
    ],
    ctaText: "Start Shipping Today",
    ctaLink: "/register",
    metricBadge: "98.4% First-Attempt Delivery Rate",
  },
  {
    id: "riders",
    label: "For Courier Riders",
    icon: Bike,
    title: "Empower Your Delivery Fleet with Smart Tools",
    subtitle: "A frictionless mobile workflow designed for speed, safety, and transparent earnings.",
    highlights: [
      "Optimized doorstep route navigation and delivery batching",
      "Contactless digital OTP verification & proof-of-delivery photos",
      "Instant commission calculation & wallet balance ledger",
      "Real-time parcel status update with single-tap triggers",
      "Vehicle maintenance and fuel expense tracking integration",
    ],
    ctaText: "Join Rider Fleet",
    ctaLink: "/register",
    metricBadge: "Avg 35+ Deliveries / Day per Rider",
  },
  {
    id: "hubs",
    label: "For Hub & Warehouse Managers",
    icon: Building2,
    title: "Full Command Over Distribution Hubs & Fleet",
    subtitle: "Orchestrate high-throughput sorting, vehicle transfers, and warehouse inventory.",
    highlights: [
      "High-speed barcode scanner integration for parcel check-in",
      "Inter-hub transfer manifest batching and vehicle capacity loading",
      "Live hub inventory ledger with automatic discrepancy alerts",
      "Dedicated driver & transport vehicle assignment matrix",
      "Regional coverage analytics with district SLA reporting",
    ],
    ctaText: "Explore Hub Operations",
    ctaLink: "/login",
    metricBadge: "Under 12 Mins Hub Turnaround Time",
  },
  {
    id: "ops",
    label: "For Enterprise Operations",
    icon: ShieldCheck,
    title: "End-to-End Governance & Financial Control",
    subtitle: "Centralized intelligence, fleet tracking, and automated audit logs across the network.",
    highlights: [
      "Real-time nationwide map with live vehicle and parcel positions",
      "Automated bKash & banking gateway reconciliation",
      "Role-Based Access Control (RBAC) across all personnel",
      "Customizable rate sheets, discounts, and priority SLAs",
      "Immutable audit log records for every scan, handover, and edit",
    ],
    ctaText: "Schedule Enterprise Demo",
    ctaLink: "/login",
    metricBadge: "Enterprise ISO 27001 Certified Security",
  },
];

export function PersonaExperienceSection() {
  const [activeTab, setActiveTab] = useState<string>("senders");

  const current = PERSONAS.find((p) => p.id === activeTab) || PERSONAS[0];

  return (
    <section className="py-20 border-t border-border bg-muted/15 relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
            <Sparkles className="size-3.5" />
            <span>Tailored Experience</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Built for Every Stakeholder in Modern Logistics
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Whether you are an online store owner, a last-mile courier rider, or a regional distribution manager, our platform adapts to your workflow.
          </p>
        </div>

        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-8">
          {PERSONAS.map((p) => {
            const Icon = p.icon;
            const isSelected = p.id === activeTab;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setActiveTab(p.id)}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer",
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted/70"
                )}
              >
                <Icon className="size-4" />
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-xl relative overflow-hidden animate-in fade-in duration-300">
          <div className="grid gap-8 lg:grid-cols-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary inline-block">
                  {current.metricBadge}
                </span>
                <h3 className="font-heading text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                  {current.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {current.subtitle}
                </p>
              </div>

              <div className="space-y-3 pt-2">
                {current.highlights.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="flex size-5 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                      <CheckCircle2 className="size-3.5" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-foreground">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Button size="lg" asChild className="rounded-xl font-semibold gap-2 shadow-md shadow-primary/20">
                  <Link href={current.ctaLink}>
                    <span>{current.ctaText}</span>
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="rounded-2xl border border-border/80 bg-muted/40 p-5 space-y-4 shadow-inner">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <span className="size-3 rounded-full bg-red-500/80" />
                    <span className="size-3 rounded-full bg-amber-500/80" />
                    <span className="size-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-[11px] font-mono font-semibold text-muted-foreground">
                    live.logistics.io
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="rounded-xl bg-card border border-border p-3.5 space-y-2 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground">Active Order Stream</span>
                      <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        Live Sync
                      </span>
                    </div>
                    <div className="space-y-1.5 text-[11px] text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Shipment #TR-99021</span>
                        <span className="font-mono font-bold text-primary">In Transit (Dhaka → Sylhet)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipment #TR-99022</span>
                        <span className="font-mono font-bold text-emerald-500">Out for Delivery</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl bg-primary/10 border border-primary/20 p-3.5 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-primary tracking-wider">
                        Next-Day Settlement
                      </span>
                      <p className="font-heading text-lg font-bold text-foreground">৳ 128,450.00</p>
                    </div>
                    <div className="rounded-lg bg-primary text-primary-foreground px-2.5 py-1 text-xs font-semibold">
                      Disbursed ✓
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
