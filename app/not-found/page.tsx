import { NotFoundScreen } from "@/components/ui/not-found-screen";

export const metadata = {
  title: "Status Alert | BH Planner",
  description: "Account state or network connectivity status alert.",
};

export default function NotFoundDirectPage({
  searchParams,
}: {
  searchParams?: { reason?: string; error?: string };
}) {
  const reason = searchParams?.reason || searchParams?.error;
  return <NotFoundScreen initialReason={reason} />;
}
