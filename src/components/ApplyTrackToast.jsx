"use client";

// ApplyTrackToast — floating bottom-right toast asking user to confirm application
// Appears ~4 seconds after clicking Apply on a job card

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    CheckCircleIcon,
    XMarkIcon,
    BuildingOfficeIcon,
    BriefcaseIcon,
} from "@heroicons/react/24/outline";

/**
 * Props:
 *   job      — { role, company, location, applyLink } | null
 *   onYes    — () => void  — called when user confirms they applied
 *   onNo     — () => void  — called when user dismisses
 */
const ApplyTrackToast = ({ job, onYes, onNo }) => {
    const [visible, setVisible] = useState(false);
    const [saving, setSaving]   = useState(false);
    const [saved, setSaved]     = useState(false);

    // Show toast 4 seconds after job changes (i.e., after Apply is clicked)
    useEffect(() => {
        if (!job) { setVisible(false); setSaved(false); return; }
        const t = setTimeout(() => setVisible(true), 4000);
        return () => clearTimeout(t);
    }, [job]);

    // Auto-dismiss after 20 seconds if no action
    useEffect(() => {
        if (!visible) return;
        const t = setTimeout(() => handleNo(), 20000);
        return () => clearTimeout(t);
    }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleYes = async () => {
        setSaving(true);
        await onYes();
        setSaving(false);
        setSaved(true);
        setTimeout(() => { setVisible(false); onNo(); }, 2000);
    };

    const handleNo = () => {
        setVisible(false);
        onNo();
    };

    if (!job) return null;

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0, y: 80, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0,  scale: 1 }}
                    exit={{ opacity: 0, y: 60, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 28 }}
                    style={{
                        position: "fixed",
                        bottom: 28,
                        right: 28,
                        zIndex: 9999,
                        width: 340,
                        background: "#ffffff",
                        borderRadius: 20,
                        boxShadow: "0 20px 60px rgba(0,0,0,0.15), 0 4px 16px rgba(0,0,0,0.08)",
                        border: "1px solid #E5E7EB",
                        overflow: "hidden",
                    }}
                >
                    {/* Purple accent bar at top */}
                    <div style={{
                        height: 4,
                        background: "linear-gradient(90deg, #4F46E5, #7C3AED)",
                    }} />

                    <div style={{ padding: "20px 20px 16px" }}>

                        {saved ? (
                            /* ── Success state ── */
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <div style={{
                                    width: 40, height: 40, borderRadius: "50%",
                                    background: "#DCFCE7", display: "flex",
                                    alignItems: "center", justifyContent: "center", flexShrink: 0,
                                }}>
                                    <CheckCircleIcon style={{ width: 22, height: 22, color: "#16A34A" }} />
                                </div>
                                <div>
                                    <p style={{ fontWeight: 700, fontSize: 14, color: "#111827", margin: 0 }}>
                                        Saved to Tracker!
                                    </p>
                                    <p style={{ fontSize: 12, color: "#6B7280", margin: "2px 0 0" }}>
                                        Check Applications to track your progress.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* ── Header ── */}
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        <div style={{
                                            width: 36, height: 36, borderRadius: 10,
                                            background: "#EEF2FF", display: "flex",
                                            alignItems: "center", justifyContent: "center", flexShrink: 0,
                                        }}>
                                            <BriefcaseIcon style={{ width: 18, height: 18, color: "#4F46E5" }} />
                                        </div>
                                        <div>
                                            <p style={{ fontSize: 11, fontWeight: 600, color: "#9CA3AF", margin: 0, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                                Did you apply?
                                            </p>
                                            <p style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: "2px 0 0", lineHeight: 1.3 }}>
                                                {job.role?.length > 28 ? job.role.slice(0, 28) + "…" : job.role}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleNo}
                                        style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#9CA3AF", flexShrink: 0 }}
                                    >
                                        <XMarkIcon style={{ width: 18, height: 18 }} />
                                    </button>
                                </div>

                                {/* Company + location */}
                                <div style={{
                                    display: "flex", alignItems: "center", gap: 6,
                                    padding: "8px 12px", borderRadius: 10,
                                    background: "#F9FAFB", marginBottom: 16,
                                }}>
                                    <BuildingOfficeIcon style={{ width: 14, height: 14, color: "#6B7280", flexShrink: 0 }} />
                                    <span style={{ fontSize: 12, color: "#6B7280", fontWeight: 500 }}>
                                        {job.company}{job.location ? ` · ${job.location}` : ""}
                                    </span>
                                </div>

                                {/* Action buttons */}
                                <div style={{ display: "flex", gap: 8 }}>
                                    <button
                                        onClick={handleYes}
                                        disabled={saving}
                                        style={{
                                            flex: 1, padding: "10px 0",
                                            background: saving ? "#9CA3AF" : "linear-gradient(135deg, #4F46E5, #7C3AED)",
                                            color: "#fff", border: "none", borderRadius: 12,
                                            fontSize: 13, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer",
                                            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                                        }}
                                    >
                                        {saving ? (
                                            <div style={{
                                                width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)",
                                                borderTopColor: "#fff", borderRadius: "50%",
                                                animation: "spin 0.8s linear infinite",
                                            }} />
                                        ) : (
                                            <CheckCircleIcon style={{ width: 15, height: 15 }} />
                                        )}
                                        {saving ? "Saving…" : "Yes, track it"}
                                    </button>
                                    <button
                                        onClick={handleNo}
                                        style={{
                                            flex: 1, padding: "10px 0",
                                            background: "#F3F4F6", color: "#6B7280",
                                            border: "none", borderRadius: 12,
                                            fontSize: 13, fontWeight: 600, cursor: "pointer",
                                        }}
                                    >
                                        No
                                    </button>
                                </div>

                                {/* Auto-dismiss hint */}
                                <p style={{ fontSize: 11, color: "#D1D5DB", textAlign: "center", marginTop: 10, marginBottom: 0 }}>
                                    Disappears in 20 seconds
                                </p>
                            </>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ApplyTrackToast;
