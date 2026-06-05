"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/Modal";
import { fetchUserProfile, loginUser } from "@/services/authService";
import { setUserProfileCache } from "@/lib/userProfileCache";
import type { LoginErrorResponse } from "@/types/auth";
import { useSnackbar } from "@/context/SnackbarContext";

interface FieldErrors {
  email?: string;
  password?: string;
}

export default function LoginForm() {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const showModal = (message: string) => {
    setModalMessage(message);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // --- Client-side empty field validation ---
    const errors: FieldErrors = {};
    if (!email.trim()) errors.email = "Email address is required.";
    if (!password) errors.password = "Password is required.";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    // --- API call ---
    setIsLoading(true);
    try {
      const result = await loginUser({
        email: email.trim(),
        password,
        user_agent: "WebApp",
      });

      document.cookie = `access_token=${result.data.access_token}; path=/; SameSite=Lax`;
      document.cookie = `refresh_token=${result.data.refresh_token}; path=/; SameSite=Lax`;

      const profileResult = await fetchUserProfile();
      setUserProfileCache(profileResult.data);

      showSnackbar("Welcome back!");
      router.push("/dashboard");
    } catch (err) {
      const apiError = err as LoginErrorResponse;
      const message = apiError?.message ?? "Something went wrong.";
      showModal(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Error"
        message={modalMessage}
      />

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
            <form onSubmit={handleSubmit} noValidate>
              <div className="flex flex-col gap-4">
                {/* Email Field */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-[#3F3F46]">
                    Email Address
                  </label>
                  <div
                    className={`bg-[#F0F3FF] border rounded-md px-4 py-[13px] ${
                      fieldErrors.email ? "border-red-400" : "border-[#C1CAB5]"
                    }`}
                  >
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (fieldErrors.email)
                          setFieldErrors((prev) => ({
                            ...prev,
                            email: undefined,
                          }));
                      }}
                      disabled={isLoading}
                      className="w-full bg-transparent text-sm text-[#151C27] placeholder-[#6B7280] outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                  {fieldErrors.email && (
                    <p className="text-xs text-red-500">{fieldErrors.email}</p>
                  )}
                </div>

                {/* Password Field */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-[#3F3F46]">
                      Password
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-xs font-semibold text-[#2F6C00]"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <div
                    className={`bg-[#F0F3FF] border rounded-md px-4 py-[13px] flex items-center gap-2 ${
                      fieldErrors.password
                        ? "border-red-400"
                        : "border-[#C1CAB5]"
                    }`}
                  >
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (fieldErrors.password)
                          setFieldErrors((prev) => ({
                            ...prev,
                            password: undefined,
                          }));
                      }}
                      disabled={isLoading}
                      className="w-full bg-transparent text-sm text-[#151C27] placeholder-[#6B7280] outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      disabled={isLoading}
                      className="text-[#6B7280] hover:text-[#41493A] transition-colors disabled:opacity-50 flex-shrink-0"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg
                          width="16"
                          height="16"
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
                      )}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <p className="text-xs text-red-500">
                      {fieldErrors.password}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#18181B] text-white rounded-full py-4 flex items-center justify-center gap-2 font-normal text-base disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                      Logging in...
                    </>
                  ) : (
                    <>
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
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Social login hidden for first release */}
            {/* <SocialAuthButtons mode="login" /> */}
          </div>

          {/* Footer Links */}
          <div className="pt-6">
            <p
              className="text-sm text-[#5D5F5F]"
              style={{ lineHeight: "21px" }}
            >
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-[#18181B] font-semibold">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
