"use client";

import { useState } from "react";
import {
  MapPin,
  PlusCircle,
  Search,
  Building2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  Hash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AreaFormModal } from "./area-form-modal";
import { useAreas } from "@/hooks/use-areas";
import type { ICreateAreaPayload } from "@/types/area.types";

export function AreasPage() {
  const {
    areas,
    meta,
    isLoading,
    error,
    page,
    setPage,
    search,
    setSearch,
    createArea,
  } = useAreas({ initialLimit: 10 });

  const [formModalOpen, setFormModalOpen] = useState(false);

  const handleFormSubmit = async (data: ICreateAreaPayload) => {
    await createArea(data);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold text-foreground">
            Service Areas & Postal Coverage
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage delivery territory coverage, postal codes, and assigned operational distribution hubs.
          </p>
        </div>
        <Button
          onClick={() => setFormModalOpen(true)}
          className="gap-2 shadow-sm"
        >
          <PlusCircle className="size-4" />
          <span>Add Service Area</span>
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search by Area name, Postal code, or Hub..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Areas Table */}
      <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3.5">Area Name</th>
                <th className="px-5 py-3.5">Postal Code</th>
                <th className="px-5 py-3.5">Assigned Distribution Hub</th>
                <th className="px-5 py-3.5">Hub Manager</th>
                <th className="px-5 py-3.5">Created Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted-foreground">
                    <div className="inline-flex items-center gap-2">
                      <Loader2 className="size-5 animate-spin text-primary" />
                      <span>Loading service areas...</span>
                    </div>
                  </td>
                </tr>
              ) : areas.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <MapPin className="size-10 stroke-1 text-muted-foreground/60" />
                      <p className="font-medium text-foreground">No service areas found</p>
                      <p className="text-xs">Click "Add Service Area" to define coverage zones.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                areas.map((area) => (
                  <tr
                    key={area.id}
                    className="transition hover:bg-muted/30"
                  >
                    <td className="px-5 py-4 font-semibold text-foreground">
                      {area.name}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 font-mono text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md">
                        <Hash className="size-3" />
                        {area.postalCode}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Building2 className="size-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-foreground text-xs">
                            {area.hub?.hubName}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {area.hub?.address}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs text-muted-foreground">
                      {area.hub?.manager?.name ? (
                        <div>
                          <span className="font-medium text-foreground">
                            {area.hub.manager.name}
                          </span>
                          <span className="block text-[11px]">
                            {area.hub.manager.email}
                          </span>
                        </div>
                      ) : (
                        <span className="italic">No manager assigned</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-xs text-muted-foreground">
                      {new Date(area.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {meta.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border px-5 py-3 bg-muted/20 text-xs text-muted-foreground">
            <span>
              Page {meta.page} of {meta.totalPages} ({meta.total} total)
            </span>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={page <= 1 || isLoading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="size-4" /> Previous
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={page >= meta.totalPages || isLoading}
                onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
              >
                Next <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Form Modal */}
      <AreaFormModal
        open={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}
