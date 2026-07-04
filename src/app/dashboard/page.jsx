"use client";

// Dashboard — KPI cards, activity chart, and recent applications table
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import KpiCard from "@/components/KpiCard";
import StatusChip from "@/components/StatusChip";
import SkeletonLoader from "@/components/SkeletonLoader";
import {
    BriefcaseIcon,
    CheckCircleIcon,
    UserGroupIcon,
    ChatBubbleLeftRightIcon,
    BellIcon,
    DocumentArrowUpIcon,
} from "@heroicons/react/24/outline";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { applicationService } from "@/services/api";
import { getErrorMessage } from "@/utils/errorMessage";

// Mock weekly chart data (replaced by real data when API is ready)
const chartData = [
    { name: "Mon", apps: 4 }, { name: "Tue", apps: 7 }, { name: "Wed", apps: 5 },
    { name: "Thu", apps: 12 }, { name: "Fri", apps: 9 }, { name: "Sat", apps: 3 }, { name: "Sun", apps: 2 },
];

export default function DashboardPage() {
    const router = useRouter();
    const [stats, setStats]     = useState(null);
    const [apps, setApps]       = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState("");
    const [userName, setUserName] = useState("there");

    useEffect(() => {
        // OAuth callback — Spring Boot redirects here with ?token=<jwt>
        // Save it to localStorage then clean the URL so it doesn't persist on refresh
        const params = new URLSearchParams(window.location.search);
        const oauthToken = params.get("token");
        if (oauthToken) {
            localStorage.setItem("applync_token", oauthToken);
            router.replace("/dashboard");
            return;
        }

        // Auth guard — redirect if no token
        const token = localStorage.getItem("applync_token");
        if (!token) { router.replace("/login"); return; }

        // Read user name from storage
        try {
            const raw = localStorage.getItem("applync_user");
            if (raw) {
                const u = JSON.parse(raw);
                setUserName(u.name || "there");
            }
        } catch {}

        // Fetch stats and recent applications
        const fetchData = async () => {
            try {
                const [statsRes, appsRes] = await Promise.all([
                    applicationService.getStats(),
                    applicationService.getAll(),
                ]);
                setStats(statsRes.data);
                setApps((appsRes.data || []).slice(0, 5));
            } catch (err) {
                if (err.response?.status !== 401) {
                    setError(getErrorMessage(err));
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [router]);

    return (
        <div className="flex min-h-screen" style={{ backgroundColor: "#F8FAFC" }}>
            <Sidebar />

            {/* Main content — offset by sidebar width on large screens */}
            <main className="flex-1 lg:ml-64 p-6 lg:p-8 overflow-x-hidden">

                {/* ── Page Header ── */}
                <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-black" style={{ color: "#111827" }}>Dashboard</h1>
                        <p className="text-sm mt-0.5" style={{ color: "#6B7280" }}>
                            Welcome back, <span style={{ color: "#4F46E5", fontWeight: 700 }}>{userName}</span> 👋
                        </p>
                    </div>
                    <div className="flex items-center space-x-3">
                        {/* Notification bell */}
                        <button
                            className="relative p-2.5 rounded-xl bg-white transition-colors hover:bg-gray-50"
                            style={{ border: "1px solid #E5E7EB" }}
                        >
                            <BellIcon className="w-5 h-5" style={{ color: "#6B7280" }} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
                        </button>
                        {/* Upload resume CTA */}
                        <button
                            onClick={() => router.push("/resume-upload")}
                            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white brand-gradient hover:opacity-90 transition-all"
                        >
                            <DocumentArrowUpIcon className="w-4 h-4" />
                            <span>Upload Resume</span>
                        </button>
                    </div>
                </header>

                {/* API error banner */}
                {error && (
                    <div
                        className="mb-6 px-4 py-3 rounded-xl text-sm font-medium"
                        style={{ backgroundColor: "#FEF3C7", color: "#D97706", border: "1px solid #FDE68A" }}
                    >
                        {error}
                    </div>
                )}

                {/* ── KPI Cards ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    <KpiCard loading={loading} title="Total Applied"  value={stats?.totalApplied} trend="18%" trendType="up"   icon={CheckCircleIcon}           />
                    <KpiCard loading={loading} title="In Review"      value={stats?.inProgress}   trend="12%" trendType="up"   icon={BriefcaseIcon}             />
                    <KpiCard loading={loading} title="Interviews"     value={stats?.interviews}   trend="5%"  trendType="up"   icon={ChatBubbleLeftRightIcon}   />
                    <KpiCard loading={loading} title="Offers"         value={stats?.offers ?? 0}  trend="2%"  trendType="up"   icon={UserGroupIcon}             />
                </div>

                {/* ── Activity Chart ── */}
                <div
                    className="bg-white rounded-2xl p-6 mb-8"
                    style={{ border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-base font-bold" style={{ color: "#111827" }}>Application Activity</h3>
                            <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>Daily applications this week</p>
                        </div>
                        <select
                            className="px-3 py-1.5 rounded-lg text-xs font-medium outline-none"
                            style={{ border: "1px solid #E5E7EB", color: "#6B7280", backgroundColor: "#FFFFFF" }}
                        >
                            <option>This Week</option>
                            <option>Last Week</option>
                        </select>
                    </div>
                    <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="gradApps" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%"  stopColor="#4F46E5" stopOpacity={0.15} />
                                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}    />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                            <XAxis
                                dataKey="name"
                                axisLine={false} tickLine={false}
                                tick={{ fill: "#9CA3AF", fontSize: 11, fontWeight: 600 }}
                            />
                            <YAxis
                                axisLine={false} tickLine={false}
                                tick={{ fill: "#9CA3AF", fontSize: 11, fontWeight: 600 }}
                            />
                            <Tooltip
                                cursor={{ stroke: "#4F46E5", strokeWidth: 1, strokeDasharray: "4 4" }}
                                contentStyle={{
                                    backgroundColor: "#FFFFFF",
                                    border: "1px solid #E5E7EB",
                                    borderRadius: 12,
                                    fontSize: 12,
                                    color: "#111827",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                }}
                            />
                            <Area
                                type="monotone" dataKey="apps"
                                stroke="#4F46E5" strokeWidth={2.5}
                                fill="url(#gradApps)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* ── Recent Applications Table ── */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-bold" style={{ color: "#111827" }}>Recent Applications</h3>
                        <a
                            href="/applications"
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                            style={{ color: "#4F46E5", backgroundColor: "#EEF2FF" }}
                        >
                            View All
                        </a>
                    </div>

                    {/* Table */}
                    <div
                        className="bg-white rounded-2xl overflow-hidden"
                        style={{ border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
                    >
                        <table className="w-full">
                            <thead>
                                <tr style={{ backgroundColor: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
                                    {["Company", "Position", "Date", "Status"].map((h) => (
                                        <th
                                            key={h}
                                            className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider"
                                            style={{ color: "#6B7280" }}
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <SkeletonLoader type="table-row" count={4} />
                                ) : apps.length > 0 ? (
                                    apps.map((app, i) => (
                                        <tr
                                            key={app.id || i}
                                            className="hover:bg-gray-50 transition-colors"
                                            style={{ borderBottom: i < apps.length - 1 ? "1px solid #F3F4F6" : "none" }}
                                        >
                                            <td className="px-6 py-4 text-sm font-semibold" style={{ color: "#111827" }}>{app.company}</td>
                                            <td className="px-6 py-4 text-sm" style={{ color: "#6B7280" }}>{app.position || app.role}</td>
                                            <td className="px-6 py-4 text-xs" style={{ color: "#9CA3AF" }}>{app.date || app.appliedDate}</td>
                                            <td className="px-6 py-4"><StatusChip status={app.status} /></td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-sm" style={{ color: "#9CA3AF" }}>
                                            No applications yet.{" "}
                                            <a href="/jobs" style={{ color: "#4F46E5", fontWeight: 600 }}>Find jobs →</a>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </div>
    );
}
