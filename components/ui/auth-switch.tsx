"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Loader2,
  ShieldCheck,
  CalendarDays,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

/**
 * @appvibed01/components/auth-switch
 * Split dual-card sliding auth architecture:
 * - Left column: Sign In form
 * - Right column: Sign Up form
 * - Sliding Overlay Panel: Glides between left (x: 0%) and right (x: 100%),
 *   solidly covering the inactive form while exposing the active one with zero overlap.
 * - Mobile: Segmented pill toggle with single visible form.
 */
export function AuthSwitch() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);

  // Form states
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [verificationPending, setVerificationPending] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");

  const supabase = createClient();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: signInEmail,
        password: signInPassword,
      });

      if (error) {
        setErrorMsg(error.message);
      } else if (data.session) {
        if (!data.user.email_confirmed_at) {
          setPendingEmail(signInEmail);
          setVerificationPending(true);
        } else {
          router.push("/dashboard/overview");
        }
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "An unexpected error occurred during sign in");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (signUpPassword !== signUpConfirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    if (signUpPassword.length < 6) {
      setErrorMsg("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: signUpEmail,
        password: signUpPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard/overview`,
        },
      });

      if (error) {
        setErrorMsg(error.message);
      } else if (data.user && !data.session) {
        setPendingEmail(signUpEmail);
        setVerificationPending(true);
      } else {
        router.push("/dashboard/overview");
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "An unexpected error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  if (verificationPending) {
    return (
      <div className="w-full max-w-md p-8 rounded-3xl bg-panel border border-panel-border backdrop-blur-xl text-center shadow-xl">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-accent/15 border border-accent/30 text-accent mb-4">
          <CheckCircle2 className="w-6 h-6" strokeWidth={1.75} />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">Verification Required</h2>
        <p className="text-sm text-muted mb-6 leading-relaxed">
          We sent a verification link to{" "}
          <span className="text-foreground font-mono font-medium">{pendingEmail}</span>.
          Access to student schedules and timetable storage is protected until your email is confirmed.
        </p>
        <div className="p-3.5 rounded-xl bg-panel-solid border border-panel-border text-xs text-muted font-mono mb-6">
          Security policy: Institutional academic privacy requires verified student sessions.
        </div>
        <button
          type="button"
          onClick={() => {
            setVerificationPending(false);
            setIsSignUp(false);
            setErrorMsg(null);
          }}
          className="text-xs text-accent hover:underline font-medium focus:outline-none"
        >
          Return to Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl min-h-[580px] rounded-3xl bg-panel border border-panel-border backdrop-blur-2xl shadow-2xl overflow-hidden relative">
      {/* MOBILE HEADER: Segmented Toggle Pill (< md) */}
      <div className="md:hidden p-6 pb-2 border-b border-panel-border">
        <div className="relative flex items-center p-1 rounded-xl bg-canvas/70 border border-panel-border">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(false);
              setErrorMsg(null);
            }}
            className={`relative z-10 flex-1 py-2 text-xs font-medium transition-colors ${
              !isSignUp ? "text-foreground font-semibold" : "text-muted"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(true);
              setErrorMsg(null);
            }}
            className={`relative z-10 flex-1 py-2 text-xs font-medium transition-colors ${
              isSignUp ? "text-foreground font-semibold" : "text-muted"
            }`}
          >
            Create Account
          </button>
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 450, damping: 35 }}
            className={`absolute inset-y-1 rounded-lg bg-panel-solid border border-panel-border ${
              !isSignUp ? "left-1 right-1/2" : "left-1/2 right-1"
            }`}
          />
        </div>
      </div>

      {/* ERROR ALERT (Centered if present) */}
      {errorMsg && (
        <div className="mx-6 mt-4 p-3 rounded-xl bg-status-missed/10 border border-status-missed/30 text-status-missed text-xs flex items-start space-x-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" strokeWidth={1.75} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* DESKTOP TWO-COLUMN BASE LAYER */}
      <div className="relative w-full min-h-[580px] flex flex-col md:flex-row">
        {/* LEFT COLUMN: Sign In Form Area */}
        <div
          className={`w-full md:w-1/2 p-8 sm:p-10 flex flex-col justify-center transition-opacity duration-300 ${
            isSignUp ? "md:pointer-events-none md:opacity-0" : "opacity-100"
          } ${isSignUp ? "hidden md:flex" : "flex"}`}
        >
          <div className="w-full max-w-sm mx-auto space-y-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-accent font-semibold">
                Access Portal
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-foreground mt-1">
                Sign In to BH Planner
              </h2>
              <p className="text-xs text-muted mt-1">
                Inspect today's schedule blocks and resume your academic cadence.
              </p>
            </div>

            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-1.5">
                  Student Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-muted" strokeWidth={1.5} />
                  <input
                    type="email"
                    required
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    placeholder="student@university.edu"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-canvas/60 border border-panel-border text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent font-sans transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-muted" strokeWidth={1.5} />
                  <input
                    type="password"
                    required
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-canvas/60 border border-panel-border text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent font-sans transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-accent text-white font-medium text-sm transition-all hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-canvas disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-95 mt-2"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: Sign Up Form Area */}
        <div
          className={`w-full md:w-1/2 p-8 sm:p-10 flex flex-col justify-center transition-opacity duration-300 ${
            !isSignUp ? "md:pointer-events-none md:opacity-0" : "opacity-100"
          } ${!isSignUp ? "hidden md:flex" : "flex"}`}
        >
          <div className="w-full max-w-sm mx-auto space-y-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-accent font-semibold">
                New Semester
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-foreground mt-1">
                Create Student Account
              </h2>
              <p className="text-xs text-muted mt-1">
                Configure your fixed commitments, commute, and syllabus runway.
              </p>
            </div>

            <form onSubmit={handleSignUp} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-1.5">
                  Student Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-muted" strokeWidth={1.5} />
                  <input
                    type="email"
                    required
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    placeholder="student@university.edu"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-canvas/60 border border-panel-border text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent font-sans transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-1.5">
                  Create Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-muted" strokeWidth={1.5} />
                  <input
                    type="password"
                    required
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-canvas/60 border border-panel-border text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent font-sans transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-muted" strokeWidth={1.5} />
                  <input
                    type="password"
                    required
                    value={signUpConfirmPassword}
                    onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-canvas/60 border border-panel-border text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent font-sans transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-accent text-white font-medium text-sm transition-all hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-canvas disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-95 mt-2"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Initiate Verification</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* DESKTOP SLIDING OVERLAY PANEL (@appvibed01 signature mechanism) */}
      <motion.div
        initial={false}
        animate={{
          x: isSignUp ? "0%" : "100%",
        }}
        transition={{
          type: "spring",
          stiffness: 240,
          damping: 26,
        }}
        className="hidden md:flex absolute top-0 left-0 w-1/2 h-full z-20 p-10 flex-col justify-between bg-panel-solid border-r border-panel-border shadow-2xl"
        style={{
          borderLeft: isSignUp ? "none" : "1px solid var(--border)",
          borderRight: isSignUp ? "1px solid var(--border)" : "none",
        }}
      >
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-accent/15 border border-accent/25 text-accent text-xs font-mono mb-6">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ACADEMIC INTEGRITY</span>
          </div>

          <h3 className="text-3xl font-extrabold tracking-tight text-foreground leading-tight">
            {isSignUp ? "Welcome back to BH Planner" : "Begin your structured semester"}
          </h3>

          <p className="text-sm text-muted mt-4 leading-relaxed">
            {isSignUp
              ? "Access your active weekly timetable, inspect today's checklist, and run natural-language mutations with Academic Copilot."
              : "Lock in your fixed college lectures and daily commute times. Let our Tier-1 deterministic buffer engine keep your syllabus on track."}
          </p>

          <div className="mt-8 space-y-3 font-mono text-xs text-muted">
            <div className="flex items-center space-x-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span>Tier-1 Deterministic 72h Buffers</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span>Non-Overlapping Fixed Constraints</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span>Exam Runway Timeline Countdown</span>
            </div>
          </div>
        </div>

        {/* Tactile Switch Button */}
        <div className="pt-6 border-t border-panel-border">
          <p className="text-xs text-muted mb-3">
            {isSignUp ? "Already registered your curriculum?" : "Starting a new academic term?"}
          </p>
          <button
            type="button"
            onClick={() => {
              setErrorMsg(null);
              setIsSignUp(!isSignUp);
            }}
            className="group inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl border border-accent/40 bg-accent/10 text-accent hover:bg-accent hover:text-white font-medium text-xs tracking-wide transition-all focus:outline-none focus:ring-1 focus:ring-accent active:scale-95"
          >
            <span>{isSignUp ? "Sign in to existing account" : "Create a new student account"}</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
