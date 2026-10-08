"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Package,
  Truck,
  ShieldCheck,
  Zap,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  CheckCircle2,
  Globe,
  Radio,
  CreditCard,
  Building2,
  ExternalLink,
  Send,
  Sparkles,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="border-t border-border bg-card/60 backdrop-blur-md relative overflow-hidden text-sm">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/4 w-[450px] h-[250px] bg-primary/10 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-10 w-[300px] h-[200px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      {/* ── Top Newsletter & Merchant Alert Bar ── */}
      <div className="border-b border-border/70 py-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="text-center lg:text-left space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
              <Sparkles className="size-3" />
              <span>Logistics Intelligence Weekly</span>
            </div>
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-foreground tracking-tight">
              Stay Updated with Real-Time Logistics Insights
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Get the latest updates on nationwide route openings, discount tiers, API webhooks, and e-commerce supply chain best practices.
            </p>
          </div>

          {/* Newsletter Form */}
          <div className="w-full lg:w-auto max-w-md">
            {subscribed ? (
              <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="size-4 shrink-0" />
                <span>Thank you for subscribing! You are now on the priority dispatch newsletter.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your work email..."
                    className="pl-9 h-11 text-xs rounded-xl bg-background shadow-xs border-border"
                  />
                </div>
                <Button type="submit" size="sm" className="h-11 px-5 rounded-xl font-semibold gap-1.5 shadow-sm shrink-0">
                  <span>Subscribe</span>
                  <Send className="size-3.5" />
                </Button>
              </form>
            )}
            <p className="text-[11px] text-muted-foreground/80 mt-2 text-center lg:text-left">
              Zero spam. Unsubscribe anytime with a single click.
            </p>
          </div>
        </div>
      </div>

      {/* ── Main Multi-Column Footer Grid ── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12">
          {/* Col 1: Brand & Contact Info (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-indigo-600 text-primary-foreground shadow-md shadow-primary/20 transition-transform group-hover:scale-105">
                <Package className="size-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-lg font-bold tracking-tight text-foreground">
                  Courier<span className="text-primary">Pro</span>
                </span>
                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider -mt-1">
                  Smart Logistics OS
                </span>
              </div>
            </Link>

            <p className="text-xs text-muted-foreground leading-relaxed">
              The intelligent parcel logistics and multi-hub dispatch platform powering next-day deliveries, OTP-verified handovers, and automated merchant settlements across 64 districts in Bangladesh.
            </p>

            {/* Live Status Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All Systems Operational • 99.98% SLA</span>
            </div>

            {/* Contact Details */}
            <div className="space-y-2 pt-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Phone className="size-3.5 text-primary shrink-0" />
                <span className="font-medium text-foreground">+880 1700-000000</span>
                <span className="text-[10px] text-muted-foreground">(24/7 Dispatch Hotline)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="size-3.5 text-primary shrink-0" />
                <span>support@courierpro.io</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="size-3.5 text-primary shrink-0 mt-0.5" />
                <span>Central Logistics Terminal, Plot 42, Gulshan Avenue, Dhaka-1212</span>
              </div>
            </div>
          </div>

          {/* Col 2: Solutions & Tools (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-foreground">
              Solutions & Tools
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/track" className="transition hover:text-primary flex items-center gap-1.5">
                  <Search className="size-3 text-muted-foreground" />
                  <span>Live Parcel Tracking</span>
                </Link>
              </li>
              <li>
                <Link href="/calculator" className="transition hover:text-primary flex items-center gap-1.5">
                  <Zap className="size-3 text-muted-foreground" />
                  <span>Rate & Weight Calculator</span>
                </Link>
              </li>
              <li>
                <Link href="/#coverage" className="transition hover:text-primary flex items-center gap-1.5">
                  <MapPin className="size-3 text-muted-foreground" />
                  <span>Nationwide Hub Coverage</span>
                </Link>
              </li>
              <li>
                <Link href="/register" className="transition hover:text-primary flex items-center gap-1.5">
                  <Truck className="size-3 text-muted-foreground" />
                  <span>Merchant E-Commerce Shipping</span>
                </Link>
              </li>
              <li>
                <Link href="/register" className="transition hover:text-primary flex items-center gap-1.5">
                  <CreditCard className="size-3 text-muted-foreground" />
                  <span>bKash & COD Next-Day Payout</span>
                </Link>
              </li>
              <li>
                <Link href="/track" className="transition hover:text-primary flex items-center gap-1.5">
                  <ShieldCheck className="size-3 text-muted-foreground" />
                  <span>OTP Verified Proof of Delivery</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Stakeholder Dashboards (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-foreground">
              Stakeholder Portals
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/dashboard/sender" className="transition hover:text-primary flex items-center justify-between">
                  <span>Merchant & Sender Portal</span>
                  <span className="text-[10px] rounded bg-muted px-1.5 py-0.5">Live</span>
                </Link>
              </li>
              <li>
                <Link href="/dashboard/rider" className="transition hover:text-primary flex items-center justify-between">
                  <span>Courier & Rider Cockpit</span>
                  <span className="text-[10px] rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold px-1.5 py-0.5">Mobile</span>
                </Link>
              </li>
              <li>
                <Link href="/dashboard/hub-manager" className="transition hover:text-primary flex items-center justify-between">
                  <span>Hub & Sorting Operations</span>
                  <span className="text-[10px] rounded bg-muted px-1.5 py-0.5">Operations</span>
                </Link>
              </li>
              <li>
                <Link href="/dashboard/ops-manager" className="transition hover:text-primary flex items-center justify-between">
                  <span>Fleet & Transit Logistics</span>
                  <span className="text-[10px] rounded bg-muted px-1.5 py-0.5">Fleet</span>
                </Link>
              </li>
              <li>
                <Link href="/dashboard/admin" className="transition hover:text-primary flex items-center justify-between">
                  <span>Enterprise Administration</span>
                  <span className="text-[10px] rounded bg-primary/10 text-primary font-semibold px-1.5 py-0.5">RBAC</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Compliance (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-foreground">
              Security & Trust
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex items-center gap-1.5 text-foreground font-medium">
                <ShieldCheck className="size-3.5 text-emerald-500" />
                <span>ISO 27001 Certified</span>
              </li>
              <li className="flex items-center gap-1.5 text-foreground font-medium">
                <CreditCard className="size-3.5 text-primary" />
                <span>256-Bit SSL Escrow</span>
              </li>
              <li className="flex items-center gap-1.5 text-foreground font-medium">
                <CheckCircle2 className="size-3.5 text-indigo-500" />
                <span>Zero Deductions</span>
              </li>
              <li className="flex items-center gap-1.5 text-foreground font-medium">
                <Radio className="size-3.5 text-amber-500" />
                <span>Real-Time Audit Trail</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Payment Partners & Compliance Strip ── */}
      <div className="border-t border-border/60 bg-muted/20 py-5 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-semibold text-foreground">Supported Gateways & Settlement:</span>
            <div className="flex items-center gap-3">
              <span className="rounded-md bg-pink-500/10 px-2 py-0.5 text-[11px] font-bold text-pink-600">bKash Merchant</span>
              <span className="rounded-md bg-orange-500/10 px-2 py-0.5 text-[11px] font-bold text-orange-600">Nagad Direct</span>
              <span className="rounded-md bg-blue-500/10 px-2 py-0.5 text-[11px] font-bold text-blue-600">SSLCommerz</span>
              <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-bold text-emerald-600">Automated COD</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="hover:text-foreground cursor-pointer transition">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-foreground cursor-pointer transition">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-foreground cursor-pointer transition">Merchant Agreement</span>
          </div>
        </div>
      </div>

      {/* ── Bottom Copyright & Social Bar ── */}
      <div className="border-t border-border/80 bg-background/80 py-5 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} <strong className="text-foreground font-semibold">CourierPro Technologies Ltd.</strong> All rights reserved. Nationwide Parcel & Fleet Infrastructure.
          </p>

          <div className="flex items-center gap-2.5">
            {/* GitHub SVG */}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="flex size-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition hover:border-primary hover:text-primary"
            >
              <svg className="size-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>

            {/* LinkedIn SVG */}
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="flex size-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition hover:border-primary hover:text-primary"
            >
              <svg className="size-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>

            {/* Twitter / X SVG */}
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="flex size-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition hover:border-primary hover:text-primary"
            >
              <svg className="size-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            {/* Facebook SVG */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="flex size-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition hover:border-primary hover:text-primary"
            >
              <svg className="size-4 fill-current" viewBox="0 0 24 24">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
