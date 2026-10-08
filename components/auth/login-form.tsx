"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FormErrors {
    email?: string;
    password?: string;
    root?: string;
}

function validate(email: string, password: string): FormErrors {
    const errors: FormErrors = {};
    if (!email) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email";
    if (!password) errors.password = "Password is required";
    return errors;
}

export function LoginForm() {
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [isPending, setIsPending] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validated = validate(email, password);
        if (Object.keys(validated).length > 0) {
            setErrors(validated);
            return;
        }
        setErrors({});
        setIsPending(true);
        try {
            await login({ email, password });
        } catch (err) {
            setErrors({
                root: err instanceof Error ? err.message : "Invalid email or password.",
            });
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className="flex flex-col gap-8">
            {/* Header */}
            <div className="flex flex-col gap-1">
                <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
                    Welcome back
                </h1>
                <p className="text-sm text-muted-foreground">
                    Sign in to your CourierPro account
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
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

                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-foreground">Password</label>
                        <Link href="/forgot-password" className="text-xs text-primary underline-offset-4 hover:underline">
                            Forgot password?
                        </Link>
                    </div>
                    <Input
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={errors.password}
                        disabled={isPending}
                        leftIcon={<Lock />}
                        rightElement={
                            <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                className="text-muted-foreground transition-colors hover:text-foreground"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                            </button>
                        }
                    />
                </div>

                {/* Root error */}
                {errors.root && (
                    <div
                        role="alert"
                        className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/8 px-4 py-3 text-sm text-destructive"
                    >
                        <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-destructive" />
                        {errors.root}
                    </div>
                )}

                <Button
                    type="submit"
                    size="lg"
                    className="mt-1 w-full"
                    disabled={isPending}
                >
                    {isPending && <Loader2 className="size-4 animate-spin" />}
                    {isPending ? "Signing in…" : "Sign in"}
                </Button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3">
                <hr className="flex-1 border-border" />
                <span className="text-xs text-muted-foreground">or</span>
                <hr className="flex-1 border-border" />
            </div>

            {/* Footer */}
            <p className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link
                    href="/register"
                    className="font-medium text-primary underline-offset-4 hover:underline"
                >
                    Create one
                </Link>
            </p>
        </div>
    );
}
