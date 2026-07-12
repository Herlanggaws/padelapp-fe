import type { Metadata } from "next";
import LiveScoreboardClient from "@/components/LiveScoreboardClient";

export const metadata: Metadata = {
  title: "Live Scoreboard",
};

export default async function LiveScoreboardPage({
  params,
}: {
  params: Promise<{ eventGuid: string }>;
}) {
  const { eventGuid } = await params;
  return <LiveScoreboardClient eventGuid={eventGuid} />;
}
