"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function OfflineDetector() {
  const pathname = usePathname();

  useEffect(() => {

    if (typeof window !== "undefined" && !navigator.onLine && !pathname.includes("/not-found")) {
      window.location.href = "/not-found?reason=offline";
    }

    const handleOffline = () => {
      if (!window.location.pathname.includes("/not-found")) {
        window.location.href = "/not-found?reason=offline";
      }
    };

    const handleOnline = () => {
      if (window.location.pathname.includes("/not-found")) {
        window.location.href = "/dashboard/overview";
      }
    };

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
