"use client";

import Link from "next/link";
import { useState } from "react";
import Modal from "@/components/Modal";
import { forgotPassword } from "@/services/authService";
import type { ForgotPasswordErrorResponse } from "@/types/auth";

interface FieldErrors {
  email?: string;
}

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: FieldErrors = {};
    if (!email.trim()) {
      errors.email = "Email address is required.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const result = await forgotPassword({ email: email.trim() });
      showModal("Success", result.message);
    } catch (err) {
      const apiError = err as ForgotPasswordErrorResponse;
      showModal("Error", apiError?.message ?? "Failed to send reset link.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
              Forgot Password
            </h1>
            <p className="text-sm text-[#5D5F5F]">
              Enter your email and we will send you a reset password link.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
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
                    if (fieldErrors.email) {
                      setFieldErrors((prev) => ({ ...prev, email: undefined }));
                    }
                  }}
                  disabled={isSubmitting}
                  className="w-full bg-transparent text-sm text-[#151C27] placeholder-[#6B7280] outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              {fieldErrors.email && (
                <p className="text-xs text-red-500">{fieldErrors.email}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#18181B] text-white rounded-full py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Sending..." : "Send Reset Link"}
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
