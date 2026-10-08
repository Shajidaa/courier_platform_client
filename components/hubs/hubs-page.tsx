"use client"

import { useState } from "react"
import Link from "next/link"
import {
    Building2, MapPin, Package, Plus, Search,
    Pencil, Trash2, UserCog, ChevronLeft, ChevronRight,
    Loader2, Users,
} from "lucide-react"
import { useHubs } from "@/hooks/use-hubs"
import { HubForm } from "@/components/hubs/hub-form"
import { AssignManagerForm } from "@/components/hubs/assign-manager-form"
import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { IHub } from "@/types/hub.types"

// ── Permission helper — admins can write, others read-only ────────────────────
const WRITE_ROLES = ["ADMIN", "SUPER_ADMIN"]

interface HubsPageProps {
    userRole: string
}

export function HubsPage({ userRole }: HubsPageProps) {
    const canWrite = WRITE_ROLES.includes(userRole)
    const { hubs, meta, isLoading, error, query, search, goToPage, createHub, updateHub, assignManager, deleteHub } = useHubs()

    // Modal state
    const [createOpen, setCreateOpen] = useState(false)
    const [editHub, setEditHub] = useState<IHub | null>(null)
    const [assignHub, setAssignHub] = useState<IHub | null>(null)
    const [deleteTarget, setDeleteTarget] = useState<IHub | null>(null)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [deleteError, setDeleteError] = useState<string | null>(null)
    const [searchValue, setSearchValue] = useState(query.search ?? "")

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        search(searchValue)
    }

    const handleDelete = async () => {
        if (!deleteTarget) return
        setDeleteLoading(true); setDeleteError(null)
        try {
            await deleteHub(deleteTarget.id)
            setDeleteTarget(null)
        } catch (err) {
            setDeleteError(err instanceof Error ? err.message : "Delete failed.")
        } finally {
            setDeleteLoading(false)
        }
    }

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="font-heading text-2xl font-semibold text-foreground">Hubs</h1>
                    <p className="text-sm text-muted-foreground">
                        {meta ? `${meta.total} hub${meta.total !== 1 ? "s" : ""} total` : "Manage distribution hubs"}
                    </p>
                </div>
                {canWrite && (
                    <Button onClick={() => setCreateOpen(true)}>
                        <Plus className="size-4" /> New hub
                    </Button>
                )}
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="search"
                        placeholder="Search by name or address…"
                        value={searchValue}
                        onChange={e => setSearchValue(e.target.value)}
                        className={cn(
                            "h-11 w-full rounded-xl border border-input bg-background pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground",
                            "outline-none transition-all focus:border-primary focus:ring-3 focus:ring-primary/15",
                        )}
                    />
                </div>
                <Button type="submit" variant="outline">Search</Button>
            </form>

            {/* Error */}
            {error && (
                <div role="alert" className="rounded-xl border border-destructive/30 bg-destructive/8 px-4 py-3 text-sm text-destructive">
                    {error}
                </div>
            )}

            {/* Loading */}
            {isLoading && (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="size-6 animate-spin text-muted-foreground" />
                </div>
            )}

            {/* Empty */}
            {!isLoading && !error && hubs.length === 0 && (
                <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
                    <Building2 className="size-10 text-muted-foreground/40" />
                    <p className="text-sm text-muted-foreground">No hubs found.</p>
                    {canWrite && (
                        <Button size="sm" onClick={() => setCreateOpen(true)}>
                            <Plus className="size-4" /> Create first hub
                        </Button>
                    )}
                </div>
            )}

            {/* Grid */}
            {!isLoading && hubs.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {hubs.map(hub => (
                        <HubCard
                            key={hub.id}
                            hub={hub}
                            canWrite={canWrite}
                            onEdit={() => setEditHub(hub)}
                            onAssign={() => setAssignHub(hub)}
                            onDelete={() => { setDeleteError(null); setDeleteTarget(hub) }}
                        />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {meta && meta.totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                        Page {meta.page} of {meta.totalPages}
                    </p>
                    <div className="flex gap-1">
                        <Button
                            variant="outline" size="icon-sm"
                            onClick={() => goToPage(meta.page - 1)}
                            disabled={meta.page <= 1}
                            aria-label="Previous page"
                        >
                            <ChevronLeft className="size-4" />
                        </Button>
                        <Button
                            variant="outline" size="icon-sm"
                            onClick={() => goToPage(meta.page + 1)}
                            disabled={meta.page >= meta.totalPages}
                            aria-label="Next page"
                        >
                            <ChevronRight className="size-4" />
                        </Button>
                    </div>
                </div>
            )}

            {/* ── Modals ── */}

            {/* Create */}
            <Modal open={createOpen} title="Create hub" onClose={() => setCreateOpen(false)}>
                <HubForm
                    onSubmit={async (data) => { await createHub(data as any); setCreateOpen(false) }}
                    onCancel={() => setCreateOpen(false)}
                />
            </Modal>

            {/* Edit */}
            <Modal open={!!editHub} title="Edit hub" onClose={() => setEditHub(null)}>
                {editHub && (
                    <HubForm
                        hub={editHub}
                        onSubmit={async (data) => { await updateHub(editHub.id, data); setEditHub(null) }}
                        onCancel={() => setEditHub(null)}
                    />
                )}
            </Modal>

            {/* Assign manager */}
            <Modal open={!!assignHub} title="Assign manager" onClose={() => setAssignHub(null)}>
                {assignHub && (
                    <AssignManagerForm
                        hubName={assignHub.hubName}
                        currentManagerId={assignHub.managerId}
                        onSubmit={async (managerId) => { await assignManager(assignHub.id, { managerId }); setAssignHub(null) }}
                        onCancel={() => setAssignHub(null)}
                    />
                )}
            </Modal>

            {/* Delete confirm */}
            <Modal open={!!deleteTarget} title="Delete hub" onClose={() => setDeleteTarget(null)}>
                {deleteTarget && (
                    <div className="flex flex-col gap-4">
                        <p className="text-sm text-muted-foreground">
                            Are you sure you want to delete{" "}
                            <span className="font-medium text-foreground">{deleteTarget.hubName}</span>?
                            This cannot be undone. The hub must have no active shipments.
                        </p>
                        {deleteError && (
                            <div role="alert" className="rounded-xl border border-destructive/30 bg-destructive/8 px-4 py-3 text-sm text-destructive">
                                {deleteError}
                            </div>
                        )}
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={deleteLoading}>Cancel</Button>
                            <Button variant="destructive" onClick={handleDelete} disabled={deleteLoading}>
                                {deleteLoading && <Loader2 className="size-4 animate-spin" />}
                                {deleteLoading ? "Deleting…" : "Delete hub"}
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    )
}

// ── Hub card ──────────────────────────────────────────────────────────────────

function HubCard({ hub, canWrite, onEdit, onAssign, onDelete }: {
    hub: IHub
    canWrite: boolean
    onEdit: () => void
    onAssign: () => void
    onDelete: () => void
}) {
    return (
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-sm">
            {/* Top */}
            <div className="flex items-start justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2.5">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Building2 className="size-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                        <Link
                            href={`/dashboard/hubs/${hub.id}`}
                            className="block truncate font-heading font-semibold text-foreground hover:text-primary transition-colors"
                        >
                            {hub.hubName}
                        </Link>
                        <p className="truncate text-xs text-muted-foreground">{hub.address}</p>
                    </div>
                </div>
                {canWrite && (
                    <div className="flex shrink-0 gap-1">
                        <button
                            onClick={onEdit}
                            aria-label="Edit hub"
                            className="flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                            <Pencil className="size-3.5" />
                        </button>
                        <button
                            onClick={onDelete}
                            aria-label="Delete hub"
                            className="flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                        >
                            <Trash2 className="size-3.5" />
                        </button>
                    </div>
                )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-1.5 rounded-lg bg-muted/50 px-3 py-2">
                    <MapPin className="size-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                        {hub._count.areas} area{hub._count.areas !== 1 ? "s" : ""}
                    </span>
                </div>
                <div className="flex items-center gap-1.5 rounded-lg bg-muted/50 px-3 py-2">
                    <Package className="size-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                        {hub._count.currentShipments} shipments
                    </span>
                </div>
            </div>

            {/* Manager */}
            <div className="flex items-center justify-between border-t border-border pt-3">
                <div className="flex items-center gap-1.5">
                    <Users className="size-3.5 text-muted-foreground" />
                    {hub.manager ? (
                        <span className="text-xs text-foreground">{hub.manager.name}</span>
                    ) : (
                        <span className="text-xs text-muted-foreground italic">No manager assigned</span>
                    )}
                </div>
                {canWrite && (
                    <button
                        onClick={onAssign}
                        className="text-xs font-medium text-primary underline-offset-4 hover:underline"
                    >
                        <UserCog className="mr-1 inline size-3" />
                        {hub.manager ? "Reassign" : "Assign"}
                    </button>
                )}
            </div>
        </div>
    )
}
