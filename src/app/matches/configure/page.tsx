import TopAppBar from "@/components/TopAppBar";
import MatchConfigClient from "@/components/MatchConfigClient";

export default async function MatchConfigurePage({
  searchParams,
}: {
  searchParams: Promise<{ event_guid?: string }>;
}) {
  const { event_guid } = await searchParams;

  return (
    <div className="min-h-screen bg-white max-w-[448px] mx-auto relative flex flex-col">
      <TopAppBar
        showBack
        backHref="/matches"
        title="Configure Game"
        showSettings={false}
      />
      <div style={{ paddingTop: "64px" }}>
        <MatchConfigClient eventGuid={event_guid ?? ""} />
      </div>
    </div>
  );
}
