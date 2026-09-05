"use client";

import { useEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import { useInView } from "framer-motion";

interface ScrollFloatProps {
  children: string;
  containerClassName?: string;
  textClassName?: string;
  animationDuration?: number;
  ease?: string;
  stagger?: number;
  highlightWord?: string;
  delay?: number;
}

export const ScrollFloat = ({
  children,
  containerClassName = "",
  textClassName = "",
  animationDuration = 0.9,
  ease = "back.out(2)",
  stagger = 0.032,
  highlightWord,
  delay = 0.05,
}: ScrollFloatProps) => {
  const containerRef = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(containerRef, { amount: 0.35, once: false });

  const words = useMemo(() => {
    return typeof children === "string" ? children.split(" ") : [];
  }, [children]);

  const splitText = useMemo(() => {
    let charIndex = 0;
    return words.map((word, wIdx) => {
      const isHighlighted =
        highlightWord && word.toUpperCase() === highlightWord.toUpperCase();

      const chars = word.split("").map((char) => {
        const key = `${wIdx}-${charIndex++}`;
        return (
          <span
            className={`char ${
              isHighlighted ? "text-accent font-black" : "text-foreground"
            }`}
            key={key}
          >
            {char}
          </span>
        );
      });

      return (
        <span key={wIdx} className="inline-block whitespace-nowrap">
          {chars}
          {wIdx < words.length - 1 && (
            <span className="char">&nbsp;</span>
          )}
        </span>
      );
    });
  }, [words, highlightWord]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const charElements = el.querySelectorAll(".char");

    const ctx = gsap.context(() => {
      if (isInView) {
        gsap.fromTo(
          charElements,
          {
            willChange: "opacity, transform",
            opacity: 0,
            yPercent: 120,
            scaleY: 2.3,
            scaleX: 0.7,
            transformOrigin: "50% 0%",
          },
          {
            duration: animationDuration,
            ease: ease,
            opacity: 1,
            yPercent: 0,
            scaleY: 1,
            scaleX: 1,
            stagger: stagger,
            delay: delay,
          }
        );
      } else {
        gsap.set(charElements, {
          opacity: 0,
          yPercent: 120,
          scaleY: 2.3,
          scaleX: 0.7,
        });
      }
    }, el);

    return () => ctx.revert();
  }, [isInView, animationDuration, ease, stagger, delay]);

  return (
    <h2 ref={containerRef} className={`scroll-float ${containerClassName}`}>
      <span className={`scroll-float-text ${textClassName}`}>{splitText}</span>
    </h2>
  );
};

export default ScrollFloat;
