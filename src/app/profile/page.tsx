import Image from "next/image";
import TopAppBar from "@/components/TopAppBar";
import BottomNavBar from "@/components/BottomNavBar";
import ProfileJoinedClubsSectionClient from "@/components/ProfileJoinedClubsSectionClient";

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
                Rating 4.5
              </span>
            </div>
          </div>
        </section>

        {/* Matches played */}
        <section className="w-full">
          <div className="border border-[#F2F2F2] rounded-2xl overflow-hidden bg-white p-4 flex flex-col gap-2">
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
        </section>

        <ProfileJoinedClubsSectionClient />
      </main>

      <BottomNavBar />
    </div>
  );
}
