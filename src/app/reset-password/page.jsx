"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { LockClosedIcon, CheckCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
const SG = "'Special Gothic', sans-serif";
const SW = "'Switzer', sans-serif";
const dark = "#080b0f";
const gray = "#4b5b63";

function EyeToggle({ show, onToggle }) {
    return (
        <button type="button" onClick={onToggle} style={{
            position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
            background: "none", border: "none", cursor: "pointer", color: gray, padding: 4,
        }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {show
                    ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></>
                    : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>}
            </svg>
        </button>
    );
}

function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");

    const [password, setPassword]     = useState("");
    const [confirm, setConfirm]       = useState("");
    const [showPass, setShowPass]     = useState(false);
    const [showConf, setShowConf]     = useState(false);
    const [loading, setLoading]       = useState(false);
    const [success, setSuccess]       = useState(false);
    const [error, setError]           = useState("");

    useEffect(() => {
        if (!token) setError("Invalid or missing reset link. Please request a new one.");
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
        if (password !== confirm) { setError("Passwords do not match."); return; }
        setError(""); setLoading(true);

        try {
            const res = await fetch(`${BASE_URL}/auth/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to reset password.");
            setSuccess(true);
            setTimeout(() => router.push("/login"), 3000);
        } catch (err) {
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        width: "100%", boxSizing: "border-box",
        padding: "14px 44px 14px 44px",
        border: "1.5px solid #e8e8e8", borderRadius: 12,
        fontSize: 14, color: dark, outline: "none",
        fontFamily: SW, transition: "border 0.2s",
    };

    return (
        <div style={{
            minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
            background: "linear-gradient(135deg, #d5ecfa 0%, #e9f2f9 100%)",
            fontFamily: SW, padding: "24px",
        }}>
            <div style={{
                background: "#ffffff", borderRadius: 24, padding: "48px 40px",
                boxShadow: "0 24px 80px rgba(0,0,0,0.08)", width: "100%", maxWidth: 440,
            }}>
                {/* Logo */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
                    <div style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                        <span style={{ color: "#fff", fontWeight: 800, fontSize: 16 }}>J</span>
                    </div>
                    <span style={{ fontFamily: SG, fontWeight: 800, fontSize: 20, color: dark }}>Joblenso</span>
                </div>

                {success ? (
                    /* Success state */
                    <div style={{ textAlign: "center" }}>
                        <div style={{
                            width: 64, height: 64, borderRadius: "50%",
                            background: "#DCFCE7", display: "flex",
                            alignItems: "center", justifyContent: "center",
                            margin: "0 auto 24px",
                        }}>
                            <CheckCircleIcon style={{ width: 32, height: 32, color: "#16A34A" }} />
                        </div>
                        <h2 style={{ fontFamily: SG, fontSize: 24, fontWeight: 800, color: dark, marginBottom: 12 }}>
                            Password Updated!
                        </h2>
                        <p style={{ fontSize: 14, color: gray, lineHeight: 1.7, marginBottom: 24 }}>
                            Your password has been changed successfully. Redirecting you to login…
                        </p>
                        <Link href="/login" style={{
                            display: "inline-block", padding: "12px 32px",
                            background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
                            color: "#fff", borderRadius: 12, fontSize: 14,
                            fontWeight: 700, textDecoration: "none",
                        }}>
                            Go to Login
                        </Link>
                    </div>
                ) : !token ? (
                    /* Invalid token state */
                    <div style={{ textAlign: "center" }}>
                        <div style={{
                            width: 64, height: 64, borderRadius: "50%",
                            background: "#FEE2E2", display: "flex",
                            alignItems: "center", justifyContent: "center",
                            margin: "0 auto 24px",
                        }}>
                            <ExclamationTriangleIcon style={{ width: 32, height: 32, color: "#DC2626" }} />
                        </div>
                        <h2 style={{ fontFamily: SG, fontSize: 24, fontWeight: 800, color: dark, marginBottom: 12 }}>
                            Invalid Reset Link
                        </h2>
                        <p style={{ fontSize: 14, color: gray, marginBottom: 28 }}>
                            This link is invalid or has expired. Please request a new one.
                        </p>
                        <Link href="/forgot-password" style={{
                            display: "inline-block", padding: "12px 28px",
                            background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
                            color: "#fff", borderRadius: 12, fontSize: 14,
                            fontWeight: 700, textDecoration: "none",
                        }}>
                            Request New Link
                        </Link>
                    </div>
                ) : (
                    <>
                        <h1 style={{ fontFamily: SG, fontSize: 28, fontWeight: 800, color: dark, marginBottom: 8 }}>
                            Set New Password
                        </h1>
                        <p style={{ fontSize: 14, color: gray, marginBottom: 32, lineHeight: 1.6 }}>
                            Choose a strong password with at least 6 characters.
                        </p>

                        <form onSubmit={handleSubmit}>
                            {/* New password */}
                            <div style={{ position: "relative", marginBottom: 16 }}>
                                <LockClosedIcon style={{
                                    position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
                                    width: 18, height: 18, color: gray,
                                }} />
                                <input
                                    type={showPass ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="New password"
                                    required
                                    style={inputStyle}
                                    onFocus={(e) => e.target.style.borderColor = "#4F46E5"}
                                    onBlur={(e) => e.target.style.borderColor = "#e8e8e8"}
                                />
                                <EyeToggle show={showPass} onToggle={() => setShowPass(!showPass)} />
                            </div>

                            {/* Confirm password */}
                            <div style={{ position: "relative", marginBottom: 20 }}>
                                <LockClosedIcon style={{
                                    position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
                                    width: 18, height: 18, color: gray,
                                }} />
                                <input
                                    type={showConf ? "text" : "password"}
                                    value={confirm}
                                    onChange={(e) => setConfirm(e.target.value)}
                                    placeholder="Confirm new password"
                                    required
                                    style={inputStyle}
                                    onFocus={(e) => e.target.style.borderColor = "#4F46E5"}
                                    onBlur={(e) => e.target.style.borderColor = "#e8e8e8"}
                                />
                                <EyeToggle show={showConf} onToggle={() => setShowConf(!showConf)} />
                            </div>

                            {error && (
                                <p style={{ fontSize: 13, color: "#DC2626", marginBottom: 16 }}>{error}</p>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    width: "100%", padding: "14px",
                                    background: loading ? "#9CA3AF" : "linear-gradient(135deg, #4F46E5, #7C3AED)",
                                    color: "#fff", border: "none", borderRadius: 12,
                                    fontSize: 15, fontWeight: 700, fontFamily: SW,
                                    cursor: loading ? "not-allowed" : "pointer",
                                }}
                            >
                                {loading ? "Updating…" : "Update Password"}
                            </button>
                        </form>
                    </>
                )}

                <div style={{ marginTop: 28, textAlign: "center" }}>
                    <Link href="/login" style={{ fontSize: 13, color: gray, textDecoration: "none" }}>
                        ← Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading…</div>}>
            <ResetPasswordContent />
        </Suspense>
    );
}
