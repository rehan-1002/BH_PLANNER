"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronDown, ArrowRight } from "lucide-react";

import { KineticNav } from "@/components/ui/kinetic-nav";
import { ScrollFloat } from "@/components/ui/scroll-float";
import { HandwritingText } from "@/components/ui/handwriting";
import { ButtonWithIcon } from "@/components/ui/button-with-icon";

export default function LandingPage() {
  const router = useRouter();

  const handleJoin = () => {
    router.push("/auth?mode=signup");
  };

  return (
    <div className="relative w-full min-h-screen bg-canvas text-foreground selection:bg-accent/30 selection:text-foreground">
      <div className="fixed top-0 left-0 right-0 z-40">
        <KineticNav />
      </div>

      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <span className="text-[11px] font-mono uppercase tracking-widest text-accent font-semibold mb-4 px-3 py-1 rounded-full glass-panel">
            Phase 01 · The Reality
          </span>
          <ScrollFloat
            animationDuration={0.9}
            stagger={0.032}
            containerClassName="w-full"
            textClassName="text-foreground"
          >
            Unorganised planning?
          </ScrollFloat>
        </div>

        <div className="absolute bottom-10 inset-x-0 flex flex-col items-center space-y-2 text-xs text-muted font-mono pointer-events-none select-none">
          <span className="tracking-widest uppercase text-[10px]">Scroll down to explore</span>
          <ChevronDown className="w-4 h-4 text-accent animate-bounce" />
        </div>
      </section>

      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <span className="text-[11px] font-mono uppercase tracking-widest text-accent font-semibold mb-4 px-3 py-1 rounded-full glass-panel">
            Phase 02 · The Barrier
          </span>
          <ScrollFloat
            animationDuration={0.9}
            stagger={0.035}
            containerClassName="w-full"
            textClassName="text-foreground"
          >
            No schedule?
          </ScrollFloat>
        </div>
      </section>

      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <span className="text-[11px] font-mono uppercase tracking-widest text-accent font-semibold mb-4 px-3 py-1 rounded-full glass-panel">
            Phase 03 · The Resolution
          </span>
          <ScrollFloat
            highlightWord="ALL"
            animationDuration={0.9}
            stagger={0.032}
            containerClassName="w-full"
            textClassName="text-foreground"
          >
            ALL solution is here
          </ScrollFloat>
        </div>
      </section>

      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="w-full max-w-3xl mx-auto flex flex-col items-center space-y-8">
          <span className="text-[11px] font-mono uppercase tracking-widest text-accent font-semibold px-3 py-1 rounded-full glass-panel">
            Phase 04 · The Instrument
          </span>

          <div className="w-full flex justify-center py-2">
            <HandwritingText />
          </div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.5, once: false }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-sm md:text-base text-muted max-w-lg font-light leading-relaxed px-4"
          >
            Adaptive study scheduling around fixed college commitments, commute realities, syllabus coverage, and approaching exam deadlines.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ amount: 0.5, once: false }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="pt-2 flex flex-col items-center space-y-4"
          >
            <ButtonWithIcon
              onClick={handleJoin}
              ariaLabel="Join BH Planner — Create Account"
            >
              JOIN
            </ButtonWithIcon>

            <p className="text-xs text-muted font-mono">
              Already have an account?{" "}
              <Link
                href="/auth"
                className="text-accent hover:underline font-medium ml-1 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </motion.div>
        </div>

        <div className="absolute bottom-8 inset-x-0 flex justify-center text-xs text-muted/60 font-mono select-none">
          <span>BH PLANNER · DETERMINISTIC ACADEMIC ENGINE</span>
        </div>
      </section>
    </div>
  );
}
