"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface HandwritingTextProps {
  prefix?: string;
  suffix?: string;
  className?: string;
}

/**
 * @kokonutd/components/hand-writing-text
 * Adapted to BH Planner's flat Violet Bloom design tokens.
 * Renders the canonical "BH PLANNER" reveal with an animated hand-drawn SVG
 * flourish stroke and a traveling fountain pen nib cursor.
 */
export function HandwritingText({
  prefix = "BH",
  suffix = "PLANNER",
  className = "",
}: HandwritingTextProps) {
  const [isDoneDrawing, setIsDoneDrawing] = useState(false);

  return (
    <div className={`relative inline-flex flex-col items-center select-none py-3 ${className}`}>
      {/* Editorial Typographic Core */}
      <div className="relative inline-flex items-baseline space-x-3 text-4xl sm:text-6xl md:text-7xl font-sans tracking-tight">
        <motion.span
          initial={{ opacity: 0.7, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="font-extrabold text-accent tracking-tighter"
        >
          {prefix}
        </motion.span>
        <motion.span
          initial={{ opacity: 0.7, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
          className="font-light tracking-wider text-foreground"
        >
          {suffix}
        </motion.span>
      </div>

      {/* SVG Hand-Drawn Flourish with Traveling Pen Nib */}
      <div className="relative w-full max-w-[280px] sm:max-w-[420px] md:max-w-[500px] h-9 -mt-1 overflow-visible">
        <svg
          viewBox="0 0 420 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full overflow-visible"
        >
          {/* Subtle guide track */}
          <path
            d="M 10,22 C 70,28 150,14 230,22 C 310,30 370,16 410,20"
            stroke="var(--border)"
            strokeWidth="1.5"
            strokeLinecap="round"
            className="opacity-40"
          />

          {/* Animated Hand-drawn Calligraphic Stroke */}
          <motion.path
            d="M 10,22 C 70,28 150,14 230,22 C 310,30 370,16 410,20"
            stroke="#8b5cf6"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: 1.4,
              delay: 0.35,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            onAnimationComplete={() => setIsDoneDrawing(true)}
          />

          {/* Secondary return flourish loop */}
          <motion.path
            d="M 410,20 C 390,26 350,30 320,29"
            stroke="#8b5cf6"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.75 }}
            transition={{
              duration: 0.6,
              delay: 1.7,
              ease: "easeOut",
            }}
          />
        </svg>

        {/* Traveling Fountain Pen Nib Cursor */}
        <motion.div
          initial={{ opacity: 0, x: 10, y: 14 }}
          animate={
            isDoneDrawing
              ? { opacity: 0, x: 410, y: 12 }
              : {
                  opacity: [0, 1, 1, 0],
                  x: [10, 100, 230, 410],
                  y: [14, 18, 14, 12],
                  rotate: [15, 25, 20, 15],
                }
          }
          transition={{
            duration: 1.5,
            delay: 0.35,
            times: [0, 0.1, 0.85, 1],
            ease: "easeInOut",
          }}
          className="absolute top-0 left-0 pointer-events-none text-accent drop-shadow-sm -translate-x-2 -translate-y-4"
        >
          {/* Stylized Pen Nib SVG */}
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-accent fill-panel-solid"
          >
            <path d="m12 19 7-7 3 3-7 7-3-3z" />
            <path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
            <path d="m2 2 7.586 7.586" />
            <circle cx="11" cy="11" r="2" fill="currentColor" />
          </svg>
        </motion.div>
      </div>
    </div>
  );
}
