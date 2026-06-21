import type { Metadata } from "next";
import LandingPageClient from "@/components/LandingPageClient";

export const metadata: Metadata = {
  title: "Home",
};

export default function Home() {
  return <LandingPageClient />;
}
