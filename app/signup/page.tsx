"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { ThemeToggle } from "@/components/theme-toggle";

export default function SignUpPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [verificationPending, setVerificationPending] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");

  const supabase = createClient();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard/overview`,
        },
      });

      if (error) {
        setErrorMsg(error.message);
      } else if (data.user && !data.session) {
        // Confirmation email dispatched
        setPendingEmail(email);
        setVerificationPending(true);
      } else if (data.session) {
        router.refresh();
        window.location.href = "/dashboard/overview";
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "An unexpected error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-20 bg-canvas text-foreground selection:bg-accent/30 selection:text-foreground">
      {/* Top-Left: Theme Toggle */}
      <div className="fixed top-5 left-6 z-50">
        <ThemeToggle />
      </div>

      {/* Top-Right: Refined Frosted Logo Badge */}
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

      <AnimatePresence mode="wait">
        {verificationPending ? (
          <motion.div
            key="verify-screen"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="w-full max-w-md p-8 rounded-2xl glass-panel text-center space-y-6 shadow-2xl"
          >
            <div className="size-14 rounded-2xl bg-accent/15 border border-accent/30 flex items-center justify-center mx-auto text-accent shadow-sm">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Verification Dispatched
              </h2>
              <p className="text-sm text-muted leading-relaxed">
                An activation link has been sent to{" "}
                <span className="font-mono text-accent font-semibold">{pendingEmail}</span>.
                Please verify your academic email to unlock your timetable workspace.
              </p>
            </div>

            <div className="pt-2 flex flex-col space-y-3">
              <Link
                href="/auth"
                className="w-full py-3 px-4 rounded-xl bg-accent text-white font-medium text-sm hover:bg-accent/90 transition-colors shadow-md text-center block"
              >
                Proceed to Sign In
              </Link>
              <button
                type="button"
                onClick={() => setVerificationPending(false)}
                className="text-xs text-muted hover:text-foreground font-mono transition-colors"
              >
                ← Back to registration form
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="signup-card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md p-8 rounded-2xl glass-panel space-y-8 shadow-2xl border border-panel-border"
          >
            {/* Header / Brand */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="flex items-center justify-center size-12 rounded-2xl glass-panel overflow-hidden shadow-md">
                <img
                  src="/BH LOGO.webp"
                  alt="BH Logo"
                  className="size-8 object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  Join BH Planner
                </h1>
                <p className="text-xs sm:text-sm text-muted mt-1">
                  Create your account to start adaptive timetable scheduling.
                </p>
              </div>
            </div>

            {/* Error Banner */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Sign Up Form */}
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-muted flex items-center space-x-2">
                  <Mail className="w-3.5 h-3.5 text-accent" />
                  <span>Academic Email</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@university.edu"
                  className="w-full px-4 py-2.5 rounded-xl bg-canvas border border-panel-border focus:border-accent focus:outline-none text-sm text-foreground placeholder:text-muted/50 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-muted flex items-center space-x-2">
                  <Lock className="w-3.5 h-3.5 text-accent" />
                  <span>Password</span>
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full px-4 py-2.5 rounded-xl bg-canvas border border-panel-border focus:border-accent focus:outline-none text-sm text-foreground placeholder:text-muted/50 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-muted flex items-center space-x-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                  <span>Confirm Password</span>
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  className="w-full px-4 py-2.5 rounded-xl bg-canvas border border-panel-border focus:border-accent focus:outline-none text-sm text-foreground placeholder:text-muted/50 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-accent text-white font-medium text-sm hover:bg-accent/90 transition-all flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50 mt-6"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Bottom Navigation */}
            <div className="pt-2 text-center border-t border-panel-border/60">
              <p className="text-xs text-muted font-mono">
                Already have an account?{" "}
                <Link
                  href="/auth"
                  className="text-accent hover:underline font-semibold ml-1 transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Security notice */}
      <div className="mt-8 text-center text-xs text-muted/60 font-mono">
        <span>Email verification strictly enforced prior to timetable access</span>
      </div>
    </div>
  );
}
