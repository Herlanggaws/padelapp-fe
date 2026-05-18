"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import TopAppBar from "@/components/TopAppBar";
import BottomSheetAddOutsider from "@/components/BottomSheetAddOutsider";
import BottomSheetSeeAllPlayers from "@/components/BottomSheetSeeAllPlayers";
import {
  fetchEventDetail,
  fetchEventParticipants,
  joinEvent,
  leaveEvent,
  approveParticipant,
  rejectParticipant,
  addOutsiderParticipant,
} from "@/services/eventService";
import type { Event, PendingRequest } from "@/types/event";
import { useSnackbar } from "@/context/SnackbarContext";

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
  participantPhotos,
}: {
  participants: number;
  total: number;
  participantPhotos: (string | null)[];
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
        {avatars.map((i) => {
          const photo = participantPhotos[i];
          return (
            <div
              key={`avatar-${i}`}
              className="relative"
              style={{
                width: "48px",
                height: "48px",
                marginLeft: i > 0 ? "-12px" : 0,
              }}
            >
              {photo ? (
                <Image
                  src={photo}
                  alt={`Player ${i + 1}`}
                  width={48}
                  height={48}
                  className="w-full h-full rounded-full border-2 border-white object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#71717A"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
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
  onApprove,
  onReject,
  isActing,
}: {
  request: PendingRequest;
  isHost: boolean;
  onApprove: (guid: string) => void;
  onReject: (guid: string) => void;
  isActing: boolean;
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
          {request.user.profile_photo ? (
            <Image
              src={request.user.profile_photo}
              alt={request.user.name}
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-sm font-semibold text-gray-600">
              {request.user.name.charAt(0).toUpperCase()}
            </span>
          )}
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
            onClick={() => onReject(request.participant_guid)}
            disabled={isActing}
            className="w-9 h-9 rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
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
            onClick={() => onApprove(request.participant_guid)}
            disabled={isActing}
            className="w-9 h-9 rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
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

function EventDetailContent({
  event,
  participantPhotos,
  onJoin,
  isJoining,
  isLeaving,
  onApprove,
  onReject,
  actingGuid,
  onAddOutsider,
}: {
  event: Event;
  participantPhotos: (string | null)[];
  onJoin: () => void;
  isJoining: boolean;
  isLeaving: boolean;
  onApprove: (guid: string) => void;
  onReject: (guid: string) => void;
  actingGuid: string | null;
  onAddOutsider: (name: string) => Promise<void>;
}) {
  const [showAddOutsider, setShowAddOutsider] = useState(false);
  const [showSeeAllPlayers, setShowSeeAllPlayers] = useState(false);
  const pendingRequests = event.pending_requests ?? [];

  return (
    <div className="min-h-screen bg-white max-w-[448px] mx-auto relative flex flex-col">
      <TopAppBar
        showBack
        backFallback={`/clubs/${event.club_guid}`}
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
              <div className="flex items-center gap-2">
                <span
                  className="text-[10px] font-bold text-[#71717A] uppercase tracking-[5%]"
                  style={{ lineHeight: "15px" }}
                >
                  PLAYERS ({event.number_of_participants}/
                  {event.number_of_players})
                </span>

                {event.is_host && (
                  <button
                    className="text-xs font-semibold text-[#2F6C00] cursor-pointer"
                    onClick={() => setShowSeeAllPlayers(true)}
                  >
                    See More
                  </button>
                )}
              </div>

              {event.is_host && (
                <button
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={() => setShowAddOutsider(true)}
                >
                  <div className="shrink-0">
                    <svg
                      width="19"
                      height="14"
                      viewBox="0 0 19 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M14.1667 8.33333V5.83333H11.6667V4.16667H14.1667V1.66667H15.8333V4.16667H18.3333V5.83333H15.8333V8.33333H14.1667ZM6.66667 6.66667C5.75 6.66667 4.96528 6.34028 4.3125 5.6875C3.65972 5.03472 3.33333 4.25 3.33333 3.33333C3.33333 2.41667 3.65972 1.63194 4.3125 0.979167C4.96528 0.326389 5.75 0 6.66667 0C7.58333 0 8.36806 0.326389 9.02083 0.979167C9.67361 1.63194 10 2.41667 10 3.33333C10 4.25 9.67361 5.03472 9.02083 5.6875C8.36806 6.34028 7.58333 6.66667 6.66667 6.66667ZM0 13.3333V11C0 10.5278 0.121528 10.0938 0.364583 9.69792C0.607639 9.30208 0.930556 9 1.33333 8.79167C2.19444 8.36111 3.06944 8.03819 3.95833 7.82292C4.84722 7.60764 5.75 7.5 6.66667 7.5C7.58333 7.5 8.48611 7.60764 9.375 7.82292C10.2639 8.03819 11.1389 8.36111 12 8.79167C12.4028 9 12.7257 9.30208 12.9688 9.69792C13.2118 10.0938 13.3333 10.5278 13.3333 11V13.3333H0ZM1.66667 11.6667H11.6667V11C11.6667 10.8472 11.6285 10.7083 11.5521 10.5833C11.4757 10.4583 11.375 10.3611 11.25 10.2917C10.5 9.91667 9.74306 9.63542 8.97917 9.44792C8.21528 9.26042 7.44444 9.16667 6.66667 9.16667C5.88889 9.16667 5.11806 9.26042 4.35417 9.44792C3.59028 9.63542 2.83333 9.91667 2.08333 10.2917C1.95833 10.3611 1.85764 10.4583 1.78125 10.5833C1.70486 10.7083 1.66667 10.8472 1.66667 11V11.6667ZM6.66667 5C7.125 5 7.51736 4.83681 7.84375 4.51042C8.17014 4.18403 8.33333 3.79167 8.33333 3.33333C8.33333 2.875 8.17014 2.48264 7.84375 2.15625C7.51736 1.82986 7.125 1.66667 6.66667 1.66667C6.20833 1.66667 5.81597 1.82986 5.48958 2.15625C5.16319 2.48264 5 2.875 5 3.33333C5 3.79167 5.16319 4.18403 5.48958 4.51042C5.81597 4.83681 6.20833 5 6.66667 5Z"
                        fill="#2F6C00"
                      />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-[#2F6C00]">
                    Add Player
                  </span>
                </button>
              )}
            </div>
            <PlayerSlots
              participants={event.number_of_participants}
              total={event.number_of_players}
              participantPhotos={participantPhotos}
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
                  onApprove={onApprove}
                  onReject={onReject}
                  isActing={actingGuid === req.participant_guid}
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
            {event.session_guid ? (
              <Link
                href={`/matches/${event.session_guid}`}
                className="flex-1 flex items-center justify-center gap-2 text-base font-semibold text-[#121212] rounded-full"
                style={{ background: "#9FE870", height: "56px" }}
              >
                Match Detail
              </Link>
            ) : (
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
            )}
            <button
              onClick={onJoin}
              disabled={isJoining || isLeaving}
              className="flex-1 text-base font-normal rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: event.is_joined ? "#BA1A1A" : "#121212",
                color: event.is_joined ? "#FFFFFF" : "#9FE870",
                height: "56px",
              }}
            >
              {isLeaving
                ? "Leaving..."
                : isJoining
                  ? "Joining..."
                  : event.is_joined
                    ? "Leave Event"
                    : "Join Event"}
            </button>
          </div>
        ) : (
          <button
            onClick={onJoin}
            disabled={isJoining || isLeaving}
            className="w-full text-base font-normal rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: event.is_joined ? "#BA1A1A" : "#121212",
              color: event.is_joined ? "#FFFFFF" : "#9FE870",
              height: "56px",
            }}
          >
            {isLeaving
              ? "Leaving..."
              : isJoining
                ? "Joining..."
                : event.is_joined
                  ? "Leave Event"
                  : "Join Event"}
          </button>
        )}
      </div>

      {/* Bottom Sheet: Add Outsider */}
      {showAddOutsider && (
        <BottomSheetAddOutsider
          onClose={() => setShowAddOutsider(false)}
          onAdd={onAddOutsider}
        />
      )}

      {/* Bottom Sheet: See All Players */}
      {showSeeAllPlayers && (
        <BottomSheetSeeAllPlayers
          eventGuid={event.guid}
          isHost={event.is_host}
          onClose={() => setShowSeeAllPlayers(false)}
        />
      )}
    </div>
  );
}

export default function EventDetail({ id }: { id: string }) {
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [participantPhotos, setParticipantPhotos] = useState<(string | null)[]>(
    [],
  );
  const [isJoining, setIsJoining] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [actingGuid, setActingGuid] = useState<string | null>(null);
  const { showSnackbar } = useSnackbar();

  const loadEvent = useCallback(async () => {
    const eventRes = await fetchEventDetail(id);
    setEvent(eventRes.data);
    const participantsRes = await fetchEventParticipants({
      event_guid: id,
      limit: MAX_VISIBLE_SLOTS,
    });
    setParticipantPhotos(participantsRes.data.map((p) => p.user.profile_photo));
    return eventRes.data;
  }, [id]);
  console.log("participantPhotos", participantPhotos);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadEvent().catch(() => router.replace("/not-found"));
  }, [loadEvent, router]);

  const handleJoin = async () => {
    if (!event) return;
    if (event.is_joined) {
      setIsLeaving(true);
      try {
        await leaveEvent(event.guid);
        await loadEvent();
        showSnackbar("You have left the event");
      } finally {
        setIsLeaving(false);
      }
    } else {
      setIsJoining(true);
      try {
        await joinEvent({ event_guid: event.guid });
        await loadEvent();
        showSnackbar("Successfully joined the event");
      } finally {
        setIsJoining(false);
      }
    }
  };

  const handleApprove = async (guid: string) => {
    setActingGuid(guid);
    try {
      await approveParticipant(guid);
      await loadEvent();
      showSnackbar("Participant approved successfully");
    } finally {
      setActingGuid(null);
    }
  };

  const handleReject = async (guid: string) => {
    if (!event) return;
    setActingGuid(guid);
    try {
      await rejectParticipant(guid);
      const freshEvent = await loadEvent();
      showSnackbar("Participant rejected");
      // If the host rejected their own pending request, the backend's /reject
      // endpoint doesn't clear is_joined — so we explicitly leave the event.
      if (freshEvent?.is_host && freshEvent?.is_joined) {
        await leaveEvent(freshEvent.guid);
        await loadEvent();
      }
    } finally {
      setActingGuid(null);
    }
  };

  if (!event) {
    return (
      <div className="min-h-screen bg-white max-w-[448px] mx-auto flex items-center justify-center">
        <span className="text-sm text-[#71717A]">Loading...</span>
      </div>
    );
  }

  const handleAddOutsider = async (name: string) => {
    const res = await addOutsiderParticipant({
      event_guid: event!.guid,
      outsider_name: name,
    });
    showSnackbar(res.message);
  };

  return (
    <EventDetailContent
      event={event}
      participantPhotos={participantPhotos}
      onJoin={handleJoin}
      isJoining={isJoining}
      isLeaving={isLeaving}
      onApprove={handleApprove}
      onReject={handleReject}
      actingGuid={actingGuid}
      onAddOutsider={handleAddOutsider}
    />
  );
}
