"use client";

import { useState } from "react";
import Link from "next/link";
import { EnvelopeIcon, ArrowLeftIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim()) { setError("Please enter your email."); return; }
        setError("");
        setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email.trim().toLowerCase() }),
            });
            setSent(true);
        } catch {
            setError("Network error. Please check your connection and try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex w-full bg-white font-sans">
            {/* Left Panel - Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-between p-8 sm:p-12 lg:p-16 xl:p-24 relative z-10">
                {/* Header / Logo */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#080B0F] to-[#1A1F26] flex items-center justify-center">
                        <span className="text-white font-black text-lg">J</span>
                    </div>
                    <span className="font-heading font-black text-2xl text-gray-900 tracking-tight">Joblenso</span>
                </div>

                {/* Main Content */}
                <div className="w-full max-w-md mx-auto my-auto">
                    <Link href="/login" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium group mb-10">
                        <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to login
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {!sent ? (
                            <>
                                <h1 className="font-heading text-4xl font-bold text-gray-900 mb-4">
                                    Forgot password?
                                </h1>
                                <p className="text-gray-500 text-base leading-relaxed mb-8">
                                    No worries, we'll send you reset instructions. Enter the email address associated with your account.
                                </p>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="block text-sm font-semibold text-gray-900">
                                            Email address
                                        </label>
                                        <div className="relative group">
                                            <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors duration-200" />
                                            <input
                                                id="email"
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="Enter your email"
                                                required
                                                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 focus:bg-white transition-all duration-300"
                                            />
                                        </div>
                                    </div>

                                    {error && (
                                        <p className="text-sm text-red-500 bg-red-50 py-2.5 px-4 rounded-lg font-medium">
                                            {error}
                                        </p>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className={`w-full py-4 rounded-xl text-white font-semibold transition-all duration-300 flex items-center justify-center gap-2
                                            ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-gray-900 hover:bg-gray-800 shadow-xl shadow-gray-900/10 hover:shadow-gray-900/20"}
                                        `}
                                    >
                                        {loading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Sending...
                                            </>
                                        ) : (
                                            "Reset password"
                                        )}
                                    </button>
                                </form>
                            </>
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <div className="w-16 h-16 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center mb-6">
                                    <CheckCircleIcon className="w-8 h-8 text-green-600" />
                                </div>
                                <h1 className="font-heading text-4xl font-bold text-gray-900 mb-4">
                                    Check your email
                                </h1>
                                <p className="text-gray-500 text-base leading-relaxed mb-8">
                                    We have sent a password reset link to <span className="font-semibold text-gray-900">{email}</span>. Click the link to reset your password.
                                </p>

                                <div className="space-y-4">
                                    <p className="text-sm text-gray-500">
                                        Didn't receive the email? Check your spam folder or
                                    </p>
                                    <button
                                        onClick={() => { setSent(false); setEmail(""); }}
                                        className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                                    >
                                        Click here to try again
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                </div>

                {/* Footer placeholder */}
                <div className="text-sm text-gray-400 mt-12">
                    &copy; {new Date().getFullYear()} Joblenso. All rights reserved.
                </div>
            </div>

            {/* Right Panel - Visual */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-[#080B0F] overflow-hidden items-center justify-center p-12">
                {/* Background effects */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                    <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-indigo-600/30 blur-[120px]"></div>
                    <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-violet-600/20 blur-[100px]"></div>
                    
                    {/* Grid pattern overlay */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
                </div>

                {/* Floating UI Elements */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="relative z-10 max-w-lg"
                >
                    <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
                        <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/30">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-heading font-bold text-white mb-4 leading-tight">
                            Secure & fast access to your account.
                        </h2>
                        <p className="text-gray-300 text-lg leading-relaxed">
                            Regain access in seconds. Your security is our top priority, ensuring your job search journey remains uninterrupted and safe.
                        </p>
                        
                        <div className="mt-8 pt-8 border-t border-white/10 flex items-center gap-4">
                            <div className="flex -space-x-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className={`w-10 h-10 rounded-full border-2 border-[#080B0F] bg-gradient-to-br from-indigo-${300 + i*100} to-violet-${400 + i*100}`}></div>
                                ))}
                            </div>
                            <p className="text-sm font-medium text-gray-300">
                                Trusted by <span className="text-white font-bold">10k+</span> professionals
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

