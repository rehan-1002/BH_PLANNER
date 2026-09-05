"use client";

import { useEffect, useState } from "react";
import {
  motion,
  MotionValue,
  useTransform,
  useMotionValueEvent,
  useMotionValue,
} from "framer-motion";

interface HandwritingTextProps {
  onComplete?: () => void;
  className?: string;
  progress?: MotionValue<number>;
  drawRange?: [number, number];
}

/**
 * @kokonutd/components/hand-writing-text
 * Cursive calligraphy SVG path animation for "BH PLANNER".
 * Supports BOTH:
 * 1. Scroll-driven drawing bound to scroll progress (scrubs forward and back)
 * 2. Automatic keyframe animation when no progress value is provided
 *
 * Theme-aware:
 * - "BH": Violet Bloom accent (#8b5cf6)
 * - "PLANNER": stroke="currentColor" (text-foreground) -> dark ink in light mode, bright in dark mode
 * - Underline: Violet Bloom accent (#8b5cf6)
 */
export function HandwritingText({
  onComplete,
  className = "",
  progress,
  drawRange = [0.55, 0.82],
}: HandwritingTextProps) {
  const [completed, setCompleted] = useState(false);

  // Standalone fallback timeout
  useEffect(() => {
    if (progress) return;
    const timer = setTimeout(() => {
      if (!completed) {
        setCompleted(true);
        onComplete?.();
      }
    }, 2500);
    return () => clearTimeout(timer);
  }, [completed, onComplete, progress]);

  const [start, end] = drawRange;
  const span = end - start;

  // Segment allocations within drawRange:
  // BH: start -> start + 0.35 * span
  // PLANNER: start + 0.35 * span -> start + 0.85 * span
  // Underline: start + 0.85 * span -> end
  const bhStart = start;
  const bhEnd = start + 0.35 * span;
  const pStart = bhEnd;
  const pEnd = start + 0.85 * span;
  const uStart = pEnd;
  const uEnd = end;

  // Fallback motion value when progress is not passed
  const fallbackProgress = useMotionValue(1);
  const activeProgress = progress || fallbackProgress;

  const overallOpacity = useTransform(
    activeProgress,
    [Math.max(0, start - 0.08), start],
    [0.1, 1]
  );

  // BH Paths
  const bh1 = useTransform(activeProgress, [bhStart, bhStart + 0.15 * span], [0, 1]);
  const bh2 = useTransform(activeProgress, [bhStart + 0.08 * span, bhStart + 0.22 * span], [0, 1]);
  const bh3 = useTransform(activeProgress, [bhStart + 0.18 * span, bhStart + 0.28 * span], [0, 1]);
  const bh4 = useTransform(activeProgress, [bhStart + 0.24 * span, bhStart + 0.31 * span], [0, 1]);
  const bh5 = useTransform(activeProgress, [bhStart + 0.28 * span, bhEnd], [0, 1]);

  // PLANNER Paths
  const pSpanPerLetter = (pEnd - pStart) / 7;
  const plP1 = useTransform(activeProgress, [pStart, pStart + pSpanPerLetter * 0.5], [0, 1]);
  const plP2 = useTransform(activeProgress, [pStart + pSpanPerLetter * 0.4, pStart + pSpanPerLetter], [0, 1]);
  const plL = useTransform(activeProgress, [pStart + pSpanPerLetter, pStart + pSpanPerLetter * 2], [0, 1]);
  const plA = useTransform(activeProgress, [pStart + pSpanPerLetter * 2, pStart + pSpanPerLetter * 3], [0, 1]);
  const plN1 = useTransform(activeProgress, [pStart + pSpanPerLetter * 3, pStart + pSpanPerLetter * 4], [0, 1]);
  const plN2 = useTransform(activeProgress, [pStart + pSpanPerLetter * 4, pStart + pSpanPerLetter * 5], [0, 1]);
  const plE = useTransform(activeProgress, [pStart + pSpanPerLetter * 5, pStart + pSpanPerLetter * 6], [0, 1]);
  const plR = useTransform(activeProgress, [pStart + pSpanPerLetter * 6, pEnd], [0, 1]);

  // Underline Flourish
  const underFlourish = useTransform(activeProgress, [uStart, uEnd], [0, 1]);

  // Notify onComplete when scroll reaches completion of flourish
  useMotionValueEvent(underFlourish, "change", (latest) => {
    if (latest >= 0.95 && !completed) {
      setCompleted(true);
      onComplete?.();
    }
  });

  const isScrollDriven = Boolean(progress);

  return (
    <motion.div
      style={isScrollDriven ? { opacity: overallOpacity } : undefined}
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
            style={isScrollDriven ? { pathLength: bh1 } : undefined}
            initial={isScrollDriven ? undefined : { pathLength: 0 }}
            animate={isScrollDriven ? undefined : { pathLength: 1 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />
          {/* 'B' cursive loops */}
          <motion.path
            d="M 38 30 C 72 16 92 36 68 54 C 48 60 40 56 40 56 C 75 56 96 74 72 88 C 50 94 40 88 56 88"
            style={isScrollDriven ? { pathLength: bh2 } : undefined}
            initial={isScrollDriven ? undefined : { pathLength: 0 }}
            animate={isScrollDriven ? undefined : { pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.15, ease: "easeInOut" }}
          />
          {/* 'H' left stem */}
          <motion.path
            d="M 108 26 L 108 88"
            style={isScrollDriven ? { pathLength: bh3 } : undefined}
            initial={isScrollDriven ? undefined : { pathLength: 0 }}
            animate={isScrollDriven ? undefined : { pathLength: 1 }}
            transition={{ duration: 0.35, delay: 0.35, ease: "easeInOut" }}
          />
          {/* 'H' cross-bridge */}
          <motion.path
            d="M 105 56 C 122 52 136 53 150 55"
            style={isScrollDriven ? { pathLength: bh4 } : undefined}
            initial={isScrollDriven ? undefined : { pathLength: 0 }}
            animate={isScrollDriven ? undefined : { pathLength: 1 }}
            transition={{ duration: 0.25, delay: 0.5, ease: "easeInOut" }}
          />
          {/* 'H' right stem & exit */}
          <motion.path
            d="M 150 26 L 150 88 C 150 94 158 90 168 84"
            style={isScrollDriven ? { pathLength: bh5 } : undefined}
            initial={isScrollDriven ? undefined : { pathLength: 0 }}
            animate={isScrollDriven ? undefined : { pathLength: 1 }}
            transition={{ duration: 0.35, delay: 0.6, ease: "easeInOut" }}
          />
        </g>

        {/* ================================================================= */}
        {/* "PLANNER" — Foreground Ink: stroke="currentColor" (Theme-adaptive) */}
        {/* ================================================================= */}
        <g id="planner-word" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
          {/* 'P' stem */}
          <motion.path
            d="M 205 92 L 205 38"
            style={isScrollDriven ? { pathLength: plP1 } : undefined}
            initial={isScrollDriven ? undefined : { pathLength: 0 }}
            animate={isScrollDriven ? undefined : { pathLength: 1 }}
            transition={{ duration: 0.25, delay: 0.8, ease: "easeInOut" }}
          />
          {/* 'P' loop */}
          <motion.path
            d="M 205 40 C 205 26 238 26 238 52 C 238 68 205 68 205 68"
            style={isScrollDriven ? { pathLength: plP2 } : undefined}
            initial={isScrollDriven ? undefined : { pathLength: 0 }}
            animate={isScrollDriven ? undefined : { pathLength: 1 }}
            transition={{ duration: 0.25, delay: 0.9, ease: "easeInOut" }}
          />
          {/* 'L' cursive loop */}
          <motion.path
            d="M 242 88 C 255 88 262 82 268 48 C 272 26 264 26 260 40 C 254 64 260 88 288 88"
            style={isScrollDriven ? { pathLength: plL } : undefined}
            initial={isScrollDriven ? undefined : { pathLength: 0 }}
            animate={isScrollDriven ? undefined : { pathLength: 1 }}
            transition={{ duration: 0.3, delay: 1.05, ease: "easeInOut" }}
          />
          {/* 'A' loop */}
          <motion.path
            d="M 308 68 C 296 58 290 70 296 82 C 302 90 320 90 326 78 M 326 58 L 326 88 C 326 92 332 89 340 84"
            style={isScrollDriven ? { pathLength: plA } : undefined}
            initial={isScrollDriven ? undefined : { pathLength: 0 }}
            animate={isScrollDriven ? undefined : { pathLength: 1 }}
            transition={{ duration: 0.3, delay: 1.25, ease: "easeInOut" }}
          />
          {/* First 'N' arches */}
          <motion.path
            d="M 352 64 L 352 88 M 352 70 C 362 58 380 58 382 88"
            style={isScrollDriven ? { pathLength: plN1 } : undefined}
            initial={isScrollDriven ? undefined : { pathLength: 0 }}
            animate={isScrollDriven ? undefined : { pathLength: 1 }}
            transition={{ duration: 0.25, delay: 1.45, ease: "easeInOut" }}
          />
          {/* Second 'N' arches */}
          <motion.path
            d="M 396 64 L 396 88 M 396 70 C 406 58 424 58 426 88"
            style={isScrollDriven ? { pathLength: plN2 } : undefined}
            initial={isScrollDriven ? undefined : { pathLength: 0 }}
            animate={isScrollDriven ? undefined : { pathLength: 1 }}
            transition={{ duration: 0.25, delay: 1.6, ease: "easeInOut" }}
          />
          {/* 'E' loop */}
          <motion.path
            d="M 440 88 C 458 88 464 68 450 60 C 435 52 430 72 444 84 C 452 90 464 88 472 84"
            style={isScrollDriven ? { pathLength: plE } : undefined}
            initial={isScrollDriven ? undefined : { pathLength: 0 }}
            animate={isScrollDriven ? undefined : { pathLength: 1 }}
            transition={{ duration: 0.25, delay: 1.75, ease: "easeInOut" }}
          />
          {/* 'R' arch & baseline */}
          <motion.path
            d="M 484 64 L 484 88 M 482 70 C 492 58 510 62 514 72 C 514 80 512 88 524 88"
            style={isScrollDriven ? { pathLength: plR } : undefined}
            initial={isScrollDriven ? undefined : { pathLength: 0 }}
            animate={isScrollDriven ? undefined : { pathLength: 1 }}
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
          style={isScrollDriven ? { pathLength: underFlourish } : undefined}
          initial={isScrollDriven ? undefined : { pathLength: 0, opacity: 0 }}
          animate={isScrollDriven ? undefined : { pathLength: 1, opacity: 0.9 }}
          transition={{ duration: 0.5, delay: 2.0, ease: "easeOut" }}
          onAnimationComplete={isScrollDriven ? undefined : () => {
            if (!completed) {
              setCompleted(true);
              onComplete?.();
            }
          }}
        />
      </svg>
    </motion.div>
  );
}
