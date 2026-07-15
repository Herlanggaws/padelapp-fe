"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import EditClubFormClient from "@/components/EditClubFormClient";
import { fetchClubDetail } from "@/services/clubService";
import type { Club } from "@/types/club";

export default function EditClubClient({ id }: { id: string }) {
  const router = useRouter();
  const [club, setClub] = useState<Club | null>(null);

  const loadClub = useCallback(async () => {
    const res = await fetchClubDetail(id);
    return res.data;
  }, [id]);

  useEffect(() => {
    loadClub()
      .then((data) => {
        if (!data.is_host) {
          router.replace(`/clubs/${id}`);
          return;
        }
        setClub(data);
      })
      .catch(() => router.replace("/not-found"));
  }, [id, loadClub, router]);

  if (!club) {
    return (
      <div className="min-h-screen bg-white max-w-[448px] mx-auto flex items-center justify-center">
        <span className="text-sm text-[#71717A]">Loading...</span>
      </div>
    );
  }

  return <EditClubFormClient club={club} />;
}
