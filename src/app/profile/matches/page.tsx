import type { Metadata } from "next";
import MatchHistoryClient from "@/components/MatchHistoryClient";

export const metadata: Metadata = {
  title: "Match History",
};

export default function MatchHistoryPage() {
  return <MatchHistoryClient />;
}
