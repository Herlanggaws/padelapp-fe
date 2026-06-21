import type { Metadata } from "next";
import TopAppBar from "@/components/TopAppBar";
import ShareYourResultClient from "@/components/ShareYourResultClient";

export const metadata: Metadata = {
  title: "Share Result",
};

export default async function ShareYourResultPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ event_guid?: string }>;
}) {
  const { id } = await params;
  const { event_guid } = await searchParams;

  return (
    <div className="min-h-screen bg-white max-w-[448px] mx-auto relative flex flex-col">
      <TopAppBar
        showBack
        backFallback={`/matches/${id}${event_guid ? `?event_guid=${encodeURIComponent(event_guid)}` : ""}`}
        title="Share your Result"
        showSettings={false}
      />
      <ShareYourResultClient eventGuid={event_guid ?? ""} />
    </div>
  );
}
