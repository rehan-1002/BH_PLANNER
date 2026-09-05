"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Global Network Status Listener
 * - Detects disconnection from internet (Wi-Fi dropped, offline mode).
 * - Redirects seamlessly to the animated offline 404 page.
 * - Restores user session automatically as soon as internet connection resumes.
 */
export function OfflineDetector() {
  const pathname = usePathname();

  useEffect(() => {
    // 1. Initial offline check
    if (typeof window !== "undefined" && !navigator.onLine && !pathname.includes("/not-found")) {
      window.location.href = "/not-found?reason=offline";
    }

    // 2. Real-time offline listener
    const handleOffline = () => {
      if (!window.location.pathname.includes("/not-found")) {
        window.location.href = "/not-found?reason=offline";
      }
    };

    // 3. Real-time online listener (auto-redirect when connection resumes)
    const handleOnline = () => {
      if (window.location.pathname.includes("/not-found")) {
        window.location.href = "/dashboard/overview";
      }
    };

    // 4. Polling check every 1.5s
    const interval = setInterval(() => {
      if (typeof window !== "undefined") {
        if (!navigator.onLine && !window.location.pathname.includes("/not-found")) {
          window.location.href = "/not-found?reason=offline";
        }
      }
    }, 1500);

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      clearInterval(interval);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, [pathname]);

  return null;
}
