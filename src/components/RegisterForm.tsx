"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/Modal";
import { registerUser } from "@/services/authService";
import type { RegisterErrorResponse } from "@/types/auth";

interface FieldErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function RegisterForm() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("Error");
  const [modalMessage, setModalMessage] = useState("");
  const [modalFieldErrors, setModalFieldErrors] = useState<
    Record<string, string> | undefined
  >(undefined);

  const showModal = (
    message: string,
    title = "Error",
    errors?: Record<string, string>,
  ) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalFieldErrors(errors);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // --- Terms checkbox (first priority) ---
    if (!agreedToTerms) {
      showModal(
        "You must agree to the Terms of Service and Privacy Policy before registering.",
        "Error",
      );
      return;
    }

    // --- Client-side empty field validation ---
    const errors: FieldErrors = {};
    if (!name.trim()) errors.name = "Full name is required.";
    if (!email.trim()) errors.email = "Email address is required.";
    if (!password) errors.password = "Password is required.";
    if (!confirmPassword)
      errors.confirmPassword = "Please confirm your password.";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    // --- Password mismatch ---
    if (password !== confirmPassword) {
      showModal("Password and confirm password do not match.", "Error");
      return;
    }

    // --- API call ---
    setIsLoading(true);
    try {
      const result = await registerUser({
        name: name.trim(),
        email: email.trim(),
        password,
        user_agent: "WebApp",
      });

      // Set cookie for server-side auth checks (proxy)
      document.cookie = `access_token=${result.data.access_token}; path=/; SameSite=Lax`;
      sessionStorage.setItem(
        "snackbar_message",
        "Registration successful! Welcome to Padel.",
      );
      router.push("/dashboard");
    } catch (err) {
      const apiError = err as RegisterErrorResponse;
      const message = apiError?.message ?? "Something went wrong.";
      const errors = apiError?.error ?? {};

      // Merge API field errors into inline field errors
      if (Object.keys(errors).length > 0) {
        setFieldErrors((prev) => ({ ...prev, ...errors }));
      }

      showModal(
        message,
        "Error",
        Object.keys(errors).length > 0 ? errors : undefined,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        message={modalMessage}
        fieldErrors={modalFieldErrors}
      />

      <div className="w-full max-w-[448px] flex flex-col items-center gap-6">
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
            Create your player profile to start booking
            <br />
            courts and joining matches.
          </p>
        </div>

        {/* Main Card */}
        <div className="w-full bg-white border border-[#F4F4F5] rounded-[32px] p-10 flex flex-col gap-6">
          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>
            <div className="flex flex-col gap-6 pb-4">
              {/* Full Name Field */}
              <div className="flex flex-col gap-2">
                <div className="px-2">
                  <label className="text-[12px] font-normal text-[#41493A] tracking-[0.05em] uppercase">
                    FULL NAME
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Rafael Nadal"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (fieldErrors.name)
                        setFieldErrors((prev) => ({
                          ...prev,
                          name: undefined,
                        }));
                    }}
                    disabled={isLoading}
                    className={`w-full bg-white border rounded-xl py-[17px] pl-12 pr-4 text-sm text-[#151C27] placeholder-[#6B7280] outline-none focus:border-[#9FE870] transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      fieldErrors.name ? "border-red-400" : "border-[#C1CAB5]"
                    }`}
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </span>
                </div>
                {fieldErrors.name && (
                  <p className="text-xs text-red-500 px-2">
                    {fieldErrors.name}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div className="flex flex-col gap-2">
                <div className="px-2">
                  <label className="text-[12px] font-normal text-[#41493A] tracking-[0.05em] uppercase">
                    EMAIL ADDRESS
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="rafa@padel.com"
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
                    className={`w-full bg-white border rounded-xl py-[17px] pl-12 pr-4 text-sm text-[#151C27] placeholder-[#6B7280] outline-none focus:border-[#9FE870] transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      fieldErrors.email ? "border-red-400" : "border-[#C1CAB5]"
                    }`}
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </span>
                </div>
                {fieldErrors.email && (
                  <p className="text-xs text-red-500 px-2">
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="flex flex-col gap-2">
                <div className="px-2">
                  <label className="text-[12px] font-normal text-[#41493A] tracking-[0.05em] uppercase">
                    PASSWORD
                  </label>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
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
                    className={`w-full bg-white border rounded-xl py-[17px] pl-12 pr-12 text-sm text-[#151C27] placeholder-[#6B7280] outline-none focus:border-[#9FE870] transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      fieldErrors.password
                        ? "border-red-400"
                        : "border-[#C1CAB5]"
                    }`}
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]">
                    <svg
                      width="18"
                      height="18"
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
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    disabled={isLoading}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#41493A] transition-colors disabled:opacity-50"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <svg
                        width="18"
                        height="18"
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
                        width="18"
                        height="18"
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
                  <p className="text-xs text-red-500 px-2">
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="flex flex-col gap-2">
                <div className="px-2">
                  <label className="text-[12px] font-normal text-[#41493A] tracking-[0.05em] uppercase">
                    CONFIRM PASSWORD
                  </label>
                </div>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (fieldErrors.confirmPassword)
                        setFieldErrors((prev) => ({
                          ...prev,
                          confirmPassword: undefined,
                        }));
                    }}
                    disabled={isLoading}
                    className={`w-full bg-white border rounded-xl py-[17px] pl-12 pr-12 text-sm text-[#151C27] placeholder-[#6B7280] outline-none focus:border-[#9FE870] transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      fieldErrors.confirmPassword
                        ? "border-red-400"
                        : "border-[#C1CAB5]"
                    }`}
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]">
                    <svg
                      width="18"
                      height="18"
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
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    disabled={isLoading}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#41493A] transition-colors disabled:opacity-50"
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirmPassword ? (
                      <svg
                        width="18"
                        height="18"
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
                        width="18"
                        height="18"
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
                {fieldErrors.confirmPassword && (
                  <p className="text-xs text-red-500 px-2">
                    {fieldErrors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Terms */}
              <div className="flex items-start gap-3 px-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  disabled={isLoading}
                  className="mt-1 w-4 h-4 accent-[#9FE870] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-[#41493A]"
                  style={{ lineHeight: "21px" }}
                >
                  I agree to the{" "}
                  <span className="underline text-[#151C27] font-semibold cursor-pointer">
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <Link
                    href="#"
                    className="underline text-[#151C27] font-semibold"
                  >
                    Privacy Policy
                  </Link>
                  .
                </label>
              </div>

              {/* CTA Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#151C27] text-[#9FE870] rounded-full py-4 flex items-center justify-center gap-2 font-semibold text-base disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
                style={{ lineHeight: "26px" }}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Registering...
                  </>
                ) : (
                  <>
                    Register Account
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
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Social login hidden for first release */}
          {/* <SocialAuthButtons mode="register" /> */}
        </div>

        {/* Footer Links */}
        <div className="pt-6">
          <p className="text-sm text-[#5D5F5F]" style={{ lineHeight: "21px" }}>
            Already have an account?{" "}
            <Link href="/login" className="text-[#18181B] font-semibold">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
