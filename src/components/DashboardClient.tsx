"use client";

import Link from "next/link";
import Image from "next/image";
import TopAppBar from "@/components/TopAppBar";
import BottomNavBar from "@/components/BottomNavBar";

export default function DashboardClient() {

  return (
    <div className="min-h-screen bg-white max-w-[448px] mx-auto relative">
      <TopAppBar showNotification={true} />

      <main className="flex flex-col gap-10 pt-24 pb-36">
        {/* Welcome Header */}
        <section className="flex items-center justify-between px-4">
          <div className="flex flex-col gap-0">
            <h1
              className="font-semibold text-[28px] text-[#151C27]"
              style={{ lineHeight: "33.6px", letterSpacing: "-1%" }}
            >
              Hello, Alex!
            </h1>
            <p
              className="text-sm text-[#41493A]"
              style={{ lineHeight: "21px" }}
            >
              Ready for your next match?
            </p>
          </div>
          {/* User Avatar */}
          <div className="w-14 h-14 rounded-full border-2 border-[#9FE870] overflow-hidden bg-[#E4E4E7]">
            <Image
              src="https://i.pravatar.cc/56?img=3"
              alt="User Avatar"
              width={56}
              height={56}
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        {/* Stats Grid (Bento Style) */}
        <section className="w-full px-4">
          <div
            className="w-full bg-[#9FE870] rounded-[32px] p-4 flex flex-col justify-between"
            style={{ minHeight: "120px" }}
          >
            <div>
              <svg
                width="20"
                height="12"
                viewBox="0 0 20 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.4 12L0 10.6L7.4 3.15L11.4 7.15L16.6 2H14V0H20V6H18V3.4L11.4 10L7.4 6L1.4 12Z"
                  fill="#2E6900"
                />
              </svg>
            </div>
            <div className="flex flex-col gap-1">
              <span
                className="text-xs font-normal text-[#2E6900] tracking-[0.6px] uppercase"
                style={{ lineHeight: "12px" }}
              >
                Rank point
              </span>
              <span
                className="text-xl text-[#2E6900]"
                style={{ lineHeight: "26px" }}
              >
                Advanced 4.5
              </span>
            </div>
          </div>
        </section>

        {/* Upcoming Matches */}
        <section className="flex flex-col gap-4 px-4">
          <div className="flex items-center justify-between">
            <h2
              className="font-semibold text-xl text-[#151C27]"
              style={{ lineHeight: "26px" }}
            >
              Upcoming Matches
            </h2>
            <Link
              href="/matches"
              className="text-xs font-semibold text-[#2F6C00]"
            >
              See All
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            {/* Match Card 1 */}
            <div className="bg-white border border-[#F4F4F5] rounded-[32px]">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-4 border-b border-[#FAFAFA]">
                <div className="flex items-center gap-2">
                  <svg
                    width="18"
                    height="20"
                    viewBox="0 0 18 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 20C1.45 20 0.979167 19.8042 0.5875 19.4125C0.195833 19.0208 0 18.55 0 18V4C0 3.45 0.195833 2.97917 0.5875 2.5875C0.979167 2.19583 1.45 2 2 2H3V0H5V2H13V0H15V2H16C16.55 2 17.0208 2.19583 17.4125 2.5875C17.8042 2.97917 18 3.45 18 4V18C18 18.55 17.8042 19.0208 17.4125 19.4125C17.0208 19.8042 16.55 20 16 20H2ZM2 18H16V8H2V18Z"
                      fill="#2F6C00"
                    />
                  </svg>
                  <span className="text-xs font-semibold text-[#151C27]">
                    Today, 18:30
                  </span>
                </div>
                <span className="bg-[#F4F4F5] text-[#151C27] text-[10px] uppercase rounded-full px-3 py-1">
                  COMPETITIVE
                </span>
              </div>
              {/* Body */}
              <div className="flex items-center justify-between px-4 py-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full overflow-hidden bg-[#E4E4E7]">
                      <Image
                        src="https://picsum.photos/seed/club1/24/24"
                        alt="Elite Padel Club"
                        width={24}
                        height={24}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-sm font-semibold text-[#18181B]">
                      Elite Padel Club
                    </span>
                  </div>
                  {/* Player Avatars */}
                  <div className="flex items-center" style={{ gap: "-8px" }}>
                    <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden">
                      <Image
                        src="https://i.pravatar.cc/32?img=1"
                        alt="Player 1"
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="w-8 h-8 rounded-full border-2 border-white -ml-2 overflow-hidden">
                      <Image
                        src="https://i.pravatar.cc/32?img=2"
                        alt="Player 2"
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#FAFAFA] border-2 border-white -ml-2 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-[#A1A1AA]">
                        +2
                      </span>
                    </div>
                  </div>
                </div>
                <button className="bg-[#121212] text-[#9FE870] text-xs font-semibold rounded-full px-4 py-2">
                  Details
                </button>
              </div>
            </div>

            {/* Match Card 2 */}
            <div className="bg-white border border-[#F4F4F5] rounded-[32px]">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-4 border-b border-[#FAFAFA]">
                <div className="flex items-center gap-2">
                  <svg
                    width="18"
                    height="20"
                    viewBox="0 0 18 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 20C1.45 20 0.979167 19.8042 0.5875 19.4125C0.195833 19.0208 0 18.55 0 18V4C0 3.45 0.195833 2.97917 0.5875 2.5875C0.979167 2.19583 1.45 2 2 2H3V0H5V2H13V0H15V2H16C16.55 2 17.0208 2.19583 17.4125 2.5875C17.8042 2.97917 18 3.45 18 4V18C18 18.55 17.8042 19.0208 17.4125 19.4125C17.0208 19.8042 16.55 20 16 20H2ZM2 18H16V8H2V18Z"
                      fill="#2F6C00"
                    />
                  </svg>
                  <span className="text-xs font-semibold text-[#151C27]">
                    Fri, 22 Oct • 10:00
                  </span>
                </div>
                <span className="bg-[#F4F4F5] text-[#151C27] text-[10px] uppercase rounded-full px-3 py-1">
                  FRIENDLY
                </span>
              </div>
              {/* Body */}
              <div className="flex items-center justify-between px-4 py-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full overflow-hidden bg-[#E4E4E7]">
                      <Image
                        src="https://picsum.photos/seed/club2/24/24"
                        alt="Central Courts"
                        width={24}
                        height={24}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-sm font-semibold text-[#18181B]">
                      Central Courts
                    </span>
                  </div>
                  {/* Player Avatars */}
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden">
                      <Image
                        src="https://i.pravatar.cc/32?img=4"
                        alt="Player 1"
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#FAFAFA] border-2 border-white -ml-2 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-[#A1A1AA]">
                        +3
                      </span>
                    </div>
                  </div>
                </div>
                <button className="bg-[#FAFAFA] text-[#18181B] border border-[#E4E4E7] text-xs font-semibold rounded-full px-4 py-2">
                  Details
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Your Clubs */}
        <section className="flex flex-col items-center gap-4">
          <div className="flex items-center justify-between w-full px-4">
            <h2
              className="font-semibold text-xl text-[#151C27]"
              style={{ lineHeight: "26px" }}
            >
              Your Clubs
            </h2>
            {/* <Link href="#" className="text-xs font-semibold text-[#2F6C00]">
              Explore
            </Link> */}
          </div>

          {/* Club Cards - Horizontal Scroll */}
          <div className="flex gap-4 w-full overflow-auto px-4 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {/* Club Card 1 */}
            <Link
              href="/clubs/1"
              className="min-w-[198px] bg-white border border-[#F4F4F5] rounded-[32px] overflow-hidden flex-shrink-0"
            >
              <div className="relative h-24">
                <Image
                  src="https://picsum.photos/seed/padelhub/400/200"
                  alt="The Padel Hub"
                  fill
                  className="object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(0deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 100%)",
                  }}
                />
              </div>
              <div className="p-4">
                <p className="font-normal text-base text-[#151C27]">
                  The Padel Hub
                </p>
                <p className="font-normal text-base text-[#41493A]">
                  Madrid, ES
                </p>
              </div>
            </Link>

            {/* Club Card 2 */}
            <Link
              href="/clubs/2"
              className="min-w-[198px] bg-white border border-[#F4F4F5] rounded-[32px] overflow-hidden flex-shrink-0"
            >
              <div className="relative h-24">
                <Image
                  src="https://picsum.photos/seed/smashclub/400/200"
                  alt="Smash Club"
                  fill
                  className="object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(0deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 100%)",
                  }}
                />
              </div>
              <div className="p-4">
                <p className="font-normal text-base text-[#151C27]">
                  Smash Club
                </p>
                <p className="font-normal text-base text-[#41493A]">
                  London, UK
                </p>
              </div>
            </Link>

            {/* Club Card 3 */}
            <Link
              href="/clubs/3"
              className="min-w-[198px] bg-white border border-[#F4F4F5] rounded-[32px] overflow-hidden flex-shrink-0"
            >
              <div className="relative h-24">
                <Image
                  src="https://picsum.photos/seed/peakperformance/400/200"
                  alt="Peak Performance"
                  fill
                  className="object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(0deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 100%)",
                  }}
                />
              </div>
              <div className="p-4">
                <p className="font-normal text-base text-[#151C27]">
                  Peak Performance
                </p>
                <p className="font-normal text-base text-[#41493A]">
                  Milan, IT
                </p>
              </div>
            </Link>
          </div>

          {/* Club Placeholder */}
          <div className="w-full px-4">
            <div
              className="flex flex-col items-center justify-center text-center px-2 py-6 min-h-[350px] w-full rounded-3xl"
              style={{ border: `1px dashed rgba(228, 228, 231, 1)` }}
            >
              <svg
                width="64"
                height="64"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="64" height="64" rx="32" fill="#FAFAFA" />
                <path
                  d="M17 39.5V37.5312C17 36.6354 17.4583 35.9062 18.375 35.3438C19.2917 34.7812 20.5 34.5 22 34.5C22.2708 34.5 22.5312 34.5052 22.7812 34.5156C23.0312 34.526 23.2708 34.5521 23.5 34.5938C23.2083 35.0312 22.9896 35.4896 22.8438 35.9688C22.6979 36.4479 22.625 36.9479 22.625 37.4688V39.5H17ZM24.5 39.5V37.4688C24.5 36.8021 24.6823 36.1927 25.0469 35.6406C25.4115 35.0885 25.9271 34.6042 26.5938 34.1875C27.2604 33.7708 28.0573 33.4583 28.9844 33.25C29.9115 33.0417 30.9167 32.9375 32 32.9375C33.1042 32.9375 34.1198 33.0417 35.0469 33.25C35.974 33.4583 36.7708 33.7708 37.4375 34.1875C38.1042 34.6042 38.6146 35.0885 38.9688 35.6406C39.3229 36.1927 39.5 36.8021 39.5 37.4688V39.5H24.5ZM41.375 39.5V37.4688C41.375 36.9271 41.3073 36.4167 41.1719 35.9375C41.0365 35.4583 40.8333 35.0104 40.5625 34.5938C40.7917 34.5521 41.026 34.526 41.2656 34.5156C41.5052 34.5052 41.75 34.5 42 34.5C43.5 34.5 44.7083 34.776 45.625 35.3281C46.5417 35.8802 47 36.6146 47 37.5312V39.5H41.375ZM27.1562 37H36.875C36.6667 36.5833 36.0885 36.2188 35.1406 35.9062C34.1927 35.5938 33.1458 35.4375 32 35.4375C30.8542 35.4375 29.8073 35.5938 28.8594 35.9062C27.9115 36.2188 27.3438 36.5833 27.1562 37ZM22 33.25C21.3125 33.25 20.724 33.0052 20.2344 32.5156C19.7448 32.026 19.5 31.4375 19.5 30.75C19.5 30.0417 19.7448 29.4479 20.2344 28.9688C20.724 28.4896 21.3125 28.25 22 28.25C22.7083 28.25 23.3021 28.4896 23.7812 28.9688C24.2604 29.4479 24.5 30.0417 24.5 30.75C24.5 31.4375 24.2604 32.026 23.7812 32.5156C23.3021 33.0052 22.7083 33.25 22 33.25ZM42 33.25C41.3125 33.25 40.724 33.0052 40.2344 32.5156C39.7448 32.026 39.5 31.4375 39.5 30.75C39.5 30.0417 39.7448 29.4479 40.2344 28.9688C40.724 28.4896 41.3125 28.25 42 28.25C42.7083 28.25 43.3021 28.4896 43.7812 28.9688C44.2604 29.4479 44.5 30.0417 44.5 30.75C44.5 31.4375 44.2604 32.026 43.7812 32.5156C43.3021 33.0052 42.7083 33.25 42 33.25ZM32 32C30.9583 32 30.0729 31.6354 29.3438 30.9062C28.6146 30.1771 28.25 29.2917 28.25 28.25C28.25 27.1875 28.6146 26.2969 29.3438 25.5781C30.0729 24.8594 30.9583 24.5 32 24.5C33.0625 24.5 33.9531 24.8594 34.6719 25.5781C35.3906 26.2969 35.75 27.1875 35.75 28.25C35.75 29.2917 35.3906 30.1771 34.6719 30.9062C33.9531 31.6354 33.0625 32 32 32ZM32 29.5C32.3542 29.5 32.651 29.3802 32.8906 29.1406C33.1302 28.901 33.25 28.6042 33.25 28.25C33.25 27.8958 33.1302 27.599 32.8906 27.3594C32.651 27.1198 32.3542 27 32 27C31.6458 27 31.349 27.1198 31.1094 27.3594C30.8698 27.599 30.75 27.8958 30.75 28.25C30.75 28.6042 30.8698 28.901 31.1094 29.1406C31.349 29.3802 31.6458 29.5 32 29.5Z"
                  fill="#A1A1AA"
                />
              </svg>
              <h5 className="mt-4 text-md text-[#151C27]">
                You haven`t joined any clubs
              </h5>
              <p className="max-w-[240px] mt-2 text-md text-[#41493A]">
                Join clubs to participate in exclusive events and find regular
                match partners.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Button */}
        <section className="px-4">
          <Link href="/clubs/new" className="block cursor-pointer">
            <button className="w-full bg-[#9FE870] text-[#121212] rounded-[32px] py-5 flex items-center justify-center gap-2 font-semibold text-xl">
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v8M8 12h8" />
              </svg>
              Create Club
            </button>
          </Link>
        </section>
      </main>

      <BottomNavBar />
    </div>
  );
}
