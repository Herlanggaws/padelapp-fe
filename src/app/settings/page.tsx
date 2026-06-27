import type { Metadata } from "next";
import Link from "next/link";
import BetaBadge from "@/components/BetaBadge";
import LogoutButton from "@/components/LogoutButton";

export const metadata: Metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-white max-w-[448px] mx-auto relative">
      {/* Header */}
      <header className="flex items-center px-6 py-0 bg-white border-b border-[#F4F4F5] h-16">
        <div className="flex items-center gap-4">
          <Link href="/profile" className="p-2 rounded-full">
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
          <div className="flex min-w-0 items-center gap-2">
            <span
              className="truncate font-semibold text-lg text-[#18181B]"
              style={{ letterSpacing: "-2.5%" }}
            >
              Settings
            </span>
            <BetaBadge />
          </div>
        </div>
      </header>

      <main className="flex flex-col gap-6 p-6">
        {/* GENERAL Section */}
        <section className="flex flex-col gap-2">
          <div className="px-2 py-2">
            <span className="text-[10px] font-normal text-[#717A68] tracking-[0.1em] uppercase">
              GENERAL
            </span>
          </div>
          <div className="flex flex-col">
            {/* Change Password */}
            <Link
              href="/settings/change-password"
              className="flex items-center justify-between px-4 py-4 bg-white border border-[#F4F4F5] hover:bg-[#F9F9FF] transition-colors"
            >
              <div className="flex items-center gap-4">
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
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span className="text-base font-normal text-[#18181B]">
                  Change Password
                </span>
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
            </Link>
          </div>
        </section>

        {/* LEGAL Section */}
        <section className="flex flex-col gap-2">
          <div className="px-2 py-2">
            <span className="text-[10px] font-normal text-[#717A68] tracking-[0.1em] uppercase">
              LEGAL
            </span>
          </div>
          <div className="flex flex-col">
            {/* Privacy Policy */}
            <Link
              href="/privacy-policy"
              className="flex items-center justify-between px-4 py-4 bg-white border border-[#F4F4F5] border-b-0 hover:bg-[#F9F9FF] transition-colors"
            >
              <div className="flex items-center gap-4">
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
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span className="text-base font-normal text-[#18181B]">
                  Privacy Policy
                </span>
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
            </Link>

            {/* Terms of Service */}
            <Link
              href="/terms-of-service"
              className="flex items-center justify-between px-4 py-4 bg-white border border-[#F4F4F5] hover:bg-[#F9F9FF] transition-colors"
            >
              <div className="flex items-center gap-4">
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
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" x2="8" y1="13" y2="13" />
                  <line x1="16" x2="8" y1="17" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                <span className="text-base font-normal text-[#18181B]">
                  Terms of Service
                </span>
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
            </Link>
          </div>
        </section>

        {/* Logout Section */}
        <section className="flex flex-col gap-4 pt-10 pb-32">
          <LogoutButton />

          <div className="text-center opacity-60">
            <span className="text-base text-[#717A68]">
              Version 2.4.1 (Build 892)
            </span>
          </div>
        </section>
      </main>
    </div>
  );
}
