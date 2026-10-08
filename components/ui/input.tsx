import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
    leftIcon?: React.ReactNode;
    rightElement?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, hint, leftIcon, rightElement, id, ...props }, ref) => {
        const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

        return (
            <div className="flex flex-col gap-1.5">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="text-sm font-medium text-foreground"
                    >
                        {label}
                    </label>
                )}
                <div className="relative flex items-center">
                    {leftIcon && (
                        <span className="absolute left-3 text-muted-foreground [&_svg]:size-4">
                            {leftIcon}
                        </span>
                    )}
                    <input
                        ref={ref}
                        id={inputId}
                        aria-invalid={!!error}
                        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
                        className={cn(
                            "h-11 w-full rounded-xl border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground",
                            "outline-none transition-all focus:border-primary focus:ring-3 focus:ring-primary/15",
                            "disabled:cursor-not-allowed disabled:opacity-50",
                            "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/15",
                            leftIcon ? "pl-10" : "pl-4",
                            rightElement ? "pr-11" : "pr-4",
                            className,
                        )}
                        {...props}
                    />
                    {rightElement && (
                        <span className="absolute right-3">{rightElement}</span>
                    )}
                </div>
                {error && (
                    <p id={`${inputId}-error`} role="alert" className="text-xs text-destructive">
                        {error}
                    </p>
                )}
                {hint && !error && (
                    <p id={`${inputId}-hint`} className="text-xs text-muted-foreground">
                        {hint}
                    </p>
                )}
            </div>
        );
    },
);
Input.displayName = "Input";

export { Input };
