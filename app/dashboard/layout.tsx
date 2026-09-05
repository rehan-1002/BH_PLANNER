import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { KineticNav } from "@/components/ui/kinetic-nav";
import { CaptureShield } from "@/components/security/capture-shield";

export const metadata = {
  title: "Dashboard — BH Planner",
  description: "Adaptive academic study dashboard.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CaptureShield userEmail="student@bhplanner.internal" enableBlurProtection={true} enableWatermark={true}>
      <div className="relative w-full min-h-screen flex flex-col pt-24 pb-16 px-4 sm:px-8 max-w-7xl mx-auto">
        {/* Global Dashboard Fixed Header Anchors */}
        {/* Top-Left: Theme Toggle */}
        <div className="fixed top-5 left-6 z-50">
          <ThemeToggle />
        </div>

        {/* Top-Center: Kinetic Navigation Dock */}
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-40">
          <KineticNav />
        </div>

        {/* Top-Right: Refined Frosted Logo Badge */}
        <div className="fixed top-5 right-6 z-50">
          <Link
            aria-label="BH Planner Home"
            className="flex items-center justify-center size-9 rounded-xl glass-panel overflow-hidden hover:border-accent transition-colors"
            href="/dashboard/overview"
          >
            <img
              src="/BH LOGO.webp"
              alt="BH Logo"
              className="size-6 object-contain"
            />
          </Link>
        </div>

        {/* Dynamic Route Content */}
        <main className="w-full flex-1 flex flex-col">
          {children}
        </main>
      </div>
    </CaptureShield>
  );
}
