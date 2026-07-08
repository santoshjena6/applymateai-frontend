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

const SG = "'Special Gothic', sans-serif";
const SW = "'Switzer', sans-serif";
const dark = "#080b0f";
const gray = "#4b5b63";
const white = "#ffffff";
const borderCol = "#e8e8e8";

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
        const params = new URLSearchParams(window.location.search);
        const oauthToken = params.get("token");
        if (oauthToken) {
            localStorage.setItem("applync_token", oauthToken);
            router.replace("/dashboard");
            return;
        }

        const token = localStorage.getItem("applync_token");
        if (!token) { router.replace("/login"); return; }

        try {
            const raw = localStorage.getItem("applync_user");
            if (raw) {
                const u = JSON.parse(raw);
                setUserName(u.name || "there");
            }
        } catch {}

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
        <div style={{ display: "flex", minHeight: "100vh", fontFamily: SW, background: "linear-gradient(to bottom, #d5ecfa, #e9f2f9)" }}>
            <Sidebar />

            <main style={{ flex: 1, padding: "32px 48px", marginLeft: "256px" }} className="lg:ml-64 p-6 lg:p-8 overflow-x-hidden">

                {/* ── Page Header ── */}
                <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 40 }} className="flex-col md:flex-row gap-4">
                    <div>
                        <h1 style={{ fontFamily: SG, fontSize: 36, fontWeight: 800, color: dark, letterSpacing: "-1px", marginBottom: 4 }}>
                            Dashboard
                        </h1>
                        <p style={{ fontFamily: SW, fontSize: 16, color: gray }}>
                            Welcome back, <span style={{ color: dark, fontWeight: 800 }}>{userName}</span> 👋
                        </p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <button
                            style={{ width: 44, height: 44, borderRadius: "50%", background: white, border: `1px solid rgba(255,255,255,0.8)`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", cursor: "pointer", transition: "all 0.2s ease" }}
                            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
                            onMouseLeave={e => e.currentTarget.style.transform = "none"}
                        >
                            <BellIcon style={{ width: 20, height: 20, color: dark }} />
                            <span style={{ position: "absolute", top: 12, right: 12, width: 8, height: 8, background: "#ef4444", borderRadius: "50%", border: "2px solid white" }} />
                        </button>
                        <button
                            onClick={() => router.push("/resume-upload")}
                            style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 999, background: dark, color: white, border: "none", fontFamily: SW, fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 12px rgba(8,11,15,0.2)", transition: "all 0.2s ease" }}
                            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(8,11,15,0.3)"; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(8,11,15,0.2)"; }}
                        >
                            <DocumentArrowUpIcon style={{ width: 18, height: 18 }} />
                            <span>Upload Resume</span>
                        </button>
                    </div>
                </header>

                {error && (
                    <div style={{ marginBottom: 24, padding: "12px 16px", borderRadius: 12, background: "#fef2f2", color: "#991b1b", border: "1px solid #fecaca", fontSize: 14, fontWeight: 600 }}>
                        {error}
                    </div>
                )}

                {/* ── KPI Cards ── */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24, marginBottom: 40 }}>
                    <KpiCard loading={loading} title="Total Applied"  value={stats?.totalApplied} trend="18%" trendType="up"   icon={CheckCircleIcon}           />
                    <KpiCard loading={loading} title="In Review"      value={stats?.inProgress}   trend="12%" trendType="up"   icon={BriefcaseIcon}             />
                    <KpiCard loading={loading} title="Interviews"     value={stats?.interviews}   trend="5%"  trendType="up"   icon={ChatBubbleLeftRightIcon}   />
                    <KpiCard loading={loading} title="Offers"         value={stats?.offers ?? 0}  trend="2%"  trendType="up"   icon={UserGroupIcon}             />
                </div>

                {/* ── Activity Chart ── */}
                <div
                    style={{ background: white, borderRadius: 24, padding: 32, marginBottom: 40, border: `1px solid rgba(255,255,255,0.8)`, boxShadow: "0 24px 80px rgba(0,0,0,0.07), 0 4px 20px rgba(0,0,0,0.04)" }}
                >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
                        <div>
                            <h3 style={{ fontFamily: SG, fontSize: 24, fontWeight: 800, color: dark, letterSpacing: "-0.5px", marginBottom: 4 }}>Application Activity</h3>
                            <p style={{ fontSize: 14, color: gray, fontWeight: 500 }}>Daily applications this week</p>
                        </div>
                        <select
                            style={{ padding: "8px 16px", borderRadius: 999, border: `1px solid ${borderCol}`, background: "#f8fafc", color: dark, fontFamily: SW, fontSize: 13, fontWeight: 700, cursor: "pointer", outline: "none" }}
                        >
                            <option>This Week</option>
                            <option>Last Week</option>
                        </select>
                    </div>
                    <ResponsiveContainer width="100%" height={260}>
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="gradApps" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%"  stopColor={dark} stopOpacity={0.2} />
                                    <stop offset="95%" stopColor={dark} stopOpacity={0}    />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={borderCol} />
                            <XAxis
                                dataKey="name"
                                axisLine={false} tickLine={false}
                                tick={{ fill: gray, fontSize: 12, fontFamily: SW, fontWeight: 600 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false} tickLine={false}
                                tick={{ fill: gray, fontSize: 12, fontFamily: SW, fontWeight: 600 }}
                                dx={-10}
                            />
                            <Tooltip
                                cursor={{ stroke: dark, strokeWidth: 1, strokeDasharray: "4 4" }}
                                contentStyle={{
                                    backgroundColor: white,
                                    border: `1px solid ${borderCol}`,
                                    borderRadius: 16,
                                    fontFamily: SW,
                                    fontSize: 13,
                                    fontWeight: 700,
                                    color: dark,
                                    boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                                }}
                            />
                            <Area
                                type="monotone" dataKey="apps"
                                stroke={dark} strokeWidth={3}
                                fill="url(#gradApps)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* ── Recent Applications Table ── */}
                <section>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                        <h3 style={{ fontFamily: SG, fontSize: 24, fontWeight: 800, color: dark, letterSpacing: "-0.5px" }}>Recent Applications</h3>
                        <a
                            href="/applications"
                            style={{ padding: "8px 16px", borderRadius: 999, background: white, border: `1px solid ${borderCol}`, color: dark, fontFamily: SW, fontSize: 13, fontWeight: 700, textDecoration: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", transition: "all 0.2s ease" }}
                            onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                            onMouseLeave={e => e.currentTarget.style.background = white}
                        >
                            View All
                        </a>
                    </div>

                    <div
                        style={{ background: white, borderRadius: 24, padding: "16px 32px 32px", border: `1px solid rgba(255,255,255,0.8)`, boxShadow: "0 24px 80px rgba(0,0,0,0.07), 0 4px 20px rgba(0,0,0,0.04)", overflow: "hidden" }}
                    >
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr>
                                    {["Company", "Position", "Date", "Status"].map((h) => (
                                        <th
                                            key={h}
                                            style={{ textAlign: "left", padding: "20px 16px", fontSize: 12, fontWeight: 700, color: gray, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: `1px solid ${borderCol}` }}
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
                                            style={{ borderBottom: i < apps.length - 1 ? `1px solid ${borderCol}` : "none", transition: "background 0.2s" }}
                                            onMouseEnter={e => e.currentTarget.style.background = "#f9fbfd"}
                                            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                        >
                                            <td style={{ padding: "20px 16px", fontSize: 15, fontWeight: 700, color: dark }}>{app.company}</td>
                                            <td style={{ padding: "20px 16px", fontSize: 15, fontWeight: 500, color: gray }}>{app.position || app.role}</td>
                                            <td style={{ padding: "20px 16px", fontSize: 13, fontWeight: 600, color: gray }}>{app.date || app.appliedDate}</td>
                                            <td style={{ padding: "20px 16px" }}><StatusChip status={app.status} /></td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} style={{ padding: "48px 16px", textAlign: "center", fontSize: 14, color: gray, fontWeight: 500 }}>
                                            No applications yet.{" "}
                                            <a href="/resume-upload" style={{ color: dark, fontWeight: 800, textDecoration: "none", borderBottom: "1px solid" }}>Find jobs →</a>
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
