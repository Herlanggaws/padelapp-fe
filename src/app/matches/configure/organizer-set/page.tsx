import type { Metadata } from "next";
import TopAppBar from "@/components/TopAppBar";
import MatchOrganizerSetClient from "@/components/MatchOrganizerSetClient";

export const metadata: Metadata = {
  title: "Organizer Set",
};

export default function MatchOrganizerSetPage() {
  return (
    <div className="min-h-screen bg-white max-w-[448px] mx-auto relative flex flex-col">
      <TopAppBar
        showBack
        backFallback="/matches/configure"
        title="Configure Game"
        showSettings={false}
      />
      <MatchOrganizerSetClient />
    </div>
  );
}
