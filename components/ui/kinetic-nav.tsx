"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Clock,
  BookOpen,
  Sparkles,
  CalendarDays,
  Menu,
  X,
  ArrowRight,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

interface NavItem {
  number: string;
  name: string;
  href: string;
  icon: LucideIcon;
  description: string;
}

const navItems: NavItem[] = [
  {
    number: "01",
    name: "Overview",
    href: "/dashboard/overview",
    icon: LayoutDashboard,
    description: "Daily command surface & study execution",
  },
  {
    number: "02",
    name: "Schedule",
    href: "/dashboard/schedule",
    icon: Clock,
    description: "Weekly timetable with fixed lecture constraints",
  },
  {
    number: "03",
    name: "Syllabus",
    href: "/dashboard/syllabus",
    icon: BookOpen,
    description: "Exam runway & subject modules breakdown",
  },
  {
    number: "04",
    name: "Copilot",
    href: "/dashboard/copilot",
    icon: Sparkles,
    description: "Natural language schedule mutations",
  },
  {
    number: "05",
    name: "Calendar",
    href: "/dashboard/calendar",
    icon: CalendarDays,
    description: "Multi-month exam and revision milestones",
  },
];

/**
 * Magnetic Kinetic Item
 * Pulls toward cursor by 18% of delta from button center.
 */
function MagneticDockItem({
  item,
  isActive,
}: {
  item: NavItem;
  isActive: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const deltaX = (e.clientX - rect.left - rect.width / 2) * 0.18;
    const deltaY = (e.clientY - rect.top - rect.height / 2) * 0.18;
    setOffset({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  const Icon = item.icon;

  return (
    <Link
      ref={ref}
      href={item.href}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative px-3.5 py-1.5 rounded-full text-xs transition-colors focus:outline-none flex items-center gap-1.5 select-none ${
        isActive
          ? "text-white font-medium relative z-10"
          : "text-muted hover:text-foreground relative z-10 transition-colors"
      }`}
    >
      {/* Active Kinetic Pill */}
      {isActive && (
        <motion.div
          layoutId="sterling-active-pill"
          className="absolute inset-0 rounded-full bg-accent"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}

      {/* Magnetic Content */}
      <motion.span
        animate={{ x: offset.x, y: offset.y }}
        transition={{ type: "spring", stiffness: 350, damping: 18 }}
        className="relative z-10 flex items-center gap-1.5"
      >
        <Icon className="w-3.5 h-3.5 shrink-0" strokeWidth={isActive ? 2.2 : 1.75} />
        <span className="tracking-tight">{item.name}</span>
      </motion.span>
    </Link>
  );
}

/**
 * @hardikkashiyani123456788/components/sterling-gate-kinetic-navigation
 * Authoritative full-screen kinetic navigation system:
 * - Magnetic docked navigation capsule with theme-aware frosted glass.
 * - Authoritative "Sterling Gate" Reveal layer featuring typography-heavy links,
 *   index numbers, liquid ripple hover physics, and secondary metadata columns.
 * - Escape key support, fluid spring entrance, and 100% theme visibility in light and dark modes.
 */
export function KineticNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      {/* 1. FLOATING MAGNETIC DOCK */}
      <nav
        aria-label="Sterling Gate Kinetic Navigation Dock"
        className="rounded-full glass-panel px-2 py-1.5 shadow-xl flex items-center gap-1 select-none"
      >
        {/* Desktop Quick Magnetic Links (Hidden on small screens) */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard/overview" && pathname.startsWith(item.href));

            return (
              <MagneticDockItem
                key={item.href}
                item={item}
                isActive={isActive}
              />
            );
          })}
        </div>

        {/* Mobile current active label */}
        <div className="md:hidden px-3 py-1 text-xs font-semibold text-foreground flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span>
            {navItems.find((i) => pathname.startsWith(i.href))?.name || "BH Planner"}
          </span>
        </div>

        {/* Gate Reveal Trigger Button */}
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open Sterling Gate Navigation"
          className="relative px-3 py-1.5 rounded-full text-xs font-medium text-foreground hover:bg-accent/15 transition-all flex items-center gap-1.5 focus:outline-none focus:ring-1 focus:ring-accent"
        >
          <Menu className="w-3.5 h-3.5 text-accent" strokeWidth={2} />
          <span className="hidden sm:inline font-mono text-[11px] uppercase tracking-wider text-muted">Gate</span>
        </button>
      </nav>

      {/* 2. STERLING GATE FULL-SCREEN REVEAL LAYER */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Full-screen Sterling Gate Navigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] flex flex-col justify-between p-6 sm:p-12 md:p-16 bg-canvas/95 backdrop-blur-2xl overflow-y-auto"
          >
            {/* Top Bar of Gate Overlay */}
            <div className="w-full max-w-6xl mx-auto flex items-center justify-between pb-6 border-b border-panel-border">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center size-8 rounded-xl bg-accent/15 border border-accent/30 text-accent">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-mono tracking-wider uppercase text-accent font-semibold block">
                    Sterling Gate · Navigation Engine
                  </span>
                  <span className="text-xs text-muted">
                    Tier-1 Deterministic Academic Architecture
                  </span>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close Navigation Gate"
                className="group p-2 rounded-xl bg-panel border border-panel-border text-muted hover:text-foreground hover:border-accent transition-all focus:outline-none focus:ring-2 focus:ring-accent active:scale-95"
              >
                <X className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" strokeWidth={2} />
              </button>
            </div>

            {/* Middle: Kinetic Typography Links Grid */}
            <div className="w-full max-w-6xl mx-auto my-auto py-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Massive Kinetic Navigation List (8 columns) */}
              <div className="lg:col-span-8 flex flex-col space-y-2 sm:space-y-4">
                {navItems.map((item, idx) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/dashboard/overview" && pathname.startsWith(item.href));
                  const isHovered = hoveredIdx === idx;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onMouseEnter={() => setHoveredIdx(idx)}
                      onMouseLeave={() => setHoveredIdx(null)}
                      onClick={() => setIsOpen(false)}
                      className="group relative flex items-center justify-between py-3 sm:py-4 px-4 rounded-2xl transition-all duration-300 hover:bg-accent/10 focus:outline-none"
                    >
                      <div className="flex items-baseline space-x-4 sm:space-x-8">
                        {/* Kinetic Index Number */}
                        <span className="text-xs sm:text-sm font-mono text-muted/80 group-hover:text-accent font-medium transition-colors">
                          {item.number}
                        </span>

                        {/* Heavy-Weighted Typography Title */}
                        <span
                          className={`text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight transition-transform duration-300 group-hover:translate-x-3 ${
                            isActive
                              ? "text-accent"
                              : "text-foreground group-hover:text-accent"
                          }`}
                        >
                          {item.name}
                        </span>
                      </div>

                      {/* Right Indicator Arrow with Liquid Glide */}
                      <motion.div
                        animate={{
                          x: isHovered ? 0 : -8,
                          opacity: isHovered || isActive ? 1 : 0.2,
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="hidden sm:flex items-center space-x-2 text-accent"
                      >
                        <span className="text-xs font-mono uppercase tracking-wider hidden md:inline">Open</span>
                        <ArrowRight className="w-5 h-5" strokeWidth={2} />
                      </motion.div>
                    </Link>
                  );
                })}

                {/* Additional Gateway Link */}
                <Link
                  href="/auth"
                  onMouseEnter={() => setHoveredIdx(99)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  onClick={() => setIsOpen(false)}
                  className="group relative flex items-center justify-between py-3 sm:py-4 px-4 rounded-2xl transition-all duration-300 hover:bg-accent/10 focus:outline-none"
                >
                  <div className="flex items-baseline space-x-4 sm:space-x-8">
                    <span className="text-xs sm:text-sm font-mono text-muted/80 group-hover:text-accent font-medium transition-colors">
                      06
                    </span>
                    <span className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-muted hover:text-foreground transition-transform duration-300 group-hover:translate-x-3">
                      Authenticate
                    </span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted group-hover:text-foreground transition-all" strokeWidth={2} />
                </Link>
              </div>

              {/* Secondary Details & Context Panel (4 columns) */}
              <div className="lg:col-span-4 p-6 sm:p-8 rounded-2xl glass-panel space-y-6">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-accent font-bold">
                    Active System Status
                  </span>
                  <h3 className="text-lg font-bold text-foreground mt-1">
                    Autonomous Buffer Protection
                  </h3>
                  <p className="text-xs text-muted mt-2 leading-relaxed">
                    Student syllabus schedules are locked against immovable college lectures and commute windows.
                  </p>
                </div>

                <div className="space-y-3 font-mono text-xs text-muted border-t border-panel-border pt-4">
                  <div className="flex justify-between">
                    <span>Engine</span>
                    <span className="text-foreground">Tier-1 Deterministic</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Spillover Window</span>
                    <span className="text-accent font-semibold">72 Hours Max</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Academic Privacy</span>
                    <span className="text-status-done font-semibold">Enforced</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/"
                    onClick={() => setIsOpen(false)}
                    className="inline-flex items-center text-xs font-mono text-accent hover:underline"
                  >
                    ← Return to Interactive Story
                  </Link>
                </div>
              </div>
            </div>

            {/* Bottom Bar: System Spec & Keyboard Shortcut */}
            <div className="w-full max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-muted/70 font-mono pt-6 border-t border-panel-border gap-2">
              <span>BH PLANNER · SYSTEM SPECIFICATION 1.0</span>
              <div className="flex items-center space-x-3">
                <span>Press</span>
                <kbd className="px-2 py-0.5 rounded bg-panel border border-panel-border text-foreground font-semibold text-[11px]">
                  ESC
                </kbd>
                <span>to close gate</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
