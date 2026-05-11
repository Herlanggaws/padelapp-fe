import type { Metadata } from "next";
import LegalBackHeader from "@/components/LegalBackHeader";
import TermsOfServiceContent from "@/components/legal/TermsOfServiceContent";

export const metadata: Metadata = {
  title: "Terms of Service | Padel App",
  description: "Read the RallyRank Terms of Service.",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white max-w-[448px] mx-auto relative">
      <LegalBackHeader title="Terms of Service" />
      <TermsOfServiceContent />
    </div>
  );
}
