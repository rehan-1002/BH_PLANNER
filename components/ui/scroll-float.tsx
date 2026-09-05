"use client";

import { useEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollFloatProps {
  children: string;
  scrollContainerRef?: React.RefObject<HTMLElement>;
  containerClassName?: string;
  textClassName?: string;
  animationDuration?: number;
  ease?: string;
  scrollStart?: string;
  scrollEnd?: string;
  stagger?: number;
  highlightWord?: string;
  animateOnMount?: boolean;
}

export const ScrollFloat = ({
  children,
  scrollContainerRef,
  containerClassName = "",
  textClassName = "",
  animationDuration = 1,
  ease = "back.inOut(2)",
  scrollStart = "center bottom+=50%",
  scrollEnd = "bottom bottom-=40%",
  stagger = 0.03,
  highlightWord,
  animateOnMount = false,
}: ScrollFloatProps) => {
  const containerRef = useRef<HTMLHeadingElement>(null);

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

    const scroller =
      scrollContainerRef && scrollContainerRef.current
        ? scrollContainerRef.current
        : window;

    const charElements = el.querySelectorAll(".char");

    const ctx = gsap.context(() => {
      if (animateOnMount) {
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
            ease: "back.out(2)",
            opacity: 1,
            yPercent: 0,
            scaleY: 1,
            scaleX: 1,
            stagger: stagger,
            delay: 0.1,
          }
        );
      } else {
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
            scrollTrigger: {
              trigger: el,
              scroller,
              start: scrollStart,
              end: scrollEnd,
              scrub: true,
            },
          }
        );
      }
    }, el);

    return () => ctx.revert();
  }, [
    scrollContainerRef,
    animationDuration,
    ease,
    scrollStart,
    scrollEnd,
    stagger,
    animateOnMount,
  ]);

  return (
    <h2 ref={containerRef} className={`scroll-float ${containerClassName}`}>
      <span className={`scroll-float-text ${textClassName}`}>{splitText}</span>
    </h2>
  );
};

export default ScrollFloat;
