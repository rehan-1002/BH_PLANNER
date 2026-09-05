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
 * - Disables window blur locking during local development (process.env.NODE_ENV === "development").
 * - In production, only triggers blur when user explicitly switches tabs (document.visibilityState === "hidden").
 * - Never triggers on simple window focus loss or opening DevTools.
 * - Suppresses right-click contextmenu and intercepts print keys.
 * - Print styles handled via @media print in globals.css.
 */
export function CaptureShield({
  userEmail = "",
  enableBlurProtection = true,
  enableWatermark = false,
  children,
}: CaptureShieldProps) {
  const [isBlurred, setIsBlurred] = useState(false);
  const [sessionTime, setSessionTime] = useState("");

  useEffect(() => {
    setSessionTime(new Date().toISOString().slice(0, 16).replace("T", " "));

    const isDev = process.env.NODE_ENV === "development";

    // 1. Tab visibility listener (Production tab-switch only, never on simple focus loss/DevTools)
    const handleVisibilityChange = () => {
      if (!isDev && enableBlurProtection) {
        if (document.visibilityState === "hidden") {
          setIsBlurred(true);
        } else {
          setIsBlurred(false);
        }
      }
    };

    // 2. Right-click contextmenu suppression
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // 3. Print key interception
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "PrintScreen") {
        setIsBlurred(true);
        setTimeout(() => setIsBlurred(false), 2500);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [enableBlurProtection]);

  return (
    <div className="relative w-full h-full min-h-screen">
      {/* Protected content */}
      <div
        className={`transition-filter duration-200 ${
          isBlurred ? "filter blur-xl select-none pointer-events-none" : ""
        }`}
      >
        {children}
      </div>

      {/* Security Overlay when tab is hidden / PrintScreen intercepted */}
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
