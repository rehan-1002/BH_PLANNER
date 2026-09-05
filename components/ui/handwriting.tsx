"use client";

import { useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface HandwritingTextProps {
  onComplete?: () => void;
  className?: string;
  triggerAnimation?: boolean;
}

export function HandwritingText({
  onComplete,
  className = "",
  triggerAnimation,
}: HandwritingTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: 0.3, once: false });
  const shouldAnimate = triggerAnimation !== undefined ? triggerAnimation : isInView;
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (shouldAnimate && !hasAnimated) {
      const timer = setTimeout(() => {
        setHasAnimated(true);
        onComplete?.();
      }, 2100);
      return () => clearTimeout(timer);
    }
  }, [shouldAnimate, hasAnimated, onComplete]);

  return (
    <div
      ref={ref}
      className={`relative inline-flex flex-col items-center select-none w-full max-w-2xl px-2 text-foreground ${className}`}
    >
      <span className="sr-only">BH PLANNER</span>

      <svg
        viewBox="0 0 680 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto overflow-visible"
        aria-hidden="true"
      >
        {/* ================================================================= */}
        {/* "BH" — Violet Bloom Primary (#8b5cf6)                             */}
        {/* ================================================================= */}
        <g id="bh-word" stroke="#8b5cf6" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
          {/* 'B' vertical stem */}
          <motion.path
            d="M 40 28 L 40 88"
            initial={{ pathLength: 0 }}
            animate={shouldAnimate ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
          />
          {/* 'B' cursive loops */}
          <motion.path
            d="M 38 30 C 72 16 92 36 68 54 C 48 60 40 56 40 56 C 75 56 96 74 72 88 C 50 94 40 88 56 88"
            initial={{ pathLength: 0 }}
            animate={shouldAnimate ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 0.55, delay: 0.12, ease: "easeInOut" }}
          />
          {/* 'H' left stem */}
          <motion.path
            d="M 108 26 L 108 88"
            initial={{ pathLength: 0 }}
            animate={shouldAnimate ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 0.4, delay: 0.28, ease: "easeInOut" }}
          />
          {/* 'H' cross-bridge */}
          <motion.path
            d="M 105 56 C 122 52 136 53 150 55"
            initial={{ pathLength: 0 }}
            animate={shouldAnimate ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 0.25, delay: 0.42, ease: "easeInOut" }}
          />
          {/* 'H' right stem & exit */}
          <motion.path
            d="M 150 26 L 150 88 C 150 94 158 90 168 84"
            initial={{ pathLength: 0 }}
            animate={shouldAnimate ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 0.4, delay: 0.5, ease: "easeInOut" }}
          />
        </g>

        {/* ================================================================= */}
        {/* "PLANNER" — Foreground Ink: stroke="currentColor" (Theme-adaptive) */}
        {/* ================================================================= */}
        <g id="planner-word" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
          {/* 'P' stem */}
          <motion.path
            d="M 205 92 L 205 38"
            initial={{ pathLength: 0 }}
            animate={shouldAnimate ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 0.3, delay: 0.65, ease: "easeInOut" }}
          />
          {/* 'P' loop */}
          <motion.path
            d="M 205 40 C 205 26 238 26 238 52 C 238 68 205 68 205 68"
            initial={{ pathLength: 0 }}
            animate={shouldAnimate ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 0.3, delay: 0.78, ease: "easeInOut" }}
          />
          {/* 'L' cursive loop */}
          <motion.path
            d="M 242 88 C 255 88 262 82 268 48 C 272 26 264 26 260 40 C 254 64 260 88 288 88"
            initial={{ pathLength: 0 }}
            animate={shouldAnimate ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 0.35, delay: 0.92, ease: "easeInOut" }}
          />
          {/* 'A' loop */}
          <motion.path
            d="M 308 68 C 296 58 290 70 296 82 C 302 90 320 90 326 78 M 326 58 L 326 88 C 326 92 332 89 340 84"
            initial={{ pathLength: 0 }}
            animate={shouldAnimate ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 0.35, delay: 1.1, ease: "easeInOut" }}
          />
          {/* First 'N' arches */}
          <motion.path
            d="M 352 64 L 352 88 M 352 70 C 362 58 380 58 382 88"
            initial={{ pathLength: 0 }}
            animate={shouldAnimate ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 0.3, delay: 1.28, ease: "easeInOut" }}
          />
          {/* Second 'N' arches */}
          <motion.path
            d="M 396 64 L 396 88 M 396 70 C 406 58 424 58 426 88"
            initial={{ pathLength: 0 }}
            animate={shouldAnimate ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 0.3, delay: 1.42, ease: "easeInOut" }}
          />
          {/* 'E' loop */}
          <motion.path
            d="M 440 88 C 458 88 464 68 450 60 C 435 52 430 72 444 84 C 452 90 464 88 472 84"
            initial={{ pathLength: 0 }}
            animate={shouldAnimate ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 0.3, delay: 1.56, ease: "easeInOut" }}
          />
          {/* 'R' arch & baseline */}
          <motion.path
            d="M 484 64 L 484 88 M 482 70 C 492 58 510 62 514 72 C 514 80 512 88 524 88"
            initial={{ pathLength: 0 }}
            animate={shouldAnimate ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 0.3, delay: 1.7, ease: "easeInOut" }}
          />
        </g>

        {/* ================================================================= */}
        {/* Underline Flourish — Violet Bloom Primary (#8b5cf6)               */}
        {/* ================================================================= */}
        <motion.path
          d="M 25 106 C 180 116 360 96 500 104 C 590 110 650 100 665 104 C 630 114 540 116 460 114"
          stroke="#8b5cf6"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={shouldAnimate ? { pathLength: 1, opacity: 0.9 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 0.5, delay: 1.85, ease: "easeOut" }}
        />
      </svg>

      {/* Traveling Calligraphy Fountain Pen Nib Cursor */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0, x: 25, y: 15 }}
        animate={
          shouldAnimate
            ? {
                opacity: [0, 1, 1, 1, 1, 0],
                x: [35, 130, 220, 370, 510, 660],
                y: [28, 50, 38, 60, 70, 106],
                rotate: [15, 25, 20, 18, 22, 12],
              }
            : { opacity: 0 }
        }
        transition={{
          duration: 2.3,
          ease: "easeInOut",
        }}
        className="absolute top-0 left-0 pointer-events-none text-accent drop-shadow-md -translate-x-2 -translate-y-4"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-accent fill-canvas drop-shadow"
        >
          <path d="m12 19 7-7 3 3-7 7-3-3z" />
          <path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
          <path d="m2 2 7.586 7.586" />
          <circle cx="11" cy="11" r="2" fill="currentColor" />
        </svg>
      </motion.div>
    </div>
  );
}
