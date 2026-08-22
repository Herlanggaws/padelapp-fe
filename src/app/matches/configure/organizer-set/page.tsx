import type { Metadata } from "next";
import TopAppBar from "@/components/TopAppBar";
import MatchOrganizerSetClient from "@/components/MatchOrganizerSetClient";

export const metadata: Metadata = {
  title: "Organizer Set",
};

export default async function MatchOrganizerSetPage({
  searchParams,
}: {
  searchParams: Promise<{ event_guid?: string }>;
}) {
  const { event_guid } = await searchParams;
  const eventGuid = event_guid ?? "";
  const backFallback = eventGuid
    ? `/matches/configure?event_guid=${encodeURIComponent(eventGuid)}`
    : "/matches/configure";

  return (
    <div className="min-h-screen bg-white max-w-[448px] mx-auto relative flex flex-col">
      <TopAppBar
        showBack
        backFallback={backFallback}
        title="Configure Game"
        showSettings={false}
      />
      <MatchOrganizerSetClient eventGuid={eventGuid} />
    </div>
  );
}
