"use client";

import Link from "next/link";

interface ActivityCardProps {
  day: string;
  month: string;
  title: string;
  subtitle?: string;
  link?: string;
  onJoin?: () => void;
}

export default function ActivityCard({
  day,
  month,
  title,
  subtitle,
  link,
  onJoin,
}: ActivityCardProps) {
  const card = (
    <div className="flex items-center justify-between p-5 rounded-2xl bg-white transition border border-[#F4F4F5] md:group-hover:border-[#DADADA]">
      <div className="flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-[48px] flex flex-col items-center justify-center"
          style={{ background: "#F0F3FF" }}
        >
          <span
            className="text-base text-[#2F6C00]"
            style={{ lineHeight: "24px" }}
          >
            {day}
          </span>
          <span
            className="text-[8px] font-bold text-[#41493A] uppercase"
            style={{ lineHeight: "12px" }}
          >
            {month}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span
            className="text-base text-[#151C27]"
            style={{ lineHeight: "24px" }}
          >
            {title}
          </span>
          {subtitle && (
            <span
              className="text-xs text-[#41493A]"
              style={{ lineHeight: "12px" }}
            >
              {subtitle}
            </span>
          )}
        </div>
      </div>
      {/* Conditionally render the Join button */}
      {onJoin && (
        <button
          className="px-4 py-2 rounded-full text-base font-normal text-[#18181B]"
          style={{ background: "#F4F4F5", lineHeight: "24px" }}
          onClick={onJoin}
        >
          Join
        </button>
      )}
    </div>
  );

  if (link) {
    return (
      <Link href={link} className="group">
        {card}
      </Link>
    );
  }

  return card;
}
