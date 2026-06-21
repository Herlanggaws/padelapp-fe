import type { Metadata } from "next";
import { redirect } from "next/navigation";
import CreateEventForm from "@/components/CreateEventForm";

export const metadata: Metadata = {
  title: "New Event",
};

interface EventNewPageProps {
  searchParams: Promise<{ club_guid?: string; club_id?: string }>;
}

export default async function EventFormPage({
  searchParams,
}: EventNewPageProps) {
  const { club_guid, club_id } = await searchParams;

  if (!club_guid || !club_id) {
    redirect("/clubs");
  }

  return <CreateEventForm clubGuid={club_guid} clubId={club_id} />;
}
