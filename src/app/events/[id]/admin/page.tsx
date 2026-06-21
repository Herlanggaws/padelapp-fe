import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import TopAppBar from "@/components/TopAppBar";
import EventAdminRankPoint from "@/components/EventAdminRankPoint";

export const metadata: Metadata = {
  title: "Event Admin",
};

// Event Details as Admin
export default function EventDetailAdminPage() {
  const requests = [
    {
      id: 1,
      name: "Alex Johnson",
      level: 3.5,
      img: "https://i.pravatar.cc/48?img=11",
    },
    {
      id: 2,
      name: "Maria Garcia",
      level: 2.5,
      img: "https://i.pravatar.cc/48?img=12",
    },
    {
      id: 3,
      name: "Sam Lee",
      level: 4.0,
      img: "https://i.pravatar.cc/48?img=13",
    },
  ];

  return (
    <div className="min-h-screen bg-white max-w-[448px] mx-auto relative flex flex-col">
      {/* Header */}
      <TopAppBar
        showBack
        backFallback="/clubs/1/admin"
        title="Event Details"
        showSettings={false}
        rightAction={
          <Link
            href="/events/1/edit"
            className="flex items-center justify-center w-9 h-9 rounded-full"
            style={{ background: "#F4F4F5" }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </Link>
        }
      />

      {/* Main Content */}
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
              Friday Morning
              <br />
              Smash
            </h2>
            <div className="flex items-center gap-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                  fill="#2F6C00"
                />
              </svg>
              <EventAdminRankPoint />
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
                  Oct 24,
                  <br />
                  2023
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
                  09:00 AM
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
              Friendly match at the club. All intermediate players welcome! We
              play for 90 minutes and usually grab a coffee after.
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
                PLAYERS (2/4)
              </span>
              <span
                className="text-xs font-semibold text-[#2F6C00]"
                style={{ lineHeight: "12px" }}
              >
                2 Slots left
              </span>
            </div>
            <div className="pt-2 flex items-center">
              <div
                className="relative"
                style={{ width: "48px", height: "48px" }}
              >
                <Image
                  src="https://i.pravatar.cc/48?img=3"
                  alt="Player 1"
                  width={48}
                  height={48}
                  className="rounded-full border-2 border-white object-cover"
                />
              </div>
              <div
                className="relative -ml-3"
                style={{ width: "48px", height: "48px" }}
              >
                <Image
                  src="https://i.pravatar.cc/48?img=5"
                  alt="Player 2"
                  width={48}
                  height={48}
                  className="rounded-full border-2 border-white object-cover"
                />
              </div>
              <div
                className="relative -ml-3 w-12 h-12 rounded-full border-2 border-white flex items-center justify-center"
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
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </div>
              <div
                className="relative -ml-3 w-12 h-12 rounded-full border-2 border-white flex items-center justify-center"
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
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Join Requests Section */}
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
              {requests.length} pending
            </span>
          </div>

          {/* Request Cards */}
          <div className="flex flex-col gap-3">
            {requests.map((req) => (
              <div
                key={req.id}
                className="flex items-center justify-between p-4 rounded-2xl"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #F4F4F5",
                  boxShadow: "0px 1px 2px 0px rgba(0,0,0,0.05)",
                }}
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={req.img}
                    alt={req.name}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                  <div className="flex flex-col gap-1">
                    <span
                      className="text-sm font-semibold text-[#151C27]"
                      style={{ lineHeight: "21px" }}
                    >
                      {req.name}
                    </span>
                    <div className="flex items-center gap-1">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                          fill="#2F6C00"
                        />
                      </svg>
                      <span
                        className="text-xs text-[#2F6C00]"
                        style={{ lineHeight: "12px" }}
                      >
                        Level {req.level}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* Reject */}
                  <button
                    className="w-9 h-9 rounded-full flex items-center justify-center"
                    style={{
                      background: "#FFF0F0",
                      border: "1px solid #FECACA",
                    }}
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
                  {/* Accept */}
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
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer - Delete Event */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 max-w-[448px] mx-auto px-6 py-4 pb-8"
        style={{
          background: "#FFFFFF",
          borderTop: "1px solid #F4F4F5",
        }}
      >
        <button
          className="w-full text-base font-normal text-white rounded-full"
          style={{
            background: "#BA1A1A",
            height: "56px",
            lineHeight: "24px",
          }}
        >
          Delete Event
        </button>
      </div>
    </div>
  );
}
