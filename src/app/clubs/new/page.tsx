import type { Metadata } from "next";
import TopAppBar from "@/components/TopAppBar";
import ClubFormClient from "@/components/ClubFormClient";

export const metadata: Metadata = {
  title: "New Club",
};

export default function ClubFormPage() {
  return (
    <div className="min-h-screen bg-white max-w-[448px] mx-auto relative">
      <TopAppBar
        showBack
        backFallback="/dashboard"
        title="Club Management"
        showSettings={false}
        rightAction={
          <button className="flex items-center justify-center">
            <svg
              width="4"
              height="16"
              viewBox="0 0 4 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="2" cy="2" r="2" fill="#18181B" />
              <circle cx="2" cy="8" r="2" fill="#18181B" />
              <circle cx="2" cy="14" r="2" fill="#18181B" />
            </svg>
          </button>
        }
      />

      <main
        className="flex flex-col gap-10 px-4 pb-10"
        style={{ paddingTop: "88px" }}
      >
        <div className="flex flex-col gap-2">
          <h2
            className="font-semibold text-[28px] text-[#151C27]"
            style={{ lineHeight: "33.6px", letterSpacing: "-1%" }}
          >
            Create Club
          </h2>
          <p className="text-sm text-[#41493A]" style={{ lineHeight: "21px" }}>
            Register your Padel facility to start managing matches and court
            bookings.
          </p>
        </div>

        <ClubFormClient />
      </main>
    </div>
  );
}
