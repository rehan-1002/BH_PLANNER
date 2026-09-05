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
 * Magnetic Kinetic Navigation Item
 * Calculates offset from button center:
 * deltaX = (e.clientX - rect.left - rect.width / 2) * 0.15
 * deltaY = (e.clientY - rect.top - rect.height / 2) * 0.15
 * Animates text/icon toward (deltaX, deltaY), resetting to (0, 0) with a spring on onMouseLeave.
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
    const deltaX = (e.clientX - rect.left - rect.width / 2) * 0.15;
    const deltaY = (e.clientY - rect.top - rect.height / 2) * 0.15;
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
      className={`relative px-3.5 py-1.5 rounded-full text-xs transition-colors focus:outline-none flex items-center gap-1.5 ${
        isActive
          ? "text-white font-medium relative z-10"
          : "text-[#a79fb7] hover:text-[#f3f0f9] relative z-10 transition-colors"
      }`}
    >
      {/* Sliding Kinetic Pill Backdrop */}
      {isActive && (
        <motion.div
          layoutId="kinetic-active-pill"
          className="absolute inset-0 rounded-full bg-[#8b5cf6]"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}

      {/* Magnetic Floating Content */}
      <motion.span
        animate={{ x: offset.x, y: offset.y }}
        transition={{ type: "spring", stiffness: 350, damping: 15 }}
        className="relative z-10 flex items-center gap-1.5"
      >
        <Icon className="w-3.5 h-3.5 shrink-0" strokeWidth={isActive ? 2.2 : 1.75} />
        <span className="tracking-tight select-none">{item.name}</span>
      </motion.span>
    </Link>
  );
}

/**
 * Refactored Kinetic Navigation Dock
 * Outer pill container: rounded-full border border-[rgba(147,112,219,0.18)] bg-[rgba(26,21,38,0.65)] backdrop-blur-xl px-2.5 py-1.5 shadow-2xl flex items-center gap-1
 * Removed floating dot completely.
 */
export function KineticNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Dashboard Kinetic Navigation Dock"
      className="rounded-full border border-[rgba(147,112,219,0.18)] bg-[rgba(26,21,38,0.65)] backdrop-blur-xl px-2.5 py-1.5 shadow-2xl flex items-center gap-1 select-none"
    >
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
    </nav>
  );
}
