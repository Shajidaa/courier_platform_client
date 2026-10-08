"use client"

import { useEffect, useState } from "react"
import { Loader2, MapPin, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { IHub, ICreateHubPayload, IUpdateHubPayload } from "@/types/hub.types"

interface HubFormProps {
    /** Pass existing hub to switch to edit mode */
    hub?: IHub
    onSubmit: (data: ICreateHubPayload | IUpdateHubPayload) => Promise<void>
    onCancel: () => void
}

export function HubForm({ hub, onSubmit, onCancel }: HubFormProps) {
    const isEdit = !!hub
    const [hubName, setHubName] = useState(hub?.hubName ?? "")
    const [address, setAddress] = useState(hub?.address ?? "")
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [rootError, setRootError] = useState<string | null>(null)
    const [isPending, setIsPending] = useState(false)

    useEffect(() => {
        if (hub) { setHubName(hub.hubName); setAddress(hub.address) }
    }, [hub?.id])

    const validate = () => {
        const e: Record<string, string> = {}
        if (!hubName.trim()) e.hubName = "Hub name is required"
        else if (hubName.trim().length < 2) e.hubName = "At least 2 characters"
        else if (hubName.trim().length > 100) e.hubName = "Max 100 characters"
        if (!address.trim()) e.address = "Address is required"
        else if (address.trim().length < 5) e.address = "At least 5 characters"
        return e
    }

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        const errs = validate()
        if (Object.keys(errs).length) { setErrors(errs); return }
        setErrors({}); setRootError(null); setIsPending(true)
        try {
            await onSubmit({ hubName: hubName.trim(), address: address.trim() })
        } catch (err) {
            setRootError(err instanceof Error ? err.message : "Something went wrong.")
        } finally {
            setIsPending(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <Input
                label="Hub name"
                type="text"
                placeholder="e.g. Dhaka Central Hub"
                value={hubName}
                onChange={e => { setHubName(e.target.value); setErrors(v => ({ ...v, hubName: "" })) }}
                error={errors.hubName}
                disabled={isPending}
                leftIcon={<Building2 />}
            />
            <Input
                label="Address"
                type="text"
                placeholder="Full address"
                value={address}
                onChange={e => { setAddress(e.target.value); setErrors(v => ({ ...v, address: "" })) }}
                error={errors.address}
                disabled={isPending}
                leftIcon={<MapPin />}
            />

            {rootError && (
                <div role="alert" className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/8 px-4 py-3 text-sm text-destructive">
                    <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-destructive" />
                    {rootError}
                </div>
            )}

            <div className="flex justify-end gap-2 pt-1">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                    {isPending && <Loader2 className="size-4 animate-spin" />}
                    {isPending ? "Saving…" : isEdit ? "Save changes" : "Create hub"}
                </Button>
            </div>
        </form>
    )
}
