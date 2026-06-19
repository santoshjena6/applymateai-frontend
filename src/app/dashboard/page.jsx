"use client";

import Sidebar from "@/components/Sidebar";
import StatsCard from "@/components/StatsCard";
import ApplicationTable from "@/components/ApplicationTable";
import JobCard from "@/components/JobCard";
import ResumeScoreWidget from "@/components/ResumeScoreWidget";
import JobMatchInsights from "@/components/JobMatchInsights";
import {
    BriefcaseIcon,
    CheckCircleIcon,
    UserGroupIcon,
    ChatBubbleLeftRightIcon,
    SparklesIcon,
    RocketLaunchIcon,
    BellIcon
} from "@heroicons/react/24/outline";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

const data = [
    { name: "Mon", apps: 4 },
    { name: "Tue", apps: 7 },
    { name: "Wed", apps: 5 },
    { name: "Thu", apps: 12 },
    { name: "Fri", apps: 9 },
    { name: "Sat", apps: 3 },
    { name: "Sun", apps: 2 },
];

const recommendedJobs = [
    { id: 1, title: "Senior Frontend Engineer", company: "Stripe", location: "Global / Remote", matchScore: 98, tags: ["Product", "Next.js", "Systems"] },
    { id: 2, title: "Product Designer", company: "Vercel", location: "San Francisco, CA", matchScore: 95, tags: ["UI/UX", "Design Systems", "Brand"] },
];

const recentApplications = [
    { company: "Google", position: "Senior Frontend Engineer", date: "Mar 08, 2026", status: "Interviewing" },
    { company: "Stripe", position: "Product Designer", date: "Mar 07, 2026", status: "Applied" },
    { company: "Vercel", position: "Fullstack Developer", date: "Mar 05, 2026", status: "Offer" },
    { company: "Linear", position: "Software Engineer", date: "Mar 02, 2026", status: "Rejected" },
];

export default function DashboardPage() {
    return (
        <div className="flex min-h-screen bg-white">
            <Sidebar />

            <main className="flex-1 lg:ml-64 p-8 overflow-x-hidden">
                {/* Header */}
                <header className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-slate-900">Dashboard</h1>
                        <p className="text-slate-400 font-medium mt-1">Ready to find your next career move, John?</p>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button className="relative p-2.5 bg-white rounded-xl border border-slate-100 text-slate-400 hover:text-blue-500 transition-all shadow-sm">
                            <BellIcon className="w-5 h-5" />
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
                        </button>
                        <button className="group px-6 py-3 bg-blue-600 text-white font-black text-sm rounded-xl hover:bg-blue-700 transition-all shadow-md flex items-center space-x-2">
                            <RocketLaunchIcon className="w-4 h-4" />
                            <span>Start Auto Apply</span>
                        </button>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <StatsCard
                        title="Total Found"
                        value="1,248"
                        trend="12%"
                        trendType="up"
                        icon={BriefcaseIcon}
                    />
                    <StatsCard
                        title="Total Applied"
                        value="42"
                        trend="18%"
                        trendType="up"
                        icon={CheckCircleIcon}
                    />
                    <StatsCard
                        title="Interviews"
                        value="8"
                        trend="5%"
                        trendType="up"
                        icon={ChatBubbleLeftRightIcon}
                    />
                    <StatsCard
                        title="Success Rate"
                        value="85%"
                        trend="2%"
                        trendType="up"
                        icon={UserGroupIcon}
                    />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 mb-10">
                    {/* Main Chart Section */}
                    <div className="xl:col-span-8 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-lg font-black text-slate-900">Application Activity</h3>
                                <p className="text-xs font-medium text-slate-400 mt-1">Tracking your daily application volume</p>
                            </div>
                            <select className="bg-white border border-slate-100 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 focus:outline-none focus:border-blue-200 shadow-sm">
                                <option>MAR 2026</option>
                                <option>FEB 2026</option>
                            </select>
                        </div>

                        <div className="h-[300px] w-full mt-4">
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={data}>
                                    <defs>
                                        <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: "#64748b", fontSize: 10, fontWeight: "600" }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: "#64748b", fontSize: 10, fontWeight: "600" }}
                                    />
                                    <Tooltip
                                        cursor={{ stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '5 5' }}
                                        contentStyle={{
                                            backgroundColor: "#ffffff",
                                            borderRadius: "12px",
                                            border: "1px solid #f1f5f9",
                                            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)",
                                            fontSize: '12px',
                                            fontWeight: '700'
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="apps"
                                        stroke="#3b82f6"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorApps)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* AI Insights & Suggestions */}
                    <div className="xl:col-span-4 flex flex-col gap-6">
                        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <SparklesIcon className="w-16 h-16 text-slate-900" />
                            </div>
                            <div className="flex items-center space-x-2 mb-6">
                                <SparklesIcon className="w-4 h-4 text-blue-600" />
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">AI Target Recommendation</h3>
                            </div>
                            <p className="text-sm font-medium text-slate-500 leading-relaxed mb-8 relative z-10">
                                Based on your profile, <span className="text-blue-600 font-bold underline decoration-blue-600/30">Stripe</span> is looking for candidates with your exact Next.js expertise.
                            </p>
                            <button className="w-full py-4 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-black transition-all flex items-center justify-center space-x-2 shadow-md">
                                <span>Apply Automatically</span>
                                <RocketLaunchIcon className="w-4 h-4" />
                            </button>
                        </div>

                        <JobMatchInsights />
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 mb-10">
                    {/* Recommended Jobs */}
                    <div className="xl:col-span-8">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-black text-slate-900">Recommended Roles</h3>
                            <button className="text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors">See all matches</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {recommendedJobs.map(job => (
                                <JobCard key={job.id} job={job} />
                            ))}
                        </div>
                    </div>

                    {/* Resume Score */}
                    <div className="xl:col-span-4">
                        <ResumeScoreWidget score={78} />
                    </div>
                </div>

                {/* Recent Applications Table */}
                <section className="mb-10">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-black text-slate-900">Recent Activity</h3>
                        <button className="text-xs font-bold text-slate-400 hover:text-blue-600 px-4 py-2 bg-slate-50 rounded-lg transition-all border border-slate-100 shadow-sm">View Applications</button>
                    </div>
                    <ApplicationTable applications={recentApplications} />
                </section>
            </main>
        </div>
    );
}
