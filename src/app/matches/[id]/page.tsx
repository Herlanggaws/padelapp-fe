import MatchDetailClient from "@/components/MatchDetailClient";

export default async function MatchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <MatchDetailClient sessionGuid={id} />;
}
