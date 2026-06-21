import type { Metadata } from "next";
import MatchesClient from "@/components/MatchesClient";

export const metadata: Metadata = {
  title: "Matches",
};

export default function MatchesPage() {
  return <MatchesClient />;
}
