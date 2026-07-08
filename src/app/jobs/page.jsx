"use client";

// Jobs page — search bar, IT / Non-IT filter tabs, mismatch guard, job card grid
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import ResumeUpload from "@/components/ResumeUpload";
import JobCard from "@/components/JobCard";
import SkeletonLoader from "@/components/SkeletonLoader";
import {
    MagnifyingGlassIcon,
    BriefcaseIcon,
    AdjustmentsHorizontalIcon,
    ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { SparklesIcon } from "@heroicons/react/24/solid";
import { jobService, applicationService } from "@/services/api";
import ApplyTrackToast from "@/components/ApplyTrackToast";
import { getErrorMessage } from "@/utils/errorMessage";
import { motion, AnimatePresence } from "framer-motion";

// Only two tabs — IT and Non-IT
const TABS = [
    { key: "IT",     label: "IT & Tech" },
    { key: "NON_IT", label: "Non-IT"    },
];

// Mismatch screen copy — keyed by the USER's actual resume category
const MISMATCH = {
    IT: {
        // User is IT, but clicked Non-IT tab
        emoji: "⚡",
        heading: "Your Resume Is Optimised for IT Roles",
        body: "Our AI detected strong technical skills — programming languages, frameworks, and engineering expertise — in your profile. Non-IT listings are unlikely to align with what makes your profile stand out. Switch back to let the AI surface the opportunities you're actually built for.",
        cta: "View My IT Jobs",
        switchTo: "IT",
        accentBg: "#EEF2FF",
        accentColor: "#4F46E5",
    },
    NON_IT: {
        // User is Non-IT, but clicked IT tab
        emoji: "🎯",
        heading: "Your Resume Is Optimised for Non-IT Roles",
        body: "Based on your resume, our AI identified your strengths in business, finance, operations, or management — domains where IT job listings won't reflect your true potential. You're best positioned for Non-IT opportunities where your skills and experience truly shine.",
        cta: "View My Non-IT Jobs",
        switchTo: "NON_IT",
        accentBg: "#F5F3FF",
        accentColor: "#7C3AED",
    },
};

// ── Mismatch Screen ───────────────────────────────────────────────────────────
function MismatchScreen({ userCategory, onSwitch }) {
    const m = MISMATCH[userCategory];
    if (!m) return null;

    return (
        <motion.div
            key="mismatch"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center py-24 px-8 rounded-2xl bg-white text-center"
            style={{ border: "2px dashed #E5E7EB" }}
        >
            {/* Icon badge */}
            <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 text-3xl"
                style={{ backgroundColor: m.accentBg }}
            >
                {m.emoji}
            </div>

            {/* AI label pill */}
            <div
                className="flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-5"
                style={{ backgroundColor: m.accentBg, color: m.accentColor }}
            >
                <SparklesIcon className="w-3.5 h-3.5" />
                <span>AI Resume Analysis</span>
            </div>

            <h3 className="text-xl font-bold mb-3" style={{ color: "#111827" }}>
                {m.heading}
            </h3>
            <p className="text-sm leading-relaxed max-w-md mb-8" style={{ color: "#6B7280" }}>
                {m.body}
            </p>

            <button
                onClick={() => onSwitch(m.switchTo)}
                className="flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-semibold text-white brand-gradient hover:opacity-90 transition-all"
            >
                <span>{m.cta}</span>
                <ArrowRightIcon className="w-4 h-4" />
            </button>
        </motion.div>
    );
}

// ── Main Content ──────────────────────────────────────────────────────────────
function JobsContent() {
    const router = useRouter();

    const [jobs, setJobs]                   = useState([]);
    const [selected, setSelected]           = useState(new Set());
    const [loading, setLoading]             = useState(false);
    const [error, setError]                 = useState("");
    const [category, setCategory]           = useState("IT");   // active tab
    const [userCategory, setUserCategory]   = useState(null);   // from Groq resume analysis
    const [search, setSearch]               = useState("");
    const [showUpload, setShowUpload]       = useState(false);
    const [userExperience, setUserExperience] = useState(null);
    const [pendingTrack, setPendingTrack]   = useState(null);   // job waiting for "Did you apply?" confirm

    useEffect(() => {
        // Auth guard
        const token = localStorage.getItem("applync_token");
        if (!token) { router.replace("/login"); return; }

        // Read resume category stored by Groq (applync_user.jobCategory)
        let resumeCategory = null;
        try {
            const raw = localStorage.getItem("applync_user");
            if (raw) {
                const u = JSON.parse(raw);
                if (u.jobCategory === "NON_IT") resumeCategory = "NON_IT";
                else if (u.jobCategory === "IT")  resumeCategory = "IT";
                if (u.experienceYears != null) setUserExperience(u.experienceYears);
            }
        } catch {}

        setUserCategory(resumeCategory);

        // Default active tab = resume category (fall back to IT if unknown)
        const defaultTab = resumeCategory || "IT";
        setCategory(defaultTab);

        // Use cached results from resume upload if available
        const stored = localStorage.getItem("latestJobResults");
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setJobs(parsed.matchedJobs || []);
                // Persist updated jobCategory from upload
                if (parsed.jobCategory) {
                    const raw2 = localStorage.getItem("applync_user");
                    const u2 = raw2 ? JSON.parse(raw2) : {};
                    u2.jobCategory = parsed.jobCategory;
                    localStorage.setItem("applync_user", JSON.stringify(u2));
                    setUserCategory(parsed.jobCategory);
                    setCategory(parsed.jobCategory);
                }
            } catch {}
            localStorage.removeItem("latestJobResults");
        } else {
            fetchJobs(search, defaultTab, userExperience);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const fetchJobs = async (q = search, cat = category, exp = userExperience) => {
        setLoading(true);
        setError("");
        try {
            const res = await jobService.searchJobs(q, "", cat, exp);
            setJobs(res.data || []);
        } catch (err) {
            if (err.response?.status !== 401)
                setError(getErrorMessage(err));
        } finally {
            setTimeout(() => setLoading(false), 300);
        }
    };

    const handleTab = (cat) => {
        setCategory(cat);
        // Only fetch if it matches the user's category (mismatch = show warning screen, not jobs)
        if (!userCategory || cat === userCategory) {
            fetchJobs(search, cat, userExperience);
        }
    };

    const handleSearch = (e) => { if (e.key === "Enter") fetchJobs(search); };

    const toggleSelect = (i, sel) => {
        const s = new Set(selected);
        sel ? s.add(i) : s.delete(i);
        setSelected(s);
    };

    // Called immediately when user clicks Apply on a JobCard
    // Toast will appear 4 seconds later (handled inside ApplyTrackToast)
    const handleApply = (jobData) => {
        setPendingTrack(jobData);
    };

    // Save confirmed application to the tracker
    const handleTrackYes = async () => {
        if (!pendingTrack) return;
        try {
            await applicationService.create({
                jobTitle:  pendingTrack.role,
                company:   pendingTrack.company,
                location:  pendingTrack.location || "",
                applyLink: pendingTrack.applyLink || "",
                source:    pendingTrack.source    || "Adzuna",
            });
        } catch (err) {
            console.error("Auto-track save failed:", err);
        }
    };

    // Mismatch: resume category exists but the active tab doesn't match it
    const isMismatch = Boolean(userCategory && category !== userCategory);

    return (
        <>
            {/* ── Page Header ── */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-black" style={{ color: "#111827" }}>Browse Jobs</h1>
                    <p className="text-sm mt-0.5" style={{ color: "#6B7280" }}>
                        AI-matched opportunities based on your profile.
                    </p>
                </div>
                <button
                    onClick={() => setShowUpload(!showUpload)}
                    className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-white transition-colors hover:bg-gray-50"
                    style={{ border: "1px solid #E5E7EB", color: "#374151" }}
                >
                    <AdjustmentsHorizontalIcon className="w-4 h-4" />
                    <span>{showUpload ? "Close" : "Update Resume"}</span>
                </button>
            </header>

            {/* Resume upload panel — toggled */}
            <AnimatePresence>
                {showUpload && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-8"
                    >
                        <div
                            className="p-8 rounded-2xl bg-white"
                            style={{ border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
                        >
                            <ResumeUpload onUploadSuccess={(d) => {
                                setJobs(d.matchedJobs || []);
                                setShowUpload(false);
                                if (d.jobCategory) {
                                    setUserCategory(d.jobCategory);
                                    setCategory(d.jobCategory);
                                }
                            }} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Search Bar ── */}
            <div className="relative mb-5 max-w-lg">
                <MagnifyingGlassIcon
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
                    style={{ color: "#9CA3AF" }}
                />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={handleSearch}
                    placeholder="Search roles, companies… (Enter to search)"
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all bg-white"
                    style={{ border: "1px solid #E5E7EB", color: "#111827" }}
                    onFocus={(e) => { e.target.style.borderColor = "#4F46E5"; e.target.style.boxShadow = "0 0 0 3px rgba(79,70,229,0.1)"; }}
                    onBlur={(e)  => { e.target.style.borderColor = "#E5E7EB"; e.target.style.boxShadow = "none"; }}
                />
            </div>

            {/* ── Filter Tabs — IT and Non-IT only ── */}
            <div className="flex items-center gap-2 mb-6 flex-wrap">
                {TABS.map((t) => {
                    const isActive = category === t.key;
                    const isWrong  = userCategory && t.key !== userCategory;
                    return (
                        <button
                            key={t.key}
                            onClick={() => handleTab(t.key)}
                            className="px-5 py-2.5 rounded-full text-sm font-semibold transition-all"
                            style={{
                                backgroundColor: isActive ? "#4F46E5" : "#FFFFFF",
                                color:           isActive ? "#FFFFFF" : "#6B7280",
                                border:          `1px solid ${isActive ? "#4F46E5" : "#E5E7EB"}`,
                                opacity:         isWrong && !isActive ? 0.6 : 1,
                            }}
                        >
                            {t.label}
                        </button>
                    );
                })}

                {/* AI recommendation badge */}
                {userCategory && (
                    <div
                        className="flex items-center space-x-1.5 px-3 py-2 rounded-full text-xs font-semibold"
                        style={{ backgroundColor: "#F0FDF4", color: "#16A34A", border: "1px solid #BBF7D0" }}
                    >
                        <SparklesIcon className="w-3.5 h-3.5" />
                        <span>AI matched: {userCategory === "IT" ? "IT & Tech" : "Non-IT"}</span>
                    </div>
                )}
            </div>

            {/* Error message */}
            {error && (
                <div
                    className="mb-5 px-4 py-3 rounded-xl text-sm font-medium"
                    style={{ backgroundColor: "#FEE2E2", color: "#DC2626", border: "1px solid #FECACA" }}
                >
                    {error}
                </div>
            )}

            {/* ── Main area: Mismatch screen OR Job grid ── */}
            <AnimatePresence mode="wait">
                {isMismatch ? (
                    <MismatchScreen
                        key="mismatch"
                        userCategory={userCategory}
                        onSwitch={handleTab}
                    />
                ) : (
                    <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        {/* Result count */}
                        {!loading && (
                            <div className="flex items-center space-x-3 mb-5">
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#EEF2FF" }}>
                                    <BriefcaseIcon className="w-4 h-4" style={{ color: "#4F46E5" }} />
                                </div>
                                <p className="text-sm font-semibold" style={{ color: "#111827" }}>
                                    {jobs.length} {jobs.length === 1 ? "job" : "jobs"} found
                                </p>
                            </div>
                        )}

                        <AnimatePresence>
                            {loading ? (
                                <motion.div key="sk" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <SkeletonLoader type="card" count={4} />
                                </motion.div>
                            ) : jobs.length > 0 ? (
                                <motion.div key="jobs" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {jobs.map((job, i) => (
                                        <JobCard
                                            key={job.jobId || job.id || i} index={i}
                                            role={job.role || job.title}
                                            company={job.company}
                                            location={job.location}
                                            minExperience={job.minExperience}
                                            maxExperience={job.maxExperience}
                                            source={job.source}
                                            applyLink={job.applyLink}
                                            category={job.jobType || job.category}
                                            description={job.description}
                                            isSelected={selected.has(i)}
                                            onSelect={(s) => toggleSelect(i, s)}
                                            onApply={handleApply}
                                        />
                                    ))}
                                </motion.div>
                            ) : (
                                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="flex flex-col items-center justify-center py-28 rounded-2xl bg-white"
                                    style={{ border: "2px dashed #E5E7EB" }}
                                >
                                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: "#EEF2FF" }}>
                                        <BriefcaseIcon className="w-7 h-7" style={{ color: "#4F46E5" }} />
                                    </div>
                                    <h4 className="text-base font-bold mb-1" style={{ color: "#111827" }}>No jobs found</h4>
                                    <p className="text-sm text-center max-w-xs" style={{ color: "#6B7280" }}>
                                        Try uploading your resume or refining your search.
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Application Auto-Track Toast ── */}
            <ApplyTrackToast
                job={pendingTrack}
                onYes={handleTrackYes}
                onNo={() => setPendingTrack(null)}
            />
        </>
    );
}

// ── Page Shell ────────────────────────────────────────────────────────────────
export default function JobsPage() {
    return (
        <div className="flex min-h-screen" style={{ backgroundColor: "#F8FAFC" }}>
            <Sidebar />
            <main className="flex-1 lg:ml-64 p-6 lg:p-8">
                <Suspense fallback={
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-20">
                        <SkeletonLoader type="card" count={4} />
                    </div>
                }>
                    <JobsContent />
                </Suspense>
            </main>
        </div>
    );
}
