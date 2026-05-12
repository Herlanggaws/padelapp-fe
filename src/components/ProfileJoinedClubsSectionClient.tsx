"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { fetchJoinedClubs } from "@/services/clubService";
import type { Club } from "@/types/club";

function clubSubtitle(club: Club): string {
  const desc = club.description?.trim();
  if (desc) {
    const line = desc.split("\n")[0] ?? desc;
    return line.length > 52 ? `${line.slice(0, 49)}…` : line;
  }
  if (club.number_of_members != null) {
    return `${club.number_of_members} members`;
  }
  return "Tap to view club";
}

function membershipLabel(club: Club): string {
  if (club.is_host) return "Host";
  return "Member";
}

function ClubRowSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 bg-white border border-[#F2F2F2] rounded-2xl animate-pulse">
      <div className="w-14 h-14 rounded-full flex-shrink-0 bg-[#E4E4E7]" />
      <div className="flex-1 flex flex-col gap-2">
        <div className="h-3 bg-[#E4E4E7] rounded w-2/3" />
        <div className="h-3 bg-[#E4E4E7] rounded w-1/2" />
      </div>
      <div className="h-6 w-14 bg-[#E4E4E7] rounded-2xl" />
    </div>
  );
}

export default function ProfileJoinedClubsSectionClient() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchJoinedClubs()
      .then((res) => setClubs(res.data ?? []))
      .catch(() => setClubs([]))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-xl text-[#151C27]">Clubs Joined</h2>
        <Link href="/clubs" className="text-xs font-semibold text-[#2F6C00]">
          View All
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {isLoading ? (
          <>
            <ClubRowSkeleton />
            <ClubRowSkeleton />
          </>
        ) : clubs.length === 0 ? (
          <p className="text-xs text-[#5F5E5E] px-1 py-2">
            You haven&apos;t joined any clubs yet. Explore clubs to get
            started.
          </p>
        ) : (
          clubs.map((club) => (
            <Link
              key={club.guid}
              href={`/clubs/${club.guid}`}
              className="flex items-center gap-4 p-4 bg-white border border-[#F2F2F2] rounded-2xl"
            >
              <div className="w-14 h-14 rounded-full flex-shrink-0 overflow-hidden bg-[#F4F4F5]">
                {club.cover_photo ? (
                  <Image
                    src={club.logo ?? club.cover_photo ?? ""}
                    alt={club.name}
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] font-semibold text-[#A1A1AA]">
                    {club.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex-1 flex flex-col min-w-0">
                <span className="text-xs font-semibold text-[#151C27] truncate">
                  {club.name}
                </span>
                <span className="text-xs text-[#5F5E5E] line-clamp-2">
                  {clubSubtitle(club)}
                </span>
              </div>
              <span className="bg-[#E7EEFE] text-[#41493A] text-xs rounded-2xl px-2 py-1 flex-shrink-0">
                {membershipLabel(club)}
              </span>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}
