"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Truck,
  ScanBarcode,
  ShieldCheck,
  Zap,
  Building2,
  Wallet,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Layers,
  MapPin,
  Clock,
  QrCode,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function FeaturesBentoSection() {
  return (
    <section className="py-20 border-t border-border bg-background relative overflow-hidden">
      <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
            <Zap className="size-3.5" />
            <span>Enterprise Feature Matrix</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Engineered for Precision, Speed & Scale
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            From automated optical hub routing to seamless last-mile handovers, every component is built to eliminate friction and maximize delivery reliability.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Bento Card 1: Hub Ingestion & Automation (2 Cols on lg) */}
          <div className="group lg:col-span-2 relative overflow-hidden rounded-3xl border border-border bg-card shadow-sm hover:shadow-xl transition-all duration-300 hover:border-primary/40 flex flex-col justify-between">
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted/80">
              <Image
                src="/images/hub-operations.jpg"
                alt="Automated High-Speed Hub Sorting Operations"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 750px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-black/30 to-transparent" />

              <div className="absolute top-4 left-4 flex items-center gap-2 rounded-xl bg-background/90 px-3 py-1.5 shadow-md backdrop-blur-md border border-white/20">
                <ScanBarcode className="size-4 text-primary" />
                <span className="text-xs font-bold text-foreground">
                  High-Speed Optical Sorting: 99.85% Accuracy
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-indigo-500/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  Regional Distribution Centers
                </span>
                <span className="text-xs text-muted-foreground">• Nationwide Hubs</span>
              </div>
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                Automated Hub Sorting & Smart Inter-Hub Dispatch
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Parcels entering any distribution hub are automatically weighed, measured, and routed to destination vehicle cages. Intelligent batching algorithms optimize transfer vehicle schedules across all 64 districts.
              </p>
            </div>
          </div>

          {/* Bento Card 2: Contactless Doorstep Handover (1 Col) */}
          <div className="group lg:col-span-1 relative overflow-hidden rounded-3xl border border-border bg-card shadow-sm hover:shadow-xl transition-all duration-300 hover:border-primary/40 flex flex-col justify-between">
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted/80">
              <Image
                src="/images/courier-handover.jpg"
                alt="Professional Courier Doorstep Delivery"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 400px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-black/20 to-transparent" />

              <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-xl bg-emerald-500/90 text-white px-3 py-1.5 shadow-md backdrop-blur-md text-xs font-bold">
                <CheckCircle2 className="size-4" />
                <span>OTP Verified</span>
              </div>
            </div>

            <div className="p-6 space-y-2.5">
              <div className="rounded-md bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 inline-block">
                Last-Mile Excellence
              </div>
              <h3 className="font-heading text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                Verified Doorstep Handover
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Contactless delivery confirmation with one-time SMS OTP passwords, digital signatures, and immediate proof of delivery notification to both sender and receiver.
              </p>
            </div>
          </div>

          {/* Bento Card 3: Financial Settlement & bKash / COD */}
          <div className="group rounded-3xl border border-border bg-card p-6 sm:p-7 shadow-sm hover:shadow-xl transition-all duration-300 hover:border-primary/40 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-pink-500/10 text-pink-600 dark:text-pink-400 group-hover:scale-110 transition-transform">
                <Wallet className="size-6" />
              </div>
              <div>
                <span className="rounded-md bg-pink-500/10 px-2.5 py-0.5 text-xs font-semibold text-pink-600 dark:text-pink-400">
                  Instant Reconciliation
                </span>
                <h3 className="font-heading text-lg font-bold text-foreground mt-2 group-hover:text-primary transition-colors">
                  bKash Gateway & Automated COD
                </h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Seamless customer payments via integrated bKash and card gateways. Cash on Delivery is tracked automatically with next-day merchant wallet disbursements and zero settlement delays.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between text-xs font-semibold text-primary">
              <span>Next-Day Payout SLA</span>
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Bento Card 4: Real-time Telemetry & Audit Logs */}
          <div className="group rounded-3xl border border-border bg-card p-6 sm:p-7 shadow-sm hover:shadow-xl transition-all duration-300 hover:border-primary/40 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform">
                <Clock className="size-6" />
              </div>
              <div>
                <span className="rounded-md bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
                  Immutable Ledger
                </span>
                <h3 className="font-heading text-lg font-bold text-foreground mt-2 group-hover:text-primary transition-colors">
                  Real-Time Scan & Telemetry Logs
                </h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Every package interaction generates an immutable event log including timestamp, geographic hub coordinates, staff ID, and route status for 100% auditability.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between text-xs font-semibold text-primary">
              <span>Live Event Stream</span>
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Bento Card 5: Dedicated Stakeholder Cockpits */}
          <div className="group rounded-3xl border border-border bg-card p-6 sm:p-7 shadow-sm hover:shadow-xl transition-all duration-300 hover:border-primary/40 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-500 group-hover:scale-110 transition-transform">
                <Users className="size-6" />
              </div>
              <div>
                <span className="rounded-md bg-purple-500/10 px-2.5 py-0.5 text-xs font-semibold text-purple-600 dark:text-purple-400">
                  Multi-Role Security
                </span>
                <h3 className="font-heading text-lg font-bold text-foreground mt-2 group-hover:text-primary transition-colors">
                  Dedicated Stakeholder Cockpits
                </h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Purpose-built user interfaces with granular RBAC permissions for Senders, Courier Riders, Hub Managers, Operations Directors, and System Administrators.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between text-xs font-semibold text-primary">
              <span>5 Dedicated Dashboards</span>
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
