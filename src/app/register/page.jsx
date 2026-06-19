"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { BriefcaseIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function RegisterPage() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true);
        // Simulate registration
        setTimeout(() => {
            router.push("/dashboard");
            setLoading(false);
        }, 1500);
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
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Create Account</h2>
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-2">Join professionals using AI</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 relative">
                    <div>
                        <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Full Name</label>
                        <input
                            {...register("name", { required: "Name is required" })}
                            type="text"
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:border-blue-600 focus:bg-white text-sm font-bold text-slate-900 outline-none transition-all placeholder:text-slate-300"
                            placeholder="John Doe"
                        />
                        {errors.name && <p className="text-rose-500 text-[10px] font-bold mt-1.5 px-1">{errors.name.message}</p>}
                    </div>

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
                            {...register("password", { required: "Password is required", minLength: { value: 6, message: "At least 6 characters" } })}
                            type="password"
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:border-blue-600 focus:bg-white text-sm font-bold text-slate-900 outline-none transition-all placeholder:text-slate-300"
                            placeholder="••••••••"
                        />
                        {errors.password && <p className="text-rose-500 text-[10px] font-bold mt-1.5 px-1">{errors.password.message}</p>}
                    </div>

                    <div className="pt-4">
                        <button
                            disabled={loading}
                            type="submit"
                            className="w-full py-4 bg-blue-600 text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-700 transition-all shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <SparklesIcon className="w-4 h-4" />
                                    <span>Create Account</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-50">
                    <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Already have an account?{" "}
                        <Link href="/login" className="text-blue-600 hover:text-blue-700 transition-colors ml-1">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
