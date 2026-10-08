import type { Metadata } from "next";
import { Geist_Mono, Outfit, Roboto } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/context/auth-context";
import { cn } from "@/lib/utils";

const robotoHeading = Roboto({ subsets: ["latin"], variable: "--font-heading" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-sans" });
const fontMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "CourierPro | Next-Gen Courier & Logistics Platform",
  description: "Automated parcel delivery network, multi-hub routing, and real-time tracking.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        outfit.variable,
        robotoHeading.variable,
        fontMono.variable,
      )}
    >
      <body>
        <AuthProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
