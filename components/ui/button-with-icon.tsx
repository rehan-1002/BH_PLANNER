"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface ButtonWithIconProps {
  children?: React.ReactNode;
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  className?: string;
  ariaLabel?: string;
}

export function ButtonWithIcon({
  children = "JOIN",
  href,
  onClick,
  className = "",
  ariaLabel = "Join BH Planner",
}: ButtonWithIconProps) {
  const baseClasses = `
    relative inline-flex items-center text-sm font-semibold rounded-full h-12 p-1 ps-6 pe-14
    bg-[#8b5cf6] hover:bg-[#7c3aed] text-white shadow-lg shadow-accent/20 border border-accent/40
    group transition-all duration-500 hover:ps-14 hover:pe-6 w-fit overflow-hidden cursor-pointer
    select-none active:scale-95 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-canvas
    ${className}
  `.trim();

  const content = (
    <>
      <span className="relative z-10 transition-all duration-500 tracking-wide font-sans">
        {children}
      </span>
      <div className="absolute right-1 w-10 h-10 rounded-full bg-canvas text-foreground border border-panel-border flex items-center justify-center transition-all duration-500 group-hover:right-[calc(100%-44px)] group-hover:rotate-45 shadow-sm">
        <ArrowUpRight className="w-4 h-4 shrink-0 transition-transform duration-500" strokeWidth={2.2} />
      </div>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        onClick={onClick}
        aria-label={ariaLabel}
        className={baseClasses}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={baseClasses}
    >
      {content}
    </button>
  );
}
