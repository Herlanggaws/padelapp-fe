"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Modal from "@/components/Modal";
import { validateResetToken, resetPassword } from "@/services/authService";
import type {
  ValidateResetTokenErrorResponse,
  ResetPasswordErrorResponse,
} from "@/types/auth";

interface FieldErrors {
  password?: string;
  confirmPassword?: string;
}

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [tokenValid, setTokenValid] = useState<boolean | null>(token ? null : false);
  const [tokenError, setTokenError] = useState(token ? "" : "Reset token is missing.");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("Error");
  const [modalMessage, setModalMessage] = useState("");

  const showModal = (title: string, message: string) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalOpen(true);
  };

  useEffect(() => {
    if (!token) return;

    validateResetToken(token)
      .then(() => setTokenValid(true))
      .catch((err: ValidateResetTokenErrorResponse) => {
        setTokenValid(false);
        setTokenError(err?.message ?? "This reset link is invalid or expired.");
      });
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: FieldErrors = {};
    if (!password) {
      errors.password = "New password is required.";
    }
    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your new password.";
    } else if (password && confirmPassword !== password) {
      errors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const result = await resetPassword({ token, password });
      showModal("Success", result.message);
      router.push("/login");
    } catch (err) {
      const apiError = err as ResetPasswordErrorResponse;
      showModal("Error", apiError?.message ?? "Failed to reset password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (tokenValid === null) {
    return (
      <div className="min-h-screen bg-[#F9F9FF] flex items-center justify-center px-4 py-16">
        <p className="text-sm text-[#5D5F5F]">Validating reset link...</p>
      </div>
    );
  }

  if (tokenValid === false) {
    return (
      <div className="min-h-screen bg-[#F9F9FF] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-[440px] bg-white border border-[#F4F4F5] rounded-[32px] p-8 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="font-semibold text-[28px] text-[#151C27]">
              Link Expired
            </h1>
            <p className="text-sm text-[#5D5F5F]">{tokenError}</p>
          </div>
          <Link
            href="/forgot-password"
            className="w-full text-center text-sm font-semibold text-[#2F6C00]"
          >
            Request a new reset link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        message={modalMessage}
      />

      <div className="min-h-screen bg-[#F9F9FF] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-[440px] bg-white border border-[#F4F4F5] rounded-[32px] p-8 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="font-semibold text-[28px] text-[#151C27]">
              Reset Password
            </h1>
            <p className="text-sm text-[#5D5F5F]">
              Enter your new password below.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-[#3F3F46]">
                New Password
              </label>
              <div
                className={`bg-[#F0F3FF] border rounded-md px-4 py-[13px] ${
                  fieldErrors.password ? "border-red-400" : "border-[#C1CAB5]"
                }`}
              >
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) {
                      setFieldErrors((prev) => ({ ...prev, password: undefined }));
                    }
                  }}
                  disabled={isSubmitting}
                  className="w-full bg-transparent text-sm text-[#151C27] placeholder-[#6B7280] outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              {fieldErrors.password && (
                <p className="text-xs text-red-500">{fieldErrors.password}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-[#3F3F46]">
                Confirm New Password
              </label>
              <div
                className={`bg-[#F0F3FF] border rounded-md px-4 py-[13px] ${
                  fieldErrors.confirmPassword ? "border-red-400" : "border-[#C1CAB5]"
                }`}
              >
                <input
                  type="password"
                  placeholder="Confirm new password"
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
                  className="w-full bg-transparent text-sm text-[#151C27] placeholder-[#6B7280] outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              {fieldErrors.confirmPassword && (
                <p className="text-xs text-red-500">{fieldErrors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#18181B] text-white rounded-full py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Resetting..." : "Reset Password"}
            </button>
          </form>

          <Link
            href="/login"
            className="w-full text-center text-sm font-semibold text-[#2F6C00]"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </>
  );
}
