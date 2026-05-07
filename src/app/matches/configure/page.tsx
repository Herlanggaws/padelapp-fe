import TopAppBar from "@/components/TopAppBar";
import MatchConfigClient from "@/components/MatchConfigClient";

export default function MatchConfigurePage() {
  return (
    <div className="min-h-screen bg-white max-w-[448px] mx-auto relative flex flex-col">
      <TopAppBar
        showBack
        backHref="/matches"
        title="Configure Game"
        showSettings={false}
      />
      <div style={{ paddingTop: "64px" }}>
        <MatchConfigClient />
      </div>
    </div>
  );
}
