"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2, Lock, Mail, User, ChevronRight } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import type { IRegisterPayload } from "@/types/auth.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Gender = "MALE" | "FEMALE" ;
type Role = "RIDER" | "SENDER";

interface Fields {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    gender: Gender | "";
    role: Role;
}

interface Errors {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    gender?: string;
    root?: string;
}

function validate(f: Fields): Errors {
    const e: Errors = {};
    if (!f.name.trim()) e.name = "Full name is required";
    else if (f.name.trim().length < 2) e.name = "At least 2 characters";
    if (!f.email) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = "Enter a valid email";
    if (!f.password) e.password = "Password is required";
    else if (f.password.length < 6) e.password = "At least 6 characters";
    if (!f.confirmPassword) e.confirmPassword = "Please confirm your password";
    else if (f.password !== f.confirmPassword) e.confirmPassword = "Passwords do not match";
    if (!f.gender) e.gender = "Please select your gender";
    return e;
}

export function RegisterForm() {
    const { register } = useAuth();

    const [fields, setFields] = useState<Fields>({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        gender: "",
        role: "SENDER",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [errors, setErrors] = useState<Errors>({});
    const [isPending, setIsPending] = useState(false);

    const set =
        (key: keyof Fields) =>
            (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
                setFields((f) => ({ ...f, [key]: e.target.value }));

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        const errs = validate(fields);
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }
        setErrors({});
        setIsPending(true);
        try {
            const payload: IRegisterPayload = {
                name: fields.name.trim(),
                email: fields.email.trim().toLowerCase(),
                password: fields.password,
                gender: fields.gender as Gender,
                role: fields.role,
            };
            await register(payload); // hook handles redirect to /verify-email
        } catch (err) {
            setErrors({ root: err instanceof Error ? err.message : "Registration failed. Please try again." });
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className="flex flex-col gap-8">
            {/* Header */}
            <div>
                <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
                    Create your account
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Join CourierPro to start sending or delivering packages
                </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                <Input
                    label="Full name"
                    type="text"
                    autoComplete="name"
                    placeholder="John Doe"
                    value={fields.name}
                    onChange={set("name")}
                    error={errors.name}
                    disabled={isPending}
                    leftIcon={<User />}
                />

                <Input
                    label="Email address"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={fields.email}
                    onChange={set("email")}
                    error={errors.email}
                    disabled={isPending}
                    leftIcon={<Mail />}
                />

                {/* Gender + Role */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="gender" className="text-sm font-medium text-foreground">
                            Gender
                        </label>
                        <select
                            id="gender"
                            value={fields.gender}
                            onChange={set("gender")}
                            disabled={isPending}
                            aria-invalid={!!errors.gender}
                            className={cn(
                                "h-11 w-full appearance-none rounded-xl border border-input bg-background px-4 text-sm text-foreground",
                                "outline-none transition-all focus:border-primary focus:ring-3 focus:ring-primary/15",
                                "disabled:opacity-50",
                                errors.gender && "border-destructive ring-3 ring-destructive/15",
                                !fields.gender && "text-muted-foreground",
                            )}
                        >
                            <option value="" disabled>Select</option>
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                            <option value="OTHER">Other</option>
                        </select>
                        {errors.gender && (
                            <p role="alert" className="text-xs text-destructive">{errors.gender}</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="role" className="text-sm font-medium text-foreground">
                            I am a
                        </label>
                        <select
                            id="role"
                            value={fields.role}
                            onChange={set("role")}
                            disabled={isPending}
                            className={cn(
                                "h-11 w-full appearance-none rounded-xl border border-input bg-background px-4 text-sm text-foreground",
                                "outline-none transition-all focus:border-primary focus:ring-3 focus:ring-primary/15",
                                "disabled:opacity-50",
                            )}
                        >
                            <option value="SENDER">Sender</option>
                            <option value="RIDER">Rider</option>
                        </select>
                    </div>
                </div>

                <Input
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Min. 6 characters"
                    value={fields.password}
                    onChange={set("password")}
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

                <Input
                    label="Confirm password"
                    type={showConfirm ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Repeat your password"
                    value={fields.confirmPassword}
                    onChange={set("confirmPassword")}
                    error={errors.confirmPassword}
                    disabled={isPending}
                    leftIcon={<Lock />}
                    rightElement={
                        <button
                            type="button"
                            onClick={() => setShowConfirm((v) => !v)}
                            className="text-muted-foreground transition-colors hover:text-foreground"
                            aria-label={showConfirm ? "Hide password" : "Show password"}
                            tabIndex={-1}
                        >
                            {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                    }
                />

                {errors.root && (
                    <div
                        role="alert"
                        className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/8 px-4 py-3 text-sm text-destructive"
                    >
                        <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-destructive" />
                        {errors.root}
                    </div>
                )}

                <Button type="submit" size="lg" className="mt-1 w-full" disabled={isPending}>
                    {isPending && <Loader2 className="size-4 animate-spin" />}
                    {isPending ? "Creating account…" : (
                        <>Continue <ChevronRight className="size-4" /></>
                    )}
                </Button>
            </form>

            <div className="flex items-center gap-3">
                <hr className="flex-1 border-border" />
                <span className="text-xs text-muted-foreground">or</span>
                <hr className="flex-1 border-border" />
            </div>

            <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
                    Sign in
                </Link>
            </p>
        </div>
    );
}
