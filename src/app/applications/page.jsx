"use client";

// Applications — Kanban board with drag-and-drop status columns
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import SkeletonLoader from "@/components/SkeletonLoader";
import { CalendarIcon, TrashIcon } from "@heroicons/react/24/outline";
import { applicationService } from "@/services/api";
import { getErrorMessage } from "@/utils/errorMessage";

// Column definitions with their display colors
const COLUMNS = [
    { key: "Applied",     label: "Applied",     dot: "#4F46E5", bg: "#EEF2FF", badge: "#4F46E5"  },
    { key: "In Progress", label: "In Review",   dot: "#D97706", bg: "#FEF3C7", badge: "#D97706"  },
    { key: "Interview",   label: "Interview",   dot: "#059669", bg: "#D1FAE5", badge: "#059669"  },
    { key: "Rejected",    label: "Rejected",    dot: "#DC2626", bg: "#FEE2E2", badge: "#DC2626"  },
];

// Distribute applications into the four columns by status
const groupByStatus = (list) => {
    const map = { Applied: [], "In Progress": [], Interview: [], Rejected: [] };
    list.forEach((app) => {
        const key =
            app.status === "Interviewing" ? "Interview"
            : map[app.status] !== undefined ? app.status
            : "Applied";
        map[key].push(app);
    });
    return map;
};

export default function ApplicationsPage() {
    const router = useRouter();
    const [columns, setColumns]   = useState({ Applied: [], "In Progress": [], Interview: [], Rejected: [] });
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState("");
    const [dragging, setDragging] = useState(null);

    useEffect(() => {
        // Auth guard
        const token = localStorage.getItem("applync_token");
        if (!token) { router.replace("/login"); return; }

        const fetchApps = async () => {
            try {
                const res = await applicationService.getAll();
                setColumns(groupByStatus(res.data || []));
            } catch (err) {
                if (err.response?.status !== 401)
                    setError(getErrorMessage(err));
            } finally {
                setLoading(false);
            }
        };
        fetchApps();
    }, [router]);

    // Drag-and-drop handlers
    const onDragStart = (card, fromCol) => setDragging({ card, fromCol });

    const onDrop = async (toCol) => {
        if (!dragging || dragging.fromCol === toCol) return;
        // Optimistic UI update
        const from = columns[dragging.fromCol].filter((c) => c.id !== dragging.card.id);
        const to   = [...columns[toCol], { ...dragging.card, status: toCol }];
        setColumns({ ...columns, [dragging.fromCol]: from, [toCol]: to });
        setDragging(null);
        try {
            await applicationService.updateStatus(dragging.card.id, toCol);
        } catch {
            // Revert on failure
            setColumns((prev) => ({
                ...prev,
                [toCol]:              prev[toCol].filter((c) => c.id !== dragging.card.id),
                [dragging.fromCol]:   [...prev[dragging.fromCol], dragging.card],
            }));
        }
    };

    // DELETE /api/v1/applications/{id} — remove card from column optimistically
    const handleDelete = async (card, colKey) => {
        // Optimistic removal from UI
        setColumns((prev) => ({
            ...prev,
            [colKey]: prev[colKey].filter((c) => c.id !== card.id),
        }));
        try {
            await applicationService.delete(card.id);
        } catch {
            // Revert on failure
            setColumns((prev) => ({
                ...prev,
                [colKey]: [...prev[colKey], card],
            }));
        }
    };

    const total = Object.values(columns).reduce((s, a) => s + a.length, 0);

    return (
        <div className="flex min-h-screen" style={{ backgroundColor: "#F8FAFC" }}>
            <Sidebar />

            <main className="flex-1 lg:ml-64 p-6 lg:p-8 overflow-x-hidden">
                {/* ── Page Header ── */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-black" style={{ color: "#111827" }}>My Applications</h1>
                        <p className="text-sm mt-0.5" style={{ color: "#6B7280" }}>
                            Tracking {total} application{total !== 1 ? "s" : ""}.
                        </p>
                    </div>
                    {/* Date badge */}
                    <div
                        className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white text-sm font-medium"
                        style={{ border: "1px solid #E5E7EB", color: "#6B7280" }}
                    >
                        <CalendarIcon className="w-4 h-4" />
                        <span>Jun 2026</span>
                    </div>
                </header>

                {/* Error banner */}
                {error && (
                    <div
                        className="mb-6 px-4 py-3 rounded-xl text-sm font-medium"
                        style={{ backgroundColor: "#FEE2E2", color: "#DC2626", border: "1px solid #FECACA" }}
                    >
                        {error}
                    </div>
                )}

                {/* ── Kanban Board ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                    {COLUMNS.map((col) => (
                        <div
                            key={col.key}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={() => onDrop(col.key)}
                            className="flex flex-col rounded-2xl p-4 min-h-[520px]"
                            style={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
                        >
                            {/* Column header */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col.dot }} />
                                    <h3 className="text-sm font-bold" style={{ color: "#111827" }}>{col.label}</h3>
                                </div>
                                {/* Count badge */}
                                <span
                                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                                    style={{ backgroundColor: col.bg, color: col.badge }}
                                >
                                    {columns[col.key].length}
                                </span>
                            </div>

                            {/* Application cards */}
                            <div className="flex-1 space-y-3">
                                {loading ? (
                                    <SkeletonLoader type="kanban" count={2} />
                                ) : columns[col.key].length > 0 ? (
                                    columns[col.key].map((card) => (
                                        <div
                                            key={card.id}
                                            draggable
                                            onDragStart={() => onDragStart(card, col.key)}
                                            className="p-4 rounded-xl cursor-grab active:cursor-grabbing transition-all hover:-translate-y-0.5 hover:shadow-md"
                                            style={{
                                                backgroundColor: "#F9FAFB",
                                                border: "1px solid #E5E7EB",
                                                opacity: dragging?.card.id === card.id ? 0.5 : 1,
                                            }}
                                        >
                                            {/* Company initial avatar + date + delete */}
                                            <div className="flex items-start justify-between mb-2">
                                                <div
                                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white brand-gradient shrink-0"
                                                >
                                                    {(card.company || "?")[0].toUpperCase()}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-medium" style={{ color: "#9CA3AF" }}>
                                                        {card.date || card.appliedDate || ""}
                                                    </span>
                                                    {/* DELETE /api/v1/applications/{id} */}
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleDelete(card, col.key); }}
                                                        className="p-1 rounded-lg transition-colors hover:bg-red-50"
                                                        style={{ color: "#D1D5DB" }}
                                                        title="Delete application"
                                                    >
                                                        <TrashIcon className="w-3.5 h-3.5 hover:text-red-400" />
                                                    </button>
                                                </div>
                                            </div>
                                            {/* Job info */}
                                            <p className="text-sm font-bold mt-2" style={{ color: "#111827" }}>{card.company}</p>
                                            <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>{card.position || card.role}</p>
                                            {/* Status pill */}
                                            <div className="mt-3">
                                                <span
                                                    className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-semibold"
                                                    style={{ backgroundColor: col.bg, color: col.badge }}
                                                >
                                                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: col.dot }} />
                                                    <span>{col.label}</span>
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    // Empty drop zone
                                    <div
                                        className="flex items-center justify-center h-24 rounded-xl"
                                        style={{ border: "2px dashed #E5E7EB" }}
                                    >
                                        <p className="text-xs" style={{ color: "#D1D5DB" }}>Drop here</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Weekly Stats Summary ── */}
                <div
                    className="mt-8 p-6 rounded-2xl bg-white"
                    style={{ border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
                >
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div>
                            <h3 className="text-base font-bold" style={{ color: "#111827" }}>Weekly Progress</h3>
                            <p className="text-sm mt-0.5" style={{ color: "#6B7280" }}>
                                You applied to 5 more jobs than last week. Keep it up!
                            </p>
                        </div>
                        <div className="flex items-center space-x-8">
                            {[["12", "Applications", "#4F46E5"], ["3", "Interviews", "#059669"]].map(([v, l, c]) => (
                                <div key={l} className="text-center">
                                    <span className="text-2xl font-black" style={{ color: c }}>{v}</span>
                                    <p className="text-[10px] uppercase font-semibold tracking-wider mt-0.5" style={{ color: "#9CA3AF" }}>{l}</p>
                                </div>
                            ))}
                        </div>
                        <button
                            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white brand-gradient hover:opacity-90 transition-all"
                        >
                            Download Report
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
