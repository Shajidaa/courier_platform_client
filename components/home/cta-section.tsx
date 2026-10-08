"use client";

import Link from "next/link";
import { ArrowRight, LayoutDashboard, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { ROLE_HOME, type TRole } from "@/types/roles";

export function CtaSection() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const role = (user?.role ?? "SENDER") as TRole;
  const dashboardUrl = ROLE_HOME[role] ?? "/dashboard/sender";

  return (
    <section className="border-t border-border bg-muted/30 px-6 py-20 text-center relative overflow-hidden">
      <div className="mx-auto max-w-3xl space-y-6">
        <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground">
          {!isLoading && isAuthenticated && user
            ? `Ready to continue, ${user.name}?`
            : "Ready to Streamline Your Deliveries?"}
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
          {!isLoading && isAuthenticated && user
            ? "Access your dashboard to book shipments, manage fleet transfers, monitor live parcels, and track settlements."
            : "Join thousands of senders, couriers, and merchants delivering across the country with CourierPro."}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          {!isLoading && isAuthenticated && user ? (
            <>
              <Button
                size="lg"
                asChild
                className="h-12 px-8 rounded-xl font-semibold shadow-lg shadow-primary/20 gap-2"
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
                className="h-12 px-8 rounded-xl font-semibold gap-2"
              >
                <Link href="/track">
                  <Search className="size-4.5" />
                  <span>Track Parcels</span>
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Button
                size="lg"
                asChild
                className="h-12 px-8 rounded-xl font-semibold shadow-lg shadow-primary/20 gap-2"
              >
                <Link href="/register">
                  <span>Create Free Account</span>
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="h-12 px-8 rounded-xl font-semibold"
              >
                <Link href="/login">Sign In</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
