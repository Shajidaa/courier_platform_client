"use client"

import { useEffect, useState } from "react"
import {
    Eye, EyeOff, Loader2, Lock, Save,
    User, Mail, Shield, Phone, FileText, CreditCard,
    Camera,
} from "lucide-react"
import { useProfile } from "@/hooks/use-profile"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { IUpdateProfilePayload } from "@/types/user.types"

// ─── Shared helpers ───────────────────────────────────────────────────────────

function Banner({ type, message }: { type: "error" | "success"; message: string }) {
    return (
        <div
            role={type === "error" ? "alert" : "status"}
            className={cn(
                "flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm",
                type === "error"
                    ? "border-destructive/30 bg-destructive/8 text-destructive"
                    : "border-emerald-500/30 bg-emerald-500/8 text-emerald-600 dark:text-emerald-400",
            )}
        >
            <span className={cn(
                "size-1.5 shrink-0 rounded-full",
                type === "error" ? "bg-destructive" : "bg-emerald-500",
            )} />
            {message}
        </div>
    )
}

const ROLE_LABEL: Record<string, string> = {
    SENDER: "Sender",
    RIDER: "Rider",
    HUB_MANAGER: "Hub Manager",
    OPS_MANAGER: "Ops Manager",
    SUPPORT_AGENT: "Support Agent",
    ADMIN: "Admin",
    SUPER_ADMIN: "Super Admin",
}

const ROLE_COLOR: Record<string, string> = {
    SENDER: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    RIDER: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    HUB_MANAGER: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    OPS_MANAGER: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    SUPPORT_AGENT: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    ADMIN: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    SUPER_ADMIN: "bg-primary/10 text-primary",
}

// ─── Profile header card ──────────────────────────────────────────────────────

function ProfileHeader({ name, email, role, imageUrl }: {
    name: string; email: string; role: string; imageUrl?: string
}) {
    const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()

    return (
        <div className="flex items-center gap-5 rounded-xl border border-border bg-card p-6">
            {/* Avatar */}
            <div className="relative shrink-0">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={name}
                        className="size-20 rounded-2xl object-cover"
                    />
                ) : (
                    <div className="flex size-20 items-center justify-center rounded-2xl bg-primary/10 text-2xl font-semibold text-primary">
                        {initials}
                    </div>
                )}
                <button
                    type="button"
                    aria-label="Change avatar"
                    className="absolute -bottom-1.5 -right-1.5 flex size-7 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
                >
                    <Camera className="size-3.5" />
                </button>
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
                <h2 className="font-heading text-lg font-semibold text-foreground truncate">{name}</h2>
                <p className="text-sm text-muted-foreground truncate">{email}</p>
                <span className={cn(
                    "mt-2 inline-block rounded-md px-2.5 py-0.5 text-xs font-medium",
                    ROLE_COLOR[role] ?? "bg-muted text-muted-foreground",
                )}>
                    {ROLE_LABEL[role] ?? role}
                </span>
            </div>
        </div>
    )
}

// ─── Info row ─────────────────────────────────────────────────────────────────

function InfoRow({ label, value }: { label: string; value?: string | null }) {
    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground">{label}</span>
            <span className="text-sm font-medium text-foreground">{value || "—"}</span>
        </div>
    )
}

// ─── Edit profile tab ─────────────────────────────────────────────────────────

function EditProfileTab({
    updateProfile,
    initialFields,
}: {
    updateProfile: (p: IUpdateProfilePayload) => Promise<void>
    initialFields: IUpdateProfilePayload
}) {
    const [fields, setFields] = useState<IUpdateProfilePayload>(initialFields)
    const [isPending, setIsPending] = useState(false)
    const [feedback, setFeedback] = useState<{ type: "error" | "success"; msg: string } | null>(null)

    // Re-hydrate if parent data changes
    useEffect(() => { setFields(initialFields) }, [JSON.stringify(initialFields)])

    const set =
        (key: keyof IUpdateProfilePayload) =>
            (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
                setFields(f => ({ ...f, [key]: e.target.value }))

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

    return (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            {/* Name + Gender */}
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

            {/* Phone */}
            <Input
                label="Phone number"
                type="tel"
                placeholder="+880..."
                value={fields.phoneNumber ?? ""}
                onChange={set("phoneNumber")}
                disabled={isPending}
                leftIcon={<Phone />}
            />

            {/* Bio */}
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
                        "w-full resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm",
                        "text-foreground placeholder:text-muted-foreground",
                        "outline-none transition-all focus:border-primary focus:ring-3 focus:ring-primary/15 disabled:opacity-50",
                    )}
                />
                <p className="text-right text-xs text-muted-foreground">
                    {(fields.bio ?? "").length}/500
                </p>
            </div>

            {/* NID + Passport */}
            <div className="grid gap-4 sm:grid-cols-2">
                <Input
                    label="NID number"
                    type="text"
                    placeholder="National ID"
                    value={fields.nid ?? ""}
                    onChange={set("nid")}
                    disabled={isPending}
                    leftIcon={<CreditCard />}
                />
                <Input
                    label="Passport number"
                    type="text"
                    placeholder="Passport"
                    value={fields.passport ?? ""}
                    onChange={set("passport")}
                    disabled={isPending}
                    leftIcon={<FileText />}
                />
            </div>

            {feedback && <Banner type={feedback.type} message={feedback.msg} />}

            <div className="flex justify-end pt-1">
                <Button type="submit" disabled={isPending}>
                    {isPending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                    {isPending ? "Saving…" : "Save changes"}
                </Button>
            </div>
        </form>
    )
}

// ─── Change password tab ──────────────────────────────────────────────────────

function ChangePasswordTab({
    changePassword,
}: {
    changePassword: (p: { oldPassword: string; newPassword: string }) => Promise<void>
}) {
    const [old, setOld] = useState("")
    const [next, setNext] = useState("")
    const [confirm, setConfirm] = useState("")
    const [showOld, setShowOld] = useState(false)
    const [showNext, setShowNext] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [feedback, setFeedback] = useState<{ type: "error" | "success"; msg: string } | null>(null)
    const [isPending, setIsPending] = useState(false)

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        const errs: Record<string, string> = {}
        if (!old) errs.old = "Current password is required"
        if (!next) errs.next = "New password is required"
        else if (next.length < 6) errs.next = "At least 6 characters"
        if (!confirm) errs.confirm = "Please confirm your new password"
        else if (next !== confirm) errs.confirm = "Passwords do not match"
        if (Object.keys(errs).length) { setErrors(errs); return }

        setErrors({})
        setFeedback(null)
        setIsPending(true)
        try {
            await changePassword({ oldPassword: old, newPassword: next })
            setFeedback({ type: "success", msg: "Password changed successfully." })
            setOld(""); setNext(""); setConfirm("")
        } catch (err) {
            setFeedback({ type: "error", msg: err instanceof Error ? err.message : "Password change failed." })
        } finally {
            setIsPending(false)
        }
    }

    const toggle = (show: boolean, fn: (v: boolean) => void) => (
        <button type="button" tabIndex={-1} onClick={() => fn(!show)}
            aria-label={show ? "Hide password" : "Show password"}
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
                value={old}
                onChange={e => setOld(e.target.value)}
                error={errors.old}
                disabled={isPending}
                leftIcon={<Lock />}
                rightElement={toggle(showOld, setShowOld)}
            />
            <Input
                label="New password"
                type={showNext ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Min. 6 characters"
                value={next}
                onChange={e => setNext(e.target.value)}
                error={errors.next}
                disabled={isPending}
                leftIcon={<Lock />}
                rightElement={toggle(showNext, setShowNext)}
            />
            <Input
                label="Confirm new password"
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Repeat new password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                error={errors.confirm}
                disabled={isPending}
                leftIcon={<Lock />}
                rightElement={toggle(showConfirm, setShowConfirm)}
            />

            {feedback && <Banner type={feedback.type} message={feedback.msg} />}

            <div className="flex justify-end pt-1">
                <Button type="submit" disabled={isPending}>
                    {isPending ? <Loader2 className="size-4 animate-spin" /> : <Shield className="size-4" />}
                    {isPending ? "Updating…" : "Change password"}
                </Button>
            </div>
        </form>
    )
}

// ─── Overview tab ─────────────────────────────────────────────────────────────

function OverviewTab({ profile }: { profile: NonNullable<ReturnType<typeof useProfile>["profile"]> }) {
    return (
        <div className="flex flex-col gap-6">
            {/* Account info */}
            <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Account
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                    <InfoRow label="Email" value={profile.email} />
                    <InfoRow label="Role" value={ROLE_LABEL[profile.role] ?? profile.role} />
                    <InfoRow label="Status" value={profile.status} />
                    <InfoRow label="Email verified" value={profile.emailVerified ? "Yes" : "No"} />
                    <InfoRow label="Member since" value={new Date(profile.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} />
                </div>
            </div>

            {/* Profile info */}
            <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Profile
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                    <InfoRow label="Gender" value={profile.gender} />
                    <InfoRow label="Phone" value={profile.profile?.phoneNumber} />
                    <InfoRow label="NID" value={profile.profile?.nid} />
                    <InfoRow label="Passport" value={profile.profile?.passport} />
                </div>
                {profile.profile?.bio && (
                    <div className="mt-4 flex flex-col gap-0.5">
                        <span className="text-xs text-muted-foreground">Bio</span>
                        <p className="text-sm text-foreground">{profile.profile.bio}</p>
                    </div>
                )}
            </div>
        </div>
    )
}

// ─── Main export ──────────────────────────────────────────────────────────────

type Tab = "overview" | "edit" | "password"

export function ProfilePage() {
    const { profile, isLoading, error, updateProfile, changePassword } = useProfile()
    const [tab, setTab] = useState<Tab>("overview")

    const tabs: { key: Tab; label: string }[] = [
        { key: "overview", label: "Overview" },
        { key: "edit", label: "Edit profile" },
        { key: "password", label: "Password" },
    ]

    if (isLoading) {
        return (
            <div className="flex min-h-[40vh] items-center justify-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-5 animate-spin" />
                Loading profile…
            </div>
        )
    }

    if (error || !profile) {
        return (
            <div className="flex flex-col gap-4">
                <Banner type="error" message={error ?? "Failed to load profile."} />
            </div>
        )
    }

    const initialFields: IUpdateProfilePayload = {
        name: profile.name,
        gender: profile.gender,
        bio: profile.profile?.bio ?? "",
        phoneNumber: profile.profile?.phoneNumber ?? "",
        nid: profile.profile?.nid ?? "",
        passport: profile.profile?.passport ?? "",
    }

    return (
        <div className="mx-auto flex max-w-2xl flex-col gap-6">
            {/* Page title */}
            <div>
                <h1 className="font-heading text-2xl font-semibold text-foreground">Account Settings</h1>
                <p className="text-sm text-muted-foreground">Manage your profile and security.</p>
            </div>

            {/* Profile header */}
            <ProfileHeader
                name={profile.name}
                email={profile.email}
                role={profile.role}
                imageUrl={profile.imageUrl || undefined}
            />

            {/* Tabs */}
            <div className="flex gap-1 rounded-xl border border-border bg-muted/40 p-1 w-fit">
                {tabs.map(({ key, label }) => (
                    <button
                        key={key}
                        type="button"
                        onClick={() => setTab(key)}
                        className={cn(
                            "rounded-lg px-4 py-1.5 text-sm font-medium transition-colors",
                            tab === key
                                ? "bg-background text-foreground shadow-xs"
                                : "text-muted-foreground hover:text-foreground",
                        )}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Tab content */}
            <div className="rounded-xl border border-border bg-card p-6">
                {tab === "overview" && <OverviewTab profile={profile} />}
                {tab === "edit" && (
                    <EditProfileTab
                        updateProfile={updateProfile}
                        initialFields={initialFields}
                    />
                )}
                {tab === "password" && (
                    <ChangePasswordTab changePassword={changePassword} />
                )}
            </div>
        </div>
    )
}
