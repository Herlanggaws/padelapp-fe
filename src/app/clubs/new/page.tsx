import Link from "next/link";

// Club Form - Create Club
export default function ClubFormPage() {
  return (
    <div className="min-h-screen bg-white max-w-[448px] mx-auto relative">
      {/* Top App Bar */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 max-w-[448px] mx-auto w-full"
        style={{
          height: "64px",
          background: "#FFFFFF",
          borderBottom: "1px solid #F4F4F5",
        }}
      >
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center justify-center">
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
            className="font-semibold text-base text-[#18181B]"
            style={{ lineHeight: "24px", letterSpacing: "-2.5%" }}
          >
            Club Management
          </span>
        </div>
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
      </header>

      <main
        className="flex flex-col gap-10 px-4 pb-10"
        style={{ paddingTop: "88px" }}
      >
        {/* Header Section */}
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

        {/* Form */}
        <div className="flex flex-col gap-6">
          {/* Visual Identity Section */}
          <div className="flex flex-col gap-4">
            <span
              className="text-xs font-semibold text-[#41493A] uppercase tracking-[5%]"
              style={{ lineHeight: "12px" }}
            >
              VISUAL IDENTITY
            </span>

            {/* Cover Photo Upload */}
            <div
              className="w-full h-40 rounded-[32px] flex flex-col items-center justify-center gap-2 relative overflow-hidden"
              style={{
                background: "#E7EEFE",
                border: "2px dashed #C1CAB5",
              }}
            >
              <svg
                width="28"
                height="25"
                viewBox="0 0 28 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14 0L27.5 25H0.5L14 0Z"
                  fill="none"
                  stroke="#C1CAB5"
                  strokeWidth="2"
                />
                <path
                  d="M4 17L9 12L13 16L18 10L24 17"
                  stroke="#C1CAB5"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span
                className="text-xs font-semibold text-[#151C27]"
                style={{ lineHeight: "12px" }}
              >
                Upload Cover Photo
              </span>
            </div>

            {/* Logo Upload */}
            <div className="flex items-center gap-4">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: "#E2E8F8",
                  border: "2px dashed #C1CAB5",
                }}
              >
                <svg
                  width="22"
                  height="16"
                  viewBox="0 0 22 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11 0L21.5 16H0.5L11 0Z"
                    fill="none"
                    stroke="#C1CAB5"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <div className="flex flex-col gap-1">
                <span
                  className="text-xs font-semibold text-[#151C27]"
                  style={{ lineHeight: "12px" }}
                >
                  Club Logo
                </span>
                <span
                  className="text-xs text-[#41493A]"
                  style={{ lineHeight: "12px" }}
                >
                  SVG, PNG or JPG (min. 400x400px)
                </span>
              </div>
            </div>
          </div>

          {/* Basic Details Section */}
          <div className="flex flex-col gap-4">
            <span
              className="text-xs font-semibold text-[#41493A] uppercase tracking-[5%]"
              style={{ lineHeight: "12px" }}
            >
              BASIC DETAILS
            </span>

            {/* Club Name Input */}
            <div
              className="w-full px-4 rounded-lg"
              style={{
                background: "#F0F3FF",
                border: "1px solid #C1CAB5",
                height: "52px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <input
                type="text"
                placeholder="Club Name"
                className="w-full bg-transparent text-sm text-[#6B7280] outline-none"
                style={{ lineHeight: "21px" }}
              />
            </div>

            {/* Club Description Textarea */}
            <div
              className="w-full px-4 py-3 rounded-lg"
              style={{
                background: "#F0F3FF",
                border: "1px solid #C1CAB5",
                minHeight: "120px",
              }}
            >
              <textarea
                placeholder="Club Description"
                className="w-full bg-transparent text-sm text-[#6B7280] outline-none resize-none"
                style={{ lineHeight: "21px", minHeight: "96px" }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 py-6">
            <button
              className="w-full text-base font-normal text-[#9FE870] rounded-full relative overflow-hidden"
              style={{
                background: "#121212",
                height: "56px",
                lineHeight: "24px",
              }}
            >
              Create Club
            </button>
            <button
              className="w-full text-base font-normal text-[#121212] rounded-full"
              style={{
                background: "#9FE870",
                height: "56px",
                lineHeight: "24px",
              }}
            >
              Save as Draft
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
