import Link from "next/link";
import Image from "next/image";
import TopAppBar from "@/components/TopAppBar";
import BottomNavBar from "@/components/BottomNavBar";

export default function DashboardPage() {
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
            <Link href="#" className="text-xs font-semibold text-[#2F6C00]">
              Explore
            </Link>
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
        </section>

        {/* CTA Button */}
        <section className="px-4">
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
            Create Club/Event
          </button>
        </section>
      </main>

      <BottomNavBar />
    </div>
  );
}
