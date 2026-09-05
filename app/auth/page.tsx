import { BhLogo } from "@/components/ui/bh-logo";
import { AuthSwitch } from "@/components/ui/auth-switch";

export const metadata = {
  title: "Authentication — BH Planner",
  description: "Secure gateway for BH Planner academic study planning.",
};

export default function AuthPage() {
  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center px-6 py-20 overflow-hidden">
      {/* Brand Header */}
      <div className="flex flex-col items-center mb-8 space-y-3">
        <BhLogo size="md" withBadge={true} linkTo="/" />
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
