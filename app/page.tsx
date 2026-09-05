import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TextReveal } from "@/components/ui/text-reveal";
import { HandwritingText } from "@/components/ui/handwriting";

export default function LandingPage() {
  const problemStatements = [
    "Unorganised planning?",
    "No schedule?",
    "ALL solution is here",
  ];

  return (
    <div className="relative w-full min-h-screen flex flex-col justify-center items-center px-6 py-24 sm:py-32 overflow-hidden">
      {/* Editorial Content Container */}
      <div className="w-full max-w-3xl flex flex-col items-center text-center space-y-10 z-10">
        {/* Documented Sequence: 1. Unorganised planning? 2. No schedule? 3. ALL solution is here */}
        <TextReveal lines={problemStatements} className="items-center" />

        {/* Documented Sequence: 4. Handwriting reveal of BH PLANNER */}
        <div className="py-1">
          <HandwritingText prefix="BH" suffix="PLANNER" />
        </div>

        {/* Minimal subtitle explaining the instrument */}
        <p className="text-sm md:text-base text-muted max-w-lg font-light leading-relaxed">
          Adaptive study scheduling around fixed college commitments, commute realities, syllabus coverage, and approaching exam deadlines.
        </p>

        {/* Documented Sequence: 5. JOIN CTA */}
        <div className="pt-2">
          <Link
            href="/auth"
            className="group relative inline-flex items-center space-x-2.5 px-8 py-3.5 rounded-xl bg-accent text-white font-medium text-sm tracking-wide transition-all hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-canvas shadow-sm active:scale-95"
          >
            <span>JOIN</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
          </Link>
        </div>
      </div>

      {/* Subtle technical footer */}
      <div className="absolute bottom-6 inset-x-0 flex justify-center text-xs text-muted/60 font-mono select-none">
        <span>BH PLANNER · SYSTEM SPECIFICATION 1.0</span>
      </div>
    </div>
  );
}
