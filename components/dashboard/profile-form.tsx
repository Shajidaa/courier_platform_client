"use client"

import { useEffect, useState } from "react"
import { Eye, EyeOff, Loader2, Lock, Save, User } from "lucide-react"
import { useProfile } from "@/hooks/use-profile"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { TGender, IUpdateProfilePayload } from "@/types/user.types"

// ── Error / Success banner ────────────────────────────────────────────────────
function Banner({ type, message }: { type: "error" | "success"; message: string }) {
    return (
        <div
            role={type === "error" ? "alert" : "status"}
            className={cn(
                "flex items-start gap-2 rounded-xl border px-4 py-3 text-sm",
                type === "error"
                    ? "border-destructive/30 bg-destructive/8 text-destructive"
                    : "border-emerald-500/30 bg-emerald-500/8 text-emerald-600 dark:text-emerald-400",
            )}
        >
            <span className={cn("mt-0.5 size-1.5 shrink-0 rounded-full",
                type === "error" ? "bg-destructive" : "bg-emerald-500")} />
            {message}
        </div>
    )
}

// ── Profile section ───────────────────────────────────────────────────────────
function ProfileSection() {
    const { profile, isLoading, error, updateProfile } = useProfile()

    const [fields, setFields] = useState<IUpdateProfilePayload>({})
    const [isPending, setIsPending] = useState(false)
    const [feedback, setFeedback] = useState<{ type: "error" | "success"; msg: string } | null>(null)

    // Hydrate once profile loads
    useEffect(() => {
        if (!profile) return
        setFields({
            name: profile.name,
            gender: profile.gender,
            bio: profile.profile?.bio ?? "",
            phoneNumber: profile.profile?.phoneNumber ?? "",
            nid: profile.profile?.nid ?? "",
            passport: profile.profile?.passport ?? "",
        })
    }, [profile])

    const set = (key: keyof IUpdateProfilePayload) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
            setFields((f) => ({ ...f, [key]: e.target.value }))

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        setFeedback(null)
        setIsPending(true)
        try {
            await updateProfile(fields)
            setFeedback({ type: "success", msg: "Profile updated successfully." })
        } catch (err) {
            setFeedback({ type: "error", msg: err instanceof Error ? err.message : "Update failed." })
        } finally {
            setIsPending(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" /> Loading profile…
            </div>
        )
    }

    if (error) return <Banner type="error" message={error} />

    return (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            <div className="grid gap-4 sm:grid-cols-2">
                <Input
                    label="Full name"
                    type="text"
                    value={fields.name ?? ""}
                    onChange={set("name")}
                    disabled={isPending}
                    leftIcon={<User />}
                />

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-foreground">Gender</label>
                    <select
                        value={fields.gender ?? ""}
                        onChange={set("gender")}
                        disabled={isPending}
                        className={cn(
                            "h-11 w-full appearance-none rounded-xl border border-input bg-background px-4 text-sm text-foreground",
                            "outline-none transition-all focus:border-primary focus:ring-3 focus:ring-primary/15 disabled:opacity-50",
                        )}
                    >
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                    </select>
                </div>
            </div>

            <Input
                label="Phone number"
                type="tel"
                placeholder="+880..."
                value={fields.phoneNumber ?? ""}
                onChange={set("phoneNumber")}
                disabled={isPending}
            />

            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">Bio</label>
                <textarea
                    value={fields.bio ?? ""}
                    onChange={set("bio")}
                    disabled={isPending}
                    rows={3}
                    maxLength={500}
                    placeholder="Tell us a little about yourself…"
                    className={cn(
                        "w-full resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground",
                        "outline-none transition-all focus:border-primary focus:ring-3 focus:ring-primary/15 disabled:opacity-50",
                    )}
                />
                <p className="text-right text-xs text-muted-foreground">{(fields.bio ?? "").length}/500</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <Input
                    label="NID number"
                    type="text"
                    placeholder="National ID"
                    value={fields.nid ?? ""}
                    onChange={set("nid")}
                    disabled={isPending}
                />
                <Input
                    label="Passport number"
                    type="text"
                    placeholder="Passport"
                    value={fields.passport ?? ""}
                    onChange={set("passport")}
                    disabled={isPending}
                />
            </div>

            {feedback && <Banner type={feedback.type} message={feedback.msg} />}

            <div className="flex justify-end">
                <Button type="submit" disabled={isPending} className="gap-2">
                    {isPending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                    {isPending ? "Saving…" : "Save changes"}
                </Button>
            </div>
        </form>
    )
}

// ── Change password section ───────────────────────────────────────────────────
function ChangePasswordSection() {
    const { changePassword } = useProfile()

    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showOld, setShowOld] = useState(false)
    const [showNew, setShowNew] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [feedback, setFeedback] = useState<{ type: "error" | "success"; msg: string } | null>(null)
    const [isPending, setIsPending] = useState(false)

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        const errs: Record<string, string> = {}
        if (!oldPassword) errs.oldPassword = "Current password is required"
        if (!newPassword) errs.newPassword = "New password is required"
        else if (newPassword.length < 6) errs.newPassword = "At least 6 characters"
        if (!confirmPassword) errs.confirmPassword = "Please confirm your new password"
        else if (newPassword !== confirmPassword) errs.confirmPassword = "Passwords do not match"
        if (Object.keys(errs).length) { setErrors(errs); return }

        setErrors({})
        setFeedback(null)
        setIsPending(true)
        try {
            await changePassword({ oldPassword, newPassword })
            setFeedback({ type: "success", msg: "Password changed successfully." })
            setOldPassword(""); setNewPassword(""); setConfirmPassword("")
        } catch (err) {
            setFeedback({ type: "error", msg: err instanceof Error ? err.message : "Password change failed." })
        } finally {
            setIsPending(false)
        }
    }

    const pwToggle = (show: boolean, set: (v: boolean) => void) => (
        <button type="button" tabIndex={-1} onClick={() => set(!show)}
            aria-label={show ? "Hide" : "Show"}
            className="text-muted-foreground transition-colors hover:text-foreground">
            {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
    )

    return (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <Input
                label="Current password"
                type={showOld ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                error={errors.oldPassword}
                disabled={isPending}
                leftIcon={<Lock />}
                rightElement={pwToggle(showOld, setShowOld)}
            />
            <Input
                label="New password"
                type={showNew ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Min. 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                error={errors.newPassword}
                disabled={isPending}
                leftIcon={<Lock />}
                rightElement={pwToggle(showNew, setShowNew)}
            />
            <Input
                label="Confirm new password"
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Repeat new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={errors.confirmPassword}
                disabled={isPending}
                leftIcon={<Lock />}
                rightElement={pwToggle(showConfirm, setShowConfirm)}
            />

            {feedback && <Banner type={feedback.type} message={feedback.msg} />}

            <div className="flex justify-end">
                <Button type="submit" disabled={isPending} className="gap-2">
                    {isPending ? <Loader2 className="size-4 animate-spin" /> : <Lock className="size-4" />}
                    {isPending ? "Updating…" : "Change password"}
                </Button>
            </div>
        </form>
    )
}

// ── Exported page component ───────────────────────────────────────────────────
export function ProfileForm() {
    const [activeTab, setActiveTab] = useState<"profile" | "password">("profile")

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h2 className="font-heading text-2xl font-semibold text-foreground">Account Settings</h2>
                <p className="text-sm text-muted-foreground">Manage your profile and security settings.</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 rounded-xl border border-border bg-muted/40 p-1 w-fit">
                {(["profile", "password"] as const).map((tab) => (
                    <button
                        key={tab}
                        type="button"
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                            "rounded-lg px-4 py-1.5 text-sm font-medium transition-colors",
                            activeTab === tab
                                ? "bg-background text-foreground shadow-xs"
                                : "text-muted-foreground hover:text-foreground",
                        )}
                    >
                        {tab === "profile" ? "Profile" : "Password"}
                    </button>
                ))}
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
                {activeTab === "profile" ? <ProfileSection /> : <ChangePasswordSection />}
            </div>
        </div>
    )
}
