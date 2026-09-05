"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { KineticNav } from "@/components/ui/kinetic-nav";
import { ScrollFloat } from "@/components/ui/scroll-float";
import { HandwritingText } from "@/components/ui/handwriting";
import { ButtonWithIcon } from "@/components/ui/button-with-icon";
import { AuthSwitch } from "@/components/ui/auth-switch";

export default function LandingPage() {
  const scrollToAuth = () => {
    const authEl = document.getElementById("auth-gateway");
    if (authEl) {
      authEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-canvas text-foreground selection:bg-accent/30 selection:text-foreground">
      {/* =================================================================== */}
      {/* FIXED GLOBAL HEADER ANCHORS                                         */}
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
      {/* SCENE 1: "Unorganised planning?"                                    */}
      {/* =================================================================== */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <span className="text-[11px] font-mono uppercase tracking-widest text-accent font-semibold mb-4 px-3 py-1 rounded-full glass-panel">
            Phase 01 · The Reality
          </span>
          <ScrollFloat
            animateOnMount={true}
            animationDuration={1.1}
            stagger={0.035}
            containerClassName="w-full"
            textClassName="text-foreground"
          >
            Unorganised planning?
          </ScrollFloat>
        </div>

        {/* Scroll Cue Prompt */}
        <div className="absolute bottom-10 inset-x-0 flex flex-col items-center space-y-2 text-xs text-muted font-mono pointer-events-none select-none">
          <span className="tracking-widest uppercase text-[10px]">Scroll down to explore</span>
          <ChevronDown className="w-4 h-4 text-accent animate-bounce" />
        </div>
      </section>

      {/* =================================================================== */}
      {/* SCENE 2: "No schedule?"                                             */}
      {/* =================================================================== */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <span className="text-[11px] font-mono uppercase tracking-widest text-accent font-semibold mb-4 px-3 py-1 rounded-full glass-panel">
            Phase 02 · The Barrier
          </span>
          <ScrollFloat
            scrollStart="top bottom-=15%"
            scrollEnd="center center"
            stagger={0.04}
            containerClassName="w-full"
            textClassName="text-foreground"
          >
            No schedule?
          </ScrollFloat>
        </div>
      </section>

      {/* =================================================================== */}
      {/* SCENE 3: "ALL solution is here"                                     */}
      {/* =================================================================== */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <span className="text-[11px] font-mono uppercase tracking-widest text-accent font-semibold mb-4 px-3 py-1 rounded-full glass-panel">
            Phase 03 · The Resolution
          </span>
          <ScrollFloat
            highlightWord="ALL"
            scrollStart="top bottom-=15%"
            scrollEnd="center center"
            stagger={0.035}
            containerClassName="w-full"
            textClassName="text-foreground"
          >
            ALL solution is here
          </ScrollFloat>
        </div>
      </section>

      {/* =================================================================== */}
      {/* SCENE 4: ANIMATED HANDWRITING SVG + JOIN BUTTON                     */}
      {/* =================================================================== */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="w-full max-w-3xl mx-auto flex flex-col items-center space-y-8">
          <span className="text-[11px] font-mono uppercase tracking-widest text-accent font-semibold px-3 py-1 rounded-full glass-panel">
            Phase 04 · The Instrument
          </span>

          {/* Actively Animated SVG Calligraphy Drawing */}
          <div className="w-full flex justify-center py-2">
            <HandwritingText />
          </div>

          {/* Core Value Proposition Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.5, once: false }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-sm md:text-base text-muted max-w-lg font-light leading-relaxed px-4"
          >
            Adaptive study scheduling around fixed college commitments, commute realities, syllabus coverage, and approaching exam deadlines.
          </motion.p>

          {/* JOIN CTA Button (@shadcnspace/components/button-witn-icon) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ amount: 0.5, once: false }}
            transition={{ duration: 0.5, delay: 0.8 }}
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

        {/* Subtle Section Footnote */}
        <div className="absolute bottom-8 inset-x-0 flex justify-center text-xs text-muted/60 font-mono select-none">
          <span>BH PLANNER · DETERMINISTIC ACADEMIC ENGINE</span>
        </div>
      </section>

      {/* =================================================================== */}
      {/* SCENE 5: AUTHENTICATION GATEWAY (@appvibed01/components/auth-switch) */}
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
