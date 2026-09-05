"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

interface TextRevealProps {
  lines?: string[];
  className?: string;
  progress?: MotionValue<number>;
  ranges?: [number, number][];
}

interface WordProps {
  word: string;
  progress: MotionValue<number>;
  range: [number, number];
  isHighlight?: boolean;
  isSolution?: boolean;
}

function ScrubbedWord({
  word,
  progress,
  range,
  isHighlight,
  isSolution,
}: WordProps) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  const y = useTransform(progress, range, [14, 0]);
  const blurValue = useTransform(progress, range, [8, 0]);
  const filter = useTransform(blurValue, (v) => `blur(${v}px)`);

  return (
    <span className="inline-block overflow-hidden align-middle py-0.5">
      <motion.span
        style={{ opacity, y, filter }}
        className={`inline-block text-2xl sm:text-3xl md:text-5xl font-normal tracking-tight ${
          isHighlight
            ? "text-accent font-bold"
            : isSolution
            ? "text-foreground font-medium"
            : "text-foreground font-light"
        }`}
      >
        {word}
      </motion.span>
    </span>
  );
}

/**
 * @kumail_ali_r/components/text-reveal-animation
 * Scroll-driven text reveal bound to scroll progress.
 * Sequentially deblurs words (filter: blur(8px) -> blur(0px), opacity: 0.15 -> 1, translateY: 14px -> 0px).
 */
export function TextReveal({
  lines = [
    "Unorganised planning?",
    "No schedule?",
    "ALL solution is here",
  ],
  className = "",
  progress: externalProgress,
  ranges,
}: TextRevealProps) {
  const localContainerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: localProgress } = useScroll({
    target: localContainerRef,
    offset: ["start end", "end start"],
  });

  const scrollProgress = externalProgress || localProgress;

  // Default stage ranges across 3 lines if not explicitly passed
  const defaultRanges: [number, number][] = [
    [0.02, 0.18], // Line 1: Unorganised planning?
    [0.18, 0.35], // Line 2: No schedule?
    [0.35, 0.52], // Line 3: ALL solution is here
  ];

  const lineRanges = ranges || defaultRanges;

  return (
    <div
      ref={localContainerRef}
      className={`flex flex-col space-y-3 sm:space-y-4 ${className}`}
    >
      {lines.map((line, lineIndex) => {
        const words = line.split(" ");
        const isSolutionLine = line.toLowerCase().includes("solution");
        const [lineStart, lineEnd] = lineRanges[lineIndex] || [0.05, 0.5];
        const wordSpan = (lineEnd - lineStart) / words.length;

        return (
          <div
            key={lineIndex}
            className="py-1 flex flex-wrap justify-center items-center gap-x-2.5 sm:gap-x-3.5"
          >
            {words.map((word, wordIndex) => {
              const isHighlightWord = word.toUpperCase() === "ALL";
              const start = lineStart + wordIndex * wordSpan;
              const end = start + wordSpan;

              return (
                <ScrubbedWord
                  key={`${lineIndex}-${wordIndex}`}
                  word={word}
                  progress={scrollProgress}
                  range={[start, end]}
                  isHighlight={isHighlightWord}
                  isSolution={isSolutionLine}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
