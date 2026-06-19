"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { BriefcaseIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function LoginPage() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { login } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const onSubmit = async (data) => {
        setLoading(true);
        setError("");
        try {
            await login(data.email, data.password);
            router.push("/dashboard");
        } catch (err) {
            setError("Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-50/50 blur-3xl rounded-full" />

                <div className="text-center mb-8 relative">
                    <Link href="/" className="inline-flex items-center space-x-2 mb-4">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                            <BriefcaseIcon className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-black tracking-tight text-slate-900">
                            ApplyMate <span className="text-blue-600">AI</span>
                        </span>
                    </Link>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Welcome Back</h2>
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-2">Sign in to continue your journey</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 relative">
                    <div>
                        <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Email Address</label>
                        <input
                            {...register("email", { required: "Email is required" })}
                            type="email"
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:border-blue-600 focus:bg-white text-sm font-bold text-slate-900 outline-none transition-all placeholder:text-slate-300"
                            placeholder="name@example.com"
                        />
                        {errors.email && <p className="text-rose-500 text-[10px] font-bold mt-1.5 px-1">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Password</label>
                        <input
                            {...register("password", { required: "Password is required" })}
                            type="password"
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:border-blue-600 focus:bg-white text-sm font-bold text-slate-900 outline-none transition-all placeholder:text-slate-300"
                            placeholder="••••••••"
                        />
                        {errors.password && <p className="text-rose-500 text-[10px] font-bold mt-1.5 px-1">{errors.password.message}</p>}
                    </div>

                    {error && <p className="text-rose-500 text-[10px] font-bold text-center mt-1.5">{error}</p>}

                    <div className="pt-4">
                        <button
                            disabled={loading}
                            type="submit"
                            className="w-full py-4 bg-blue-600 text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-700 transition-all shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </div>
                </form>

                <div className="mt-8 relative pt-6 border-t border-slate-50">
                    <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        New to ApplyMate AI?{" "}
                        <Link href="/register" className="text-blue-600 hover:text-blue-700 transition-colors ml-1">
                            Create an account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
