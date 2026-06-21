import type { Metadata } from "next";
import ClubDetailUser from "@/components/ClubDetailUser";

export const metadata: Metadata = {
  title: "Club",
};

export default function ClubDetailUserPage() {
  return <ClubDetailUser />;
}
