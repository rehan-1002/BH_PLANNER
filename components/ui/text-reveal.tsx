"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

interface TextRevealProps {
  lines?: string[];
  className?: string;
}

interface WordProps {
  word: string;
  progress: MotionValue<number>;
  range: [number, number];
  isHighlight?: boolean;
  isSolution?: boolean;
}

/**
 * Individual Word with scroll-scrubbed deblur and opacity transition
 */
function ScrubbedWord({
  word,
  progress,
  range,
  isHighlight,
  isSolution,
}: WordProps) {
  const opacity = useTransform(progress, range, [0.1, 1]);
  const y = useTransform(progress, range, [12, 0]);
  const blurValue = useTransform(progress, range, [8, 0]);
  const filter = useTransform(blurValue, (v) => `blur(${v}px)`);

  return (
    <span className="inline-block overflow-hidden align-middle py-0.5">
      <motion.span
        style={{ opacity, y, filter }}
        className={`inline-block text-2xl sm:text-3xl md:text-4xl font-normal tracking-tight ${
          isHighlight
            ? "text-accent font-bold"
            : isSolution
            ? "text-foreground font-medium"
            : "text-muted"
        }`}
      >
        {word}
      </motion.span>
    </span>
  );
}

/**
 * @kumail_ali_r/components/text-reveal-animation
 * Scroll-scrubbed text reveal bound tightly to container scroll progress
 * via Framer Motion's useScroll({ target: containerRef, offset: ["start end", "end start"] }).
 * Progressively deblurs words (filter: blur(8px) -> blur(0px), opacity: 0.1 -> 1, translateY: 12px -> 0px).
 */
export function TextReveal({
  lines = [
    "Unorganised planning?",
    "No schedule?",
    "ALL solution is here",
  ],
  className = "",
}: TextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Calculate total words across all lines to distribute progress segments
  const allWordsCount = lines.reduce(
    (count, line) => count + line.split(" ").length,
    0
  );

  let globalWordIndex = 0;

  return (
    <div
      ref={containerRef}
      className={`flex flex-col space-y-3 sm:space-y-4 ${className}`}
    >
      {lines.map((line, lineIndex) => {
        const words = line.split(" ");
        const isSolutionLine = line.toLowerCase().includes("solution");

        return (
          <div
            key={lineIndex}
            className="py-1 flex flex-wrap justify-center items-center gap-x-2.5 sm:gap-x-3.5"
          >
            {words.map((word, wordIndex) => {
              const isHighlightWord = word.toUpperCase() === "ALL";

              // Map progress range: active between 0.1 and 0.85 of scroll span
              const start = 0.05 + (globalWordIndex / allWordsCount) * 0.55;
              const end = start + (0.55 / allWordsCount);
              globalWordIndex++;

              return (
                <ScrubbedWord
                  key={`${lineIndex}-${wordIndex}`}
                  word={word}
                  progress={scrollYProgress}
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
