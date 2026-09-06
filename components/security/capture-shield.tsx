"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { ShieldAlert, Lock, ArrowRight } from "lucide-react";

interface CaptureShieldProps {
  userEmail?: string;
  enableBlurProtection?: boolean;
  enableWatermark?: boolean;
  children: React.ReactNode;
}

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
  const blurTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isArmedRef = useRef(false);

  const triggerSecurityBlur = useCallback(
    (reason: string, durationMs: number = 3500) => {
      if (!enableBlurProtection) return;
      setSecurityReason(reason);
      setIsBlurred(true);

      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }

      // Automatically clear clipboard if screenshot was attempted
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        try {
          navigator.clipboard.writeText("");
        } catch (e) {
          // ignore
        }
      }

      blurTimeoutRef.current = setTimeout(() => {
        if (typeof document !== "undefined" && document.hasFocus() && document.visibilityState === "visible") {
          setIsBlurred(false);
        }
      }, durationMs);
    },
    [enableBlurProtection]
  );

  const dismissShield = useCallback(() => {
    setIsBlurred(false);
    setIsDevToolsOpen(false);
  }, []);

  useEffect(() => {
    setSessionTime(new Date().toISOString().slice(0, 16).replace("T", " "));

    // Arm blur protection only after initial page mount and layout stabilization
    const armTimer = setTimeout(() => {
      isArmedRef.current = true;
    }, 1200);

    // 1. Intercept Screen Capture / Media Recording API (Loom, Meet, Tab recording extensions)
    if (typeof navigator !== "undefined" && navigator.mediaDevices) {
      try {
        if ("getDisplayMedia" in navigator.mediaDevices) {
          (navigator.mediaDevices as any).getDisplayMedia = async function (...args: any[]) {
            triggerSecurityBlur("Screen capture / tab recording stream blocked by Institutional Security Shield.", 5000);
            throw new DOMException("Screen capture prohibited by Institutional Security Shield.", "NotAllowedError");
          };
        }
      } catch (err) {
        // MediaDevices may be read-only in sandboxed environments
      }
    }

    // 2. Tab Background / Visibility Change
    const handleVisibilityChange = () => {
      if (!enableBlurProtection || !isArmedRef.current) return;
      if (document.visibilityState === "hidden") {
        setSecurityReason("Tab backgrounded. Surface locked for privacy.");
        setIsBlurred(true);
      } else {
        setIsBlurred(false);
      }
    };

    // 3. Window Blur (Triggers when user activates external recording software, Snipping Tool, etc.)
    const handleWindowBlur = () => {
      if (!enableBlurProtection || !isArmedRef.current) return;
      setSecurityReason("Screen capture / recording deterrence active. Refocus window to resume.");
      setIsBlurred(true);
    };

    const handleWindowFocus = () => {
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
      setIsBlurred(false);
    };

    // 4. Right-Click Context Menu Suppression
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      triggerSecurityBlur("Right-click context inspection disabled.", 2000);
    };

    // 5. Screenshot & Recording Keystroke Interception
    const handleKeySecurity = (e: KeyboardEvent) => {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      const isShift = e.shiftKey;
      const isAlt = e.altKey;
      const key = (e.key || "").toUpperCase();
      const code = e.code || "";

      // PrintScreen (captured on both keydown and keyup across all operating systems)
      if (
        e.key === "PrintScreen" ||
        code === "PrintScreen" ||
        e.keyCode === 44
      ) {
        e.preventDefault();
        e.stopPropagation();
        triggerSecurityBlur("Screenshot attempt intercepted. Screen capture prohibited.", 4000);
        return;
      }

      // Windows Snipping Tool / Mac Screenshot: Win+Shift+S / Cmd+Shift+3,4,5 / Ctrl+Shift+S
      if (
        (isCtrlOrCmd && isShift && (key === "S" || code === "KeyS")) ||
        (e.metaKey && isShift && ["3", "4", "5"].includes(e.key))
      ) {
        e.preventDefault();
        e.stopPropagation();
        triggerSecurityBlur("Snipping tool / screen capture shortcut intercepted.", 4000);
        return;
      }

      // Screen Recording shortcuts: Win+Alt+R (Game Bar record), Win+G / Alt+G, Ctrl+Shift+R
      if (
        (isAlt && (key === "R" || code === "KeyR")) ||
        ((isAlt || isCtrlOrCmd) && (key === "G" || code === "KeyG")) ||
        (isCtrlOrCmd && isShift && (key === "R" || code === "KeyR"))
      ) {
        e.preventDefault();
        e.stopPropagation();
        triggerSecurityBlur("Screen recording shortcut intercepted. Recording prohibited.", 4000);
        return;
      }

      // Print / PDF Capture: Ctrl+P
      if (isCtrlOrCmd && (key === "P" || code === "KeyP")) {
        e.preventDefault();
        e.stopPropagation();
        triggerSecurityBlur("Print to PDF / document export disabled.", 3000);
        return;
      }

      // DevTools Inspection: F12, Ctrl+Shift+I/J/C/K, Ctrl+U, Ctrl+S
      if (
        e.key === "F12" ||
        code === "F12" ||
        (isCtrlOrCmd && isShift && ["I", "J", "C", "K"].includes(key)) ||
        (isCtrlOrCmd && isAlt && ["I", "J", "C"].includes(key)) ||
        (isCtrlOrCmd && (key === "U" || code === "KeyU"))
      ) {
        e.preventDefault();
        e.stopPropagation();
        triggerSecurityBlur("Developer inspection tools shortcut intercepted.", 3500);
        return;
      }
    };

    // 6. Docked DevTools Detection (Carefully calibrated to ignore normal browser toolbars)
    const checkDevTools = () => {
      if (!enableBlurProtection || !isArmedRef.current) return;

      // Normal browser UI: widthDiff is 0-24px, heightDiff (tabs, address bar, bookmarks) is 70-140px.
      // Docked DevTools: docked side gives widthDiff > 250px; docked bottom gives heightDiff > 280px.
      const widthDiff = window.outerWidth - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;

      const isDockedSide = widthDiff > 260 && heightDiff < 180;
      const isDockedBottom = heightDiff > 290 && widthDiff < 80;

      if (isDockedSide || isDockedBottom) {
        setIsDevToolsOpen(true);
        setSecurityReason("Developer Tools panel detected. Close inspection panel to resume.");
      } else {
        setIsDevToolsOpen(false);
      }
    };

    const intervalId = setInterval(checkDevTools, 1000);

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("focus", handleWindowFocus);
    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("keydown", handleKeySecurity, true);
    window.addEventListener("keyup", handleKeySecurity, true);
    window.addEventListener("resize", checkDevTools);

    return () => {
      clearTimeout(armTimer);
      clearInterval(intervalId);
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("focus", handleWindowFocus);
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("keydown", handleKeySecurity, true);
      window.removeEventListener("keyup", handleKeySecurity, true);
      window.removeEventListener("resize", checkDevTools);
    };
  }, [enableBlurProtection, triggerSecurityBlur]);

  const shouldBlock = isBlurred || isDevToolsOpen;

  return (
    <div className="relative w-full h-full min-h-screen select-none">
      {/* Underlying content is heavily blurred and hidden from recording frames when triggered */}
      <div
        className={`transition-all duration-200 ${
          shouldBlock ? "filter blur-3xl select-none pointer-events-none opacity-0" : ""
        }`}
      >
        {children}
      </div>

      {/* Security Shield Overlay when Capture / DevTools Triggered */}
      {shouldBlock && (
        <div
          onClick={dismissShield}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-canvas/90 backdrop-blur-3xl p-6 text-center select-none animate-in fade-in duration-150 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex flex-col items-center p-8 rounded-3xl border border-accent/40 bg-panel/95 shadow-2xl max-w-md w-full relative overflow-hidden"
          >
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

            <button
              type="button"
              onClick={dismissShield}
              className="w-full py-2.5 px-4 rounded-xl bg-accent text-white font-mono text-xs font-semibold shadow-lg hover:bg-accent/90 transition-all flex items-center justify-center space-x-2 mb-3"
            >
              <span>Resume Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <div className="w-full py-2 px-4 rounded-xl bg-panel-solid border border-panel-border text-[11px] font-mono text-muted flex items-center justify-center space-x-2">
              <Lock className="w-3.5 h-3.5 text-accent shrink-0" />
              <span>Institutional Privacy Protocol</span>
            </div>
          </div>
        </div>
      )}

      {/* Subtle diagonal watermark */}
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
