"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { TextReveal } from "@/components/ui/text-reveal";
import { HandwritingText } from "@/components/ui/handwriting";

export default function LandingPage() {
  const [showJoin, setShowJoin] = useState(false);

  const problemStatements = [
    "Unorganised planning?",
    "No schedule?",
    "ALL solution is here",
  ];

  return (
    <div className="relative w-full min-h-screen flex flex-col justify-center items-center px-6 py-24 sm:py-32 overflow-hidden">
      {/* Top-Left: Theme Toggle */}
      <div className="fixed top-5 left-6 z-50">
        <ThemeToggle />
      </div>

      {/* Top-Right: Refined Frosted Logo Badge */}
      <div className="fixed top-5 right-6 z-50">
        <Link
          aria-label="BH Planner Home"
          className="flex items-center justify-center size-9 rounded-xl border border-[rgba(147,112,219,0.2)] bg-[rgba(26,21,38,0.55)] backdrop-blur-md overflow-hidden hover:border-[#8b5cf6] transition-colors"
          href="/"
        >
          <img
            src="/BH LOGO.webp"
            alt="BH Logo"
            className="size-6 object-contain"
          />
        </Link>
      </div>

      {/* Editorial Content Container */}
      <div className="w-full max-w-3xl flex flex-col items-center text-center space-y-10 z-10">
        {/* Documented Sequence: 1. Unorganised planning? 2. No schedule? 3. ALL solution is here */}
        <TextReveal lines={problemStatements} className="items-center" />

        {/* Documented Sequence: 4. Real SVG Handwriting reveal of BH PLANNER */}
        <div className="py-1 w-full flex justify-center">
          <HandwritingText onComplete={() => setShowJoin(true)} />
        </div>

        {/* Minimal subtitle explaining the instrument */}
        <p className="text-sm md:text-base text-muted max-w-lg font-light leading-relaxed">
          Adaptive study scheduling around fixed college commitments, commute realities, syllabus coverage, and approaching exam deadlines.
        </p>

        {/* Documented Sequence: 5. Frosted Glass JOIN CTA - Fades in on stroke completion */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: showJoin ? 1 : 0, y: showJoin ? 0 : 12 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="pt-2"
        >
          <Link
            href="/auth"
            className="group relative inline-flex items-center space-x-2.5 px-8 py-3.5 rounded-xl bg-panel border border-accent/40 backdrop-blur-xl text-foreground font-medium text-sm tracking-wide transition-all hover:border-accent hover:bg-accent/15 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-canvas shadow-lg active:scale-95"
          >
            <span className="font-semibold text-accent">JOIN</span>
            <ArrowRight className="w-4 h-4 text-accent transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
          </Link>
        </motion.div>
      </div>

      {/* Subtle technical footer */}
      <div className="absolute bottom-6 inset-x-0 flex justify-center text-xs text-muted/60 font-mono select-none">
        <span>BH PLANNER · SYSTEM SPECIFICATION 1.0</span>
      </div>
    </div>
  );
}
