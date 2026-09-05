"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { KineticNav } from "@/components/ui/kinetic-nav";
import { TextReveal } from "@/components/ui/text-reveal";
import { HandwritingText } from "@/components/ui/handwriting";
import { ButtonWithIcon } from "@/components/ui/button-with-icon";
import { AuthSwitch } from "@/components/ui/auth-switch";

export default function LandingPage() {
  const trackRef = useRef<HTMLDivElement>(null);

  // Measure scroll progress across the pinned storytelling track
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  // Storytelling stages mapped across track [0, 1]:
  // 1. "Unorganised planning?": [0.02, 0.16]
  // 2. "No schedule?": [0.16, 0.30]
  // 3. "ALL solution is here": [0.30, 0.46]
  // 4. "BH PLANNER" handwriting: [0.48, 0.72]
  // 5. ButtonWithIcon "JOIN": [0.70, 0.78]

  const problemStatements = [
    "Unorganised planning?",
    "No schedule?",
    "ALL solution is here",
  ];

  const statementRanges: [number, number][] = [
    [0.02, 0.16],
    [0.16, 0.30],
    [0.30, 0.46],
  ];

  // CTA Join button & subtitle transforms
  const joinOpacity = useTransform(scrollYProgress, [0.70, 0.78], [0, 1]);
  const joinY = useTransform(scrollYProgress, [0.70, 0.78], [18, 0]);
  const subtitleOpacity = useTransform(scrollYProgress, [0.66, 0.75], [0, 1]);

  // Initial scroll indicator prompt (fades away as soon as user begins scrolling)
  const scrollPromptOpacity = useTransform(scrollYProgress, [0.0, 0.05], [1, 0]);

  const scrollToAuth = () => {
    const authEl = document.getElementById("auth-gateway");
    if (authEl) {
      authEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-canvas text-foreground selection:bg-accent/30 selection:text-foreground">
      {/* =================================================================== */}
      {/* FIXED GLOBAL HEADERS                                               */}
      {/* =================================================================== */}
      {/* Top-Left: Theme Toggle */}
      <div className="fixed top-5 left-6 z-50">
        <ThemeToggle />
      </div>

      {/* Top-Center: Sterling Gate Kinetic Navigation Dock */}
      <div className="fixed top-5 left-1/2 -translate-x-1/2 z-40">
        <KineticNav />
      </div>

      {/* Top-Right: Refined Frosted Logo Badge */}
      <div className="fixed top-5 right-6 z-50">
        <Link
          aria-label="BH Planner Home"
          className="flex items-center justify-center size-9 rounded-xl glass-panel overflow-hidden hover:border-accent transition-colors"
          href="/"
        >
          <img
            src="/BH LOGO.webp"
            alt="BH Logo"
            className="size-6 object-contain"
          />
        </Link>
      </div>

      {/* =================================================================== */}
      {/* 1. SCROLL-DRIVEN PINNED STORYTELLING TRACK (min-h-[420vh])           */}
      {/* =================================================================== */}
      <div ref={trackRef} className="relative w-full min-h-[420vh]">
        <div className="sticky top-0 h-screen w-full flex flex-col justify-center items-center px-4 sm:px-6 overflow-hidden">
          {/* Main Editorial Container */}
          <div className="w-full max-w-3xl flex flex-col items-center text-center space-y-8 z-10">
            {/* Sequence 1-3: Scroll-driven Text Reveal (@kumail_ali_r) */}
            <TextReveal
              lines={problemStatements}
              progress={scrollYProgress}
              ranges={statementRanges}
              className="items-center"
            />

            {/* Sequence 4: Scroll-driven Handwriting Reveal of "BH PLANNER" (@kokonutd) */}
            <div className="py-2 w-full flex justify-center">
              <HandwritingText
                progress={scrollYProgress}
                drawRange={[0.48, 0.72]}
                onComplete={() => {}}
              />
            </div>

            {/* Subtitle explaining the system */}
            <motion.p
              style={{ opacity: subtitleOpacity }}
              className="text-xs sm:text-sm md:text-base text-muted max-w-lg font-light leading-relaxed px-4"
            >
              Adaptive study scheduling around fixed college commitments, commute realities, syllabus coverage, and approaching exam deadlines.
            </motion.p>

            {/* Sequence 5: Button With Icon (@shadcnspace/components/button-witn-icon) */}
            <motion.div
              style={{ opacity: joinOpacity, y: joinY }}
              className="pt-2"
            >
              <ButtonWithIcon
                onClick={scrollToAuth}
                ariaLabel="Proceed to Authentication Gateway"
              >
                JOIN
              </ButtonWithIcon>
            </motion.div>
          </div>

          {/* Initial Scroll Hint Prompt */}
          <motion.div
            style={{ opacity: scrollPromptOpacity }}
            className="absolute bottom-8 flex flex-col items-center space-y-1.5 text-xs text-muted font-mono pointer-events-none select-none"
          >
            <span className="tracking-widest uppercase text-[10px]">Scroll to reveal story</span>
            <ChevronDown className="w-4 h-4 text-accent animate-bounce" />
          </motion.div>

          {/* Subtle Stage Progress Indicator */}
          <div className="absolute bottom-4 inset-x-0 flex justify-center text-[10px] text-muted/50 font-mono select-none">
            <span>BH PLANNER · TIER-1 STORYLINE</span>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 2. AUTHENTICATION GATEWAY (@appvibed01/components/auth-switch)       */}
      {/* =================================================================== */}
      <section
        id="auth-gateway"
        className="relative w-full min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-24 sm:py-32 border-t border-panel-border"
      >
        <div className="flex flex-col items-center mb-8 space-y-3 text-center">
          <div className="flex items-center justify-center size-12 rounded-2xl glass-panel overflow-hidden shadow-md">
            <img
              src="/BH LOGO.webp"
              alt="BH Logo"
              className="size-8 object-contain"
            />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
              Academic Access Gateway
            </h2>
            <p className="text-xs sm:text-sm text-muted mt-1 max-w-md">
              Authenticate to access your active timetable, syllabus runway, and Tier-1 deterministic buffer engine.
            </p>
          </div>
        </div>

        {/* Sliding Frosted Curtain Component */}
        <div className="w-full flex justify-center">
          <AuthSwitch />
        </div>

        {/* Security Notice & Specification Footer */}
        <div className="mt-12 text-center text-xs text-muted/70 font-mono space-y-2">
          <p>Email verification strictly enforced prior to timetable access</p>
          <p className="text-[11px] text-muted/50">BH PLANNER · SYSTEM SPECIFICATION 1.0</p>
        </div>
      </section>
    </div>
  );
}
