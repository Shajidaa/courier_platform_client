"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Package,
  Search,
  Calculator,
  LayoutDashboard,
  LogOut,
  User,
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  Shield,
  Truck,
  PlusCircle,
  Settings,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";
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

const ROLE_BADGE_STYLES: Record<string, string> = {
  SENDER: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  RIDER: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  HUB_MANAGER: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
  OPS_MANAGER: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  SUPPORT_AGENT: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  ADMIN: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
  SUPER_ADMIN: "bg-primary/10 text-primary border-primary/20",
};

export default function Nav() {
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  // Click outside listener for user dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const role = user?.role ?? "SENDER";
  const dashboardUrl = ROLE_HOME[role as TRole] ?? "/dashboard/sender";
  const roleLabel = ROLE_LABELS[role] ?? role;
  const roleBadgeStyle = ROLE_BADGE_STYLES[role] ?? "bg-primary/10 text-primary border-primary/20";

  const userInitials = user?.name
    ? user.name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase()
    : "U";

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Track Parcel", href: "/track", icon: Search },
    { label: "Rate Estimator", href: "/calculator", icon: Calculator },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/85 backdrop-blur-md transition-all">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">

        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="group flex items-center gap-2.5 transition-transform">
            <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-primary/90 to-indigo-600 text-primary-foreground shadow-sm shadow-primary/20 ring-1 ring-white/15 transition-all duration-200 group-hover:scale-105 group-hover:shadow-md group-hover:shadow-primary/30">
              <Package className="size-4.5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-heading text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                  CourierPro
                </span>

              </div>
            </div>
          </Link>


        </div>
        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex flex-1 items-center justify-center gap-1 text-sm font-medium pl-2">
          {navLinks.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all duration-150",
                  isActive
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                )}
              >
                {Icon && <Icon className="size-3.5 shrink-0" />}
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
        {/* Right Section / Auth Controls */}
        <div className="flex items-center gap-2.5">
          <ThemeToggle />

          {/* Hydration / Loading state */}
          {isLoading ? (
            <div className="hidden sm:flex items-center gap-2">
              <div className="h-9 w-20 rounded-lg bg-muted/60 animate-pulse" />
              <div className="h-9 w-24 rounded-lg bg-muted/80 animate-pulse" />
            </div>
          ) : isAuthenticated && user ? (
            /* Logged in state: Show Dashboard & Logout buttons + User Dropdown */
            <div className="flex items-center gap-2">
              {/* Primary Dashboard Button */}
              <Button
                asChild
                size="sm"
                className="hidden lg:flex  sm:inline-flex rounded-lg font-semibold shadow-sm shadow-primary/20 gap-1.5"
              >
                <Link href={dashboardUrl}>
                  <LayoutDashboard className="size-4" />
                  <span>Dashboard</span>
                </Link>
              </Button>



              {/* User Profile Dropdown Pill */}
              <div className="relative " ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                  className={cn(
                    "flex items-center gap-2 rounded-full border border-border/80 bg-card/80 py-1 pl-1.5 pr-2.5 text-left transition-all hover:border-primary/40 hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20",
                    userMenuOpen && "border-primary ring-2 ring-primary/20"
                  )}
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                >
                  <div className="flex size-7 items-center justify-center rounded-full bg-gradient-to-br from-primary/80 to-indigo-600 text-xs font-bold text-white shadow-xs">
                    {userInitials}
                  </div>
                  <div className="hidden lg:flex flex-col text-left text-xs leading-tight">
                    <span className="font-semibold text-foreground max-w-[110px] truncate">
                      {user.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground capitalize">
                      {roleLabel}
                    </span>
                  </div>
                  <ChevronDown
                    className={cn(
                      "size-3.5 text-muted-foreground transition-transform duration-200",
                      userMenuOpen && "rotate-180 text-foreground"
                    )}
                  />
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 origin-top-right rounded-xl border border-border bg-card p-2 shadow-xl backdrop-blur-md z-50 animate-in fade-in-0 zoom-in-95 duration-150">
                    {/* User Info Header */}
                    <div className="border-b border-border/60 px-3 py-2.5">
                      <p className="font-semibold text-sm text-foreground truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      <div className="mt-2">
                        <span
                          className={cn(
                            "inline-block rounded-md px-2 py-0.5 text-[11px] font-medium border",
                            roleBadgeStyle
                          )}
                        >
                          {roleLabel}
                        </span>
                      </div>
                    </div>

                    {/* Menu Links */}
                    <div className="py-1 space-y-0.5">
                      <Link
                        href={dashboardUrl}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        <LayoutDashboard className="size-4 text-primary" />
                        <span>Go to Dashboard</span>
                      </Link>

                      {role === "SENDER" && (
                        <Link
                          href="/dashboard/sender/book"
                          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                        >
                          <PlusCircle className="size-4" />
                          <span>Book New Shipment</span>
                        </Link>
                      )}

                      {role === "RIDER" && (
                        <Link
                          href="/dashboard/rider/deliveries"
                          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                        >
                          <Truck className="size-4" />
                          <span>My Deliveries</span>
                        </Link>
                      )}

                      <Link
                        href="/dashboard/profile"
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                      >
                        <Settings className="size-4" />
                        <span>Account & Profile</span>
                      </Link>
                    </div>

                    {/* Logout Button */}
                    <div className="border-t border-border/60 pt-1 mt-1">
                      <button
                        type="button"
                        onClick={logout}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <LogOut className="size-4 shrink-0" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Unauthenticated state: Show Sign In & Get Started buttons */
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="hidden sm:inline-flex rounded-lg font-medium text-muted-foreground hover:text-foreground hover:bg-muted/70"
              >
                <Link href="/login">Sign in</Link>
              </Button>
              <Button
                size="sm"
                asChild
                className="hidden md:inline-flex rounded-lg font-semibold shadow-sm shadow-primary/20 gap-1.5"
              >
                <Link href="/register">
                  <span>Get Started</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="flex size-9 items-center justify-center rounded-lg border border-border/60 text-muted-foreground hover:bg-muted hover:text-foreground md:hidden transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer / Dropdown */}
      {mobileMenuOpen && (
        <div className="border-b border-border bg-background/95 backdrop-blur-xl px-4 py-4 md:hidden animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-3">
            {/* User header on mobile if logged in */}
            {isAuthenticated && user && (
              <div className="rounded-xl border border-border bg-card/60 p-3 mb-2">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm shadow-sm">
                    {userInitials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-foreground truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <span
                    className={cn(
                      "rounded-md px-2 py-0.5 text-[10px] font-semibold border shrink-0",
                      roleBadgeStyle
                    )}
                  >
                    {roleLabel}
                  </span>
                </div>
              </div>
            )}

            {/* Navigation links */}
            <div className="space-y-1">
              {navLinks.map(({ label, href, icon: Icon }) => {
                const isActive = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {Icon && <Icon className="size-4 shrink-0" />}
                    <span>{label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="border-t border-border/60 pt-3">
              {isAuthenticated && user ? (
                <div className="space-y-2">
                  <Button asChild className="w-full justify-center gap-2 rounded-xl font-semibold shadow-md">
                    <Link href={dashboardUrl}>
                      <LayoutDashboard className="size-4" />
                      <span>Open Dashboard</span>
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    asChild
                    className="w-full justify-center gap-2 rounded-xl font-medium"
                  >
                    <Link href="/dashboard/profile">
                      <Settings className="size-4" />
                      <span>Account Settings</span>
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={logout}
                    className="w-full justify-center gap-2 rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive font-medium"
                  >
                    <LogOut className="size-4" />
                    <span>Sign out</span>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" asChild className="w-full rounded-xl font-medium">
                    <Link href="/login">Sign in</Link>
                  </Button>
                  <Button asChild className="w-full rounded-xl font-semibold shadow-sm">
                    <Link href="/register">Get Started</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
