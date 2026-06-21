import type { Metadata } from "next";
import MatchDetailClient from "@/components/MatchDetailClient";

export const metadata: Metadata = {
  title: "Match",
};

export default async function MatchDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ event_guid?: string }>;
}) {
  const { id } = await params;
  const { event_guid } = await searchParams;
  return <MatchDetailClient sessionGuid={id} eventGuid={event_guid} />;
}
