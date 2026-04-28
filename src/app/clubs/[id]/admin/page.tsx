import Image from "next/image";
import Link from "next/link";

// Club Detail as Admin
export default function ClubDetailAdminPage() {
  return (
    <div className="min-h-screen bg-white max-w-[448px] mx-auto relative">
      {/* Top App Bar */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 max-w-[448px] mx-auto w-full"
        style={{
          background: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #F4F4F5",
          boxShadow: "0px 1px 2px 0px rgba(0,0,0,0.05)",
        }}
      >
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 rounded-full">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>
          <span
            className="font-black text-xl text-[#18181B]"
            style={{ letterSpacing: "-5%" }}
          >
            PadelPro
          </span>
        </div>
        <button className="p-2">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="1" />
            <circle cx="19" cy="12" r="1" />
            <circle cx="5" cy="12" r="1" />
          </svg>
        </button>
      </header>

      <main className="flex flex-col pb-10 pt-14">
        {/* Hero Section */}
        <div className="relative w-full h-[280px]">
          <Image
            src="https://picsum.photos/seed/smashclub/672/280"
            alt="Club Cover"
            fill
            className="object-cover"
          />
          {/* Club Logo */}
          <div
            className="absolute left-6 bottom-[-48px] w-24 h-24 rounded-full border-4 border-white overflow-hidden"
            style={{ boxShadow: "0px 1px 2px 0px rgba(0,0,0,0.05)" }}
          >
            <Image
              src="https://picsum.photos/seed/clublogo/96/96"
              alt="Club Logo"
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Club Info Section */}
        <div className="flex flex-col gap-4 px-6 pt-16 pb-0">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <h2
                className="font-semibold text-[28px] text-[#151C27]"
                style={{ lineHeight: "33.6px", letterSpacing: "-1%" }}
              >
                The Smash Arena
              </h2>
            </div>
            <div className="flex items-center gap-1">
              <svg
                width="12"
                height="15"
                viewBox="0 0 12 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 0C4.4087 0 2.88258 0.632141 1.75736 1.75736C0.632141 2.88258 0 4.4087 0 6C0 10.5 6 15 6 15C6 15 12 10.5 12 6C12 4.4087 11.3679 2.88258 10.2426 1.75736C9.11742 0.632141 7.5913 0 6 0ZM6 8.25C5.40326 8.25 4.83097 8.01295 4.40901 7.59099C3.98705 7.16903 3.75 6.59674 3.75 6C3.75 5.40326 3.98705 4.83097 4.40901 4.40901C4.83097 3.98705 5.40326 3.75 6 3.75C6.59674 3.75 7.16903 3.98705 7.59099 4.40901C8.01295 4.83097 8.25 5.40326 8.25 6C8.25 6.59674 8.01295 7.16903 7.59099 7.59099C7.16903 8.01295 6.59674 8.25 6 8.25Z"
                  fill="#41493A"
                />
              </svg>
              <span
                className="text-xs text-[#41493A]"
                style={{ lineHeight: "12px" }}
              >
                District 4, Barcelona
              </span>
            </div>
          </div>

          <p
            className="text-sm text-[#41493A]"
            style={{ lineHeight: "22.75px" }}
          >
            Experience world-class Padel at Barcelona&apos;s premier indoor
            facility. Featuring 12 panoramic courts, pro-shop, and a vibrant
            community of passionate players. Elevate your game with us.
          </p>

          {/* Admin Settings Button */}
          <div className="flex justify-center pt-2">
            <Link
              href="/clubs/settings"
              className="w-full py-3 rounded-[48px] text-base font-normal text-[#9FE870] text-center"
              style={{ background: "#121212", lineHeight: "24px" }}
            >
              Settings
            </Link>
          </div>
        </div>

        {/* Club Members Section */}
        <div className="flex flex-col gap-4 mt-6">
          <div className="flex items-center justify-between px-6">
            <h3
              className="font-semibold text-xl text-[#151C27]"
              style={{ lineHeight: "26px" }}
            >
              Club Members
            </h3>
            <button
              className="text-xs font-semibold text-[#2F6C00]"
              style={{ lineHeight: "12px" }}
            >
              See all
            </button>
          </div>

          <div className="flex gap-4 px-6">
            {[
              { name: "Marco R.", img: "1", active: true },
              { name: "Elena G.", img: "2" },
              { name: "David L.", img: "3" },
              { name: "Sonia K.", img: "4", active: true },
              { name: "Alex P.", img: "5" },
            ].map((member) => (
              <div
                key={member.name}
                className="flex flex-col items-center gap-2 px-1"
              >
                <div className="relative">
                  <div
                    className={`w-16 h-16 rounded-full overflow-hidden ${
                      member.active ? "border-2 border-[#2F6C00]" : ""
                    }`}
                  >
                    <Image
                      src={`https://i.pravatar.cc/64?img=${member.img}`}
                      alt={member.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {member.active && (
                    <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-[#22C55E] border-2 border-white" />
                  )}
                </div>
                <span
                  className="text-xs text-[#151C27] text-center"
                  style={{ lineHeight: "12px" }}
                >
                  {member.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Activities Section */}
        <div className="flex flex-col gap-6 px-6 mt-6">
          <h3 className="text-xl text-[#151C27]" style={{ lineHeight: "26px" }}>
            Upcoming Activities
          </h3>

          <div className="flex flex-col gap-4">
            {/* Featured Activity Card */}
            <div
              className="flex flex-col gap-4 p-5 rounded-2xl"
              style={{
                background: "#9FE870",
                border: "1px solid rgba(47,108,0,0.2)",
              }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="text-[10px] font-bold text-[#151C27] uppercase tracking-[5%] px-3 py-1 rounded-full"
                  style={{ background: "rgba(0,0,0,0.1)", lineHeight: "15px" }}
                >
                  TOURNAMENT
                </span>
                <div className="flex items-center" style={{ gap: "-12px" }}>
                  <div className="w-8 h-8 rounded-full border-2 border-[#9FE870] overflow-hidden">
                    <Image
                      src="https://i.pravatar.cc/32?img=10"
                      alt="Player"
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-8 h-8 rounded-full border-2 border-[#9FE870] overflow-hidden -ml-3">
                    <Image
                      src="https://i.pravatar.cc/32?img=11"
                      alt="Player"
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white border-2 border-[#9FE870] -ml-3 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-[#151C27]">
                      +12
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <h4
                  className="text-xl text-[#2E6900]"
                  style={{ lineHeight: "26px" }}
                >
                  Sunday Masters Open
                </h4>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <svg
                      width="14"
                      height="15"
                      viewBox="0 0 14 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 14C0.716667 14 0.479167 13.9042 0.2875 13.7125C0.0958333 13.5208 0 13.2833 0 13V3C0 2.71667 0.0958333 2.47917 0.2875 2.2875C0.479167 2.09583 0.716667 2 1 2H2V0H3.5V2H10.5V0H12V2H13C13.2833 2 13.5208 2.09583 13.7125 2.2875C13.9042 2.47917 14 2.71667 14 3V13C14 13.2833 13.9042 13.5208 13.7125 13.7125C13.5208 13.9042 13.2833 14 13 14H1ZM1 12.5H13V6H1V12.5Z"
                        fill="rgba(46,105,0,0.8)"
                      />
                    </svg>
                    <span
                      className="text-xs"
                      style={{
                        color: "rgba(46,105,0,0.8)",
                        lineHeight: "12px",
                      }}
                    >
                      Oct 15, 2023
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7.5 15C3.36 15 0 11.64 0 7.5C0 3.36 3.36 0 7.5 0C11.64 0 15 3.36 15 7.5C15 11.64 11.64 15 7.5 15ZM7.5 1.5C4.185 1.5 1.5 4.185 1.5 7.5C1.5 10.815 4.185 13.5 7.5 13.5C10.815 13.5 13.5 10.815 13.5 7.5C13.5 4.185 10.815 1.5 7.5 1.5ZM7.5 3.75V7.5L10.5 9L9.75 10.245L6 8.25V3.75H7.5Z"
                        fill="rgba(46,105,0,0.8)"
                      />
                    </svg>
                    <span
                      className="text-xs"
                      style={{
                        color: "rgba(46,105,0,0.8)",
                        lineHeight: "12px",
                      }}
                    >
                      09:00 - 14:00
                    </span>
                  </div>
                </div>
              </div>

              <button
                className="w-full py-3 rounded-[48px] text-base font-normal text-[#9FE870]"
                style={{ background: "#121212", lineHeight: "24px" }}
              >
                Join Tournament
              </button>
            </div>

            {/* Activity Card 2 */}
            <div
              className="flex items-center justify-between p-5 rounded-2xl bg-white"
              style={{ border: "1px solid #F4F4F5" }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-[48px] flex flex-col items-center justify-center"
                  style={{ background: "#F0F3FF" }}
                >
                  <span
                    className="text-base text-[#2F6C00]"
                    style={{ lineHeight: "24px" }}
                  >
                    18
                  </span>
                  <span
                    className="text-[8px] font-bold text-[#41493A] uppercase"
                    style={{ lineHeight: "12px" }}
                  >
                    OCT
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span
                    className="text-base text-[#151C27]"
                    style={{ lineHeight: "24px" }}
                  >
                    Pro Coaching Session
                  </span>
                  <span
                    className="text-xs text-[#41493A]"
                    style={{ lineHeight: "12px" }}
                  >
                    With Coach Roberto • 4 Slots Left
                  </span>
                </div>
              </div>
              <button
                className="px-4 py-2 rounded-full text-base font-normal text-[#18181B]"
                style={{ background: "#F4F4F5", lineHeight: "24px" }}
              >
                Join
              </button>
            </div>

            {/* Activity Card 3 */}
            <div
              className="flex items-center justify-between p-5 rounded-2xl bg-white"
              style={{ border: "1px solid #F4F4F5" }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-[48px] flex flex-col items-center justify-center"
                  style={{ background: "#F0F3FF" }}
                >
                  <span
                    className="text-base text-[#2F6C00]"
                    style={{ lineHeight: "24px" }}
                  >
                    20
                  </span>
                  <span
                    className="text-[8px] font-bold text-[#41493A] uppercase"
                    style={{ lineHeight: "12px" }}
                  >
                    OCT
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span
                    className="text-base text-[#151C27]"
                    style={{ lineHeight: "24px" }}
                  >
                    Mixed Social Match
                  </span>
                  <span
                    className="text-xs text-[#41493A]"
                    style={{ lineHeight: "12px" }}
                  >
                    Level 3.5-4.5 • 2 Slots Left
                  </span>
                </div>
              </div>
              <button
                className="px-4 py-2 rounded-full text-base font-normal text-[#18181B]"
                style={{ background: "#F4F4F5", lineHeight: "24px" }}
              >
                Join
              </button>
            </div>

            {/* Activity Card 4 */}
            <div
              className="flex items-center justify-between p-5 rounded-2xl bg-white"
              style={{ border: "1px solid #F4F4F5" }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-[48px] flex flex-col items-center justify-center"
                  style={{ background: "#F0F3FF" }}
                >
                  <span
                    className="text-base text-[#2F6C00]"
                    style={{ lineHeight: "24px" }}
                  >
                    22
                  </span>
                  <span
                    className="text-[8px] font-bold text-[#41493A] uppercase"
                    style={{ lineHeight: "12px" }}
                  >
                    OCT
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span
                    className="text-base text-[#151C27]"
                    style={{ lineHeight: "24px" }}
                  >
                    Ladies Morning Padel
                  </span>
                  <span
                    className="text-xs text-[#41493A]"
                    style={{ lineHeight: "12px" }}
                  >
                    Intermediate • 6 Slots Left
                  </span>
                </div>
              </div>
              <button
                className="px-4 py-2 rounded-full text-base font-normal text-[#18181B]"
                style={{ background: "#F4F4F5", lineHeight: "24px" }}
              >
                Join
              </button>
            </div>
          </div>
        </div>

        {/* FAB Button */}
        <div
          className="fixed bottom-8"
          style={{ right: "calc(50% - 224px + 16px)" }}
        >
          <button
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: "#9FE870" }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#121212"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v8M8 12h8" />
            </svg>
          </button>
        </div>
      </main>
    </div>
  );
}
