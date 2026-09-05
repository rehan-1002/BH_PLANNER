"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

/**
 * Global Network Status Listener
 * - Detects disconnection from internet (Wi-Fi dropped, offline mode).
 * - Redirects seamlessly to the animated offline 404 page.
 * - Restores user session automatically as soon as internet connection resumes.
 */
export function OfflineDetector() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Initial check on load
    if (typeof window !== "undefined" && !navigator.onLine && pathname !== "/not-found") {
      router.push("/not-found?reason=offline");
    }

    const handleOffline = () => {
      if (pathname !== "/not-found") {
        router.push("/not-found?reason=offline");
      }
    };

    const handleOnline = () => {
      if (pathname === "/not-found") {
        const search = window.location.search;
        if (search.includes("reason=offline")) {
          router.push("/dashboard/overview");
        }
      }
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, [router, pathname]);

  return null;
}
