"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { authService } from "@/services/api";
import { getErrorMessage } from "@/utils/errorMessage";
import { setAuthCookie } from "@/utils/authCookie";

const SG = "'Special Gothic', sans-serif";
const SW = "'Switzer', sans-serif";
const dark = "#080b0f";
const gray = "#4b5b63";
const white = "#ffffff";
const borderCol = "#e8e8e8";
const accent = "#3a7ca5";

function EyeToggle({ show, onToggle }) {
  return (
    <button type="button" onClick={onToggle} style={{
      position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
      background: "none", border: "none", cursor: "pointer", color: gray, padding: 4, display: "flex",
      transition: "color 0.2s ease"
    }}
    onMouseEnter={(e) => e.currentTarget.style.color = dark}
    onMouseLeave={(e) => e.currentTarget.style.color = gray}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {show
          ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
          : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>}
      </svg>
    </button>
  );
}

const inputSt = (hasError, isFocused, hasIcon = true) => ({
  width: "100%", boxSizing: "border-box",
  padding: hasIcon ? "12px 16px 12px 42px" : "14px 16px", borderRadius: 12,
  border: `1px solid ${hasError ? "#ef4444" : isFocused ? dark : borderCol}`,
  fontFamily: SW, fontSize: 14, color: dark,
  outline: "none", background: "#fcfcfc",
  transition: "all 0.2s ease",
  boxShadow: isFocused ? `0 0 0 3px rgba(8,11,15,0.05)` : "none"
});

export default function RegisterPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const router = useRouter();
  const [loading, setLoading]         = useState(false);
  const [apiError, setApiError]       = useState("");
  const [showPass, setShowPass]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) { setApiError("Passwords do not match."); return; }
    setLoading(true); setApiError("");
    try {
      const res = await authService.register(data.name, data.email, data.password, data.jobType);
      // Backend now returns { requiresVerification: true, email, message } — no JWT yet
      if (res.data.requiresVerification) {
        router.push(`/verify-email?email=${encodeURIComponent(res.data.email)}`);
      }
    } catch (err) {
      setApiError(getErrorMessage(err, "register"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: "flex", height: "100vh", overflow: "hidden", fontFamily: SW,
      background: "linear-gradient(to bottom, #d5ecfa, #e9f2f9)",
      justifyContent: "center", alignItems: "center", padding: "20px"
    }}>
      {/* Main Container */}
      <div style={{
        display: "flex",
        width: "100%", maxWidth: 1050, height: "100%", maxHeight: "720px", 
        background: white,
        borderRadius: 24,
        boxShadow: "0 24px 80px rgba(0,0,0,0.07), 0 4px 20px rgba(0,0,0,0.04)",
        overflow: "hidden",
      }}>
        {/* Left Form Section */}
        <div style={{
          flex: "1",
          background: white,
          display: "flex", flexDirection: "column",
          padding: "32px 56px",
          overflowY: "auto",
          justifyContent: "center",
        }}>
          <div style={{ width: "100%", margin: "0 auto" }}>
            
            {/* Minimal Logo */}
            <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none", color: dark, marginBottom: 32 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={dark} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
              </svg>
              <span style={{ fontFamily: SG, fontSize: 22, fontWeight: 700, letterSpacing: "-0.5px" }}>Joblenso</span>
            </Link>

            <h2 style={{ fontFamily: SG, fontSize: 32, fontWeight: 800, color: dark, letterSpacing: "-0.5px", margin: "0 0 32px", lineHeight: 1.1 }}>
              Create your account
            </h2>

            <form onSubmit={handleSubmit(onSubmit, errs => console.error(errs))}>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                <div>
                  <label style={{ display: "block", fontFamily: SW, fontSize: 13, fontWeight: 600, color: dark, marginBottom: 8, letterSpacing: "0.02em" }}>Full Name</label>
                  <input {...register("name", { required: "Required" })}
                    type="text" placeholder="John Doe" 
                    style={inputSt(errors.name, focusedField === "name", false)}
                    onFocus={() => setFocusedField("name")} onBlur={() => setFocusedField(null)} />
                  {errors.name && <p style={{ fontFamily: SW, fontSize: 12, color: "#ef4444", marginTop: 6 }}>{errors.name.message}</p>}
                </div>
                <div>
                  <label style={{ display: "block", fontFamily: SW, fontSize: 13, fontWeight: 600, color: dark, marginBottom: 8, letterSpacing: "0.02em" }}>Job Type</label>
                  <select {...register("jobType")} 
                    style={{ ...inputSt(false, focusedField === "jobType", false), cursor: "pointer", appearance: "none" }}
                    onFocus={() => setFocusedField("jobType")} onBlur={() => setFocusedField(null)}>
                    <option value="IT">IT / Software</option>
                    <option value="NON_IT">Non-IT</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontFamily: SW, fontSize: 13, fontWeight: 600, color: dark, marginBottom: 8, letterSpacing: "0.02em" }}>Email Address</label>
                <input {...register("email", { required: "Email is required" })}
                  type="email" placeholder="you@example.com" 
                  style={inputSt(errors.email, focusedField === "email", false)}
                  onFocus={() => setFocusedField("email")} onBlur={() => setFocusedField(null)} />
                {errors.email && <p style={{ fontFamily: SW, fontSize: 12, color: "#ef4444", marginTop: 6 }}>{errors.email.message}</p>}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }}>
                <div>
                  <label style={{ display: "block", fontFamily: SW, fontSize: 13, fontWeight: 600, color: dark, marginBottom: 8, letterSpacing: "0.02em" }}>Password</label>
                  <div style={{ position: "relative" }}>
                    <input {...register("password", { required: "Required", minLength: { value: 6, message: "Min 6 chars" } })}
                      type={showPass ? "text" : "password"} placeholder="••••••••"
                      style={{ ...inputSt(errors.password, focusedField === "password", false), paddingRight: 44 }}
                      onFocus={() => setFocusedField("password")} onBlur={() => setFocusedField(null)} />
                    <EyeToggle show={showPass} onToggle={() => setShowPass(v => !v)} />
                  </div>
                  {errors.password && <p style={{ fontFamily: SW, fontSize: 12, color: "#ef4444", marginTop: 6 }}>{errors.password.message}</p>}
                </div>
                <div>
                  <label style={{ display: "block", fontFamily: SW, fontSize: 13, fontWeight: 600, color: dark, marginBottom: 8, letterSpacing: "0.02em" }}>Confirm Password</label>
                  <div style={{ position: "relative" }}>
                    <input {...register("confirmPassword", { required: "Required" })}
                      type={showConfirm ? "text" : "password"} placeholder="••••••••"
                      style={{ ...inputSt(errors.confirmPassword, focusedField === "confirmPassword", false), paddingRight: 44 }}
                      onFocus={() => setFocusedField("confirmPassword")} onBlur={() => setFocusedField(null)} />
                    <EyeToggle show={showConfirm} onToggle={() => setShowConfirm(v => !v)} />
                  </div>
                  {errors.confirmPassword && <p style={{ fontFamily: SW, fontSize: 12, color: "#ef4444", marginTop: 6 }}>{errors.confirmPassword.message}</p>}
                </div>
              </div>

              {apiError && (
                <div style={{ padding: "12px 16px", borderRadius: 12, background: "#fef2f2", color: "#dc2626", fontFamily: SW, fontSize: 13, border: "1px solid #fecaca", marginBottom: 16 }}>
                  {apiError}
                </div>
              )}

              {/* Homy Style Pill Button */}
              <button type="submit" disabled={loading} style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                background: dark, color: white, border: "none", borderRadius: 999, // Pill shape
                padding: "14px 24px", fontFamily: SW, fontWeight: 600, fontSize: 15,
                cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.8 : 1, marginBottom: 16,
                transition: "all 0.2s ease"
              }}
              onMouseEnter={e => !loading && (e.currentTarget.style.transform = "translateY(-1px)", e.currentTarget.style.boxShadow = "0 4px 12px rgba(8,11,15,0.2)")}
              onMouseLeave={e => !loading && (e.currentTarget.style.transform = "none", e.currentTarget.style.boxShadow = "none")}>
                {loading ? "Creating account…" : "Create Account"}
                {!loading && <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, background: white, color: dark, borderRadius: "50%", fontSize: 13, marginLeft: 4 }}>→</span>}
              </button>
            </form>

            <button type="button" onClick={() => { window.location.href = "http://localhost:8080/oauth2/authorization/google"; }}
              style={{ 
                width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, 
                padding: "14px 24px", borderRadius: 999, border: `1.5px solid ${borderCol}`, // Pill shape
                background: white, fontFamily: SW, fontSize: 15, fontWeight: 600, color: dark, 
                cursor: "pointer", transition: "all 0.2s ease", marginBottom: 16
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#f9f9f9"}
              onMouseLeave={e => e.currentTarget.style.background = white}>
              <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
            
            <p style={{ textAlign: "center", fontFamily: SW, fontSize: 13, color: gray, marginTop: 16, lineHeight: 1.6 }}>
              By creating an account, you agree to our <Link href="#" style={{ color: dark, fontWeight: 600, textDecoration: "none" }}>Terms</Link> and <Link href="#" style={{ color: dark, fontWeight: 600, textDecoration: "none" }}>Privacy</Link>.
            </p>

            <p style={{ textAlign: "center", fontFamily: SW, fontSize: 14, color: gray, marginTop: 16 }}>
              Already have an account? <Link href="/login" style={{ color: "#2563eb", fontWeight: 700, textDecoration: "none" }}>Sign in</Link>
            </p>
          </div>
        </div>

        {/* Right Visual Section (Image) */}
        <div style={{ flex: "0 0 45%", position: "relative", backgroundColor: "#f3f4f6", overflow: "hidden" }}>
          <img 
            src="/register.png" 
            alt="Register visual" 
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} 
          />
          {/* Subtle gradient overlay */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(255,255,255,0.05), transparent)" }} />
        </div>
      </div>
    </div>
  );
}
