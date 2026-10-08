"use client"

import { useEffect } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ModalProps {
    open: boolean
    title: string
    onClose: () => void
    children: React.ReactNode
    className?: string
}

export function Modal({ open, title, onClose, children, className }: ModalProps) {
    // Lock scroll while open
    useEffect(() => {
        if (open) document.body.style.overflow = "hidden"
        else document.body.style.overflow = ""
        return () => { document.body.style.overflow = "" }
    }, [open])

    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
                aria-hidden
            />
            {/* Panel */}
            <div className={cn(
                "relative z-10 w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-xl",
                className,
            )}>
                <div className="mb-5 flex items-center justify-between">
                    <h2 className="font-heading text-lg font-semibold text-foreground">{title}</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                        <X className="size-4" />
                    </button>
                </div>
                {children}
            </div>
        </div>
    )
}
