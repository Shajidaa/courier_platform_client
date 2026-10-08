import Link from "next/link";
import { Package, Search, Calculator, MapPin, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Package className="size-4.5" />
          </div>
          <span className="font-heading text-lg font-bold text-foreground tracking-tight">
            CourierPro
          </span>
        </Link>

        {/* Public Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link
            href="/"
            className="transition hover:text-foreground"
          >
            Home
          </Link>
          <Link
            href="/track"
            className="flex items-center gap-1.5 transition hover:text-foreground"
          >
            <Search className="size-3.5" />
            <span>Track Parcel</span>
          </Link>
          <Link
            href="/calculator"
            className="flex items-center gap-1.5 transition hover:text-foreground"
          >
            <Calculator className="size-3.5" />
            <span>Rate Estimator</span>
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
            <Link href="/login">Sign in</Link>
          </Button>
          <Button size="sm" asChild className="rounded-lg shadow-sm font-semibold">
            <Link href="/register">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
