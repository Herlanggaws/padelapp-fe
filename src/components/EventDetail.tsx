"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import TopAppBar from "@/components/TopAppBar";
import { fetchEventDetail } from "@/services/eventService";
import type { Event, PendingRequest } from "@/types/event";

function formatDate(dateTime: string) {
  const d = new Date(dateTime);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(dateTime: string) {
  const d = new Date(dateTime);
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const MAX_VISIBLE_SLOTS = 4;

function PlayerSlots({
  participants,
  total,
}: {
  participants: number;
  total: number;
}) {
  const filled = Math.min(participants, total);
  const empty = total - filled;

  const visibleFilled = Math.min(filled, MAX_VISIBLE_SLOTS);
  const overflowFilled = filled - visibleFilled;
  const remainingSlots = MAX_VISIBLE_SLOTS - visibleFilled;
  const visibleEmpty = Math.min(empty, remainingSlots);

  const avatars = Array.from({ length: visibleFilled }, (_, i) => i);
  const slots = Array.from({ length: visibleEmpty }, (_, i) => i);

  return (
    <div className="pt-2 flex items-center gap-3">
      <div className="flex items-center">
        {avatars.map((i) => (
          <div
            key={`avatar-${i}`}
            className="relative"
            style={{
              width: "48px",
              height: "48px",
              marginLeft: i > 0 ? "-12px" : 0,
            }}
          >
            <Image
              src={`https://i.pravatar.cc/48?img=${i + 3}`}
              alt={`Player ${i + 1}`}
              width={48}
              height={48}
              className="rounded-full border-2 border-white object-cover"
            />
          </div>
        ))}
        {slots.map((i) => (
          <div
            key={`slot-${i}`}
            className="relative w-12 h-12 rounded-full border-2 border-white flex items-center justify-center"
            style={{
              background: "#9FE870",
              marginLeft: avatars.length > 0 || i > 0 ? "-12px" : 0,
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#121212"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </div>
        ))}
      </div>
      {overflowFilled > 0 && (
        <span className="text-xs font-semibold text-[#71717A]">
          +{overflowFilled} more player{overflowFilled !== 1 ? "s" : ""}
        </span>
      )}
    </div>
  );
}

function RequestCard({
  request,
  isHost,
}: {
  request: PendingRequest;
  isHost: boolean;
}) {
  return (
    <div
      className="flex items-center justify-between p-4 rounded-2xl"
      style={{
        background: "#FFFFFF",
        border: "1px solid #F4F4F5",
        boxShadow: "0px 1px 2px 0px rgba(0,0,0,0.05)",
      }}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
          <span className="text-sm font-semibold text-gray-600">
            {request.user.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span
            className="text-sm font-semibold text-[#151C27]"
            style={{ lineHeight: "21px" }}
          >
            {request.user.name}
          </span>
          <span className="text-xs text-[#71717A]">{request.user.email}</span>
        </div>
      </div>
      {isHost && (
        <div className="flex items-center gap-2">
          <button
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "#FFF0F0", border: "1px solid #FECACA" }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#BA1A1A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          <button
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "#9FE870" }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#121212"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

function EventDetailContent({ event }: { event: Event }) {
  const slotsLeft = event.number_of_players - event.number_of_participants;
  const pendingRequests = event.pending_requests ?? [];

  return (
    <div className="min-h-screen bg-white max-w-[448px] mx-auto relative flex flex-col">
      <TopAppBar
        showBack
        backHref={`/clubs/${event.club_guid}`}
        title="Event Details"
        showSettings={false}
      />

      <main
        className="flex flex-col gap-6 px-4 pb-36"
        style={{ paddingTop: "80px" }}
      >
        {/* Event Card */}
        <div
          className="rounded-[32px] flex flex-col gap-6 p-4"
          style={{
            background: "#FFFFFF",
            border: "1px solid #F4F4F5",
            boxShadow: "0px 1px 2px 0px rgba(0,0,0,0.05)",
          }}
        >
          {/* Event Title & Level */}
          <div className="flex flex-col gap-2">
            <h2
              className="font-normal text-[28px] text-[#18181B]"
              style={{ lineHeight: "33.6px", letterSpacing: "-1%" }}
            >
              {event.name}
            </h2>
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                  fill="#2F6C00"
                />
              </svg>
              <span
                className="text-xs text-[#2F6C00]"
                style={{ lineHeight: "12px" }}
              >
                Rank Point ({event.min_level} - {event.max_level})
              </span>
            </div>
          </div>

          {/* Date & Time Cards */}
          <div className="flex gap-3">
            <div
              className="flex-1 flex items-center gap-3 px-3 py-3 rounded-xl"
              style={{ background: "#F0F3FF" }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: "#FFFFFF",
                  boxShadow: "0px 1px 2px 0px rgba(0,0,0,0.05)",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 18 20" fill="none">
                  <path
                    d="M2 20C1.45 20 0.979167 19.8042 0.5875 19.4125C0.195833 19.0208 0 18.55 0 18V4C0 3.45 0.195833 2.97917 0.5875 2.5875C0.979167 2.19583 1.45 2 2 2H3V0H5V2H13V0H15V2H16C16.55 2 17.0208 2.19583 17.4125 2.5875C17.8042 2.97917 18 3.45 18 4V18C18 18.55 17.8042 19.0208 17.4125 19.4125C17.0208 19.8042 16.55 20 16 20H2ZM2 18H16V8H2V18Z"
                    fill="#71717A"
                  />
                </svg>
              </div>
              <div className="flex flex-col gap-1">
                <span
                  className="text-[10px] font-bold text-[#71717A] uppercase tracking-[5%]"
                  style={{ lineHeight: "15px" }}
                >
                  DATE
                </span>
                <span
                  className="text-xs font-semibold text-[#151C27]"
                  style={{ lineHeight: "12px" }}
                >
                  {formatDate(event.date_time)}
                </span>
              </div>
            </div>

            <div
              className="flex-1 flex items-center gap-3 px-3 py-3 rounded-xl"
              style={{ background: "#F0F3FF" }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: "#FFFFFF",
                  boxShadow: "0px 1px 2px 0px rgba(0,0,0,0.05)",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 0C3.584 0 0 3.584 0 8C0 12.416 3.584 16 8 16C12.416 16 16 12.416 16 8C16 3.584 12.416 0 8 0ZM8 14.4C4.472 14.4 1.6 11.528 1.6 8C1.6 4.472 4.472 1.6 8 1.6C11.528 1.6 14.4 4.472 14.4 8C14.4 11.528 11.528 14.4 8 14.4ZM8.4 4H7.2V8.8L11.44 11.28L12.04 10.296L8.4 8.16V4Z"
                    fill="#71717A"
                  />
                </svg>
              </div>
              <div className="flex flex-col gap-1">
                <span
                  className="text-[10px] font-bold text-[#71717A] uppercase tracking-[5%]"
                  style={{ lineHeight: "15px" }}
                >
                  TIME
                </span>
                <span
                  className="text-xs font-semibold text-[#151C27]"
                  style={{ lineHeight: "12px" }}
                >
                  {formatTime(event.date_time)}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div
            className="flex flex-col gap-2 pt-4"
            style={{ borderTop: "1px solid #FAFAFA" }}
          >
            <span
              className="text-[10px] font-normal text-[#71717A] uppercase tracking-[5%]"
              style={{ lineHeight: "15px" }}
            >
              DESCRIPTION
            </span>
            <p
              className="text-sm text-[#52525B]"
              style={{ lineHeight: "22.75px" }}
            >
              {event.description}
            </p>
          </div>

          {/* Players Section */}
          <div
            className="flex flex-col gap-2 pt-4"
            style={{ borderTop: "1px solid #FAFAFA" }}
          >
            <div className="flex items-center justify-between">
              <span
                className="text-[10px] font-bold text-[#71717A] uppercase tracking-[5%]"
                style={{ lineHeight: "15px" }}
              >
                PLAYERS ({event.number_of_participants}/
                {event.number_of_players})
              </span>
              <span
                className="text-xs font-semibold text-[#2F6C00]"
                style={{ lineHeight: "12px" }}
              >
                {slotsLeft} Slot{slotsLeft !== 1 ? "s" : ""} left
              </span>
            </div>
            <PlayerSlots
              participants={event.number_of_participants}
              total={event.number_of_players}
            />
          </div>
        </div>

        {/* Join Requests Section */}
        {pendingRequests.length > 0 && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3
                className="text-base font-semibold text-[#151C27]"
                style={{ lineHeight: "24px" }}
              >
                Join Requests
              </h3>
              <span
                className="text-xs font-semibold px-2 py-1 rounded-full"
                style={{ background: "#F0F3FF", color: "#151C27" }}
              >
                {pendingRequests.length} pending
              </span>
            </div>
            <div className="flex flex-col gap-3">
              {pendingRequests.map((req) => (
                <RequestCard
                  key={req.participant_guid}
                  request={req}
                  isHost={event.is_host}
                />
              ))}
              {pendingRequests.length === 0 && (
                <p className="text-sm text-[#71717A]">No pending requests.</p>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer Buttons */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 max-w-[448px] mx-auto px-6 py-4 pb-8"
        style={{ background: "#FFFFFF", borderTop: "1px solid #F4F4F5" }}
      >
        {event.is_host ? (
          <div className="flex gap-3">
            <Link
              href={`/matches/configure?event_guid=${encodeURIComponent(event.guid)}`}
              className="flex-1 flex items-center justify-center gap-2 text-base font-semibold text-[#121212] rounded-full"
              style={{ background: "#9FE870", height: "56px" }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#121212"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
                <path d="M11 8v6M8 11h6" />
              </svg>
              Generate Match
            </Link>
            <button
              className="flex-1 text-base font-normal text-[#9FE870] rounded-full"
              style={{ background: "#121212", height: "56px" }}
            >
              Join Event
            </button>
          </div>
        ) : (
          <button
            className="w-full text-base font-normal text-[#9FE870] rounded-full"
            style={{ background: "#121212", height: "56px" }}
          >
            Join Event
          </button>
        )}
      </div>
    </div>
  );
}

export default function EventDetail({ id }: { id: string }) {
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    fetchEventDetail(id)
      .then((res) => setEvent(res.data))
      .catch(() => router.replace("/not-found"));
  }, [id, router]);

  if (!event) {
    return (
      <div className="min-h-screen bg-white max-w-[448px] mx-auto flex items-center justify-center">
        <span className="text-sm text-[#71717A]">Loading...</span>
      </div>
    );
  }

  return <EventDetailContent event={event} />;
}
