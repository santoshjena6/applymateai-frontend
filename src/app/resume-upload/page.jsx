"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import ResumeUpload from "@/components/ResumeUpload";
import JobCard from "@/components/JobCard";
import { SparklesIcon, CheckBadgeIcon } from "@heroicons/react/24/outline";

export default function ResumeUploadPage() {
    const [jobs, setJobs] = useState([]);
    const [hasUploaded, setHasUploaded] = useState(false);

    const handleUploadSuccess = (jobList) => {
        setJobs(jobList);
        setHasUploaded(true);
    };

    return (
        <div className="flex min-h-screen bg-white">
            <Sidebar />

            <main className="flex-1 lg:ml-64 p-6 lg:p-10">
                <header className="mb-8">
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Resume & Match Engine</h1>
                    <p className="text-slate-400 text-[10px] uppercase tracking-widest font-black mt-1">Real-time Job Analysis Active</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-3 space-y-12">
                        <section>
                            <ResumeUpload />
                        </section>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-slate-900 p-6 rounded-2xl text-white relative overflow-hidden group shadow-md">
                            <div className="absolute top-0 right-0 p-3 opacity-20">
                                <SparklesIcon className="w-8 h-8" />
                            </div>
                            <h3 className="text-sm font-black mb-1 relative z-10 uppercase tracking-widest">Premium</h3>
                            <p className="text-[10px] text-white/60 mb-6 relative z-10 leading-relaxed">
                                Get prioritized AI applications and direct recruiter matching.
                            </p>
                            <button className="w-full py-3 bg-white text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-slate-50 transition-all relative z-10">
                                Upgrade Plan
                            </button>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                            <h3 className="text-[10px] font-black text-slate-400 mb-6 flex items-center uppercase tracking-widest">
                                AI Insights
                            </h3>
                            <div className="space-y-4">
                                {[
                                    "Optimize Summary for Senior roles.",
                                    "Quantify impact with metrics.",
                                    "Add AI SaaS keywords."
                                ].map((tip, i) => (
                                    <div key={i} className="flex items-start">
                                        <CheckBadgeIcon className="w-4 h-4 text-emerald-500 mt-0.5 mr-3 shrink-0" />
                                        <p className="text-xs font-medium text-slate-600 leading-snug">{tip}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
