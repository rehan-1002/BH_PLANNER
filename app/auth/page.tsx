import { Suspense } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { AuthSwitch } from "@/components/ui/auth-switch";

export const metadata = {
  title: "Academic Access Gateway — BH Planner",
  description: "Secure authentication gateway for BH Planner adaptive study scheduling.",
};

export default function AuthPage() {
  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-20 bg-canvas text-foreground selection:bg-accent/30 selection:text-foreground">
      <div className="fixed top-5 left-6 z-50">
        <ThemeToggle />
      </div>

      <div className="fixed top-5 right-6 z-50">
        <Link
          aria-label="BH Planner Home"
          className="flex items-center justify-center size-9 rounded-xl glass-panel overflow-hidden hover:border-accent transition-colors"
          href="/"
        >
          <img
            src="/BH LOGO.webp"
            alt="BH Logo"
            className="size-6 object-contain"
          />
        </Link>
      </div>

      <div className="flex flex-col items-center mb-8 space-y-3 text-center">
        <div className="flex items-center justify-center size-12 rounded-2xl glass-panel overflow-hidden shadow-md">
          <img
            src="/BH LOGO.webp"
            alt="BH Logo"
            className="size-8 object-contain"
          />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Academic Access Gateway
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-1 max-w-sm">
            Sign in to inspect your adaptive timetable or create your semester runway.
          </p>
        </div>
      </div>

      <div className="w-full flex justify-center">
        <Suspense
          fallback={
            <div className="w-full max-w-3xl min-h-[560px] rounded-3xl glass-panel animate-pulse flex items-center justify-center text-muted font-mono text-xs">
              Loading Gateway...
            </div>
          }
        >
          <AuthSwitch />
        </Suspense>
      </div>

      <div className="mt-8 text-center text-xs text-muted/60 font-mono">
        <span>Email verification strictly enforced prior to timetable access</span>
      </div>
    </div>
  );
}
