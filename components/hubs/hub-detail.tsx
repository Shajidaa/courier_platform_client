"use client"

import Link from "next/link"
import { ArrowLeft, Building2, MapPin, Package, Users, Tag } from "lucide-react"
import { useHub } from "@/hooks/use-hubs"
import { Loader2 } from "lucide-react"

function InfoRow({ label, value }: { label: string; value?: string | null }) {
    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground">{label}</span>
            <span className="text-sm font-medium text-foreground">{value || "—"}</span>
        </div>
    )
}

export function HubDetail({ id }: { id: string }) {
    const { hub, isLoading, error } = useHub(id)

    if (isLoading) {
        return (
            <div className="flex min-h-[40vh] items-center justify-center">
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (error || !hub) {
        return (
            <div className="rounded-xl border border-destructive/30 bg-destructive/8 px-4 py-3 text-sm text-destructive">
                {error ?? "Hub not found."}
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6">
            {/* Back */}
            <Link
                href="/dashboard/admin/hubs"
                className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
                <ArrowLeft className="size-4" /> Back to hubs
            </Link>

            {/* Header */}
            <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-6">
                <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
                    <Building2 className="size-6 text-primary" />
                </div>
                <div>
                    <h1 className="font-heading text-xl font-semibold text-foreground">{hub.hubName}</h1>
                    <p className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="size-3.5" /> {hub.address}
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {[
                    { label: "Areas", value: hub._count.areas, icon: MapPin },
                    { label: "Active shipments", value: hub._count.currentShipments, icon: Package },
                    { label: "Manager", value: hub.manager ? 1 : 0, icon: Users },
                ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">{label}</span>
                            <Icon className="size-4 text-primary" />
                        </div>
                        <span className="font-heading text-2xl font-semibold text-foreground">{value}</span>
                    </div>
                ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                {/* Manager */}
                <div className="rounded-xl border border-border bg-card p-5">
                    <h2 className="mb-4 font-heading font-semibold text-foreground">Manager</h2>
                    {hub.manager ? (
                        <div className="flex flex-col gap-3">
                            <InfoRow label="Name" value={hub.manager.name} />
                            <InfoRow label="Email" value={hub.manager.email} />
                            <InfoRow label="Role" value={hub.manager.role} />
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground italic">No manager assigned.</p>
                    )}
                </div>

                {/* Areas */}
                <div className="rounded-xl border border-border bg-card p-5">
                    <h2 className="mb-4 font-heading font-semibold text-foreground">
                        Coverage Areas
                        <span className="ml-2 text-sm font-normal text-muted-foreground">({hub.areas.length})</span>
                    </h2>
                    {hub.areas.length > 0 ? (
                        <ul className="flex flex-col gap-2">
                            {hub.areas.map(area => (
                                <li key={area.id} className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2">
                                    <span className="flex items-center gap-2 text-sm text-foreground">
                                        <MapPin className="size-3.5 text-muted-foreground" />
                                        {area.name}
                                    </span>
                                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <Tag className="size-3" /> {area.postalCode}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-muted-foreground italic">No coverage areas yet.</p>
                    )}
                </div>
            </div>

            {/* Metadata */}
            <div className="rounded-xl border border-border bg-card p-5">
                <h2 className="mb-4 font-heading font-semibold text-foreground">Details</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                    <InfoRow label="Hub ID" value={hub.id} />
                    <InfoRow label="Created" value={new Date(hub.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} />
                    <InfoRow label="Last updated" value={new Date(hub.updatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} />
                </div>
            </div>
        </div>
    )
}
