"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import EditEventForm from "@/components/EditEventForm";
import { fetchEventDetail } from "@/services/eventService";
import type { Event } from "@/types/event";

export default function EditEventClient({ id }: { id: string }) {
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);

  const loadEvent = useCallback(async () => {
    const res = await fetchEventDetail(id);
    return res.data;
  }, [id]);

  useEffect(() => {
    loadEvent()
      .then((data) => {
        if (!data.is_host || data.is_finished) {
          router.replace(`/events/${id}`);
          return;
        }
        setEvent(data);
      })
      .catch(() => router.replace(`/events/${id}`));
  }, [id, loadEvent, router]);

  if (!event) {
    return (
      <div className="min-h-screen bg-white max-w-[448px] mx-auto flex items-center justify-center">
        <span className="text-sm text-[#71717A]">Loading...</span>
      </div>
    );
  }

  return <EditEventForm event={event} />;
}
