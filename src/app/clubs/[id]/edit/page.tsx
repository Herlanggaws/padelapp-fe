import type { Metadata } from "next";
import EditClubClient from "@/components/EditClubClient";

export const metadata: Metadata = {
  title: "Edit Club",
};

export default async function EditClubPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditClubClient id={id} />;
}
