"use client";

import { useEffect, useState } from "react";
import { getUserProfileCache } from "@/lib/userProfileCache";

export default function EventAdminRankPoint() {
  const [rankPoints, setRankPoints] = useState<number | null>(null);

  useEffect(() => {
    const cached = getUserProfileCache();
    if (cached) setRankPoints(cached.rank_points);
  }, []);

  return (
    <span
      className="text-xs text-[#2F6C00]"
      style={{ lineHeight: "12px" }}
    >
      Rank Point {rankPoints != null ? `(${rankPoints})` : "(—)"}
    </span>
  );
}
