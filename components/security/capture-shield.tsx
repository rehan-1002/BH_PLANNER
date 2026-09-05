"use client";

import { useEffect, useState } from "react";
import { ShieldAlert } from "lucide-react";

interface CaptureShieldProps {
  userEmail?: string;
  enableBlurProtection?: boolean;
  enableWatermark?: boolean;
  children: React.ReactNode;
}

/**
 * CaptureShield Deterrence Component
 * Implements client-side screen deterrence: window blur protection, shortcut interception,
 * and subtle dynamic watermark.
 *
 * NOTE: As documented in 03-ARCHITECTURE.md, this is a deterrence mechanism only,
 * not an OS-level capture prevention.
 */
export function CaptureShield({
  userEmail = "student@bhplanner.internal",
  enableBlurProtection = true,
  enableWatermark = true,
  children,
}: CaptureShieldProps) {
  const [isBlurred, setIsBlurred] = useState(false);
  const [sessionTime, setSessionTime] = useState("");

  useEffect(() => {
    setSessionTime(new Date().toISOString().slice(0, 16).replace("T", " "));

    if (!enableBlurProtection) return;

    const handleBlur = () => setIsBlurred(true);
    const handleFocus = () => setIsBlurred(false);
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsBlurred(true);
      } else {
        setIsBlurred(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Intercept PrintScreen
      if (e.key === "PrintScreen") {
        setIsBlurred(true);
        setTimeout(() => setIsBlurred(false), 2500);
      }
      // Deter inspection shortcuts (F12, Ctrl+Shift+I)
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C"))
      ) {
        // Log deterrence notice
        console.info("[BH Security] Developer tools key shortcut intercepted.");
      }
    };

    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [enableBlurProtection]);

  return (
    <div className="relative w-full h-full min-h-screen">
      {/* Content */}
      <div className={`transition-filter duration-200 ${isBlurred ? "filter blur-xl select-none pointer-events-none" : ""}`}>
        {children}
      </div>

      {/* Security Overlay when blurred */}
      {isBlurred && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-canvas/90 backdrop-blur-2xl">
          <div className="flex flex-col items-center p-6 rounded-xl border border-panel-border bg-panel text-center max-w-sm">
            <ShieldAlert className="w-8 h-8 text-accent mb-3" strokeWidth={1.5} />
            <h3 className="text-sm font-semibold tracking-wide text-foreground uppercase mb-1">
              Protected Surface
            </h3>
            <p className="text-xs text-muted">
              Content hidden for security. Return focus to window to resume.
            </p>
          </div>
        </div>
      )}

      {/* Subtle diagonal SVG watermark */}
      {enableWatermark && (
        <div
          aria-hidden="true"
          className="timetable-watermark"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='150' viewBox='0 0 300 150'%3E%3Ctext x='20' y='80' fill='%238b5cf6' transform='rotate(-20 150 75)' font-family='monospace' font-size='11' opacity='0.35'%3E${encodeURIComponent(
              `${userEmail} · ${sessionTime}`
            )}%3C/text%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
          }}
        />
      )}
    </div>
  );
}
