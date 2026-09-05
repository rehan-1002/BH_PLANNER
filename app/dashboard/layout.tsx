import { KineticNav } from "@/components/ui/kinetic-nav";
import { CaptureShield } from "@/components/security/capture-shield";


export const metadata = {
  title: "Dashboard — BH Planner",
  description: "Adaptive academic study dashboard.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CaptureShield userEmail="student@bhplanner.internal" enableBlurProtection={true} enableWatermark={true}>
      <div className="relative w-full min-h-screen flex flex-col pt-24 pb-16 px-4 sm:px-8 max-w-7xl mx-auto">
        {/* Sterling Gate: Kinetic Navigation Header */}
        <KineticNav />


        {/* Dynamic Route Content */}
        <main className="w-full flex-1 flex flex-col">
          {children}
        </main>
      </div>
    </CaptureShield>
  );
}
