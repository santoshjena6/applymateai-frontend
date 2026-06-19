"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    PaperAirplaneIcon,
    RocketLaunchIcon,
    PauseIcon,
    PlayIcon,
    ArrowUpTrayIcon,
    DocumentTextIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    SparklesIcon,
    AdjustmentsHorizontalIcon,
    EnvelopeIcon,
    GlobeAltIcon,
    LightBulbIcon,
    ChartBarIcon,
    ChevronRightIcon,
    BellIcon,
    ArrowPathIcon,
    AtSymbolIcon,
    LinkIcon
} from "@heroicons/react/24/outline";
import Sidebar from "@/components/Sidebar";

const EmailAutomation = () => {
    const [isAutoSend, setIsAutoSend] = useState(true);
    const [emailsPerDay, setEmailsPerDay] = useState(50);
    const [status, setStatus] = useState("idle"); // idle, running
    const [isPreviewMode, setIsPreviewMode] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [emailId, setEmailId] = useState("johndoe@gmail.com");
    const [isConnected, setIsConnected] = useState(true);
    
    const [aiEmail, setAiEmail] = useState(`Dear {hiring_manager_name},

I am writing to express my interest in the {job_title} position at {company_name}. With my background in software development and experience with {key_skills}, I am confident that I would be a valuable addition to your team.

Attached is my resume for your review. I look forward to the possibility of discussing how my skills and experiences align with the needs of {company_name}.

Best regards,
[Your Name]`);

    const addNotification = (message, type = "success") => {
        const id = Date.now();
        setNotifications([{ id, message, type }, ...notifications].slice(0, 3));
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 3000);
    };

    const toggleAutomation = () => {
        if (status === "running") {
            setStatus("idle");
            addNotification("Automation paused", "info");
        } else {
            setStatus("running");
            addNotification("Automation sequence started", "success");
        }
    };

    const stats = [
        { label: "Emails sent today", value: "24", icon: EnvelopeIcon, color: "text-blue-500" },
        { label: "Reply %", value: "12.5%", icon: ChartBarIcon, color: "text-green-500" },
    ];

    const logs = [
        { company: "Stripe", email: "talent@stripe.com", status: "Sent", time: "2 mins ago" },
        { company: "Linear", email: "jobs@linear.app", status: "Sent", time: "15 mins ago" },
        { company: "Scale AI", email: "hr@scale.com", status: "Failed", time: "45 mins ago" },
        { company: "Vercel", email: "recruiting@vercel.com", status: "Pending", time: "1 hour ago" },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0, 
            transition: { duration: 0.5, ease: "easeOut" } 
        }
    };

    return (
        <div className="flex min-h-screen bg-[#F8FAFC]">
            <Sidebar />
            
            {/* Toast System */}
            <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3">
                <AnimatePresence>
                    {notifications.map(n => (
                        <motion.div
                            key={n.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border border-white/20 backdrop-blur-md ${
                                n.type === "success" ? "bg-slate-900 text-white" : "bg-blue-600 text-white"
                            }`}
                        >
                            {n.type === "success" ? <CheckCircleIcon className="w-5 h-5 text-green-400" /> : <BellIcon className="w-5 h-5 text-white" />}
                            <span className="text-sm font-bold">{n.message}</span>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
            
            <main className="flex-1 lg:ml-64 p-8 max-w-[1600px]">
                {/* 1. Page Header */}
                <header className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-slate-900">Email Automation</h1>
                        <p className="text-slate-400 font-medium mt-1">Automate job applications via smart email outreach</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2.5 bg-white rounded-xl border border-slate-100 text-slate-400 hover:text-blue-500 transition-all shadow-sm">
                            <BellIcon className="w-5 h-5" />
                        </button>
                        <button 
                            onClick={toggleAutomation}
                            className={`px-8 py-3 rounded-xl font-black text-sm transition-all shadow-md flex items-center gap-2 ${
                                status === "running" 
                                ? "bg-slate-900 text-white hover:bg-black" 
                                : "bg-blue-600 text-white hover:bg-blue-700"
                            }`}
                        >
                            {status === "running" ? (
                                <><PauseIcon className="w-4 h-4" /> Stop Automation</>
                            ) : (
                                <><RocketLaunchIcon className="w-4 h-4" /> Start Automation</>
                            )}
                        </button>
                    </div>
                </header>

                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 xl:grid-cols-12 gap-8"
                >
                    {/* Left & Middle Column */}
                    <div className="xl:col-span-8 space-y-8">
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* 2. Campaign Setup Card */}
                            <motion.section variants={itemVariants} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
                                <div className="flex items-center gap-3 mb-6">
                                    <AdjustmentsHorizontalIcon className="w-5 h-5 text-blue-600" />
                                    <h2 className="text-lg font-black text-slate-900">Campaign Setup</h2>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Job Role</label>
                                        <input type="text" placeholder="e.g. Frontend Engineer" className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-bold text-sm" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Keywords</label>
                                            <input type="text" placeholder="React, Node..." className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-bold text-sm" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Location</label>
                                            <input type="text" placeholder="Remote" className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-bold text-sm" />
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-slate-50">
                                        <div className="flex justify-between items-center mb-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Emails per day</label>
                                            <span className="text-sm font-black text-blue-600">{emailsPerDay}</span>
                                        </div>
                                        <input 
                                            type="range" min="10" max="100" value={emailsPerDay} 
                                            onChange={(e) => setEmailsPerDay(e.target.value)}
                                            className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-blue-600 mb-6"
                                        />
                                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100/50">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black text-slate-700">Auto Send</span>
                                                <span className="text-[9px] font-bold text-slate-400 uppercase">Automation Mode</span>
                                            </div>
                                            <button 
                                                onClick={() => setIsAutoSend(!isAutoSend)}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all ${isAutoSend ? 'bg-blue-600' : 'bg-slate-200'}`}
                                            >
                                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all shadow-sm ${isAutoSend ? 'translate-x-6' : 'translate-x-1'}`} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.section>

                            {/* 5. Email Connection Card */}
                            <motion.section variants={itemVariants} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md h-full flex flex-col">
                                <div className="flex items-center gap-3 mb-6">
                                    <LinkIcon className="w-5 h-5 text-blue-600" />
                                    <h2 className="text-lg font-black text-slate-900">Email Connection</h2>
                                </div>
                                <div className="space-y-6 flex-1 flex flex-col justify-between">
                                    <div className="space-y-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Connected Email ID</label>
                                            <div className="relative">
                                                <AtSymbolIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                                <input 
                                                    type="email" 
                                                    value={emailId} 
                                                    readOnly
                                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-50 bg-slate-50 text-slate-500 font-bold text-sm" 
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-100">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                            <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Status: Connected</span>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <button className="w-full py-3 bg-white border border-slate-100 rounded-xl font-black text-xs text-slate-900 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-sm">
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_Reference_Logo.svg" className="w-4 h-4" alt="Google" />
                                            Connect Gmail
                                        </button>
                                        <p className="text-[10px] text-center text-slate-300 font-bold uppercase italic">
                                            Secure SMTP integration
                                        </p>
                                    </div>
                                </div>
                            </motion.section>
                        </div>

                        {/* 3. AI Email Generator Card */}
                        <motion.section variants={itemVariants} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <SparklesIcon className="w-5 h-5 text-blue-600" />
                                    <h2 className="text-lg font-black text-slate-900">AI Email Generator</h2>
                                </div>
                                <div className="flex gap-2">
                                    {['company_name', 'job_title'].map(v => (
                                        <span key={v} className="px-2.5 py-1 bg-slate-50 text-slate-400 text-[10px] font-black uppercase rounded-lg border border-slate-100">
                                            {`{${v}}`}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="relative mb-6">
                                <textarea 
                                    value={aiEmail}
                                    onChange={(e) => setAiEmail(e.target.value)}
                                    className="w-full p-6 h-[300px] rounded-xl border border-slate-100 bg-slate-50/30 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 font-medium text-slate-700 leading-relaxed text-sm resize-none"
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button className="flex-1 px-8 py-4 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-md">
                                    <SparklesIcon className="w-4 h-4" />
                                    Generate Email
                                </button>
                                <button className="px-8 py-4 bg-white border border-slate-100 text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-sm">
                                    <ArrowPathIcon className="w-4 h-4" />
                                    Regenerate
                                </button>
                            </div>
                        </motion.section>

                        {/* 6. Activity / Logs Table */}
                        <motion.section variants={itemVariants} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="p-8 pb-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <ClockIcon className="w-5 h-5 text-blue-600" />
                                    <h2 className="text-lg font-black text-slate-900">Activity Logs</h2>
                                </div>
                            </div>

                            <div className="overflow-x-auto min-h-[300px]">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-slate-50/50">
                                            <th className="text-left px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">Company</th>
                                            <th className="text-left px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">Email</th>
                                            <th className="text-left px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">Status</th>
                                            <th className="text-left px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">Time</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {logs.map((log, idx) => (
                                            <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-8 py-5 text-sm font-black text-slate-700">{log.company}</td>
                                                <td className="px-8 py-5 text-sm font-bold text-slate-400 lowercase">{log.email}</td>
                                                <td className="px-8 py-5">
                                                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                                        log.status === 'Sent' ? 'bg-green-50 text-green-600' : 
                                                        log.status === 'Failed' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'
                                                    }`}>
                                                        <div className={`w-1.5 h-1.5 rounded-full ${
                                                            log.status === 'Sent' ? 'bg-green-500' : 
                                                            log.status === 'Failed' ? 'bg-rose-500' : 'bg-blue-500'
                                                        }`} />
                                                        {log.status}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5 text-[11px] font-bold text-slate-400">{log.time}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.section>
                    </div>

                    {/* Right Side Panel */}
                    <div className="xl:col-span-4 space-y-8">
                        {/* 4. Resume Attachment Card */}
                        <motion.section variants={itemVariants} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
                             <div className="flex items-center gap-3 mb-8">
                                <DocumentTextIcon className="w-5 h-5 text-blue-600" />
                                <h2 className="text-lg font-black text-slate-900">Active Resume</h2>
                            </div>
                            
                            <div className="p-6 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50 group cursor-pointer hover:border-blue-200 transition-all">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center">
                                        <DocumentTextIcon className="w-6 h-6 text-rose-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-slate-900">Frontend_Resume.pdf</p>
                                        <p className="text-[10px] font-bold text-slate-400">1.2 MB • Updated 2 days ago</p>
                                    </div>
                                </div>
                                <div className="h-32 bg-white rounded-lg border border-slate-100 flex items-center justify-center mb-6">
                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Resume Preview UI</span>
                                </div>
                                <button className="w-full py-3 bg-white border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm">
                                    Change Resume
                                </button>
                            </div>
                        </motion.section>

                        {/* 7. Stats & AI Tips */}
                        <motion.section variants={itemVariants} className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden">
                             <div className="absolute top-0 right-0 p-4 opacity-5">
                                <SparklesIcon className="w-20 h-20" />
                            </div>
                            
                            <h3 className="text-sm font-bold uppercase tracking-widest mb-10 text-white/50">Automation Stats</h3>
                            
                            <div className="grid grid-cols-2 gap-4 mb-12">
                                {stats.map((stat, idx) => (
                                    <div key={idx} className="p-5 bg-white/5 rounded-2xl border border-white/5">
                                        <stat.icon className={`w-4 h-4 mb-3 ${stat.color}`} />
                                        <p className="text-2xl font-black tracking-tight">{stat.value}</p>
                                        <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mt-1">{stat.label}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 px-2">AI Optimization Tips</h3>
                                <div className="space-y-4">
                                    <div className="flex gap-4 p-5 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                                        <div className="w-10 h-10 rounded-xl bg-orange-400/10 flex items-center justify-center flex-shrink-0">
                                            <LightBulbIcon className="w-5 h-5 text-orange-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-white group-hover:text-amber-400 transition-colors">Improve response rate</p>
                                            <p className="text-[10px] text-white/40 mt-1 font-medium leading-relaxed">Add a specific question about the team's tech stack to boost direct engagement.</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 p-5 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                                        <div className="w-10 h-10 rounded-xl bg-blue-400/10 flex items-center justify-center flex-shrink-0">
                                            <SparklesIcon className="w-5 h-5 text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-white group-hover:text-blue-400 transition-colors">Personalization suggestion</p>
                                            <p className="text-[10px] text-white/40 mt-1 font-medium leading-relaxed">Mention the specific project they recently launched on Product Hunt.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.section>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default EmailAutomation;
