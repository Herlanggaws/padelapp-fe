import TopAppBar from "@/components/TopAppBar";
import ShareMatchResultClient from "@/components/ShareMatchResultClient";
import type { EventStandingsType } from "@/types/event";

function parseStandingsType(value?: string): EventStandingsType {
  return value === "points" ? "points" : "wins";
}

export default async function ShareMatchResultPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ event_guid?: string; standings_type?: string }>;
}) {
  const { id } = await params;
  const { event_guid, standings_type } = await searchParams;
  const standingsType = parseStandingsType(standings_type);

  const backQuery = new URLSearchParams();
  if (event_guid) backQuery.set("event_guid", event_guid);
  const backSuffix = backQuery.size > 0 ? `?${backQuery.toString()}` : "";

  return (
    <div className="min-h-screen bg-white max-w-[448px] mx-auto relative flex flex-col">
      <TopAppBar
        showBack
        backFallback={`/matches/${id}${backSuffix}`}
        title="Share Match Result"
        showSettings={false}
      />
      <ShareMatchResultClient
        eventGuid={event_guid ?? ""}
        standingsType={standingsType}
      />
    </div>
  );
}
