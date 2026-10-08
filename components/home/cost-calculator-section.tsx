"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calculator,
  Scale,
  Zap,
  Clock,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { TDeliveryType, TShipmentCategory } from "@/types/shipment.types";

const DELIVERY_TIERS: {
  id: TDeliveryType;
  name: string;
  desc: string;
  time: string;
  multiplier: number;
}[] = [
  {
    id: "STANDARD",
    name: "Standard",
    desc: "Ground nationwide shipping",
    time: "3–5 Days",
    multiplier: 1.0,
  },
  {
    id: "EXPRESS",
    name: "Express",
    desc: "Fast tracked courier",
    time: "2 Days",
    multiplier: 1.5,
  },
  {
    id: "NEXT_DAY",
    name: "Next Day",
    desc: "Overnight guaranteed delivery",
    time: "Next Day",
    multiplier: 1.75,
  },
  {
    id: "SAME_DAY",
    name: "Same Day",
    desc: "Immediate point-to-point courier",
    time: "Within 6-12 Hrs",
    multiplier: 2.0,
  },
];

export function CostCalculatorSection() {
  const [weight, setWeight] = useState<number>(2);
  const [selectedTier, setSelectedTier] = useState<TDeliveryType>("STANDARD");
  const [isCod, setIsCod] = useState(false);
  const [codAmount, setCodAmount] = useState<number>(1000);

  const calculateCost = (w: number, mult: number) => {
    const BASE_RATE = 60; // BDT per KG
    const MINIMUM_CHARGE = 60;
    const raw = Math.max(w * BASE_RATE, MINIMUM_CHARGE);
    return Math.round(raw * mult);
  };

  const currentTier =
    DELIVERY_TIERS.find((t) => t.id === selectedTier) || DELIVERY_TIERS[0];
  const deliveryCharge = calculateCost(weight, currentTier.multiplier);
  const totalCost = deliveryCharge;

  return (
    <section className="py-16 border-t border-border bg-muted/20">
      <div className="mx-auto max-w-5xl px-4">
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-3">
            <Calculator className="size-3.5" />
            <span>Instant Rate Estimator</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
            Calculate Delivery Charges
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Transparent pricing with zero hidden fees. Adjust package weight and speed to preview shipping costs.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xl">
          {/* Controls (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Weight Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Scale className="size-4 text-primary" />
                  <span>Package Weight</span>
                </label>
                <span className="font-mono text-base font-bold text-primary bg-primary/10 px-3 py-1 rounded-lg">
                  {weight} kg
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="25"
                step="0.5"
                value={weight}
                onChange={(e) => setWeight(parseFloat(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[11px] text-muted-foreground">
                <span>0.5 kg (Document)</span>
                <span>10 kg (Medium Box)</span>
                <span>25 kg (Heavy Cargo)</span>
              </div>
            </div>

            {/* Delivery Tiers */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Zap className="size-4 text-primary" />
                <span>Select Delivery Speed</span>
              </label>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {DELIVERY_TIERS.map((tier) => {
                  const cost = calculateCost(weight, tier.multiplier);
                  const isSelected = selectedTier === tier.id;
                  return (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setSelectedTier(tier.id)}
                      className={`flex flex-col justify-between rounded-xl border p-3.5 text-left transition-all ${
                        isSelected
                          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                          : "border-border bg-card hover:bg-muted/40"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-semibold text-sm text-foreground">
                          {tier.name}
                        </span>
                        <span className="font-mono text-xs font-bold text-primary">
                          ৳{cost}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{tier.desc}</p>
                      <div className="mt-2 text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                        <Clock className="size-3" />
                        <span>{tier.time}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Pricing Card (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-border bg-muted/40 p-6 space-y-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Price Breakdown
              </span>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Base Weight ({weight} kg)</span>
                  <span className="font-medium text-foreground">
                    ৳{Math.max(weight * 60, 60)}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Speed Tier ({currentTier.name})</span>
                  <span className="font-medium text-foreground">
                    {currentTier.multiplier}x Rate
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Estimated Delivery Time</span>
                  <span className="font-medium text-foreground">{currentTier.time}</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between text-base font-bold text-foreground">
                  <span>Total Delivery Fee</span>
                  <span className="text-2xl font-extrabold text-primary">
                    ৳{totalCost}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-xl bg-background/80 border border-border p-3 text-xs text-muted-foreground flex items-center gap-2">
                <ShieldCheck className="size-4 text-emerald-500 shrink-0" />
                <span>Full package tracking and SMS notifications included.</span>
              </div>

              <Button asChild size="lg" className="w-full font-semibold shadow-md gap-2">
                <Link href="/login">
                  <span>Book This Delivery Now</span>
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
