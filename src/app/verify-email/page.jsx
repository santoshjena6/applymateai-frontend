"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authService } from "@/services/api";
import { setAuthCookie } from "@/utils/authCookie";

const SG = "'Special Gothic', sans-serif";
const SW = "'Switzer', sans-serif";
const dark = "#080b0f";
const gray = "#4b5b63";
const white = "#ffffff";
const borderCol = "#e8e8e8";
const purple = "#6c47ff";
const purpleLight = "#f0ecff";

const OTP_TOTAL_SECONDS = 10 * 60; // 10 minutes
const RESEND_COOLDOWN   = 60;       // 60 seconds

function maskEmail(email) {
  if (!email) return "";
  const [user, domain] = email.split("@");
  if (!user || !domain) return email;
  const visible = user.slice(0, 3);
  const masked  = "*".repeat(Math.max(0, user.length - 3));
  return `${visible}${masked}@${domain}`;
}

function VerifyEmailContent() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const email        = searchParams.get("email") || "";

  const [digits,        setDigits]        = useState(["", "", "", "", "", ""]);
  const [loading,       setLoading]       = useState(false);
  const [resending,     setResending]     = useState(false);
  const [error,         setError]         = useState("");
  const [success,       setSuccess]       = useState(false);
  const [secondsLeft,   setSecondsLeft]   = useState(OTP_TOTAL_SECONDS);
  const [resendCooldown, setResendCooldown] = useState(0);

  const inputRefs = useRef([]);

  // Countdown timer
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [secondsLeft]);

  // Resend cooldown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const id = setInterval(() => setResendCooldown((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [resendCooldown]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const handleDigitChange = (index, value) => {
    const cleaned = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = cleaned;
    setDigits(next);
    setError("");
    if (cleaned && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) inputRefs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const next = ["", "", "", "", "", ""];
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    setDigits(next);
    const focusIdx = Math.min(pasted.length, 5);
    inputRefs.current[focusIdx]?.focus();
  };

  const handleVerify = useCallback(async () => {
    const otp = digits.join("");
    if (otp.length < 6) { setError("Please enter the complete 6-digit code."); return; }
    if (secondsLeft <= 0) { setError("Code has expired. Please request a new one."); return; }
    setLoading(true); setError("");
    try {
      const res = await authService.verifyOtp(email, otp);
      const { token, refreshToken, email: userEmail, name, role, jobCategory } = res.data;
      localStorage.setItem("applync_token", token);
      localStorage.setItem("applync_refresh_token", refreshToken);
      localStorage.setItem("applync_user", JSON.stringify({ email: userEmail, name, role, jobCategory: jobCategory || null }));
      setAuthCookie();
      setSuccess(true);
      setTimeout(() => router.push("/resume-upload"), 1200);
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid or expired code. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [digits, email, secondsLeft, router]);

  // Auto-submit when all 6 digits are filled
  useEffect(() => {
    if (digits.every((d) => d !== "") && !loading && !success) {
      handleVerify();
    }
  }, [digits]); // eslint-disable-line

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setResending(true); setError("");
    try {
      await authService.resendOtp(email);
      setSecondsLeft(OTP_TOTAL_SECONDS);
      setResendCooldown(RESEND_COOLDOWN);
      setDigits(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err?.response?.data?.message || "Could not resend code. Please try again.");
    } finally {
      setResending(false);
    }
  };

  const expired = secondsLeft <= 0;

  return (
    <div style={{
      display: "flex", minHeight: "100vh", fontFamily: SW,
      background: "linear-gradient(135deg, #f0ecff 0%, #e8f4fd 100%)",
      justifyContent: "center", alignItems: "center", padding: "20px",
    }}>
      <div style={{
        width: "100%", maxWidth: 460,
        background: white, borderRadius: 24,
        boxShadow: "0 24px 80px rgba(0,0,0,0.08), 0 4px 20px rgba(0,0,0,0.04)",
        padding: "48px 40px",
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none", color: dark, marginBottom: 36 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={dark} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2"/>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
          </svg>
          <span style={{ fontFamily: SG, fontSize: 22, fontWeight: 700, letterSpacing: "-0.5px" }}>Joblenso</span>
        </Link>

        {/* Icon */}
        <div style={{
          width: 56, height: 56, borderRadius: 16,
          background: purpleLight,
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 24,
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={purple} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
        </div>

        <h1 style={{ fontFamily: SG, fontSize: 28, fontWeight: 800, color: dark, margin: "0 0 8px", letterSpacing: "-0.5px" }}>
          Check your email
        </h1>
        <p style={{ fontFamily: SW, fontSize: 14, color: gray, margin: "0 0 32px", lineHeight: 1.6 }}>
          We sent a 6-digit verification code to<br />
          <strong style={{ color: dark }}>{maskEmail(email)}</strong>
        </p>

        {/* OTP input boxes */}
        <div style={{ display: "flex", gap: 10, marginBottom: 24, justifyContent: "center" }}>
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputRefs.current[i] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={i === 0 ? handlePaste : undefined}
              disabled={loading || success || expired}
              style={{
                width: 52, height: 60,
                textAlign: "center",
                fontSize: 24, fontWeight: 700, fontFamily: SW,
                color: dark,
                border: `2px solid ${error ? "#ef4444" : digit ? purple : borderCol}`,
                borderRadius: 12,
                background: digit ? purpleLight : "#fcfcfc",
                outline: "none",
                transition: "all 0.15s ease",
                cursor: expired ? "not-allowed" : "text",
                opacity: expired ? 0.5 : 1,
              }}
              onFocus={(e) => { if (!expired) e.target.style.borderColor = purple; }}
              onBlur={(e) => { e.target.style.borderColor = error ? "#ef4444" : digit ? purple : borderCol; }}
            />
          ))}
        </div>

        {/* Error message */}
        {error && (
          <div style={{
            padding: "10px 14px", borderRadius: 10,
            background: "#fef2f2", color: "#dc2626",
            fontFamily: SW, fontSize: 13,
            border: "1px solid #fecaca",
            marginBottom: 16, textAlign: "center",
          }}>
            {error}
          </div>
        )}

        {/* Success message */}
        {success && (
          <div style={{
            padding: "10px 14px", borderRadius: 10,
            background: "#f0fdf4", color: "#16a34a",
            fontFamily: SW, fontSize: 13,
            border: "1px solid #bbf7d0",
            marginBottom: 16, textAlign: "center",
          }}>
            ✓ Email verified! Redirecting…
          </div>
        )}

        {/* Timer */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          {expired ? (
            <span style={{ fontFamily: SW, fontSize: 13, color: "#dc2626", fontWeight: 600 }}>
              Code expired — please request a new one
            </span>
          ) : (
            <span style={{ fontFamily: SW, fontSize: 13, color: gray }}>
              Code expires in{" "}
              <span style={{ color: secondsLeft < 60 ? "#dc2626" : purple, fontWeight: 700 }}>
                {formatTime(secondsLeft)}
              </span>
            </span>
          )}
        </div>

        {/* Verify button */}
        <button
          onClick={handleVerify}
          disabled={loading || success || expired}
          style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            background: loading || success || expired ? "#9ca3af" : dark,
            color: white, border: "none", borderRadius: 999,
            padding: "14px 24px", fontFamily: SW, fontWeight: 600, fontSize: 15,
            cursor: loading || success || expired ? "not-allowed" : "pointer",
            marginBottom: 16,
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => { if (!loading && !success && !expired) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(8,11,15,0.2)"; } }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
        >
          {loading ? "Verifying…" : success ? "Verified ✓" : "Verify Email"}
          {!loading && !success && !expired && (
            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, background: white, color: dark, borderRadius: "50%", fontSize: 13, marginLeft: 4 }}>→</span>
          )}
        </button>

        {/* Resend */}
        <div style={{ textAlign: "center" }}>
          {resendCooldown > 0 ? (
            <span style={{ fontFamily: SW, fontSize: 13, color: gray }}>
              Resend in <strong style={{ color: dark }}>{resendCooldown}s</strong>
            </span>
          ) : (
            <button
              onClick={handleResend}
              disabled={resending}
              style={{
                background: "none", border: "none", cursor: resending ? "wait" : "pointer",
                fontFamily: SW, fontSize: 13, color: purple, fontWeight: 600,
                padding: 0, textDecoration: "underline",
              }}
            >
              {resending ? "Sending…" : "Resend code"}
            </button>
          )}
        </div>

        <hr style={{ border: "none", borderTop: `1px solid ${borderCol}`, margin: "28px 0" }} />

        <p style={{ textAlign: "center", fontFamily: SW, fontSize: 13, color: gray }}>
          Wrong email?{" "}
          <Link href="/register" style={{ color: "#2563eb", fontWeight: 700, textDecoration: "none" }}>
            Go back to register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", fontFamily: "'Switzer', sans-serif", color: "#4b5b63" }}>
        Loading…
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
