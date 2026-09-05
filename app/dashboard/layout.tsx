import { KineticNav } from "@/components/ui/kinetic-nav";
import { CaptureShield } from "@/components/security/capture-shield";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export const metadata = {
  title: "Dashboard — BH Planner",
  description: "Adaptive academic study dashboard.",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const allCookies = cookieStore.getAll();
  const hasAuthCookie = allCookies.some(
    (c) =>
      c.name.includes("-auth-token") ||
      c.name.startsWith("sb-") ||
      c.name === "supabase-auth-token"
  );

  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  const isNetworkError = Boolean(
    error &&
      (error.name === "AuthRetryableFetchError" ||
        error.message?.toLowerCase().includes("fetch") ||
        error.message?.toLowerCase().includes("network") ||
        error.message?.toLowerCase().includes("failed to fetch") ||
        (error as any).status === 0 ||
        (error as any).status === 500)
  );

  const isAccountDeleted = Boolean(
    hasAuthCookie &&
      error &&
      !isNetworkError &&
      (error.message?.toLowerCase().includes("user not found") ||
        error.message?.toLowerCase().includes("does not exist") ||
        error.message?.toLowerCase().includes("sub claim") ||
        (error as any).code === "user_not_found" ||
        (error as any).status === 403 ||
        (error as any).status === 404)
  );

  if (isNetworkError) {
    redirect("/not-found?reason=offline");
  }

  if (isAccountDeleted) {
    redirect("/not-found?reason=deleted");
  }

  if (!user) {
    redirect("/auth?mode=signin");
  }

  return (
    <CaptureShield enableBlurProtection={true} enableWatermark={false}>
      <div className="relative w-full min-h-screen flex flex-col pt-24 pb-16 px-4 sm:px-8 max-w-7xl mx-auto">
        <KineticNav />

        <main className="w-full flex-1 flex flex-col">
          {children}
        </main>
      </div>
    </CaptureShield>
  );
}
