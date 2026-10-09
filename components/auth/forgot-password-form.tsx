"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Eye, EyeOff, KeyRound, Loader2, Lock, Mail, ShieldCheck } from "lucide-react"
import { userApi } from "@/api/user.api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"



// ── OTP boxes ─────────────────────────────────────────────────────────────────
function OtpInput({
    value,
    onChange,
    disabled,
    hasError,
}: {
    value: string
    onChange: (v: string) => void
    disabled: boolean
    hasError: boolean
}) {
    const refs = useRef<HTMLInputElement[]>([])
    const digits = Array.from({ length: 6 }, (_, index) => value[index] || "")

    const handleChange = (i: number, raw: string) => {
        const digit = raw.replace(/\D/g, "").slice(-1)
        const next = [...digits]; next[i] = digit
        onChange(next.join(""))
        if (digit && i < 5) refs.current[i + 1]?.focus()
    }

    const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1]?.focus()
    }

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault()
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
        onChange(pasted.padEnd(6, ""))
        refs.current[Math.min(pasted.length, 5)]?.focus()
    }

    return (
        <div className="flex justify-center gap-3 w-full" onPaste={handlePaste}>
            {digits.map((digit, i) => (
                <input
                    key={i}
                    ref={(el) => {
                        if (el) refs.current[i] = el
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    disabled={disabled}
                    aria-label={`Digit ${i + 1} of 6`}
                    className={cn(
                        "h-14 w-12 rounded-xl border-2 bg-background text-center text-xl font-semibold text-foreground",
                        "outline-none transition-all focus:border-primary focus:ring-3 focus:ring-primary/15",
                        "disabled:cursor-not-allowed disabled:opacity-50",
                        hasError
                            ? "border-destructive ring-3 ring-destructive/15"
                            : digit ? "border-primary bg-primary/5" : "border-input",
                    )}
                />
            ))}
        </div>
    )
}
// ── Error banner ──────────────────────────────────────────────────────────────
function ErrorBanner({ message }: { message: string }) {
    return (
        <div role="alert" className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/8 px-4 py-3 text-sm text-destructive">
            <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-destructive" />
            {message}
        </div>
    )
}

// ── Main ──────────────────────────────────────────────────────────────────────
type Step = "email" | "reset"

export function ForgotPasswordForm() {
    const router = useRouter()

    const [step, setStep] = useState<Step>("email")
    const [email, setEmail] = useState("")
    const [otp, setOtp] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showNew, setShowNew] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [isPending, setIsPending] = useState(false)

    // ── Step 1: request OTP ───────────────────────────────────────────────────
    const handleRequestOtp = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        const errs: Record<string, string> = {}
        if (!email) errs.email = "Email is required"
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Enter a valid email"
        if (Object.keys(errs).length) { setErrors(errs); return }

        setErrors({})
        setIsPending(true)
        try {
            await userApi.forgotPassword({ email: email.trim().toLowerCase() })
            setStep("reset")
        } catch (err) {
            setErrors({ root: err instanceof Error ? err.message : "Failed to send code. Try again." })
        } finally {
            setIsPending(false)
        }
    }

    // ── Step 2: verify OTP + new password ────────────────────────────────────
    const handleReset = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        const errs: Record<string, string> = {}
        if (otp.replace(/\D/g, "").length < 6) errs.otp = "Enter the complete 6-digit code"
        if (!newPassword) errs.newPassword = "New password is required"
        else if (newPassword.length < 6) errs.newPassword = "At least 6 characters"
        if (!confirmPassword) errs.confirmPassword = "Please confirm your password"
        else if (newPassword !== confirmPassword) errs.confirmPassword = "Passwords do not match"
        if (Object.keys(errs).length) { setErrors(errs); return }

        setErrors({})
        setIsPending(true)
        try {
            await userApi.resetPassword({
                email: email.trim().toLowerCase(),
                otp,
                newPassword,
            })
            router.push("/login?reset=1")
        } catch (err) {
            setErrors({ root: err instanceof Error ? err.message : "Reset failed. Try again." })
        } finally {
            setIsPending(false)
        }
    }

    // ── Step 1 ────────────────────────────────────────────────────────────────
    if (step === "email") {
        return (
            <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-1">
                    <div className="mb-2 flex size-12 items-center justify-center rounded-2xl bg-primary/10">
                        <KeyRound className="size-6 text-primary" />
                    </div>
                    <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
                        Forgot password?
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Enter your email and we&apos;ll send a reset code.
                    </p>
                </div>

                <form onSubmit={handleRequestOtp} noValidate className="flex flex-col gap-4">
                    <Input
                        label="Email address"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={errors.email}
                        disabled={isPending}
                        leftIcon={<Mail />}
                    />

                    {errors.root && <ErrorBanner message={errors.root} />}

                    <Button type="submit" size="lg" className="mt-1 w-full" disabled={isPending}>
                        {isPending && <Loader2 className="size-4 animate-spin" />}
                        {isPending ? "Sending code…" : "Send reset code"}
                    </Button>
                </form>

                <p className="text-center text-sm text-muted-foreground">
                    <Link href="/login" className="inline-flex items-center gap-1 font-medium text-primary underline-offset-4 hover:underline">
                        <ArrowLeft className="size-3.5" /> Back to sign in
                    </Link>
                </p>
            </div>
        )
    }

    // ── Step 2 ────────────────────────────────────────────────────────────────
    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-1">
                <div className="mb-2 flex size-12 items-center justify-center rounded-2xl bg-primary/10">
                    <ShieldCheck className="size-6 text-primary" />
                </div>
                <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
                    Reset your password
                </h1>
                <p className="text-sm text-muted-foreground">
                    Enter the 6-digit code sent to{" "}
                    <span className="font-medium text-foreground">{email}</span>
                </p>
            </div>

         <form onSubmit={handleReset} noValidate className="flex flex-col gap-5">
    {/* OTP */}
    <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground">Verification code</label>
        <OtpInput
            value={otp}
            onChange={(v) => { setOtp(v); setErrors((e) => ({ ...e, otp: "" })) }}
            disabled={isPending}
            hasError={!!errors.otp}
        />
        {errors.otp && <p role="alert" className="text-center text-xs text-destructive">{errors.otp}</p>}
    </div>

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
                    rightElement={
                        <button type="button" onClick={() => setShowNew((v) => !v)} tabIndex={-1}
                            aria-label={showNew ? "Hide" : "Show"}
                            className="text-muted-foreground transition-colors hover:text-foreground">
                            {showNew ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                    }
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
                    rightElement={
                        <button type="button" onClick={() => setShowConfirm((v) => !v)} tabIndex={-1}
                            aria-label={showConfirm ? "Hide" : "Show"}
                            className="text-muted-foreground transition-colors hover:text-foreground">
                            {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                    }
                />

                {errors.root && <ErrorBanner message={errors.root} />}

                <Button type="submit" size="lg" className="w-full" disabled={isPending || otp.length < 6}>
                    {isPending && <Loader2 className="size-4 animate-spin" />}
                    {isPending ? "Resetting…" : "Reset password"}
                </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
                <button type="button" onClick={() => { setStep("email"); setOtp(""); setErrors({}) }}
                    className="inline-flex items-center gap-1 font-medium text-primary underline-offset-4 hover:underline">
                    <ArrowLeft className="size-3.5" /> Use a different email
                </button>
            </p>
        </div>
    )
}
