"use client";

import Image from "next/image";
import Link from "next/link";

interface BhLogoProps {
  size?: "sm" | "md" | "lg";
  withBadge?: boolean;
  className?: string;
  linkTo?: string;
}

const sizeMap = {
  sm: { width: 32, height: 32, badgeClass: "p-1.5 rounded-lg" },
  md: { width: 44, height: 44, badgeClass: "p-2 rounded-xl" },
  lg: { width: 64, height: 64, badgeClass: "p-3 rounded-2xl" },
};

export function BhLogo({
  size = "md",
  withBadge = true,
  className = "",
  linkTo = "/",
}: BhLogoProps) {
  const { width, height, badgeClass } = sizeMap[size];

  const imageElement = (
    <Image
      src="/bh-logo.webp"
      alt="BH Planner"
      width={width}
      height={height}
      priority
      className="rounded-md object-contain select-none pointer-events-none"
    />
  );

  const content = withBadge ? (
    <div
      className={`inline-flex items-center justify-center bg-panel border border-panel-border backdrop-blur-md ${badgeClass} ${className}`}
      title="BH Planner"
    >
      {imageElement}
    </div>
  ) : (
    <div className={`inline-flex items-center justify-center ${className}`}>{imageElement}</div>
  );

  if (linkTo) {
    return (
      <Link href={linkTo} className="inline-block transition-opacity hover:opacity-90 focus:outline-none focus:ring-1 focus:ring-accent">
        {content}
      </Link>
    );
  }

  return content;
}
