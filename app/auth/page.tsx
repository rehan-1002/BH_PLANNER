import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { AuthSwitch } from "@/components/ui/auth-switch";

export const metadata = {
  title: "Authentication — BH Planner",
  description: "Secure gateway for BH Planner academic study planning.",
};

export default function AuthPage() {
  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center px-6 py-20 overflow-hidden">
      {/* Top-Left: Theme Toggle */}
      <div className="fixed top-5 left-6 z-50">
        <ThemeToggle />
      </div>

      {/* Top-Right: Refined Frosted Logo Badge */}
      <div className="fixed top-5 right-6 z-50">
        <Link
          aria-label="BH Planner Home"
          className="flex items-center justify-center size-9 rounded-xl border border-[rgba(147,112,219,0.2)] bg-[rgba(26,21,38,0.55)] backdrop-blur-md overflow-hidden hover:border-[#8b5cf6] transition-colors"
          href="/"
        >
          <img
            src="/BH LOGO.webp"
            alt="BH Logo"
            className="size-6 object-contain"
          />
        </Link>
      </div>

      {/* Brand Header */}
      <div className="flex flex-col items-center mb-8 space-y-3">
        <div className="flex items-center justify-center size-12 rounded-2xl border border-[rgba(147,112,219,0.25)] bg-[rgba(26,21,38,0.65)] backdrop-blur-md overflow-hidden shadow-md">
          <img
            src="/BH LOGO.webp"
            alt="BH Logo"
            className="size-8 object-contain"
          />
        </div>
        <div className="text-center">
          <h1 className="text-lg font-medium text-foreground tracking-tight">
            Academic Access Gateway
          </h1>
          <p className="text-xs text-muted">
            Authenticate to access your adaptive timetable and study runway.
          </p>
        </div>
      </div>

      {/* Sliding Auth Panel */}
      <AuthSwitch />

      {/* Security notice */}
      <div className="mt-8 text-center text-xs text-muted/60 font-mono">
        <span>Email verification strictly enforced prior to timetable access</span>
      </div>
    </div>
  );
}
