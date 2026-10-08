"use client";

import { useEffect, useState } from "react";
import {
  MapPin,
  Building2,
  Search,
  Hash,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { areaApi } from "@/api/area.api";
import { hubApi } from "@/api/hub.api";
import type { IArea } from "@/types/area.types";
import type { IHub } from "@/types/hub.types";

export function CoverageSection() {
  const [areas, setAreas] = useState<IArea[]>([]);
  const [hubs, setHubs] = useState<IHub[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      areaApi.getAll({ limit: 50 }),
      hubApi.getAll({ limit: 20 }),
    ])
      .then(([areasRes, hubsRes]) => {
        setAreas(areasRes.data ?? []);
        setHubs(hubsRes.data ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filteredAreas = areas.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.postalCode.includes(search) ||
      a.hub?.hubName?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <section className="py-16 border-t border-border bg-background">
      <div className="mx-auto max-w-5xl px-4">
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-3">
            <MapPin className="size-3.5" />
            <span>Nationwide Coverage</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
            Explore Service Areas & Hubs
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            We deliver to thousands of postal codes through our automated hub distribution network.
          </p>
        </div>

        {/* Search bar */}
        <div className="relative max-w-md mx-auto mb-8">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search postal code or area (e.g. 1205, Gulshan)..."
            className="pl-10 h-11 rounded-xl shadow-xs"
          />
        </div>

        {/* Coverage Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAreas.length > 0 ? (
            filteredAreas.slice(0, 9).map((area) => (
              <div
                key={area.id}
                className="rounded-2xl border border-border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-sm space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground text-sm">
                    {area.name}
                  </span>
                  <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                    📮 {area.postalCode}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Building2 className="size-3.5 shrink-0 text-muted-foreground" />
                  <span>Hub: {area.hub?.hubName ?? "Central Hub"}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-8 text-center text-sm text-muted-foreground">
              {search
                ? `No coverage areas matching "${search}"`
                : "No service areas currently registered."}
            </div>
          )}
        </div>

        {/* Key Highlights */}
        <div className="mt-12 rounded-3xl border border-border bg-muted/40 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-heading font-bold text-foreground text-lg">
              Expanding Rapidly Across All Divisions
            </h4>
            <p className="text-xs text-muted-foreground">
              Doorstep pickup and next-day inter-district delivery available in 64+ districts.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium text-foreground shrink-0">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-emerald-500" />
              <span>Full Insurance</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-emerald-500" />
              <span>OTP Handover</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
