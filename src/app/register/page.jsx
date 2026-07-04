"use client";

// Register page - centered white card with password strength indicator
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { authService } from "@/services/api";
import { getErrorMessage } from "@/utils/errorMessage";

// Evaluate password strength (0-4)
function getStrength(pw) {
    let s = 0;
    if (pw.length >= 8)           s++;
    if (/[A-Z]/.test(pw))         s++;
    if (/[0-9]/.test(pw))         s++;
    if (/[^A-Za-z0-9]/.test(pw))  s++;
    return s;
}

const strengthColors = ["#E5E7EB", "#EF4444", "#F59E0B", "#F59E0B", "#10B981"];
const strengthLabels = ["",         "Weak",    "Fair",    "Good",    "Strong"];

export default function RegisterPage() {
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const router = useRouter();
    const [loading, setLoading]         = useState(false);
    const [error, setError]             = useState("");
    const [showPass, setShowPass]       = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // Watch password for strength bar
    const password = watch("password", "");
    const strength = getStrength(password);

    const onSubmit = async (data) => {
        console.log("onSubmit reached - form data:", data);
        if (data.password !== data.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        setLoading(true);
        setError("");
        try {
            const res = await authService.register(data.name, data.email, data.password, data.jobType);
            const { token, refreshToken, email, name, role, jobCategory } = res.data;
            localStorage.setItem("applync_token", token);
            localStorage.setItem("applync_refresh_token", refreshToken);
            // New registrations have no resume yet — jobCategory will be set after upload
            localStorage.setItem("applync_user", JSON.stringify({ email, name, role, jobCategory: jobCategory || null }));
            router.push("/resume-upload");
        } catch (err) {
            setError(getErrorMessage(err, "register"));
        } finally {
            setLoading(false);
        }
    };

    // Shared input focus/blur handlers
    const onFocus = (e) => { e.target.style.borderColor = "#4F46E5"; e.target.style.boxShadow = "0 0 0 3px rgba(79,70,229,0.1)"; };
    const onBlur  = (e) => { e.target.style.borderColor = "#E5E7EB"; e.target.style.boxShadow = "none"; };

    const inputStyle = {
        backgroundColor: "#FFFFFF",
        border: "1px solid #E5E7EB",
        color: "#111827",
    };

    return (
        // Full-page light-gray background
        <div className="min-h-screen flex items-center justify-center px-4 py-10" style={{ backgroundColor: "#F8FAFC" }}>

            {/* Centered white card */}
            <div
                className="w-full max-w-md rounded-2xl p-8"
                style={{ backgroundColor: "#FFFFFF", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", border: "1px solid #E5E7EB" }}
            >
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2 mb-8">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center brand-gradient">
                        <span className="text-white text-xs font-black">A</span>
                    </div>
                    <span className="text-lg font-black tracking-tight" style={{ color: "#4F46E5" }}>Joblenso</span>
                </Link>

                {/* Heading */}
                <div className="mb-6">
                    <h1 className="text-2xl font-black" style={{ color: "#111827" }}>Create your account</h1>
                    <p className="text-sm mt-1" style={{ color: "#6B7280" }}>Start finding your dream job with AI.</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit, (validationErrors) => {
                    console.error("Form blocked by validation errors:", validationErrors);
                })} className="space-y-4">
                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-semibold mb-1.5" style={{ color: "#374151" }}>Full Name</label>
                        <input
                            {...register("name", { required: "Name is required" })}
                            type="text"
                            placeholder="John Doe"
                            className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                            style={inputStyle}
                            onFocus={onFocus} onBlur={onBlur}
                        />
                        {errors.name && (
                            <p className="mt-1 text-xs font-medium" style={{ color: "#EF4444" }}>{errors.name.message}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-semibold mb-1.5" style={{ color: "#374151" }}>Email Address</label>
                        <input
                            {...register("email", { required: "Email is required" })}
                            type="email"
                            placeholder="you@example.com"
                            className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                            style={inputStyle}
                            onFocus={onFocus} onBlur={onBlur}
                        />
                        {errors.email && (
                            <p className="mt-1 text-xs font-medium" style={{ color: "#EF4444" }}>{errors.email.message}</p>
                        )}
                    </div>

                    {/* Job Type */}
                    <div>
                        <label className="block text-sm font-semibold mb-1.5" style={{ color: "#374151" }}>Job Type</label>
                        <select
                            {...register("jobType")}
                            className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all cursor-pointer"
                            style={inputStyle}
                            onFocus={onFocus} onBlur={onBlur}
                        >
                            <option value="IT">IT / Software</option>
                            <option value="NON_IT">Non-IT</option>
                        </select>
                    </div>

                    {/* Password with strength bar */}
                    <div>
                        <label className="block text-sm font-semibold mb-1.5" style={{ color: "#374151" }}>Password</label>
                        <div className="relative">
                            <input
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: { value: 6, message: "At least 6 characters" },
                                })}
                                type={showPass ? "text" : "password"}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 pr-11 rounded-xl text-sm outline-none transition-all"
                                style={inputStyle}
                                onFocus={onFocus} onBlur={onBlur}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass(!showPass)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                                style={{ color: "#9CA3AF" }}
                            >
                                {showPass ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="mt-1 text-xs font-medium" style={{ color: "#EF4444" }}>{errors.password.message}</p>
                        )}
                        {/* Strength bar - shown once user starts typing */}
                        {password.length > 0 && (
                            <div className="mt-2 space-y-1">
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div
                                            key={i}
                                            className="h-1 flex-1 rounded-full transition-all"
                                            style={{ backgroundColor: i <= strength ? strengthColors[strength] : "#E5E7EB" }}
                                        />
                                    ))}
                                </div>
                                {strength > 0 && (
                                    <p className="text-[11px] font-semibold" style={{ color: strengthColors[strength] }}>
                                        {strengthLabels[strength]}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-semibold mb-1.5" style={{ color: "#374151" }}>Confirm Password</label>
                        <div className="relative">
                            <input
                                {...register("confirmPassword", { required: "Please confirm your password" })}
                                type={showConfirm ? "text" : "password"}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 pr-11 rounded-xl text-sm outline-none transition-all"
                                style={inputStyle}
                                onFocus={onFocus} onBlur={onBlur}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                                style={{ color: "#9CA3AF" }}
                            >
                                {showConfirm ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="mt-1 text-xs font-medium" style={{ color: "#EF4444" }}>{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    {/* API error */}
                    {error && (
                        <div
                            className="px-4 py-3 rounded-xl text-sm font-medium"
                            style={{ backgroundColor: "#FEE2E2", color: "#DC2626", border: "1px solid #FECACA" }}
                        >
                            {error}
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-xl text-sm font-semibold text-white brand-gradient hover:opacity-90 transition-all disabled:opacity-60 flex items-center justify-center glow-brand"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            "Create Account"
                        )}
                    </button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-3 mt-6">
                    <div className="flex-1 h-px" style={{ backgroundColor: '#E5E7EB' }} />
                    <span className="text-xs font-medium" style={{ color: '#9CA3AF' }}>or continue with</span>
                    <div className="flex-1 h-px" style={{ backgroundColor: '#E5E7EB' }} />
                </div>

                {/* Google Sign-In button */}
                <button
                    type="button"
                    onClick={() => { window.location.href = 'http://localhost:8080/oauth2/authorization/google'; }}
                    className="w-full mt-4 flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold transition-colors hover:bg-gray-50"
                    style={{ backgroundColor: '#FFFFFF', border: '1px solid #D1D5DB', color: '#374151' }}
                >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                        <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                        <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                </button>

                {/* Login link */}
                <p className="text-center text-sm mt-5" style={{ color: "#6B7280" }}>
                    Already have an account?{" "}
                    <Link href="/login" className="font-semibold" style={{ color: "#4F46E5" }}>Sign in</Link>
                </p>
            </div>
        </div>
    );
}
