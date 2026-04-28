import Link from "next/link";
import Image from "next/image";
import TopAppBar from "@/components/TopAppBar";
import BottomNavBar from "@/components/BottomNavBar";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-white max-w-[448px] mx-auto relative">
      <TopAppBar showNotification={true} />

      <main className="flex flex-col gap-6 px-4 pt-20 pb-36">
        {/* Profile Header Section */}
        <section className="flex flex-col items-center gap-4 pb-4">
          {/* Avatar */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-[3px] border-[#9FE870] p-1 bg-white">
              <div className="w-full h-full rounded-full overflow-hidden">
                <Image
                  src="https://i.pravatar.cc/128?img=3"
                  alt="Profile Picture"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            {/* Edit Badge */}
            <div className="absolute bottom-1 right-1 w-8 h-8 bg-[#9FE870] rounded-full border-4 border-white flex items-center justify-center">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#2E6900"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </div>
          </div>

          {/* Name & Level */}
          <div className="flex flex-col items-center gap-2">
            <h1
              className="font-semibold text-[28px] text-[#151C27] text-center"
              style={{ lineHeight: "33.6px", letterSpacing: "-1%" }}
            >
              Marcus Vance
            </h1>
            <div className="flex items-center gap-2">
              <span className="bg-[#2F6C00] text-white text-xs font-semibold rounded-full px-3 py-1 tracking-[0.05em] uppercase">
                LEVEL 4.5
              </span>
              <span className="text-xs text-[#5F5E5E]">Competitive Player</span>
            </div>
          </div>
        </section>

        {/* Bento Stats Grid */}
        <section className="w-full">
          <div className="grid grid-cols-2 gap-0 border border-[#F2F2F2] rounded-2xl overflow-hidden">
            {/* Matches Played */}
            <div className="bg-white border-r border-b border-[#F2F2F2] p-4 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#5F5E5E"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4l3 3" />
                </svg>
                <span className="text-xs text-[#5F5E5E]">Matches Played</span>
              </div>
              <span className="font-semibold text-xl text-[#151C27]">142</span>
            </div>

            {/* Win Rate */}
            <div className="bg-[#9FE870] border-b border-[#F2F2F2] p-4 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#2E6900"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                  <polyline points="16 7 22 7 22 13" />
                </svg>
                <span className="text-xs text-[#2E6900] opacity-80">
                  Win Rate
                </span>
              </div>
              <span className="font-semibold text-xl text-[#2E6900]">
                68.4%
              </span>
            </div>

            {/* Player Ranking */}
            <div className="bg-white col-span-2 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-[#E7EEFE] rounded-full p-2">
                  <svg
                    width="16"
                    height="21"
                    viewBox="0 0 16 21"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.675 11.7L6.55 8.85L4.25 7H7.1L8 4.2L8.9 7H11.75L9.425 8.85L10.3 11.7L8 9.925L5.675 11.7ZM2 21V13.275C1.36667 12.575 0.875 11.775 0.525 10.875C0.175 9.975 0 9.01667 0 8C0 5.76667 0.775 3.875 2.325 2.325C3.875 0.775 5.76667 0 8 0C10.2333 0 12.125 0.775 13.675 2.325C15.225 3.875 16 5.76667 16 8C16 9.01667 15.825 9.975 15.475 10.875C15.125 11.775 14.6333 12.575 14 13.275V21L8 19L2 21ZM8 14C9.66667 14 11.0833 13.4167 12.25 12.25C13.4167 11.0833 14 9.66667 14 8C14 6.33333 13.4167 4.91667 12.25 3.75C11.0833 2.58333 9.66667 2 8 2C6.33333 2 4.91667 2.58333 3.75 3.75C2.58333 4.91667 2 6.33333 2 8C2 9.66667 2.58333 11.0833 3.75 12.25C4.91667 13.4167 6.33333 14 8 14ZM4 18.025L8 17L12 18.025V14.925C11.4167 15.2583 10.7875 15.5208 10.1125 15.7125C9.4375 15.9042 8.73333 16 8 16C7.26667 16 6.5625 15.9042 5.8875 15.7125C5.2125 15.5208 4.58333 15.2583 4 14.925V18.025Z"
                      fill="#2F6C00"
                    />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-[#5F5E5E]">Player Ranking</span>
                  <span className="font-semibold text-xl text-[#151C27]">
                    #12 Local Club
                  </span>
                </div>
              </div>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#A1A1AA"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </div>
          </div>
        </section>

        {/* Clubs Joined Section */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-xl text-[#151C27]">
              Clubs Joined
            </h2>
            <Link href="#" className="text-xs font-semibold text-[#2F6C00]">
              View All
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            {/* Club 1 */}
            <div className="flex items-center gap-4 p-4 bg-white border border-[#F2F2F2] rounded-2xl">
              <div className="w-14 h-14 rounded-full flex-shrink-0 overflow-hidden">
                <Image
                  src="https://picsum.photos/seed/padelcentral/56/56"
                  alt="The Padel Central"
                  width={56}
                  height={56}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 flex flex-col">
                <span className="text-xs font-semibold text-[#151C27]">
                  The Padel Central
                </span>
                <span className="text-xs text-[#5F5E5E]">
                  Madrid, ES • 8 Courts
                </span>
              </div>
              <span className="bg-[#E7EEFE] text-[#41493A] text-xs rounded-2xl px-2 py-1">
                Member
              </span>
            </div>

            {/* Club 2 */}
            <div className="flex items-center gap-4 p-4 bg-white border border-[#F2F2F2] rounded-2xl">
              <div className="w-14 h-14 rounded-full flex-shrink-0 overflow-hidden">
                <Image
                  src="https://picsum.photos/seed/arenapadel/56/56"
                  alt="Arena Padel Elite"
                  width={56}
                  height={56}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 flex flex-col">
                <span className="text-xs font-semibold text-[#151C27]">
                  Arena Padel Elite
                </span>
                <span className="text-xs text-[#5F5E5E]">
                  Barcelona, ES • 12 Courts
                </span>
              </div>
              <span className="bg-[#E7EEFE] text-[#41493A] text-xs rounded-2xl px-2 py-1">
                Pro
              </span>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <button className="w-full bg-[#121212] text-[#9FE870] rounded-full py-4 flex items-center justify-center gap-2 font-semibold text-xs">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 15H11V11H15V9H11V5H9V9H5V11H9V15ZM10 20C8.61667 20 7.31667 19.7375 6.1 19.2125C4.88333 18.6875 3.825 17.975 2.925 17.075C2.025 16.175 1.3125 15.1167 0.7875 13.9C0.2625 12.6833 0 11.3833 0 10C0 8.61667 0.2625 7.31667 0.7875 6.1C1.3125 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.3125 6.1 0.7875C7.31667 0.2625 8.61667 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10C20 11.3833 19.7375 12.6833 19.2125 13.9C18.6875 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6875 13.9 19.2125C12.6833 19.7375 11.3833 20 10 20ZM10 18C12.2333 18 14.125 17.225 15.675 15.675C17.225 14.125 18 12.2333 18 10C18 7.76667 17.225 5.875 15.675 4.325C14.125 2.775 12.2333 2 10 2C7.76667 2 5.875 2.775 4.325 4.325C2.775 5.875 2 7.76667 2 10C2 12.2333 2.775 14.125 4.325 15.675C5.875 17.225 7.76667 18 10 18Z"
                fill="#9FE870"
              />
            </svg>
            Create New Match
          </button>
        </section>
      </main>

      <BottomNavBar />
    </div>
  );
}
