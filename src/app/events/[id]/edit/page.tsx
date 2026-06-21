import type { Metadata } from "next";
import EditEventClient from "@/components/EditEventClient";

export const metadata: Metadata = {
  title: "Edit Event",
};

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditEventClient id={id} />;
}
