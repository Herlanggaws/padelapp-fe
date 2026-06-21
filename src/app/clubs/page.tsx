import type { Metadata } from "next";
import ExploreClubsClient from "@/components/ExploreClubsClient";

export const metadata: Metadata = {
  title: "Clubs",
};

export default function ExploreClubsPage() {
  return <ExploreClubsClient />;
}
