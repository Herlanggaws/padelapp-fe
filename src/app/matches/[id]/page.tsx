import Image from "next/image";
import Link from "next/link";
import MatchDetailClient from "@/components/MatchDetailClient";

export default function MatchDetailPage() {
  return (
    <div className="min-h-screen bg-white max-w-[448px] mx-auto relative flex flex-col">
      {/* Top App Bar */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 max-w-[448px] mx-auto w-full"
        style={{
          background: "#FFFFFF",
          borderBottom: "1px solid #F4F4F5",
          height: "64px",
        }}
      >
        <div className="flex items-center gap-3">
          <Link href="/matches" className="p-1">
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
            style={{ lineHeight: "28px" }}
          >
            Padel Open
          </span>
        </div>

        {/* Player avatar */}
        <div
          className="w-8 h-8 rounded-full overflow-hidden"
          style={{ border: "1px solid #F4F4F5" }}
        >
          <Image
            src="https://picsum.photos/seed/userprofile/32/32"
            alt="Player profile"
            width={32}
            height={32}
            className="w-full h-full object-cover"
          />
        </div>
      </header>

      {/* Content */}
      <div className="flex flex-col" style={{ paddingTop: "64px" }}>
        <MatchDetailClient />
      </div>
    </div>
  );
}
