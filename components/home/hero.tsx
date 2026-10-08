"use client";

import Link from "next/link";
import {
  ArrowRight,
  Package,
  Truck,
  ShieldCheck,
  Zap,
  Building2,
  Clock,
  Sparkles,
} from "lucide-react";
import { Button } from "../ui/button";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/15 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="mx-auto max-w-5xl px-6 text-center">
        {/* Status Chip */}
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Next-Generation Intelligent Courier Infrastructure</span>
        </div>

        {/* Hero Title */}
        <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground max-w-4xl mx-auto leading-tight">
          Next-Gen Logistics, <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-primary via-indigo-500 to-purple-600 bg-clip-text text-transparent">
            Automated & Tracked
          </span>{" "}
          Every Mile.
        </h1>

        {/* Hero Subtitle */}
        <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Full real-time visibility from sender booking to doorstep delivery. Intelligent hub-to-hub dispatching, automated courier routing, and instant bKash checkout.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button size="lg" asChild className="h-12 px-7 rounded-xl font-semibold shadow-lg shadow-primary/20 gap-2 text-base">
            <Link href="/register">
              <span>Get Started Free</span>
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild className="h-12 px-7 rounded-xl font-semibold border-border bg-card/60 backdrop-blur text-base">
            <Link href="/login">
              Sign In to Portal
            </Link>
          </Button>
        </div>

        {/* Quick Highlights Bar */}
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4 max-w-3xl mx-auto pt-8 border-t border-border/60">
          <div className="flex flex-col items-center">
            <span className="font-heading text-2xl font-extrabold text-foreground">64+</span>
            <span className="text-xs text-muted-foreground mt-0.5">Districts Covered</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-heading text-2xl font-extrabold text-foreground">&lt; 24h</span>
            <span className="text-xs text-muted-foreground mt-0.5">Express Dispatch</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-heading text-2xl font-extrabold text-foreground">100%</span>
            <span className="text-xs text-muted-foreground mt-0.5">OTP Verified POD</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-heading text-2xl font-extrabold text-foreground">Instant</span>
            <span className="text-xs text-muted-foreground mt-0.5">bKash & COD Pay</span>
          </div>
        </div>
      </div>
    </section>
  );
}
