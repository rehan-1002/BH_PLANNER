"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Loader2,
  ShieldCheck,
  Sparkles,
  CalendarCheck,
  Hourglass,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface AuthSwitchProps {
  initialMode?: "signin" | "signup";
}

/**
 * @appvibed01/components/auth-switch
 * Dual-Mode Physical Sliding Curtain Authentication Switch:
 * - Two-column base container (Sign In on left, Sign Up on right)
 * - Sliding frosted curtain overlay with spring motion physics
 * - Interactive Show/Hide Password buttons
 * - High-visibility styling across both Dark (#0d0b14) & Light (#f8f7fc) themes
 * - Supabase authentication integration & email verification gating
 */
export function AuthSwitch({ initialMode = "signin" }: AuthSwitchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Mode state ("signin" or "signup")
  const urlMode = searchParams?.get("mode");
  const [mode, setMode] = useState<"signin" | "signup">(
    urlMode === "signup" ? "signup" : initialMode
  );

  useEffect(() => {
    if (urlMode === "signup" || urlMode === "signin") {
      setMode(urlMode);
    }
  }, [urlMode]);

  // Form states
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [showSignInPassword, setShowSignInPassword] = useState(false);

  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState("");
  const [showSignUpConfirmPassword, setShowSignUpConfirmPassword] = useState(false);

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
      } else if (data.session) {
        router.push("/dashboard/overview");
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "An unexpected error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  // Mandatory Email Verification Lockout Card
  if (verificationPending) {
    return (
      <div className="w-full max-w-md p-8 rounded-3xl glass-panel text-center shadow-2xl border border-panel-border space-y-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/15 border border-accent/30 text-accent shadow-sm">
          <CheckCircle2 className="w-7 h-7" strokeWidth={2} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground tracking-tight">
            Verification Dispatched
          </h2>
          <p className="text-xs sm:text-sm text-muted mt-2 leading-relaxed">
            We sent an activation link to{" "}
            <span className="text-accent font-mono font-semibold">{pendingEmail}</span>.
            Please verify your academic email to unlock your timetable workspace.
          </p>
        </div>
        <div className="p-3 rounded-xl bg-panel-solid border border-panel-border text-xs text-muted font-mono">
          Security Policy: Institutional privacy requires verified student sessions.
        </div>
        <button
          type="button"
          onClick={() => {
            setVerificationPending(false);
            setMode("signin");
            setErrorMsg(null);
          }}
          className="w-full py-2.5 px-4 rounded-xl bg-accent text-white font-medium text-xs hover:bg-accent-hover transition-colors shadow-md focus:outline-none"
        >
          Return to Sign In
        </button>
      </div>
    );
  }

  const isSignUp = mode === "signup";

  return (
    <div className="relative w-full max-w-3xl min-h-[560px] overflow-hidden rounded-3xl glass-panel shadow-2xl border border-panel-border">
      {/* =================================================================== */}
      {/* MOBILE SEGMENTED CONTROL (< md)                                     */}
      {/* =================================================================== */}
      <div className="md:hidden p-4 border-b border-panel-border bg-canvas/40">
        <div className="relative flex items-center p-1 rounded-xl bg-canvas/80 border border-panel-border">
          <button
            type="button"
            onClick={() => {
              setMode("signin");
              setErrorMsg(null);
            }}
            className={`relative z-10 flex-1 py-2 text-xs font-medium transition-colors ${
              !isSignUp ? "text-foreground font-bold" : "text-muted hover:text-foreground"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setErrorMsg(null);
            }}
            className={`relative z-10 flex-1 py-2 text-xs font-medium transition-colors ${
              isSignUp ? "text-foreground font-bold" : "text-muted hover:text-foreground"
            }`}
          >
            Create Account
          </button>
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className={`absolute inset-y-1 rounded-lg bg-panel-solid border border-panel-border shadow-sm ${
              !isSignUp ? "left-1 right-1/2" : "left-1/2 right-1"
            }`}
          />
        </div>
      </div>

      {/* ERROR MESSAGE NOTIFICATION */}
      <AnimatePresence>
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mx-6 mt-4 p-3 rounded-xl bg-status-missed/10 border border-status-missed/30 text-status-missed text-xs flex items-center space-x-2"
          >
            <AlertCircle className="w-4 h-4 shrink-0" strokeWidth={2} />
            <span className="font-medium">{errorMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =================================================================== */}
      {/* TWO-COLUMN BASE LAYER                                               */}
      {/* =================================================================== */}
      <div className="relative w-full min-h-[560px] flex flex-col md:flex-row">
        {/* ================================================================= */}
        {/* LEFT COLUMN: SIGN IN FORM (revealed when curtain slides to right)   */}
        {/* ================================================================= */}
        <div
          className={`w-full md:w-1/2 p-6 sm:p-10 flex flex-col justify-center transition-opacity duration-300 ${
            isSignUp ? "md:pointer-events-none md:opacity-20" : "opacity-100"
          } ${isSignUp ? "hidden md:flex" : "flex"}`}
        >
          <div className="w-full max-w-sm mx-auto space-y-6">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-bold px-2 py-0.5 rounded-md bg-accent/10 border border-accent/20">
                Access Portal
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-foreground mt-2">
                Sign In
              </h2>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                Resume your adaptive study runway and timetable checklist.
              </p>
            </div>

            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-muted font-medium mb-1.5">
                  Academic Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-muted pointer-events-none" strokeWidth={1.75} />
                  <input
                    type="email"
                    required
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    placeholder="student@university.edu"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-canvas/70 border border-panel-border text-xs sm:text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent font-sans transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-muted font-medium mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-muted pointer-events-none" strokeWidth={1.75} />
                  <input
                    type={showSignInPassword ? "text" : "password"}
                    required
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-canvas/70 border border-panel-border text-xs sm:text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent font-sans transition-colors"
                  />
                  {/* Show / Hide Password Button */}
                  <button
                    type="button"
                    onClick={() => setShowSignInPassword(!showSignInPassword)}
                    className="absolute right-3 top-2.5 p-1 text-muted hover:text-foreground transition-colors focus:outline-none rounded-lg"
                    aria-label={showSignInPassword ? "Hide password" : "Show password"}
                  >
                    {showSignInPassword ? (
                      <EyeOff className="w-4 h-4 text-accent" strokeWidth={1.75} />
                    ) : (
                      <Eye className="w-4 h-4" strokeWidth={1.75} />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-accent text-white font-medium text-xs sm:text-sm transition-all hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-canvas disabled:opacity-50 disabled:cursor-not-allowed shadow-md active:scale-95 mt-2"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-2 text-center md:hidden">
              <button
                type="button"
                onClick={() => {
                  setErrorMsg(null);
                  setMode("signup");
                }}
                className="text-xs text-muted font-mono hover:text-accent transition-colors"
              >
                Don&apos;t have an account? <span className="text-accent font-bold">Create Account</span>
              </button>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* RIGHT COLUMN: SIGN UP FORM (revealed when curtain slides to left)  */}
        {/* ================================================================= */}
        <div
          className={`w-full md:w-1/2 p-6 sm:p-10 flex flex-col justify-center transition-opacity duration-300 ${
            !isSignUp ? "md:pointer-events-none md:opacity-20" : "opacity-100"
          } ${!isSignUp ? "hidden md:flex" : "flex"}`}
        >
          <div className="w-full max-w-sm mx-auto space-y-5">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-bold px-2 py-0.5 rounded-md bg-accent/10 border border-accent/20">
                New Semester
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-foreground mt-2">
                Create Account
              </h2>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                Configure your lecture commitments, study blocks, and syllabus.
              </p>
            </div>

            <form onSubmit={handleSignUp} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-muted font-medium mb-1.5">
                  Student Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-muted pointer-events-none" strokeWidth={1.75} />
                  <input
                    type="email"
                    required
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    placeholder="student@university.edu"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-canvas/70 border border-panel-border text-xs sm:text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent font-sans transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-muted font-medium mb-1.5">
                  Create Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-muted pointer-events-none" strokeWidth={1.75} />
                  <input
                    type={showSignUpPassword ? "text" : "password"}
                    required
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-canvas/70 border border-panel-border text-xs sm:text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent font-sans transition-colors"
                  />
                  {/* Show / Hide Password Button */}
                  <button
                    type="button"
                    onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                    className="absolute right-3 top-2.5 p-1 text-muted hover:text-foreground transition-colors focus:outline-none rounded-lg"
                    aria-label={showSignUpPassword ? "Hide password" : "Show password"}
                  >
                    {showSignUpPassword ? (
                      <EyeOff className="w-4 h-4 text-accent" strokeWidth={1.75} />
                    ) : (
                      <Eye className="w-4 h-4" strokeWidth={1.75} />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-muted font-medium mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-muted pointer-events-none" strokeWidth={1.75} />
                  <input
                    type={showSignUpConfirmPassword ? "text" : "password"}
                    required
                    value={signUpConfirmPassword}
                    onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-canvas/70 border border-panel-border text-xs sm:text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent font-sans transition-colors"
                  />
                  {/* Show / Hide Password Button */}
                  <button
                    type="button"
                    onClick={() => setShowSignUpConfirmPassword(!showSignUpConfirmPassword)}
                    className="absolute right-3 top-2.5 p-1 text-muted hover:text-foreground transition-colors focus:outline-none rounded-lg"
                    aria-label={showSignUpConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                  >
                    {showSignUpConfirmPassword ? (
                      <EyeOff className="w-4 h-4 text-accent" strokeWidth={1.75} />
                    ) : (
                      <Eye className="w-4 h-4" strokeWidth={1.75} />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-accent text-white font-medium text-xs sm:text-sm transition-all hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-canvas disabled:opacity-50 disabled:cursor-not-allowed shadow-md active:scale-95 mt-1"
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

            <div className="pt-2 text-center md:hidden">
              <button
                type="button"
                onClick={() => {
                  setErrorMsg(null);
                  setMode("signin");
                }}
                className="text-xs text-muted font-mono hover:text-accent transition-colors"
              >
                Already have an account? <span className="text-accent font-bold">Sign In</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* SLIDING FROSTED CURTAIN OVERLAY (@appvibed01 Signature Primitive)   */}
      {/* =================================================================== */}
      <motion.div
        initial={false}
        animate={{
          x: isSignUp ? "0%" : "100%",
        }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 25,
        }}
        className="hidden md:flex absolute top-0 bottom-0 w-1/2 z-20 p-8 sm:p-10 flex-col justify-between bg-panel-solid backdrop-blur-2xl shadow-2xl"
        style={{
          borderLeft: isSignUp ? "none" : "1px solid var(--border)",
          borderRight: isSignUp ? "1px solid var(--border)" : "none",
        }}
      >
        <div className="space-y-6">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-accent/15 border border-accent/25 text-accent text-[11px] font-mono font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ACADEMIC INTEGRITY</span>
          </div>

          <div>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-snug">
              {isSignUp ? "Welcome Back to BH Planner" : "Begin Your Structured Semester"}
            </h3>

            <p className="text-xs sm:text-sm text-muted mt-3 leading-relaxed">
              {isSignUp
                ? "Access your active weekly timetable, inspect today's checklist, and run natural-language mutations with Academic Copilot."
                : "Lock in your fixed college lectures and daily commute times. Let our Tier-1 deterministic buffer engine keep your syllabus on track."}
            </p>
          </div>

          <div className="space-y-3 pt-2 font-mono text-xs text-muted">
            <div className="flex items-center space-x-3">
              <div className="size-6 rounded-lg bg-accent/15 flex items-center justify-center text-accent">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="text-foreground font-medium">Tier-1 Deterministic Buffers</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="size-6 rounded-lg bg-accent/15 flex items-center justify-center text-accent">
                <CalendarCheck className="w-3.5 h-3.5" />
              </div>
              <span className="text-foreground font-medium">Non-Overlapping Fixed Constraints</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="size-6 rounded-lg bg-accent/15 flex items-center justify-center text-accent">
                <Hourglass className="w-3.5 h-3.5" />
              </div>
              <span className="text-foreground font-medium">Exam Runway Timeline Countdown</span>
            </div>
          </div>
        </div>

        {/* Curtain Toggle Button */}
        <div className="pt-6 border-t border-panel-border">
          <p className="text-xs text-muted mb-3 font-mono">
            {isSignUp ? "Already registered your curriculum?" : "Starting a new academic term?"}
          </p>
          <button
            type="button"
            onClick={() => {
              setErrorMsg(null);
              setMode(isSignUp ? "signin" : "signup");
            }}
            className="group inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl border border-accent/40 bg-accent/10 text-accent hover:bg-accent hover:text-white font-semibold text-xs tracking-wide transition-all focus:outline-none focus:ring-2 focus:ring-accent active:scale-95 shadow-sm"
          >
            <span>{isSignUp ? "Sign In Instead" : "Create Account"}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
