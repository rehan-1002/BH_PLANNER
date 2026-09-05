"use client";

import { useEffect, useState, useCallback } from "react";
import { ShieldAlert, Lock, AlertTriangle } from "lucide-react";

interface CaptureShieldProps {
  userEmail?: string;
  enableBlurProtection?: boolean;
  enableWatermark?: boolean;
  children: React.ReactNode;
}

/**
 * CaptureShield Security & Anti-Inspection Deterrence
 * - Intercepts DevTools shortcuts (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U).
 * - Intercepts Screenshot shortcuts (PrintScreen, Win+Shift+S, Ctrl+Shift+S, Mac Cmd+Shift+3/4/5).
 * - Window blur & tab visibility protection: blurs screen immediately when snipping tools activate.
 * - Suppresses right-click contextmenu.
 * - Displays high-security glass overlay with dynamic violation reasons.
 */
export function CaptureShield({
  userEmail = "",
  enableBlurProtection = true,
  enableWatermark = false,
  children,
}: CaptureShieldProps) {
  const [isBlurred, setIsBlurred] = useState(false);
  const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);
  const [securityReason, setSecurityReason] = useState<string>(
    "Content protected against inspection and capture."
  );
  const [sessionTime, setSessionTime] = useState("");

  const triggerSecurityBlur = useCallback((reason: string, durationMs?: number) => {
    if (!enableBlurProtection) return;
    setSecurityReason(reason);
    setIsBlurred(true);

    if (durationMs) {
      setTimeout(() => {
        setIsBlurred(false);
      }, durationMs);
    }
  }, [enableBlurProtection]);

  useEffect(() => {
    setSessionTime(new Date().toISOString().slice(0, 16).replace("T", " "));

    // 1. Tab visibility listener (Switched tabs)
    const handleVisibilityChange = () => {
      if (!enableBlurProtection) return;
      if (document.visibilityState === "hidden") {
        setSecurityReason("Tab backgrounded. Surface locked for privacy.");
        setIsBlurred(true);
      } else {
        setIsBlurred(false);
      }
    };

    // 2. Window Blur Listener (Snipping Tool, Screen Capture, or Window Focus Loss)
    const handleWindowBlur = () => {
      if (!enableBlurProtection) return;
      setSecurityReason("Screen capture / snipping tool deterrence active. Refocus window to resume.");
      setIsBlurred(true);
    };

    const handleWindowFocus = () => {
      setIsBlurred(false);
    };

    // 3. Right-Click Context Menu Suppression
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      triggerSecurityBlur("Right-click context inspection disabled.", 1500);
    };

    // 4. Keystroke Interception (DevTools + Screenshot Keys)
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      const isShift = e.shiftKey;
      const isAlt = e.altKey;
      const key = e.key.toUpperCase();

      // PrintScreen / Screenshot combos
      if (
        e.key === "PrintScreen" ||
        (isCtrlOrCmd && isShift && key === "S") ||
        (isCtrlOrCmd && key === "P") || // Print
        (e.metaKey && isShift && ["3", "4", "5"].includes(e.key)) // Mac screenshot combos
      ) {
        e.preventDefault();
        e.stopPropagation();
        triggerSecurityBlur("Screen capture / print keystroke intercepted.", 3000);
        return;
      }

      // DevTools keys (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U)
      if (
        e.key === "F12" ||
        (isCtrlOrCmd && isShift && ["I", "J", "C", "K"].includes(key)) ||
        (isCtrlOrCmd && isAlt && ["I", "J", "C"].includes(key)) ||
        (isCtrlOrCmd && key === "U") // View source
      ) {
        e.preventDefault();
        e.stopPropagation();
        triggerSecurityBlur("Developer inspection tools shortcut intercepted.", 3000);
        return;
      }
    };

    // 5. DevTools Docked Detection via viewport threshold
    const checkDevToolsDimensions = () => {
      if (!enableBlurProtection) return;
      const threshold = 160;
      const widthDiff = window.outerWidth - window.innerWidth > threshold;
      const heightDiff = window.outerHeight - window.innerHeight > threshold;

      if (widthDiff || heightDiff) {
        setIsDevToolsOpen(true);
        setSecurityReason("Developer Tools detected. Close inspection tools to resume access.");
      } else {
        setIsDevToolsOpen(false);
      }
    };

    const intervalId = setInterval(checkDevToolsDimensions, 1000);

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("focus", handleWindowFocus);
    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", checkDevToolsDimensions);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("focus", handleWindowFocus);
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", checkDevToolsDimensions);
    };
  }, [enableBlurProtection, triggerSecurityBlur]);

  const shouldBlock = isBlurred || isDevToolsOpen;

  return (
    <div className="relative w-full h-full min-h-screen select-none">
      {/* Protected content */}
      <div
        className={`transition-all duration-300 ${
          shouldBlock ? "filter blur-2xl select-none pointer-events-none opacity-20" : ""
        }`}
      >
        {children}
      </div>

      {/* Security Shield Overlay when Capture / DevTools Triggered */}
      {shouldBlock && (
        <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-canvas/80 backdrop-blur-3xl p-6 text-center animate-in fade-in duration-200">
          <div className="flex flex-col items-center p-8 rounded-3xl border border-accent/40 bg-panel/90 shadow-2xl max-w-md w-full relative overflow-hidden">
            {/* Glow backdrop */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-accent/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-accent/20 rounded-full blur-2xl pointer-events-none" />

            <div className="w-16 h-16 rounded-2xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent mb-5 shadow-lg animate-pulse">
              <ShieldAlert className="w-8 h-8 text-accent" strokeWidth={1.75} />
            </div>

            <h3 className="text-base font-bold tracking-tight text-foreground uppercase mb-2 font-mono">
              SECURITY SHIELD ACTIVATED
            </h3>

            <p className="text-xs text-muted leading-relaxed mb-6 max-w-xs">
              {securityReason}
            </p>

            <div className="w-full py-2.5 px-4 rounded-xl bg-panel-solid border border-panel-border text-[11px] font-mono text-muted flex items-center justify-center space-x-2">
              <Lock className="w-3.5 h-3.5 text-accent shrink-0" />
              <span>Institutional Privacy Protocol</span>
            </div>
          </div>
        </div>
      )}

      {/* Subtle diagonal watermark (optional) */}
      {enableWatermark && userEmail && (
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
