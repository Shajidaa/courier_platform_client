"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { hubApi } from "@/api/hub.api";
import type { IHub } from "@/types/hub.types";
import { AlertCircle, Loader2 } from "lucide-react";

interface AreaFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    postalCode: string;
    hubId: string;
  }) => Promise<void>;
}

export function AreaFormModal({
  open,
  onClose,
  onSubmit,
}: AreaFormModalProps) {
  const [name, setName] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [hubId, setHubId] = useState("");
  const [hubs, setHubs] = useState<IHub[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setName("");
      setPostalCode("");
      setHubId("");
      setError(null);

      hubApi
        .getAll({ limit: 100 })
        .then((res) => {
          setHubs(res.data ?? []);
          if (res.data && res.data.length > 0) {
            setHubId(res.data[0].id);
          }
        })
        .catch(() => {});
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Area name is required.");
      return;
    }
    if (!postalCode.trim()) {
      setError("Postal code is required.");
      return;
    }
    if (!hubId) {
      setError("Please select a Hub to assign this coverage area to.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await onSubmit({
        name: name.trim(),
        postalCode: postalCode.trim(),
        hubId,
      });
      onClose();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to add service area.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      title="Add Service Area & Postal Code"
      onClose={onClose}
      className="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">
            Area / District Name <span className="text-destructive">*</span>
          </label>
          <Input
            placeholder="e.g. Dhanmondi, Gulshan, Uttara"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">
            Postal Code <span className="text-destructive">*</span>
          </label>
          <Input
            placeholder="e.g. 1205"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">
            Assign to Hub <span className="text-destructive">*</span>
          </label>
          <select
            value={hubId}
            onChange={(e) => setHubId(e.target.value)}
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 outline-none"
            required
          >
            <option value="">Select Hub</option>
            {hubs.map((h) => (
              <option key={h.id} value={h.id} className="bg-background">
                {h.hubName} ({h.address})
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-border">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-1.5 size-4 animate-spin" />
                Saving Area...
              </>
            ) : (
              "Add Coverage Area"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
