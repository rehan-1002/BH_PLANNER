"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
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
 * Implements exact magnetic cursor pull with:
 * deltaX = (e.clientX - rect.left - rect.width / 2) * 0.2
 * deltaY = (e.clientY - rect.top - rect.height / 2) * 0.2
 * and spring transition { type: "spring", stiffness: 350, damping: 15 } on release.
 */
function KineticNavItem({
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
    const deltaX = (e.clientX - rect.left - rect.width / 2) * 0.2;
    const deltaY = (e.clientY - rect.top - rect.height / 2) * 0.2;
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
            stiffness: 400,
            damping: 30,
          }}
          className="absolute inset-0 rounded-xl bg-panel-solid border border-panel-border shadow-sm z-0"
        />
      )}

      {/* Magnetic Floating Content */}
      <motion.div
        animate={{ x: offset.x, y: offset.y }}
        transition={{
          type: "spring",
          stiffness: 350,
          damping: 15,
        }}
        className="relative z-10 flex items-center space-x-2"
      >
        <span className="inline-flex items-center justify-center">
          <Icon
            className={`w-4 h-4 transition-colors ${
              isActive ? "text-accent" : "text-muted"
            }`}
            strokeWidth={isActive ? 2.2 : 1.75}
          />
        </span>

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
 * spring active pill indicator, and frosted glass styling.
 */
export function KineticNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Dashboard Kinetic Navigation Dock"
      className="relative flex items-center p-1.5 rounded-2xl shadow-lg select-none"
      style={{
        background: "rgba(26, 21, 38, 0.6)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(147, 112, 219, 0.18)",
      }}
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
