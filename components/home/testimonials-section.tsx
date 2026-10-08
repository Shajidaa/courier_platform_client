"use client";

import { Star, Quote, CheckCircle2, Building, Store, ShieldCheck } from "lucide-react";

const TESTIMONIALS = [
  {
    quote:
      "Integrating this courier platform cut our nationwide dispatch times by nearly 40%. The automated bKash reconciliation and next-day COD payout keep our cash flow completely healthy.",
    author: "Rafiqul Islam",
    role: "Head of Supply Chain",
    company: "UrbanCloth BD (Top Fashion Retailer)",
    rating: 5,
    metrics: "42,000+ Monthly Parcels",
    avatar: "RI",
  },
  {
    quote:
      "The multi-hub routing and live scan transparency have virtually eliminated lost parcels. Our customers love receiving the SMS OTP tracking links with accurate estimated arrival times.",
    author: "Nusrat Jahan",
    role: "Founder & Operations Director",
    company: "GlamourSkin E-Commerce",
    rating: 5,
    metrics: "99.4% On-Time Delivery Rate",
    avatar: "NJ",
  },
  {
    quote:
      "As a courier rider, the mobile interface is miles ahead of other apps. Navigation is pinpoint accurate, OTP confirmation is fast, and my earnings ledger is updated immediately after each drop.",
    author: "Tanvir Ahmed",
    role: "Senior Courier Specialist",
    company: "Dhaka Central Fleet",
    rating: 5,
    metrics: "1,800+ Completed Deliveries",
    avatar: "TA",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 border-t border-border bg-background relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="size-3.5" />
            <span>Proven Social Proof</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Trusted by Industry Leaders & Fast-Growing Brands
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            See how merchants, hub operators, and courier teams across Bangladesh streamline delivery velocity every single day.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((item, idx) => (
            <div
              key={idx}
              className="group flex flex-col justify-between rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:-translate-y-1 relative"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} className="size-4 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                    {item.metrics}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed italic">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-border/60 flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 font-bold text-xs text-primary shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {item.avatar}
                </div>
                <div className="min-w-0">
                  <h4 className="font-heading text-sm font-bold text-foreground truncate">
                    {item.author}
                  </h4>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {item.role} • {item.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
