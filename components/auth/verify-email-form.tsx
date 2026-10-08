"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { Loader2, MailCheck, RotateCcw, ShieldCheck } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VerifyEmailFormProps {
    email: string;
}

export function VerifyEmailForm({ email }: VerifyEmailFormProps) {
    const { verifyEmail } = useAuth();

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const [error, setError] = useState<string | null>(null);
    const [rootError, setRootError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [isPending, startTransition] = useTransition();
    const [isResending, setIsResending] = useState(false);
    const [resendCountdown, setResendCountdown] = useState(30);
    const [resendSuccess, setResendSuccess] = useState(false);

    useEffect(() => {
        if (resendCountdown > 0) {
            const timer = setInterval(() => setResendCountdown((c) => c - 1), 1000);
            return () => clearInterval(timer);
        }
    }, [resendCountdown]);

    // Handle digit change
    const handleChange = (value: string, index: number) => {
        const digit = value.replace(/\D/g, "").slice(-1);
        const newOtp = [...otp];
        newOtp[index] = digit;
        setOtp(newOtp);
        setError(null);

        // Move to next input if digit is entered
        if (digit && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    // Handle backspace
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace") {
            if (!otp[index] && index > 0) {
                inputRefs.current[index - 1]?.focus();
            } else {
                const newOtp = [...otp];
                newOtp[index] = "";
                setOtp(newOtp);
            }
        }
    };

    // Handle paste
    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        const newOtp = [...otp];
        for (let i = 0; i < pastedData.length; i++) {
            newOtp[i] = pastedData[i];
        }
        setOtp(newOtp);
        const nextIndex = Math.min(pastedData.length, 5);
        inputRefs.current[nextIndex]?.focus();
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const otpString = otp.join("");
        if (otpString.length < 6) {
            setError("Please enter the complete 6-digit verification code.");
            return;
        }

        setError(null);
        setRootError(null);

        startTransition(async () => {
            try {
                await verifyEmail({ email, otp: otpString });
                setSuccess(true);
            } catch (err) {
                setRootError(
                    err instanceof Error
                        ? err.message
                        : "The code you entered is invalid or has expired. Please try again."
                );
            }
        });
    };

    const handleResendCode = async () => {
        if (resendCountdown > 0 || isResending) return;
        setIsResending(true);
        setError(null);
        setRootError(null);
        setResendSuccess(false);

        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setResendSuccess(true);
            setResendCountdown(60);
        } catch (err) {
            setRootError("Failed to resend code. Please try again later.");
        } finally {
            setIsResending(false);
        }
    };

    const maskedEmail = email.replace(/^(.{2})(.*)(@.*)$/, (_, a, b, c) => `${a}${"*".repeat(Math.min(b.length, 4))}${c}`);

    return (
        <div className="flex flex-col gap-6 sm:gap-8">
            {/* Header */}
            <div className="flex flex-col items-center gap-3 text-center">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
                    {success ? (
                        <ShieldCheck className="size-7 animate-pulse" />
                    ) : (
                        <MailCheck className="size-7" />
                    )}
                </div>
                <div className="space-y-1">
                    <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
                        {success ? "Email verified!" : "Check your email"}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        We&apos;ve sent a secure 6-digit verification code to
                    </p>
                    <p className="font-medium text-foreground text-sm">{maskedEmail}</p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                    {/* Explicitly written input boxes to guarantee visibility */}
                    <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => { inputRefs.current[index] = el; }}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                disabled={isPending || success}
                                onChange={(e) => handleChange(e.target.value, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                className={cn(
                                    "h-12 w-10 sm:h-14 sm:w-12 rounded-xl border-2 text-center text-lg sm:text-xl font-semibold",
                                    "bg-zinc-100 dark:bg-zinc-900 text-foreground outline-none transition-all shadow-sm",
                                    "focus:border-primary focus:ring-2 focus:ring-primary/20",
                                    "disabled:cursor-not-allowed disabled:opacity-50",
                                    error
                                        ? "border-destructive ring-2 ring-destructive/20"
                                        : digit
                                            ? "border-primary bg-primary/10"
                                            : "border-zinc-300 dark:border-zinc-700 hover:border-primary/50"
                                )}
                            />
                        ))}
                    </div>
                    {error && (
                        <p role="alert" className="text-center text-xs font-medium text-destructive">
                            {error}
                        </p>
                    )}
                </div>

                {rootError && (
                    <div
                        role="alert"
                        className="flex items-center gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
                    >
                        <span className="size-2 shrink-0 rounded-full bg-destructive" />
                        <p className="flex-1">{rootError}</p>
                    </div>
                )}

                {resendSuccess && (
                    <div
                        role="status"
                        className="flex items-center gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400"
                    >
                        <span className="size-2 shrink-0 rounded-full bg-emerald-500" />
                        <p className="flex-1">A new verification code has been sent to your email.</p>
                    </div>
                )}

                <Button
                    type="submit"
                    size="lg"
                    className="w-full font-medium shadow-sm transition-all"
                    disabled={isPending || success || otp.join("").length < 6}
                >
                    {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
                    {isPending ? "Verifying code…" : success ? "Verified" : "Verify & activate account"}
                </Button>
            </form>

            {/* Helper Actions & Links */}
            <div className="flex flex-col items-center gap-3 text-center text-sm text-muted-foreground border-t border-border/50 pt-6">
                <div className="flex items-center gap-1.5">
                    <span>Didn&apos;t receive the code?</span>
                    <button
                        type="button"
                        onClick={handleResendCode}
                        disabled={resendCountdown > 0 || isResending}
                        className={cn(
                            "inline-flex items-center gap-1 font-medium text-primary transition-colors",
                            resendCountdown > 0 || isResending
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:underline underline-offset-4"
                        )}
                    >
                        {isResending && <Loader2 className="size-3 animate-spin" />}
                        <RotateCcw className="size-3" />
                        {resendCountdown > 0 ? `Resend in ${resendCountdown}s` : "Resend code"}
                    </button>
                </div>

                <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <p>
                        Wrong email?{" "}
                        <Link href="/register" className="font-medium text-primary underline-offset-4 hover:underline">
                            Register again
                        </Link>
                    </p>
                    <span className="text-border">•</span>
                    <p>
                        Already verified?{" "}
                        <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}