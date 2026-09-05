"use client";

import { motion } from "framer-motion";

interface TextRevealProps {
  lines: string[];
  className?: string;
}

/**
 * @kumail_ali_r/components/text-reveal-animation
 * Adapted to BH Planner's flat Violet Bloom design tokens.
 * Renders the problem-solution storytelling sequence with masked upward rolling,
 * staggered word-by-word deblurring, and subtle spring physics.
 */
export function TextReveal({ lines, className = "" }: TextRevealProps) {
  return (
    <div className={`flex flex-col space-y-3 sm:space-y-4 ${className}`}>
      {lines.map((line, lineIndex) => {
        const words = line.split(" ");
        const isSolutionLine = line.toLowerCase().includes("solution");

        return (
          <div
            key={lineIndex}
            className="overflow-hidden py-1 flex flex-wrap justify-center items-center gap-x-2.5 sm:gap-x-3.5"
          >
            {words.map((word, wordIndex) => {
              const isHighlightWord = word.toUpperCase() === "ALL";

              return (
                <span
                  key={wordIndex}
                  className="inline-block overflow-hidden align-middle"
                >
                  <motion.span
                    initial={{ y: "110%", opacity: 0.1, filter: "blur(6px)" }}
                    animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
                    transition={{
                      duration: 0.7,
                      delay: lineIndex * 0.35 + wordIndex * 0.08,
                      ease: [0.215, 0.61, 0.355, 1],
                    }}
                    whileHover={{
                      y: -2,
                      scale: 1.03,
                      transition: { duration: 0.2 },
                    }}
                    className={`inline-block text-2xl sm:text-3xl md:text-4xl font-normal tracking-tight cursor-default ${
                      isHighlightWord
                        ? "text-accent font-bold"
                        : isSolutionLine
                        ? "text-foreground font-medium"
                        : "text-muted hover:text-foreground transition-colors"
                    }`}
                  >
                    {word}
                  </motion.span>
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
