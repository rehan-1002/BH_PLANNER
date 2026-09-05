"use client";

import { useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  LayoutDashboard,
  Clock,
  BookOpen,
  Sparkles,
  CalendarDays,
  type LucideIcon,
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { name: "Overview", href: "/dashboard/overview", icon: LayoutDashboard },
  { name: "Schedule", href: "/dashboard/schedule", icon: Clock },
  { name: "Syllabus", href: "/dashboard/syllabus", icon: BookOpen },
  { name: "Copilot", href: "/dashboard/copilot", icon: Sparkles },
  { name: "Calendar", href: "/dashboard/calendar", icon: CalendarDays },
];

/**
 * Individual Magnetic Kinetic Navigation Item
 * Implements magnetic hover pull, tilt reactivity, and spring press feedback.
 */
function KineticNavItem({
  item,
  isActive,
}: {
  item: NavItem;
  isActive: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Magnetic spring pull
  const springConfig = { damping: 15, stiffness: 200, mass: 0.2 };
  const dx = useSpring(mouseX, springConfig);
  const dy = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    // Limit magnetic pull to 4px in each direction
    const distanceX = Math.max(-6, Math.min(6, (e.clientX - centerX) * 0.2));
    const distanceY = Math.max(-4, Math.min(4, (e.clientY - centerY) * 0.2));
    mouseX.set(distanceX);
    mouseY.set(distanceY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const Icon = item.icon;

  return (
    <Link
      ref={ref}
      href={item.href}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-accent flex items-center space-x-2 ${
        isActive ? "text-foreground font-semibold" : "text-muted hover:text-foreground"
      }`}
    >
      {/* Elastic Kinetic Active Pill */}
      {isActive && (
        <motion.div
          layoutId="sterling-gate-kinetic-pill"
          transition={{
            type: "spring",
            stiffness: 380,
            damping: 28,
            mass: 0.6,
          }}
          className="absolute inset-0 rounded-xl bg-panel-solid border border-panel-border shadow-sm z-0"
        />
      )}

      {/* Magnetic Floating Content */}
      <motion.div
        style={{ x: dx, y: dy }}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.94 }}
        className="relative z-10 flex items-center space-x-2"
      >
        <motion.span
          whileHover={{ rotate: isActive ? 0 : [-4, 4, 0], scale: 1.1 }}
          transition={{ duration: 0.3 }}
          className="inline-flex items-center justify-center"
        >
          <Icon
            className={`w-4 h-4 transition-colors ${
              isActive ? "text-accent" : "text-muted"
            }`}
            strokeWidth={isActive ? 2.2 : 1.75}
          />
        </motion.span>

        <span className="hidden sm:inline-block tracking-tight select-none">
          {item.name}
        </span>
      </motion.div>

      {/* Active Indicator Micro-Dot */}
      {isActive && (
        <motion.div
          layoutId="sterling-gate-active-dot"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-accent z-10"
        />
      )}
    </Link>
  );
}

/**
 * @hardikkashiyani123456788/components/sterling-gate-kinetic-navigation
 * Floating kinetic navigation dock with magnetic cursor pull,
 * elastic spring active pill, and micro-tilt icon reactivity.
 */
export function KineticNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Dashboard Kinetic Navigation Dock"
      className="relative flex items-center p-1.5 rounded-2xl bg-panel border border-panel-border backdrop-blur-2xl shadow-lg select-none"
    >
      <div className="flex items-center space-x-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard/overview" && pathname.startsWith(item.href));

          return (
            <KineticNavItem
              key={item.href}
              item={item}
              isActive={isActive}
            />
          );
        })}
      </div>
    </nav>
  );
}
