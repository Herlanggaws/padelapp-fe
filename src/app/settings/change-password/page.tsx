import Link from "next/link";

export default function ChangePasswordPage() {
  return (
    <div className="min-h-screen bg-white max-w-[448px] mx-auto relative">
      {/* Header */}
      <header className="flex items-center px-6 py-0 bg-white border-b border-[#F4F4F5] h-16">
        <div className="flex items-center gap-4">
          <Link href="/settings" className="p-2 rounded-full">
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
            className="font-semibold text-lg text-[#18181B]"
            style={{ letterSpacing: "-2.5%" }}
          >
            Settings
          </span>
        </div>
      </header>

      <main className="flex flex-col gap-6 p-6">
        {/* Header Section */}
        <section className="flex flex-col gap-2">
          <h2
            className="font-normal text-[28px] text-[#151C27]"
            style={{ lineHeight: "33.6px", letterSpacing: "-1%" }}
          >
            Change Password
          </h2>
          <p className="text-sm text-[#41493A]" style={{ lineHeight: "21px" }}>
            Update your security credentials to keep your account
            <br />
            safe.
          </p>
        </section>

        {/* Security Badge */}
        <section className="flex items-center gap-4 p-4 bg-[#F0F3FF] border border-[#C1CAB5] rounded-[32px]">
          <div className="bg-[#9FE870] rounded-full p-3 flex-shrink-0">
            <svg
              width="22"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2E6900"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-[#151C27]">
              Password Security
            </span>
            <span className="text-xs text-[#41493A]">
              Use 8+ characters with a mix of numbers and
              <br />
              symbols.
            </span>
          </div>
        </section>

        {/* Change Password Form */}
        <section className="flex flex-col gap-4 pb-4">
          {/* Current Password */}
          <div className="relative" style={{ height: "76px" }}>
            <label
              className="absolute text-xs font-semibold text-[#151C27]"
              style={{ top: "-0.5px", left: "4px" }}
            >
              Current Password
            </label>
            <div className="absolute w-full" style={{ top: "20px" }}>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter current password"
                  className="w-full bg-white border border-[#C1CAB5] rounded-xl py-[18px] pl-4 pr-12 text-sm text-[#151C27] placeholder-[#6B7280] outline-none focus:border-[#9FE870] transition-colors"
                />
                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280]">
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
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* New Password */}
          <div className="flex flex-col gap-2 mt-8">
            <label className="text-xs font-semibold text-[#151C27]">
              New Password
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="Enter new password"
                className="w-full bg-white border border-[#C1CAB5] rounded-xl py-[18px] pl-4 pr-12 text-sm text-[#151C27] placeholder-[#6B7280] outline-none focus:border-[#9FE870] transition-colors"
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280]">
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
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-[#151C27]">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="Re-type new password"
                className="w-full bg-white border border-[#C1CAB5] rounded-xl py-[18px] pl-4 pr-12 text-sm text-[#151C27] placeholder-[#6B7280] outline-none focus:border-[#9FE870] transition-colors"
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280]">
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
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4 pt-6">
            <button
              className="w-full bg-[#9FE870] text-[#2E6900] rounded-full py-4 font-semibold text-xl flex items-center justify-center"
              style={{
                boxShadow: "0px 1px 2px 0px rgba(0,0,0,0.05)",
                lineHeight: "26px",
              }}
            >
              Update Password
            </button>
            <button className="w-full py-2 flex items-center justify-center">
              <span
                className="text-sm text-[#5F5E5E]"
                style={{ lineHeight: "21px" }}
              >
                Forgot Password?
              </span>
            </button>
          </div>
        </section>

        {/* Recent Login Activity */}
        <section className="flex flex-col gap-2 p-4 bg-white border border-[#C1CAB5] rounded-[32px]">
          <h3 className="text-xs font-normal text-[#151C27] tracking-[0.1em] uppercase">
            RECENT LOGIN ACTIVITY
          </h3>

          <div className="flex flex-col">
            {/* Activity 1 */}
            <div className="flex items-center justify-between py-2 border-b border-[#DCE2F3]">
              <div className="flex items-center gap-2">
                <svg
                  width="12"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
                  <path d="M12 18h.01" />
                </svg>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-[#151C27]">
                    iPhone 15 Pro
                  </span>
                  <span className="text-xs text-[#41493A]">
                    Madrid, ES • Active Now
                  </span>
                </div>
              </div>
              <div className="w-2 h-2 rounded-full bg-[#9FE870]" />
            </div>

            {/* Activity 2 */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <svg
                  width="17"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="14" x="2" y="3" rx="2" />
                  <line x1="8" x2="16" y1="21" y2="21" />
                  <line x1="12" x2="12" y1="17" y2="21" />
                </svg>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-[#151C27]">
                    MacBook Pro
                  </span>
                  <span className="text-xs text-[#41493A]">
                    Madrid, ES • 2 hours ago
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
