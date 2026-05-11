import type { Metadata } from "next";
import LegalBackHeader from "@/components/LegalBackHeader";
import PrivacyPolicyContent from "@/components/legal/PrivacyPolicyContent";

export const metadata: Metadata = {
  title: "Privacy Policy | Padel App",
  description: "Read the RallyRank Privacy Policy.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white max-w-[448px] mx-auto relative">
      <LegalBackHeader title="Privacy Policy" />
      <PrivacyPolicyContent />
    </div>
  );
}
