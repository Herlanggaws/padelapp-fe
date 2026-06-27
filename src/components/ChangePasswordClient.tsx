"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import BetaBadge from "@/components/BetaBadge";
import Modal from "@/components/Modal";
import { changePassword } from "@/services/authService";
import type { ChangePasswordErrorResponse } from "@/types/auth";

interface FieldErrors {
  oldPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export default function ChangePasswordClient() {
  const router = useRouter();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const showModal = (message: string) => {
    setModalMessage(message);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: FieldErrors = {};

    if (!oldPassword) {
      errors.oldPassword = "Current password is required.";
    }
    if (!newPassword) {
      errors.newPassword = "New password is required.";
    }
    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your new password.";
    } else if (newPassword && confirmPassword !== newPassword) {
      errors.confirmPassword = "Confirm password must match new password.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      await changePassword({
        old_password: oldPassword,
        new_password: newPassword,
      });
      router.back();
    } catch (err) {
      const apiError = err as ChangePasswordErrorResponse;
      showModal(apiError?.message ?? "Failed to change password.");
    } finally {
      setIsSubmitting(false);
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

      <div className="min-h-screen bg-white max-w-[448px] mx-auto relative">
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

          <section className="flex items-center gap-4 p-4 bg-[#F0F3FF] border border-[#C1CAB5] rounded-[32px]">
            <div className="bg-[#9FE870] rounded-full p-3 shrink-0">
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

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 pb-4" noValidate>
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
                    type={showOldPassword ? "text" : "password"}
                    placeholder="Enter current password"
                    value={oldPassword}
                    onChange={(e) => {
                      setOldPassword(e.target.value);
                      if (fieldErrors.oldPassword) {
                        setFieldErrors((prev) => ({
                          ...prev,
                          oldPassword: undefined,
                        }));
                      }
                    }}
                    disabled={isSubmitting}
                    className={`w-full bg-white border rounded-xl py-[18px] pl-4 pr-12 text-sm text-[#151C27] placeholder-[#6B7280] outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      fieldErrors.oldPassword ? "border-red-400" : "border-[#C1CAB5]"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword((prev) => !prev)}
                    disabled={isSubmitting}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280] disabled:opacity-50"
                  >
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
            {fieldErrors.oldPassword && (
              <p className="-mt-1 text-xs text-red-500">{fieldErrors.oldPassword}</p>
            )}

            <div className="flex flex-col gap-2 mt-4">
              <label className="text-xs font-semibold text-[#151C27]">New Password</label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (fieldErrors.newPassword || fieldErrors.confirmPassword) {
                      setFieldErrors((prev) => ({
                        ...prev,
                        newPassword: undefined,
                        confirmPassword: undefined,
                      }));
                    }
                  }}
                  disabled={isSubmitting}
                  className={`w-full bg-white border rounded-xl py-[18px] pl-4 pr-12 text-sm text-[#151C27] placeholder-[#6B7280] outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    fieldErrors.newPassword ? "border-red-400" : "border-[#C1CAB5]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  disabled={isSubmitting}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280] disabled:opacity-50"
                >
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
              {fieldErrors.newPassword && (
                <p className="text-xs text-red-500">{fieldErrors.newPassword}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-[#151C27]">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-type new password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (fieldErrors.confirmPassword) {
                      setFieldErrors((prev) => ({
                        ...prev,
                        confirmPassword: undefined,
                      }));
                    }
                  }}
                  disabled={isSubmitting}
                  className={`w-full bg-white border rounded-xl py-[18px] pl-4 pr-12 text-sm text-[#151C27] placeholder-[#6B7280] outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    fieldErrors.confirmPassword ? "border-red-400" : "border-[#C1CAB5]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  disabled={isSubmitting}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280] disabled:opacity-50"
                >
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
              {fieldErrors.confirmPassword && (
                <p className="text-xs text-red-500">{fieldErrors.confirmPassword}</p>
              )}
            </div>

            <div className="flex flex-col gap-4 pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#9FE870] text-[#2E6900] rounded-full py-4 font-semibold text-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  boxShadow: "0px 1px 2px 0px rgba(0,0,0,0.05)",
                  lineHeight: "26px",
                }}
              >
                {isSubmitting ? "Updating..." : "Update Password"}
              </button>
              <button
                type="button"
                className="w-full py-2 flex items-center justify-center"
                onClick={() => router.push("/forgot-password")}
              >
                <span className="text-sm text-[#5F5E5E]" style={{ lineHeight: "21px" }}>
                  Forgot Password?
                </span>
              </button>
            </div>
          </form>
        </main>
      </div>
    </>
  );
}
