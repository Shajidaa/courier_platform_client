import { Package, MapPin, Truck, Clock } from "lucide-react";

const stats = [
    { icon: Truck, label: "Active deliveries", value: "12,400+" },
    { icon: MapPin, label: "Cities covered", value: "80+" },
    { icon: Clock, label: "Avg. delivery time", value: "24 hrs" },
];

interface AuthLayoutProps {
    children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="flex min-h-screen bg-background">
            {/* Left panel — brand/illustration */}
            <div className="relative hidden flex-col justify-between overflow-hidden bg-primary p-10 lg:flex lg:w-[46%]">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                </div>

                {/* Logo */}
                <div className="relative flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-white/20">
                        <Package className="size-5 text-white" />
                    </div>
                    <span className="font-heading text-xl font-semibold text-white">CourierPro</span>
                </div>

                {/* Center copy */}
                <div className="relative space-y-6">
                    <h2 className="font-heading text-4xl font-semibold leading-tight text-white">
                        Move packages.<br />Deliver trust.
                    </h2>
                    <p className="text-sm leading-relaxed text-white/70">
                        The all-in-one logistics platform for couriers, senders and hub managers. Track every shipment, manage your fleet, and grow your business.
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 pt-2">
                        {stats.map(({ icon: Icon, label, value }) => (
                            <div key={label} className="rounded-xl bg-white/10 p-4">
                                <Icon className="mb-2 size-5 text-white/80" />
                                <p className="font-heading text-lg font-semibold text-white">{value}</p>
                                <p className="text-xs text-white/60">{label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer quote */}
                <p className="relative text-xs text-white/40">
                    &copy; {new Date().getFullYear()} CourierPro. All rights reserved.
                </p>
            </div>

            {/* Right panel — form */}
            <div className="flex flex-1 items-center justify-center px-6 py-12">
                <div className="w-full max-w-[420px]">{children}</div>
            </div>
        </div>
    );
}
