"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface AuthSwitchProps {
  initialMode?: "signin" | "signup";
}

export function AuthSwitch({ initialMode = "signin" }: AuthSwitchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlMode = searchParams?.get("mode");
  const [isSignUp, setIsSignUp] = useState(
    urlMode === "signup" || initialMode === "signup"
  );

  useEffect(() => {
    if (urlMode === "signup") setIsSignUp(true);
    else if (urlMode === "signin") setIsSignUp(false);
  }, [urlMode]);

  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [showSignInPassword, setShowSignInPassword] = useState(false);

  const [signUpUsername, setSignUpUsername] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);

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
        router.refresh();
        window.location.href = "/dashboard/overview";
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
          data: {
            username: signUpUsername || signUpEmail.split("@")[0],
          },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard/overview`,
        },
      });

      if (error) {
        setErrorMsg(error.message);
      } else if (data.user && !data.session) {
        setPendingEmail(signUpEmail);
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
            setIsSignUp(false);
            setErrorMsg(null);
          }}
          className="w-full py-2.5 px-4 rounded-xl bg-accent text-white font-medium text-xs hover:bg-accent-hover transition-colors shadow-md focus:outline-none"
        >
          Return to Sign In
        </button>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .as-container {
          position: relative;
          width: 100%;
          max-width: 920px;
          height: 560px;
          border-radius: 24px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);
          overflow: hidden;
          transition: background-color 0.3s ease, border-color 0.3s ease;
        }

        html.dark .as-container {
          background: rgba(26, 21, 38, 0.85);
          border: 1px solid rgba(147, 112, 219, 0.22);
          backdrop-filter: blur(20px);
        }

        html.light .as-container {
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(139, 92, 246, 0.25);
          box-shadow: 0 20px 50px rgba(139, 92, 246, 0.12);
        }

        .as-forms-container {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
        }

        .as-signin-signup {
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          left: 75%;
          width: 50%;
          transition: 1s 0.7s ease-in-out;
          display: grid;
          grid-template-columns: 1fr;
          z-index: 5;
        }

        .as-form {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          padding: 0 3.5rem;
          transition: all 0.2s 0.7s;
          overflow: hidden;
          grid-column: 1 / 2;
          grid-row: 1 / 2;
          width: 100%;
        }

        .as-form.as-sign-up-form {
          opacity: 0;
          z-index: 1;
          pointer-events: none;
        }

        .as-form.as-sign-in-form {
          z-index: 2;
          opacity: 1;
          pointer-events: all;
        }

        .as-title {
          font-size: 2rem;
          margin-bottom: 8px;
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        html.dark .as-title {
          color: #f3f0f9;
        }

        html.light .as-title {
          color: #120e1f;
        }

        .as-input-field {
          max-width: 360px;
          width: 100%;
          margin: 8px 0;
          height: 52px;
          border-radius: 52px;
          display: flex;
          align-items: center;
          padding: 0 1.2rem;
          position: relative;
          transition: 0.3s;
        }

        html.dark .as-input-field {
          background-color: rgba(13, 11, 20, 0.75);
          border: 1px solid rgba(147, 112, 219, 0.25);
        }

        html.light .as-input-field {
          background-color: #f2edf9;
          border: 1px solid rgba(139, 92, 246, 0.25);
        }

        .as-input-field:focus-within {
          box-shadow: 0 0 0 2px #8b5cf6;
        }

        .as-input-icon {
          color: #8b5cf6;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          margin-right: 12px;
        }

        .as-input {
          background: none;
          outline: none;
          border: none;
          line-height: 1;
          font-weight: 500;
          font-size: 0.92rem;
          width: 100%;
        }

        html.dark .as-input {
          color: #f3f0f9;
        }

        html.light .as-input {
          color: #120e1f;
        }

        .as-input::placeholder {
          font-weight: 400;
        }

        html.dark .as-input::placeholder {
          color: #857e96;
        }

        html.light .as-input::placeholder {
          color: #7a708c;
        }

        .as-password-toggle {
          background: none;
          border: none;
          cursor: pointer;
          color: #8b5cf6;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          margin-left: 6px;
          transition: opacity 0.2s;
        }

        .as-password-toggle:hover {
          opacity: 0.8;
        }

        .as-btn {
          width: 160px;
          background-color: #8b5cf6;
          border: none;
          outline: none;
          height: 46px;
          border-radius: 46px;
          color: #fff;
          text-transform: uppercase;
          font-weight: 700;
          margin: 12px 0 6px 0;
          cursor: pointer;
          transition: 0.4s;
          font-size: 0.82rem;
          letter-spacing: 0.04em;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 14px rgba(139, 92, 246, 0.4);
        }

        .as-btn:hover {
          background-color: #7c3aed;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(139, 92, 246, 0.55);
        }

        .as-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .as-panels-container {
          position: absolute;
          height: 100%;
          width: 100%;
          top: 0;
          left: 0;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
        }

        .as-panel {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: space-around;
          text-align: center;
          z-index: 6;
        }

        .as-left-panel {
          pointer-events: all;
          padding: 3rem 16% 2rem 10%;
        }

        .as-right-panel {
          pointer-events: none;
          padding: 3rem 10% 2rem 16%;
        }

        .as-panel .as-content {
          color: #ffffff;
          transition: transform 0.9s ease-in-out;
          transition-delay: 0.6s;
        }

        .as-panel h3 {
          font-weight: 700;
          line-height: 1.2;
          font-size: 1.65rem;
          margin-bottom: 12px;
          letter-spacing: -0.02em;
        }

        .as-panel p {
          font-size: 0.92rem;
          padding: 0.6rem 0;
          line-height: 1.5;
          opacity: 0.95;
        }

        .as-btn.as-transparent {
          margin-top: 14px;
          background: none;
          border: 2px solid #ffffff;
          width: 140px;
          height: 42px;
          font-weight: 700;
          font-size: 0.8rem;
          color: #ffffff;
          box-shadow: none;
        }

        .as-btn.as-transparent:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .as-right-panel .as-content {
          transform: translateX(800px);
        }

        .as-container:before {
          content: "";
          position: absolute;
          height: 2000px;
          width: 2000px;
          top: -10%;
          right: 48%;
          transform: translateY(-50%);
          background: linear-gradient(-45deg, #8b5cf6 0%, #6d28d9 100%);
          transition: 1.8s ease-in-out;
          border-radius: 50%;
          z-index: 6;
          box-shadow: 0 0 50px rgba(109, 40, 217, 0.4);
        }

        .as-container.as-sign-up-mode:before {
          transform: translate(100%, -50%);
          right: 52%;
        }

        .as-container.as-sign-up-mode .as-left-panel .as-content {
          transform: translateX(-800px);
        }

        .as-container.as-sign-up-mode .as-signin-signup {
          left: 25%;
        }

        .as-container.as-sign-up-mode .as-form.as-sign-up-form {
          opacity: 1;
          z-index: 2;
          pointer-events: all;
        }

        .as-container.as-sign-up-mode .as-form.as-sign-in-form {
          opacity: 0;
          z-index: 1;
          pointer-events: none;
        }

        .as-container.as-sign-up-mode .as-right-panel .as-content {
          transform: translateX(0%);
        }

        .as-container.as-sign-up-mode .as-left-panel {
          pointer-events: none;
        }

        .as-container.as-sign-up-mode .as-right-panel {
          pointer-events: all;
        }

        .as-error-box {
          margin-bottom: 10px;
          padding: 8px 14px;
          border-radius: 12px;
          background: rgba(239, 68, 68, 0.12);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #ef4444;
          font-size: 0.78rem;
          display: flex;
          align-items: center;
          gap: 8px;
          max-width: 360px;
          width: 100%;
        }

        @media (max-width: 870px) {
          .as-container {
            min-height: 680px;
            height: auto;
          }
          .as-signin-signup {
            width: 100%;
            top: 92%;
            transform: translate(-50%, -100%);
            transition: 1s 0.8s ease-in-out;
          }
          .as-signin-signup,
          .as-container.as-sign-up-mode .as-signin-signup {
            left: 50%;
          }
          .as-panels-container {
            grid-template-columns: 1fr;
            grid-template-rows: 1fr 2fr 1fr;
          }
          .as-panel {
            flex-direction: row;
            justify-content: space-around;
            align-items: center;
            padding: 2.2rem 8%;
            grid-column: 1 / 2;
          }
          .as-right-panel {
            grid-row: 3 / 4;
          }
          .as-left-panel {
            grid-row: 1 / 2;
          }
          .as-panel .as-content {
            padding-right: 10%;
            transition: transform 0.9s ease-in-out;
            transition-delay: 0.8s;
          }
          .as-panel h3 {
            font-size: 1.3rem;
          }
          .as-panel p {
            font-size: 0.78rem;
            padding: 0.3rem 0;
          }
          .as-btn.as-transparent {
            width: 110px;
            height: 36px;
            font-size: 0.72rem;
          }
          .as-container:before {
            width: 1500px;
            height: 1500px;
            transform: translateX(-50%);
            left: 30%;
            bottom: 68%;
            right: initial;
            top: initial;
            transition: 2s ease-in-out;
          }
          .as-container.as-sign-up-mode:before {
            transform: translate(-50%, 100%);
            bottom: 32%;
            right: initial;
          }
          .as-container.as-sign-up-mode .as-left-panel .as-content {
            transform: translateY(-300px);
          }
          .as-container.as-sign-up-mode .as-right-panel .as-content {
            transform: translateY(0px);
          }
          .as-right-panel .as-content {
            transform: translateY(300px);
          }
          .as-container.as-sign-up-mode .as-signin-signup {
            top: 8%;
            transform: translate(-50%, 0);
          }
        }

        @media (max-width: 570px) {
          .as-form {
            padding: 0 1.5rem;
          }
          .as-panel .as-content {
            padding: 0.5rem 1rem;
          }
        }
      `}</style>

      <div className={`as-container ${isSignUp ? "as-sign-up-mode" : ""}`}>
        <div className="as-forms-container">
          <div className="as-signin-signup">
            {/* ============================================================= */}
            {/* SIGN IN FORM                                                  */}
            {/* ============================================================= */}
            <form onSubmit={handleSignIn} className="as-form as-sign-in-form">
              <h2 className="as-title">Sign in</h2>

              {errorMsg && !isSignUp && (
                <div className="as-error-box">
                  <AlertCircle size={15} />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="as-input-field">
                <span className="as-input-icon">
                  <Mail size={18} />
                </span>
                <input
                  type="email"
                  required
                  placeholder="Email"
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  className="as-input"
                />
              </div>

              <div className="as-input-field">
                <span className="as-input-icon">
                  <Lock size={18} />
                </span>
                <input
                  type={showSignInPassword ? "text" : "password"}
                  required
                  placeholder="Password"
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  className="as-input"
                />
                <button
                  type="button"
                  onClick={() => setShowSignInPassword(!showSignInPassword)}
                  className="as-password-toggle"
                  aria-label={showSignInPassword ? "Hide password" : "Show password"}
                >
                  {showSignInPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <button type="submit" disabled={loading} className="as-btn">
                {loading && !isSignUp ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  "Login"
                )}
              </button>
            </form>

            {/* ============================================================= */}
            {/* SIGN UP FORM                                                  */}
            {/* ============================================================= */}
            <form onSubmit={handleSignUp} className="as-form as-sign-up-form">
              <h2 className="as-title">Sign up</h2>

              {errorMsg && isSignUp && (
                <div className="as-error-box">
                  <AlertCircle size={15} />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="as-input-field">
                <span className="as-input-icon">
                  <User size={18} />
                </span>
                <input
                  type="text"
                  placeholder="Username"
                  value={signUpUsername}
                  onChange={(e) => setSignUpUsername(e.target.value)}
                  className="as-input"
                />
              </div>

              <div className="as-input-field">
                <span className="as-input-icon">
                  <Mail size={18} />
                </span>
                <input
                  type="email"
                  required
                  placeholder="Email"
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  className="as-input"
                />
              </div>

              <div className="as-input-field">
                <span className="as-input-icon">
                  <Lock size={18} />
                </span>
                <input
                  type={showSignUpPassword ? "text" : "password"}
                  required
                  placeholder="Password"
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  className="as-input"
                />
                <button
                  type="button"
                  onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                  className="as-password-toggle"
                  aria-label={showSignUpPassword ? "Hide password" : "Show password"}
                >
                  {showSignUpPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <button type="submit" disabled={loading} className="as-btn">
                {loading && isSignUp ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  "Sign up"
                )}
              </button>
            </form>
          </div>
        </div>

        {/* ================================================================= */}
        {/* PANELS (Curved Sliding Content Layers)                            */}
        {/* ================================================================= */}
        <div className="as-panels-container">
          <div className="as-panel as-left-panel">
            <div className="as-content">
              <h3>New here?</h3>
              <p>
                Join BH Planner today to automate your semester timetable, commute buffers, and exam runway.
              </p>
              <button
                type="button"
                className="as-btn as-transparent"
                onClick={() => {
                  setErrorMsg(null);
                  setIsSignUp(true);
                }}
              >
                Sign up
              </button>
            </div>
          </div>

          <div className="as-panel as-right-panel">
            <div className="as-content">
              <h3>One of us?</h3>
              <p>
                Welcome back! Sign in to inspect your active study blocks and continue your semester streak.
              </p>
              <button
                type="button"
                className="as-btn as-transparent"
                onClick={() => {
                  setErrorMsg(null);
                  setIsSignUp(false);
                }}
              >
                Sign in
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AuthSwitch;

