"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface HandwritingTextProps {
  onComplete?: () => void;
  className?: string;
}

/**
 * @kokonutd/components/hand-writing-text
 * Cursive calligraphy SVG path animation for "BH PLANNER".
 * Staggered path tracing:
 * 1. "BH" drawn first (duration: 0.8s, stroke: #8b5cf6)
 * 2. "PLANNER" drawn immediately following (duration: 1.2s, delay: 0.8s, stroke: #f3f0f9)
 * 3. Underline signature flourish (duration: 0.5s, delay: 2.0s, stroke: #8b5cf6)
 * 4. Triggers onComplete callback to reveal the frosted glass JOIN CTA button.
 */
export function HandwritingText({
  onComplete,
  className = "",
}: HandwritingTextProps) {
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    // Safety fallback: ensure onComplete fires even if SVG animation is interrupted
    const timer = setTimeout(() => {
      if (!completed) {
        setCompleted(true);
        onComplete?.();
      }
    }, 2500);
    return () => clearTimeout(timer);
  }, [completed, onComplete]);

  const handleAnimationComplete = () => {
    if (!completed) {
      setCompleted(true);
      onComplete?.();
    }
  };

  return (
    <div className={`relative inline-flex flex-col items-center select-none w-full max-w-2xl px-2 ${className}`}>
      <span className="sr-only">BH PLANNER</span>

      <svg
        viewBox="0 0 680 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto overflow-visible"
        aria-hidden="true"
      >
        {/* ================================================================= */}
        {/* "BH" — Violet Bloom Primary (#8b5cf6) — Duration 0.8s            */}
        {/* ================================================================= */}
        <g id="bh-word" stroke="#8b5cf6" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
          {/* 'B' vertical stem and top flourish */}
          <motion.path
            d="M 40 28 L 40 88"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />
          {/* 'B' upper and lower cursive loops */}
          <motion.path
            d="M 38 30 C 72 16 92 36 68 54 C 48 60 40 56 40 56 C 75 56 96 74 72 88 C 50 94 40 88 56 88"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.15, ease: "easeInOut" }}
          />

          {/* 'H' left ascender */}
          <motion.path
            d="M 108 26 L 108 88"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.35, delay: 0.35, ease: "easeInOut" }}
          />
          {/* 'H' cross-swoop bridge */}
          <motion.path
            d="M 105 56 C 122 52 136 53 150 55"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.25, delay: 0.5, ease: "easeInOut" }}
          />
          {/* 'H' right ascender & cursive exit */}
          <motion.path
            d="M 150 26 L 150 88 C 150 94 158 90 168 84"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.35, delay: 0.6, ease: "easeInOut" }}
          />
        </g>

        {/* ================================================================= */}
        {/* "PLANNER" — Foreground Text (#f3f0f9) — Duration 1.2s, Delay 0.8s */}
        {/* ================================================================= */}
        <g id="planner-word" stroke="#f3f0f9" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
          {/* 'P' stem */}
          <motion.path
            d="M 205 92 L 205 38"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.25, delay: 0.8, ease: "easeInOut" }}
          />
          {/* 'P' cursive head loop */}
          <motion.path
            d="M 205 40 C 205 26 238 26 238 52 C 238 68 205 68 205 68"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.25, delay: 0.9, ease: "easeInOut" }}
          />

          {/* 'L' cursive loop and baseline */}
          <motion.path
            d="M 242 88 C 255 88 262 82 268 48 C 272 26 264 26 260 40 C 254 64 260 88 288 88"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.3, delay: 1.05, ease: "easeInOut" }}
          />

          {/* 'A' bowl and downstroke */}
          <motion.path
            d="M 308 68 C 296 58 290 70 296 82 C 302 90 320 90 326 78 M 326 58 L 326 88 C 326 92 332 89 340 84"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.3, delay: 1.25, ease: "easeInOut" }}
          />

          {/* First 'N' arches */}
          <motion.path
            d="M 352 64 L 352 88 M 352 70 C 362 58 380 58 382 88"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.25, delay: 1.45, ease: "easeInOut" }}
          />

          {/* Second 'N' arches */}
          <motion.path
            d="M 396 64 L 396 88 M 396 70 C 406 58 424 58 426 88"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.25, delay: 1.6, ease: "easeInOut" }}
          />

          {/* 'E' loop */}
          <motion.path
            d="M 440 88 C 458 88 464 68 450 60 C 435 52 430 72 444 84 C 452 90 464 88 472 84"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.25, delay: 1.75, ease: "easeInOut" }}
          />

          {/* 'R' stem & shoulder */}
          <motion.path
            d="M 484 64 L 484 88 M 482 70 C 492 58 510 62 514 72 C 514 80 512 88 524 88"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.25, delay: 1.9, ease: "easeInOut" }}
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
          animate={{ pathLength: 1, opacity: 0.9 }}
          transition={{ duration: 0.5, delay: 2.0, ease: "easeOut" }}
          onAnimationComplete={handleAnimationComplete}
        />
      </svg>
    </div>
  );
}
