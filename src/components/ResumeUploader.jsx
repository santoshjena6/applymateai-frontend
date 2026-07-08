"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    CloudArrowUpIcon,
    DocumentTextIcon,
    XMarkIcon,
    RocketLaunchIcon,
} from "@heroicons/react/24/outline";

const ResumeUploader = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isAutomationRunning, setIsAutomationRunning] = useState(false);
    const fileInputRef = useRef(null);

    const skills = ["Java", "Spring Boot", "REST API", "MySQL", "React", "Next.js", "Tailwind CSS"];
    const topMatches = [
        { company: "Stripe", role: "Sr. Frontend", score: 98 },
        { company: "Vercel", role: "UI Engineer", score: 95 },
        { company: "Linear", role: "Product Dev", score: 92 },
    ];

    const handleFileSelect = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            simulateUpload();
        }
    };

    const simulateUpload = () => {
        setUploading(true);
        setProgress(0); // Ensure progress starts at 0
        
        const interval = setInterval(() => {
            setProgress((prev) => {
                const next = prev + Math.floor(Math.random() * 10) + 5; // Add 5-15% randomly
                if (next >= 100) {
                    clearInterval(interval);
                    setUploading(false);
                    return 100;
                }
                return next;
            });
        }, 400); // Slower interval (400ms) to simulate actual scanning/processing
    };

    const removeFile = () => {
        setFile(null);
        setProgress(0);
        setUploading(false);
        setIsAutomationRunning(false);
    };

    const startAutomation = () => {
        setIsAutomationRunning(true);
    };

    return (
        <div className="max-w-4xl mx-auto py-2">
            <AnimatePresence mode="wait">
                {!file ? (
                    <motion.div
                        key="minimalist-upload"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        onClick={() => fileInputRef.current.click()}
                        className="bg-white border border-slate-200 p-12 rounded-[1.5rem] hover:border-slate-300 transition-all cursor-pointer group text-center shadow-sm"
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            className="hidden"
                            accept=".pdf,.doc,.docx"
                        />
                        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-50 transition-colors border border-slate-100">
                            <CloudArrowUpIcon className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Let AI Apply Jobs For You</h3>
                        <p className="mt-3 text-slate-400 max-w-sm mx-auto font-black text-[10px] uppercase tracking-widest leading-relaxed">
                            Upload your resume to start the job automation experience.
                        </p>
                    </motion.div>
                ) : (
                    <motion.div
                        key="minimalist-analysis"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* Compact Resume Detail */}
                        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex items-center justify-between gap-4">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                                    <DocumentTextIcon className="w-6 h-6 text-slate-400" />
                                </div>
                                <div className="min-w-0">
                                    <h4 className="text-sm font-black text-slate-900 truncate max-w-[200px] uppercase tracking-tight">{file.name}</h4>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                                        {progress >= 100 ? "Analysis complete • 82/100" : `Scanning Resume... ${progress}%`}
                                    </p>
                                </div>
                            </div>

                            {!uploading && (
                                <button onClick={removeFile} className="text-[10px] font-black text-slate-400 hover:text-rose-500 transition-colors uppercase tracking-widest flex items-center shrink-0">
                                    <XMarkIcon className="w-4 h-4 mr-1.5" />
                                    Change File
                                </button>
                            )}
                        </div>

                        {/* Progress Bar */}
                        {uploading && (
                            <div className="px-1">
                                <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden border border-slate-100">
                                    <motion.div
                                        className="bg-blue-600 h-full rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        {progress >= 100 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-8"
                            >
                                {/* Expertise */}
                                <div className="space-y-4">
                                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Detected Expertise</h5>
                                    <div className="flex flex-wrap gap-2">
                                        {skills.map((skill, index) => (
                                            <motion.span
                                                key={skill}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 hover:border-blue-100 transition-colors cursor-default"
                                            >
                                                {skill}
                                            </motion.span>
                                        ))}
                                    </div>
                                </div>

                                {/* Matches */}
                                <div className="space-y-4">
                                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Job Distribution</h5>
                                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm">
                                        <p className="text-[11px] font-black text-slate-600 uppercase tracking-widest">34 matched roles</p>
                                        <div className="flex -space-x-2">
                                            {topMatches.map((m, i) => (
                                                <div key={i} className="w-8 h-8 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-[11px] font-black text-blue-600 shadow-sm">
                                                    {m.company.charAt(0)}
                                                </div>
                                            ))}
                                            <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-[11px] font-black text-white shadow-sm ring-2 ring-white">+31</div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {progress >= 100 && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col items-center space-y-6 pt-6"
                            >
                                <div className="inline-flex items-center space-x-3 px-4 py-2 bg-slate-50 border border-slate-100 text-slate-600 rounded-full shadow-sm">
                                    <div className={`w-2 h-2 rounded-full ${isAutomationRunning ? "bg-blue-600 animate-pulse" : "bg-emerald-500 shadow-sm ring-4 ring-emerald-500/10 animate-pulse"}`} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">
                                        {isAutomationRunning ? "Tactical Automation Active" : "Neural Scan Ready"}
                                    </span>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={startAutomation}
                                    disabled={isAutomationRunning}
                                    className={`w-full max-w-md px-12 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-300 shadow-xl relative overflow-hidden group ${isAutomationRunning
                                        ? "bg-slate-50 text-slate-400 border border-slate-100 cursor-not-allowed"
                                        : "bg-blue-600 text-white hover:bg-black shadow-blue-600/10"
                                        }`}
                                >
                                    <div className="flex items-center justify-center space-x-3 relative z-10">
                                        <RocketLaunchIcon className={`w-5 h-5 ${!isAutomationRunning && "group-hover:animate-bounce"}`} />
                                        <span>{isAutomationRunning ? "Automation in Progress" : "Let AI Apply Jobs For You"}</span>
                                    </div>
                                    {!isAutomationRunning && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] transition-transform" />
                                    )}
                                </motion.button>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ResumeUploader;
