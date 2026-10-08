"use client"

import { useState } from "react"
import { Loader2, UserCog } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface AssignManagerFormProps {
    hubName: string
    currentManagerId?: string | null
    onSubmit: (managerId: string) => Promise<void>
    onCancel: () => void
}

export function AssignManagerForm({ hubName, currentManagerId, onSubmit, onCancel }: AssignManagerFormProps) {
    const [managerId, setManagerId] = useState(currentManagerId ?? "")
    const [error, setError] = useState<string | null>(null)
    const [rootError, setRootError] = useState<string | null>(null)
    const [isPending, setIsPending] = useState(false)

    const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!managerId.trim()) { setError("Manager ID is required"); return }
        if (!uuidRe.test(managerId.trim())) { setError("Enter a valid UUID"); return }
        setError(null); setRootError(null); setIsPending(true)
        try {
            await onSubmit(managerId.trim())
        } catch (err) {
            setRootError(err instanceof Error ? err.message : "Assignment failed.")
        } finally {
            setIsPending(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
                Assigning a manager to <span className="font-medium text-foreground">{hubName}</span>.
                The user must have the <code className="rounded bg-muted px-1 text-xs">HUB_MANAGER</code> role.
            </p>

            <Input
                label="Manager user ID"
                type="text"
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                value={managerId}
                onChange={e => { setManagerId(e.target.value); setError(null) }}
                error={error ?? undefined}
                disabled={isPending}
                leftIcon={<UserCog />}
                hint="Paste the UUID of an active HUB_MANAGER user"
            />

            {rootError && (
                <div role="alert" className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/8 px-4 py-3 text-sm text-destructive">
                    <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-destructive" />
                    {rootError}
                </div>
            )}

            <div className="flex justify-end gap-2 pt-1">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>Cancel</Button>
                <Button type="submit" disabled={isPending}>
                    {isPending && <Loader2 className="size-4 animate-spin" />}
                    {isPending ? "Assigning…" : "Assign manager"}
                </Button>
            </div>
        </form>
    )
}
