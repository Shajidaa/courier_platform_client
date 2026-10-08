"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Package,
  Truck,
  ShieldCheck,
  Zap,
  Building2,
  Clock,
  Sparkles,
  LayoutDashboard,
  Search,
  CheckCircle2,
  Navigation,
  Radio,
  CreditCard,
  Layers,
  MapPin,
  Barcode,
  Check,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { ROLE_HOME, type TRole } from "@/types/roles";

const ROLE_LABELS: Record<string, string> = {
  SENDER: "Sender",
  RIDER: "Rider",
  HUB_MANAGER: "Hub Manager",
  OPS_MANAGER: "Ops Manager",
  SUPPORT_AGENT: "Support Agent",
  ADMIN: "Admin",
  SUPER_ADMIN: "Super Admin",
};

export default function HeroSection() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [quickTracking, setQuickTracking] = useState("");

  const role = (user?.role ?? "SENDER") as TRole;
  const dashboardUrl = ROLE_HOME[role] ?? "/dashboard/sender";
  const roleLabel = ROLE_LABELS[role] ?? role;

  const handleQuickTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickTracking.trim()) {
      router.push(`/track?code=${encodeURIComponent(quickTracking.trim())}`);
    } else {
      router.push("/track");
    }
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-border/50">
      {/* Background ambient lighting */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-primary/20 via-indigo-500/15 to-purple-500/10 blur-[140px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-40 right-10 w-[350px] h-[350px] bg-emerald-500/10 blur-[110px] rounded-full pointer-events-none -z-10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left Column: Value Prop & Interactive Quick Action */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Status Pill Badge */}
            {!isLoading && isAuthenticated && user ? (
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary shadow-xs">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Welcome back, {user.name} ({roleLabel})</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary shadow-xs">
                <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Live across 64 Districts • Real-Time GPS Telemetry</span>
              </div>
            )}

            {/* Main Headline */}
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-5xl/tight font-extrabold tracking-tight text-foreground">
              Intelligent Courier & Logistics,{" "}
              <span className="bg-gradient-to-r from-primary via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                Automated
              </span>{" "}
              Every Single Mile.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl">
              From sender doorstep to recipient handover: multi-hub optical sorting, automated courier routing, and instant bKash & COD settlements.
            </p>

            {/* Quick Track Input Bar */}
            <form
              onSubmit={handleQuickTrack}
              className="flex items-center gap-2 rounded-2xl border border-border bg-card/80 p-2 shadow-lg backdrop-blur-md max-w-lg transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
            >
              <div className="flex items-center gap-2 pl-3 flex-1 text-muted-foreground">
                <Barcode className="size-5 text-primary shrink-0" />
                <Input
                  value={quickTracking}
                  onChange={(e) => setQuickTracking(e.target.value)}
                  placeholder="Enter Tracking # (e.g. TRK-884920)..."
                  className="border-0 bg-transparent p-0 text-xs sm:text-sm focus-visible:ring-0 shadow-none h-9 text-foreground placeholder:text-muted-foreground/70"
                />
              </div>
              <Button
                type="submit"
                size="sm"
                className="rounded-xl px-5 h-10 font-semibold gap-1.5 shadow-md shadow-primary/20"
              >
                <Search className="size-4" />
                <span>Track</span>
              </Button>
            </form>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              {!isLoading && isAuthenticated && user ? (
                <>
                  <Button
                    size="lg"
                    asChild
                    className="h-12 px-7 rounded-xl font-semibold shadow-lg shadow-primary/25 gap-2 text-sm transition-all hover:scale-[1.02]"
                  >
                    <Link href={dashboardUrl}>
                      <LayoutDashboard className="size-4.5" />
                      <span>Go to Dashboard</span>
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    asChild
                    className="h-12 px-7 rounded-xl font-semibold border-border bg-card/60 backdrop-blur text-sm gap-2 hover:bg-muted"
                  >
                    <Link href="/calculator">
                      <Zap className="size-4 text-primary" />
                      <span>Calculate Rates</span>
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    size="lg"
                    asChild
                    className="h-12 px-7 rounded-xl font-semibold shadow-lg shadow-primary/25 gap-2 text-sm transition-all hover:scale-[1.02]"
                  >
                    <Link href="/register">
                      <span>Get Started Free</span>
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    asChild
                    className="h-12 px-7 rounded-xl font-semibold border-border bg-card/60 backdrop-blur text-sm gap-2 hover:bg-muted"
                  >
                    <Link href="/login">
                      <span>Sign In to Portal</span>
                    </Link>
                  </Button>
                </>
              )}
            </div>

            {/* Micro Feature Bullet Pills */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-2 text-xs font-semibold text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Check className="size-3.5 text-emerald-500" />
                <span>Instant bKash & COD</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="size-3.5 text-primary" />
                <span>99.8% On-Time SLA</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="size-3.5 text-indigo-500" />
                <span>OTP Verified Handover</span>
              </div>
            </div>
          </div>

          {/* Right Column: High-Tech Logistics Dashboard Showcase */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl border border-border/80 bg-card/40 p-2 sm:p-3 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:border-primary/40">
              {/* Image Frame */}
              <div className="relative aspect-[16/10] sm:aspect-[16/11] w-full overflow-hidden rounded-2xl bg-muted/80">
                <Image
                  src="/images/hero-fleet.jpg"
                  alt="Next-Gen Intelligent Courier Logistics Network"
                  fill
                  priority
                  className="object-cover transition-transform duration-700 hover:scale-[1.02]"
                  sizes="(max-width: 1024px) 100vw, 600px"
                />

                {/* Subtle dark gradient scrims */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/30 pointer-events-none" />

                {/* Floating Overlay 1: Live Transit Route (Top Right) */}
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-2.5 rounded-2xl border border-white/20 bg-background/90 p-2.5 sm:p-3 shadow-xl backdrop-blur-md text-left max-w-[240px]">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-primary/15 text-primary shrink-0">
                    <Radio className="size-4.5 animate-pulse" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        In Transit
                      </span>
                    </div>
                    <p className="text-xs font-bold text-foreground truncate mt-0.5">
                      Dhaka → Chittagong
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Batch #TR-4092 • 45m ETA
                    </p>
                  </div>
                </div>

                {/* Floating Overlay 2: Rider Handover & OTP (Bottom Left) */}
                <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 flex items-center gap-3 rounded-2xl border border-white/20 bg-background/90 p-2.5 sm:p-3 shadow-xl backdrop-blur-md text-left max-w-[260px]">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shrink-0">
                    <CheckCircle2 className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                        OTP Confirmed ✓
                      </span>
                    </div>
                    <p className="text-xs font-bold text-foreground truncate mt-0.5">
                      Handover #CP-884920
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Assigned: Tanvir A. (Van #04)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Performance Stats Strip */}
        <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-4 pt-8 border-t border-border/60">
          <div className="flex flex-col items-center p-4 rounded-2xl bg-card/40 border border-border/60 text-center">
            <span className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              64
            </span>
            <span className="text-xs font-medium text-muted-foreground mt-1">
              Districts Covered Nationwide
            </span>
          </div>

          <div className="flex flex-col items-center p-4 rounded-2xl bg-card/40 border border-border/60 text-center">
            <span className="font-heading text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
              &lt; 24h
            </span>
            <span className="text-xs font-medium text-muted-foreground mt-1">
              Express City Dispatch
            </span>
          </div>

          <div className="flex flex-col items-center p-4 rounded-2xl bg-card/40 border border-border/60 text-center">
            <span className="font-heading text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
              99.8%
            </span>
            <span className="text-xs font-medium text-muted-foreground mt-1">
              On-Time SLA Reliability
            </span>
          </div>

          <div className="flex flex-col items-center p-4 rounded-2xl bg-card/40 border border-border/60 text-center">
            <span className="font-heading text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 tracking-tight">
              Instant
            </span>
            <span className="text-xs font-medium text-muted-foreground mt-1">
              bKash & COD Settlement
            </span>
          </div>
        </div>

        {/* Trust Partners Cloud */}
        <div className="mt-10 text-center space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/70">
            Trusted by E-Commerce Merchants & Supply Chain Networks Nationwide
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-muted-foreground/80">
            <div className="flex items-center gap-1.5 font-bold text-sm text-foreground">
              <span className="rounded-lg bg-pink-500/10 px-2 py-0.5 text-pink-600 font-extrabold text-xs">bKash</span>
              <span>Merchant Pay</span>
            </div>
            <div className="flex items-center gap-1.5 font-bold text-sm text-foreground">
              <span className="rounded-lg bg-orange-500/10 px-2 py-0.5 text-orange-600 font-extrabold text-xs">Nagad</span>
              <span>Direct Gateway</span>
            </div>
            <div className="flex items-center gap-1.5 font-bold text-sm text-foreground">
              <CreditCard className="size-4 text-primary" />
              <span>SSLCommerz Secured</span>
            </div>
            <div className="flex items-center gap-1.5 font-bold text-sm text-foreground">
              <ShieldCheck className="size-4 text-emerald-500" />
              <span>ISO 27001 Certified</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
