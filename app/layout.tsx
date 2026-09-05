import type { Metadata } from "next";
import "./globals.css";
import { ThemeToggle } from "@/components/theme-toggle";
import { BhLogo } from "@/components/ui/bh-logo";
import { CaptureShield } from "@/components/security/capture-shield";

export const metadata: Metadata = {
  title: "BH Planner — Adaptive Academic Study Planning",
  description:
    "An adaptive study planning system for students balancing fixed college commitments, commute constraints, syllabus coverage, and approaching exams.",
  icons: {
    icon: "/bh-logo.webp",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="bg-canvas text-foreground min-h-screen relative antialiased selection:bg-accent/30 selection:text-foreground">
        {/* Global Persistent Shell Anchors */}
        <header className="fixed top-5 inset-x-6 z-40 flex items-center justify-between pointer-events-none">
          {/* Top-Left: Theme Toggle */}
          <div className="pointer-events-auto">
            <ThemeToggle />
          </div>

          {/* Top-Right: Canonical BH Logo Frosted Badge */}
          <div className="pointer-events-auto">
            <BhLogo size="sm" withBadge={true} linkTo="/" />
          </div>
        </header>

        {/* Global Security Deterrence Wrapper */}
        <CaptureShield userEmail="student@bhplanner.internal" enableBlurProtection={false} enableWatermark={false}>
          <main className="w-full min-h-screen flex flex-col">
            {children}
          </main>
        </CaptureShield>
      </body>
    </html>
  );
}
