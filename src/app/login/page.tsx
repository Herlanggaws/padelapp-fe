import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#F9F9FF] flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-[440px] flex flex-col items-center gap-6">
        {/* Branding Header */}
        <div className="flex flex-col items-center gap-2">
          {/* Logo */}
          <div className="bg-[#9FE870] rounded-full p-4 flex items-center justify-center w-[66px] aspect-square">
            <svg
              width="30"
              height="34"
              viewBox="0 0 30 34"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.1375 28.601L0 26.501L6.15 20.351C6.925 19.576 7.45625 18.6073 7.74375 17.4448C8.03125 16.2823 8.175 14.501 8.175 12.101C8.175 10.651 8.5 9.22603 9.15 7.82603C9.8 6.42603 10.725 5.12603 11.925 3.92603C14.2 1.65103 16.7125 0.363529 19.4625 0.0635294C22.2125 -0.236471 24.475 0.526029 26.25 2.35103C28.05 4.15103 28.8 6.42603 28.5 9.17603C28.2 11.926 26.925 14.426 24.675 16.676C23.475 17.876 22.175 18.801 20.775 19.451C19.375 20.101 17.95 20.426 16.5 20.426C14.075 20.426 12.3 20.5635 11.175 20.8385C10.05 21.1135 9.0875 21.651 8.2875 22.451L2.1375 28.601ZM12.45 16.076C13.625 17.226 15.2125 17.651 17.2125 17.351C19.2125 17.051 21 16.1135 22.575 14.5385C24.175 12.9385 25.1313 11.1448 25.4438 9.15728C25.7563 7.16978 25.325 5.61353 24.15 4.48853C22.95 3.28853 21.3813 2.83853 19.4438 3.13853C17.5063 3.43853 15.725 4.38853 14.1 5.98853C12.525 7.56353 11.5687 9.34478 11.2312 11.3323C10.8938 13.3198 11.3 14.901 12.45 16.076ZM24 33.101C22.35 33.101 20.9375 32.5135 19.7625 31.3385C18.5875 30.1635 18 28.751 18 27.101C18 25.451 18.5875 24.0385 19.7625 22.8635C20.9375 21.6885 22.35 21.101 24 21.101C25.65 21.101 27.0625 21.6885 28.2375 22.8635C29.4125 24.0385 30 25.451 30 27.101C30 28.751 29.4125 30.1635 28.2375 31.3385C27.0625 32.5135 25.65 33.101 24 33.101ZM24 30.101C24.825 30.101 25.5312 29.8073 26.1187 29.2198C26.7062 28.6323 27 27.926 27 27.101C27 26.276 26.7062 25.5698 26.1187 24.9823C25.5312 24.3948 24.825 24.101 24 24.101C23.175 24.101 22.4688 24.3948 21.8813 24.9823C21.2938 25.5698 21 26.276 21 27.101C21 27.926 21.2938 28.6323 21.8813 29.2198C22.4688 29.8073 23.175 30.101 24 30.101Z"
                fill="#2E6900"
              />
            </svg>
          </div>
          {/* Title */}
          <div className="pt-2 w-full text-center">
            <h1
              className="font-semibold text-[28px] text-[#151C27] text-center uppercase tracking-tight"
              style={{ lineHeight: "33.6px" }}
            >
              PADEL
            </h1>
          </div>
          {/* Subtitle */}
          <p
            className="text-[#5D5F5F] text-sm text-center"
            style={{ lineHeight: "21px" }}
          >
            Enter your details to access your court.
          </p>
        </div>

        {/* Login Card */}
        <div
          className="w-full bg-white border border-[#F4F4F5] rounded-[32px] p-8 flex flex-col gap-8"
          style={{ boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.05)" }}
        >
          {/* Form */}
          <div className="flex flex-col gap-4">
            {/* Email Field */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-[#3F3F46]">
                Email Address
              </label>
              <div className="bg-[#F0F3FF] border border-[#C1CAB5] rounded-md px-4 py-[13px]">
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full bg-transparent text-sm text-[#151C27] placeholder-[#6B7280] outline-none"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#3F3F46]">
                  Password
                </label>
                <Link href="#" className="text-xs font-semibold text-[#2F6C00]">
                  Forgot Password?
                </Link>
              </div>
              <div className="bg-[#F0F3FF] border border-[#C1CAB5] rounded-md px-4 py-[13px]">
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-transparent text-sm text-[#151C27] placeholder-[#6B7280] outline-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button className="w-full bg-[#18181B] text-white rounded-full py-4 flex items-center justify-center gap-2 font-normal text-base">
              Log In
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#C1CAB5]" />
            </div>
            <div className="relative bg-white px-4">
              <span className="text-xs text-[#5D5F5F]">OR CONTINUE WITH</span>
            </div>
          </div>

          {/* Social Sign-in */}
          <div className="flex gap-4">
            <button className="flex-1 flex items-center justify-center gap-2 bg-white border border-[#F4F4F5] rounded-full py-3 px-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span className="text-xs font-semibold text-[#151C27]">
                Google
              </span>
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 bg-white border border-[#F4F4F5] rounded-full py-3 px-4">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              <span className="text-xs font-semibold text-[#151C27]">
                Apple
              </span>
            </button>
          </div>
        </div>

        {/* Footer Links */}
        <div className="pt-6">
          <p className="text-sm text-[#5D5F5F]" style={{ lineHeight: "21px" }}>
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-[#18181B] font-semibold">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
