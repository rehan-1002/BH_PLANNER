"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toggleThemeWithTransition, applyThemeClass } from "@/lib/theme-transitions";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("bh_theme") as "dark" | "light" | null;
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
      applyThemeClass(stored);
    } else {
      setTheme("dark");
      applyThemeClass("dark");
    }
  }, []);

  const handleToggle = (e: React.MouseEvent) => {
    toggleThemeWithTransition(theme, setTheme, e);
  };

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={`Switch to ${isDark ? "Violet Frost light" : "dark"} mode`}
      className={`group relative inline-flex items-center justify-center w-10 h-10 rounded-xl bg-panel border border-panel-border backdrop-blur-md text-foreground transition-all duration-200 hover:border-accent hover:text-accent focus:outline-none focus:ring-1 focus:ring-accent ${className}`}
      title={isDark ? "Switch to Violet Frost Light Mode" : "Switch to Dark Mode"}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="overflow-visible select-none pointer-events-none"
      >
        <mask id="theme-toggle-mask">
          <rect x="0" y="0" width="24" height="24" fill="white" />
          {/* Circular mask cuts into sun to create moon crescent */}
          <motion.circle
            initial={false}
            animate={{
              cx: isDark ? 28 : 17,
              cy: isDark ? 4 : 7,
              r: 8,
            }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            fill="black"
          />
        </mask>

        {/* Central celestial circle (Sun center / Moon crescent) */}
        <motion.circle
          cx="12"
          cy="12"
          mask="url(#theme-toggle-mask)"
          initial={false}
          animate={{
            r: isDark ? 5 : 8,
            rotate: isDark ? 0 : 40,
          }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          fill="currentColor"
          stroke="none"
        />

        {/* 8 Radial Sun Rays - Collapsing/expanding on toggle */}
        <motion.g
          initial={false}
          animate={{
            scale: isDark ? 1 : 0,
            rotate: isDark ? 0 : 90,
            opacity: isDark ? 1 : 0,
          }}
          transition={{ type: "spring", stiffness: 350, damping: 22 }}
          style={{ originX: "12px", originY: "12px" }}
          stroke="currentColor"
        >
          {/* 12 o'clock */}
          <line x1="12" y1="1" x2="12" y2="3" />
          {/* 1:30 o'clock */}
          <line x1="19.78" y1="4.22" x2="18.36" y2="5.64" />
          {/* 3 o'clock */}
          <line x1="23" y1="12" x2="21" y2="12" />
          {/* 4:30 o'clock */}
          <line x1="19.78" y1="19.78" x2="18.36" y2="18.36" />
          {/* 6 o'clock */}
          <line x1="12" y1="23" x2="12" y2="21" />
          {/* 7:30 o'clock */}
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          {/* 9 o'clock */}
          <line x1="1" y1="12" x2="3" y2="12" />
          {/* 10:30 o'clock */}
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        </motion.g>
      </svg>
    </button>
  );
}
