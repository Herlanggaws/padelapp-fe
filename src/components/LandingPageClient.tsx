"use client";

import Link from "next/link";
import { useState } from "react";
import BetaBadge from "@/components/BetaBadge";
import { joinNewsletter } from "@/services/newsletterService";

export default function LandingPageClient() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleJoinWaitlist() {
    if (!email || isSubmitting) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await joinNewsletter({ email });
      setSuccess(true);
      setEmail("");
    } catch (err) {
      const message =
        (err as { message?: string })?.message ?? "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="relative min-h-screen flex flex-col"
      style={{ backgroundColor: "#F9F9FF", fontFamily: "Lexend, sans-serif" }}
    >
      {/* Watermark Background */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
        style={{ zIndex: 0 }}
      >
        <span
          className="select-none"
          style={{
            fontFamily: "Lexend, sans-serif",
            fontWeight: 900,
            fontSize: "clamp(200px, 60vw, 768px)",
            lineHeight: 1,
            color: "rgba(47, 108, 0, 0.03)",
          }}
        >
          R
        </span>
      </div>

      {/* Header */}
      <header
        className="sticky top-0 z-50"
        style={{
          height: "80px",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <div className="w-full h-full flex items-center justify-between px-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span
              style={{
                fontFamily: "Lexend, sans-serif",
                fontWeight: 900,
                fontSize: "24px",
                lineHeight: "32px",
                color: "#18181B",
              }}
            >
              RallyRank
            </span>
            <BetaBadge />
          </div>

          <Link
            href="/login"
            style={{
              fontFamily: "Lexend, sans-serif",
              fontWeight: 400,
              fontSize: "14px",
              lineHeight: "20px",
              color: "#9FE870",
              backgroundColor: "#18181B",
              borderRadius: "9999px",
              padding: "10px 20px",
              textDecoration: "none",
            }}
          >
            Log in
          </Link>
        </div>
      </header>

      {/* Main */}
      <main
        className="relative flex-1 flex flex-col items-center"
        style={{ zIndex: 1 }}
      >
        {/* Hero Section */}
        <section
          className="w-full flex flex-col items-center justify-center gap-8 md:gap-5"
          style={{ padding: "60px 24px 80px" }}
        >
          {/* Big Heading + charter link */}
          <div className="flex flex-col items-center gap-6 md:gap-8">
            <h1
              className="text-center"
              style={{
                fontFamily: "Lexend, sans-serif",
                fontWeight: 900,
                fontSize: "clamp(48px, 10vw, 120px)",
                lineHeight: "0.9",
                letterSpacing: "-0.05em",
                textTransform: "uppercase",
                color: "#2F6C00",
                margin: 0,
              }}
            >
              EVERY MATCH
              <br />
              MOVES YOU UP
            </h1>
          </div>

          {/* Content card */}
          <div
            className="flex flex-col items-center gap-4 w-full"
            style={{ maxWidth: "672px" }}
          >
            {/* Coming Soon badge */}
            <div
              className="flex items-center gap-2"
              style={{
                backgroundColor: "rgba(159, 232, 112, 0.1)",
                borderRadius: "9999px",
                padding: "4px 12px",
              }}
            >
              <svg
                width="15"
                height="14"
                viewBox="0 0 15 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 12C4 8 8 6 13 6C13 11 9 13 5 12C4 12 3 12 2 12Z"
                  fill="#2F6C00"
                  opacity="0.7"
                />
                <path
                  d="M2 12L7 7"
                  stroke="#2F6C00"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
              <span
                style={{
                  fontFamily: "Lexend, sans-serif",
                  fontWeight: 600,
                  fontSize: "12px",
                  lineHeight: "12px",
                  textAlign: "center",
                  color: "#2F6C00",
                }}
              >
                Coming Soon for Mobile App
              </span>
            </div>

            {/* Heading 2 */}
            <h2
              className="text-center"
              style={{
                fontFamily: "Lexend, sans-serif",
                fontWeight: 400,
                fontSize: "16px",
                lineHeight: "24px",
                color: "#18181B",
                margin: 0,
                paddingTop: "8px",
              }}
            >
              Precision in Every Point.
            </h2>

            {/* Description */}
            <p
              className="text-center"
              style={{
                fontFamily: "Lexend, sans-serif",
                fontWeight: 400,
                fontSize: "16px",
                lineHeight: "24px",
                color: "#5F5E5E",
                maxWidth: "633px",
                margin: 0,
              }}
            >
              Precision meets Performance. Experience the first data-driven
              competition engine designed for the next generation of Padel
              Clubs.
            </p>

            {/* Email + CTA — stacked on mobile, row on desktop */}
            {success ? (
              <p
                style={{
                  fontFamily: "Lexend, sans-serif",
                  fontWeight: 400,
                  fontSize: "16px",
                  lineHeight: "24px",
                  color: "#2F6C00",
                  paddingTop: "24px",
                  textAlign: "center",
                }}
              >
                You&apos;re on the list! We&apos;ll be in touch soon.
              </p>
            ) : (
              <div
                className="w-full flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3"
                style={{ paddingTop: "24px" }}
              >
                <div
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #C1CAB5",
                    borderRadius: "9999px",
                    padding: "16px 24px",
                    flex: 1,
                    maxWidth: "360px",
                    minWidth: 0,
                  }}
                >
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    style={{
                      fontFamily: "Lexend, sans-serif",
                      fontWeight: 400,
                      fontSize: "16px",
                      color: "#6B7280",
                      background: "transparent",
                      border: "none",
                      outline: "none",
                      width: "100%",
                    }}
                  />
                </div>
                <button
                  onClick={handleJoinWaitlist}
                  disabled={isSubmitting}
                  className="disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    fontFamily: "Lexend, sans-serif",
                    fontWeight: 400,
                    fontSize: "16px",
                    lineHeight: "24px",
                    textAlign: "center",
                    color: "#9FE870",
                    backgroundColor: "#18181B",
                    borderRadius: "9999px",
                    padding: "17px 32px",
                    border: "none",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  {isSubmitting ? "Joining..." : "Join Waitlist"}
                </button>
              </div>
            )}
            <p
              style={{
                fontFamily: "Lexend, sans-serif",
                fontWeight: 400,
                fontSize: "14px",
                lineHeight: "20px",
                color: "#DC2626",
                textAlign: "center",
                marginTop: "8px",
                minHeight: "20px",
              }}
            >
              {error ?? ""}
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        className="relative z-10"
        style={{
          backgroundColor: "#FFFFFF",
          borderTop: "1px solid #F4F4F5",
          padding: "48px 24px",
        }}
      >
        {/* Desktop: row layout; Mobile: column layout */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 w-full">
          {/* Left: Logo + copyright */}
          <div className="flex flex-col gap-2">
            <span
              style={{
                fontFamily: "Lexend, sans-serif",
                fontWeight: 900,
                fontSize: "18px",
                lineHeight: "28px",
                color: "#18181B",
              }}
            >
              RallyRank
            </span>
            <span
              style={{
                fontFamily: "Lexend, sans-serif",
                fontWeight: 400,
                fontSize: "12px",
                lineHeight: "16px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#A1A1AA",
              }}
            >
              © {new Date().getFullYear()} Rallyrank. PRECISION IN EVERY POINT.
            </span>
          </div>

          {/* Right: Links — wrap on mobile */}
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {[
              { label: "PRIVACY", href: "/privacy-policy" },
              { label: "TERMS", href: "/terms-of-service" },
              // { label: "CONTACT", href: "#" },
              { label: "INSTAGRAM", href: "https://www.instagram.com/rallyrank.id" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                style={{
                  fontFamily: "Lexend, sans-serif",
                  fontWeight: 400,
                  fontSize: "12px",
                  lineHeight: "16px",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#A1A1AA",
                  textDecoration: "none",
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
