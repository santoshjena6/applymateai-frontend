"use client";

// Applications — Tabbed List View
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import SkeletonLoader from "@/components/SkeletonLoader";
import { CalendarIcon, TrashIcon, BriefcaseIcon, BuildingOfficeIcon, MagnifyingGlassIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { applicationService } from "@/services/api";
import { getErrorMessage } from "@/utils/errorMessage";

const SG = "'Special Gothic', sans-serif";
const SW = "'Switzer', sans-serif";
const dark = "#080b0f";
const gray = "#4b5b63";
const white = "#ffffff";
const borderCol = "rgba(255,255,255,0.6)";

const TABS = ["All", "Applied", "In Review", "Interview", "Offered", "Rejected"];

const STATUS_CONFIG = {
    "Applied":      { dot: "#4F46E5", bg: "rgba(79,70,229,0.1)",  color: "#4F46E5" },
    "In Progress":  { dot: "#D97706", bg: "rgba(217,119,6,0.1)",  color: "#D97706" },
    "In Review":    { dot: "#D97706", bg: "rgba(217,119,6,0.1)",  color: "#D97706" },
    "Interview":    { dot: "#059669", bg: "rgba(5,150,105,0.1)",  color: "#059669" },
    "Interviewing": { dot: "#059669", bg: "rgba(5,150,105,0.1)",  color: "#059669" },
    "Offered":      { dot: "#0284c7", bg: "rgba(2,132,199,0.1)",  color: "#0284c7" },
    "Rejected":     { dot: "#DC2626", bg: "rgba(220,38,38,0.1)",  color: "#DC2626" },
};

// Backend status values (sent to API)
const STATUS_OPTIONS = [
    { value: "APPLIED",     label: "Applied"    },
    { value: "IN_PROGRESS", label: "In Review"  },
    { value: "INTERVIEW",   label: "Interview"  },
    { value: "OFFERED",     label: "Offered"    },
    { value: "REJECTED",    label: "Rejected"   },
];

export default function ApplicationsPage() {
    const router = useRouter();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [updatingId, setUpdatingId] = useState(null); // track which row is being updated

    useEffect(() => {
        const token = localStorage.getItem("applync_token");
        if (!token) { router.replace("/login"); return; }

        const fetchApps = async () => {
            try {
                const res = await applicationService.getAll();
                // Map backend statuses to UI friendly ones if needed
                const formatted = (res.data || []).map(app => ({
                    ...app,
                    uiStatus: app.status === "In Progress" ? "In Review" : app.status === "Interviewing" ? "Interview" : app.status
                }));
                setApplications(formatted);
            } catch (err) {
                if (err.response?.status !== 401)
                    setError(getErrorMessage(err));
            } finally {
                setLoading(false);
            }
        };
        fetchApps();
    }, [router]);

    const handleDelete = async (id) => {
        const previous = [...applications];
        setApplications(applications.filter(app => app.id !== id));
        try {
            await applicationService.delete(id);
        } catch {
            setApplications(previous);
        }
    };

    const handleStatusChange = async (id, newBackendStatus) => {
        const labelMap = { APPLIED: "Applied", IN_PROGRESS: "In Review", INTERVIEW: "Interview", OFFERED: "Offered", REJECTED: "Rejected" };
        const newUiStatus = labelMap[newBackendStatus] || newBackendStatus;
        const previous = [...applications];
        // Optimistic update
        setApplications(apps => apps.map(a => a.id === id ? { ...a, status: newBackendStatus, uiStatus: newUiStatus } : a));
        setUpdatingId(id);
        try {
            await applicationService.updateStatus(id, newBackendStatus);
        } catch {
            setApplications(previous);
        } finally {
            setUpdatingId(null);
        }
    };

    // Filter logic
    const filteredApps = applications.filter(app => {
        const matchesTab = activeTab === "All" || app.uiStatus === activeTab;
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = !searchQuery || 
            (app.company && app.company.toLowerCase().includes(searchLower)) ||
            (app.position && app.position.toLowerCase().includes(searchLower)) ||
            (app.role && app.role.toLowerCase().includes(searchLower));
        return matchesTab && matchesSearch;
    });

    const currentDate = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

    return (
        <div style={{ display: "flex", minHeight: "100vh", fontFamily: SW, background: "linear-gradient(to bottom, #d5ecfa, #e9f2f9)" }}>
            <Sidebar />

            <main style={{ flex: 1, padding: "32px 48px", marginLeft: "256px" }} className="lg:ml-64 p-6 lg:p-8 overflow-x-hidden">
                {/* ── Page Header ── */}
                <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 40 }} className="flex-col md:flex-row gap-4">
                    <div>
                        <h1 style={{ fontFamily: SG, fontSize: 36, fontWeight: 800, color: dark, letterSpacing: "-1px", marginBottom: 4 }}>
                            My Applications
                        </h1>
                        <p style={{ fontFamily: SW, fontSize: 16, color: gray }}>
                            Tracking <span style={{ color: dark, fontWeight: 800 }}>{applications.length}</span> active application{applications.length !== 1 ? "s" : ""}.
                        </p>
                    </div>
                    {/* Date badge */}
                    <div
                        style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 999, background: white, border: `1px solid rgba(255,255,255,0.8)`, boxShadow: "0 4px 12px rgba(0,0,0,0.02)", color: dark, fontSize: 14, fontWeight: 700 }}
                    >
                        <CalendarIcon style={{ width: 16, height: 16 }} />
                        <span>{currentDate}</span>
                    </div>
                </header>

                {error && (
                    <div style={{ marginBottom: 24, padding: "12px 16px", borderRadius: 12, background: "#fef2f2", color: "#991b1b", border: "1px solid #fecaca", fontSize: 14, fontWeight: 600 }}>
                        {error}
                    </div>
                )}

                {/* ── Tabs & Search ── */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }} className="flex-col md:flex-row gap-4">
                    {/* Tabs */}
                    <div style={{ display: "flex", gap: 8, background: "rgba(255,255,255,0.4)", backdropFilter: "blur(20px)", padding: 6, borderRadius: 999, border: "1px solid rgba(255,255,255,0.6)" }} className="overflow-x-auto w-full md:w-auto">
                        {TABS.map(tab => {
                            const isActive = activeTab === tab;
                            const count = tab === "All" ? applications.length : applications.filter(a => a.uiStatus === tab).length;
                            return (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    style={{ 
                                        padding: "8px 20px", borderRadius: 999, border: "none", cursor: "pointer", 
                                        fontFamily: SW, fontSize: 14, fontWeight: isActive ? 800 : 600,
                                        background: isActive ? white : "transparent",
                                        color: isActive ? dark : gray,
                                        boxShadow: isActive ? "0 2px 8px rgba(0,0,0,0.05)" : "none",
                                        transition: "all 0.2s",
                                        display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap"
                                    }}
                                >
                                    {tab}
                                    {count > 0 && (
                                        <span style={{ background: isActive ? dark : "rgba(8,11,15,0.1)", color: isActive ? white : gray, padding: "2px 8px", borderRadius: 999, fontSize: 11, fontWeight: 800 }}>
                                            {count}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Search */}
                    <div style={{ position: "relative", width: "100%", maxWidth: 300 }}>
                        <MagnifyingGlassIcon style={{ width: 18, height: 18, color: gray, position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)" }} />
                        <input
                            type="text"
                            placeholder="Search company or role..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ 
                                width: "100%", padding: "12px 16px 12px 44px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.8)",
                                background: white, fontFamily: SW, fontSize: 14, color: dark, outline: "none",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.02)", transition: "all 0.2s"
                            }}
                            onFocus={(e) => { e.target.style.boxShadow = "0 4px 16px rgba(0,0,0,0.05)"; }}
                            onBlur={(e)  => { e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.02)"; }}
                        />
                    </div>
                </div>

                {/* ── List View ── */}
                <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingBottom: 40 }}>
                    {loading ? (
                        <SkeletonLoader type="table" count={5} />
                    ) : filteredApps.length > 0 ? (
                        filteredApps.map((app) => {
                            const statusStyle = STATUS_CONFIG[app.uiStatus] || STATUS_CONFIG["Applied"];
                            
                            return (
                                <div
                                    key={app.id}
                                    style={{
                                        display: "flex", alignItems: "center", justifyContent: "space-between",
                                        background: white, padding: "20px 24px", borderRadius: 20,
                                        border: "1px solid rgba(255,255,255,0.8)", boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                                        transition: "all 0.2s", cursor: "default"
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.transform = "translateY(-2px)";
                                        e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.06)";
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.transform = "none";
                                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.03)";
                                    }}
                                >
                                    <div style={{ display: "flex", alignItems: "center", gap: 20, flex: 1 }}>
                                        {/* Avatar */}
                                        <div style={{ width: 56, height: 56, borderRadius: 16, background: dark, color: white, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SG, fontSize: 24, fontWeight: 800, flexShrink: 0 }}>
                                            {(app.company || "?")[0].toUpperCase()}
                                        </div>
                                        
                                        {/* Info */}
                                        <div>
                                            <h3 style={{ fontFamily: SG, fontSize: 20, fontWeight: 800, color: dark, letterSpacing: "-0.5px", marginBottom: 2 }}>{app.company}</h3>
                                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: 4, color: gray, fontSize: 14, fontWeight: 600 }}>
                                                    <BriefcaseIcon style={{ width: 14, height: 14 }} />
                                                    {app.position || app.role || "Unknown Role"}
                                                </div>
                                                <span style={{ color: "rgba(8,11,15,0.2)" }}>•</span>
                                                <div style={{ display: "flex", alignItems: "center", gap: 4, color: gray, fontSize: 13, fontWeight: 600 }}>
                                                    <CalendarIcon style={{ width: 14, height: 14 }} />
                                                    {app.date || app.appliedDate || "Recently Applied"}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status dropdown & Delete */}
                                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                        {/* Clickable status dropdown */}
                                        <div style={{ position: "relative" }}>
                                            <select
                                                value={app.status || "APPLIED"}
                                                onChange={(e) => handleStatusChange(app.id, e.target.value)}
                                                disabled={updatingId === app.id}
                                                style={{
                                                    appearance: "none",
                                                    WebkitAppearance: "none",
                                                    padding: "8px 32px 8px 12px",
                                                    borderRadius: 999,
                                                    border: `1.5px solid ${statusStyle.color}`,
                                                    background: statusStyle.bg,
                                                    color: statusStyle.color,
                                                    fontSize: 12, fontWeight: 800,
                                                    fontFamily: SW,
                                                    textTransform: "uppercase",
                                                    letterSpacing: "0.05em",
                                                    cursor: updatingId === app.id ? "wait" : "pointer",
                                                    outline: "none",
                                                    transition: "all 0.2s",
                                                    minWidth: 110,
                                                    opacity: updatingId === app.id ? 0.6 : 1,
                                                }}
                                            >
                                                {STATUS_OPTIONS.map(opt => (
                                                    <option key={opt.value} value={opt.value} style={{ background: white, color: dark, fontWeight: 600, textTransform: "none", letterSpacing: 0 }}>
                                                        {opt.label}
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronDownIcon style={{ width: 12, height: 12, color: statusStyle.color, position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                                        </div>

                                        <button
                                            onClick={() => handleDelete(app.id)}
                                            style={{ padding: 10, borderRadius: 12, border: "none", background: "#fef2f2", color: "#ef4444", cursor: "pointer", transition: "all 0.2s" }}
                                            onMouseEnter={e => { e.currentTarget.style.background = "#fca5a5"; e.currentTarget.style.color = "#991b1b"; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = "#fef2f2"; e.currentTarget.style.color = "#ef4444"; }}
                                            title="Delete Application"
                                        >
                                            <TrashIcon style={{ width: 18, height: 18 }} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "64px 20px", background: "rgba(255,255,255,0.4)", borderRadius: 24, border: "2px dashed rgba(255,255,255,0.8)" }}>
                            <BuildingOfficeIcon style={{ width: 48, height: 48, color: "rgba(8,11,15,0.2)", marginBottom: 16 }} />
                            <h3 style={{ fontFamily: SG, fontSize: 24, fontWeight: 800, color: dark, marginBottom: 4 }}>No applications found</h3>
                            <p style={{ fontSize: 15, color: gray }}>We couldn't find any applications matching your criteria.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
