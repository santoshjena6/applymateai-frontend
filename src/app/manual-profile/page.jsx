"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import {
    BriefcaseIcon,
    CheckCircleIcon,
    MagnifyingGlassIcon,
    SparklesIcon,
    ArrowRightIcon,
    ComputerDesktopIcon,
    BuildingOffice2Icon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

// ── Predefined designation lists ──────────────────────────────────────────────
const DESIGNATIONS = {
    IT: [
        "Software Developer", "Java Developer", "Python Developer",
        "Frontend Developer", "Backend Developer", "Full Stack Developer",
        "React Developer", "Node.js Developer", "Angular Developer",
        "Data Scientist", "Data Analyst", "Machine Learning Engineer",
        "AI Engineer", "DevOps Engineer", "Cloud Engineer",
        "Android Developer", "iOS Developer", "Flutter Developer",
        "QA / Test Engineer", "Database Administrator", "System Administrator",
        "Network Engineer", "Cybersecurity Analyst", "Embedded Systems Engineer",
        "Technical Lead", "Software Architect", "UI/UX Designer",
        "Business Analyst (IT)", "PHP Developer", "Golang Developer",
        "C++ Developer", "Kotlin Developer", "Salesforce Developer",
        "SAP Consultant", "Blockchain Developer", "Game Developer",
    ],
    NON_IT: [
        "Sales Executive", "Sales Manager", "Marketing Executive",
        "Digital Marketing Manager", "SEO Specialist", "HR Executive",
        "HR Manager", "Business Development Executive", "Operations Manager",
        "Supply Chain Manager", "Finance Executive", "Financial Analyst",
        "Accountant", "Chartered Accountant", "Civil Engineer",
        "Mechanical Engineer", "Electrical Engineer", "Project Manager",
        "Content Writer", "Graphic Designer", "Customer Service Executive",
        "Logistics Manager", "Procurement Manager", "Legal Executive",
        "Healthcare Professional", "Teacher / Educator", "Banking Executive",
        "Insurance Executive", "Real Estate Agent", "Event Manager",
        "MBA Graduate", "Management Trainee", "Research Analyst",
    ],
};

const STEPS = ["Department", "Designation", "Experience"];

const EXPERIENCE_OPTIONS = [
    { label: "Fresher", value: "0", sub: "0 years" },
    { label: "1 yr", value: "1", sub: "1 year" },
    { label: "2 yrs", value: "2", sub: "2 years" },
    { label: "3 yrs", value: "3", sub: "3 years" },
    { label: "4 yrs", value: "4", sub: "4 years" },
    { label: "5 yrs", value: "5", sub: "5 years" },
    { label: "6–7 yrs", value: "6", sub: "6–7 years" },
    { label: "8–10 yrs", value: "8", sub: "8–10 years" },
    { label: "10+ yrs", value: "11", sub: "10+ years" },
];

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ManualProfilePage() {
    const router = useRouter();
    const searchRef = useRef(null);

    const [step, setStep]               = useState(0);
    const [department, setDepartment]   = useState("");   // "IT" | "NON_IT"
    const [designation, setDesignation] = useState("");
    const [search, setSearch]           = useState("");   // live filter in Step 1
    const [experience, setExperience]   = useState("");
    const [loading, setLoading]         = useState(false);
    const [error, setError]             = useState("");

    useEffect(() => {
        if (!localStorage.getItem("applync_token")) router.replace("/login");
    }, [router]);

    // Auto-focus search when entering Step 1
    useEffect(() => {
        if (step === 1) setTimeout(() => searchRef.current?.focus(), 200);
    }, [step]);

    // Filtered designation list
    const filteredList = (DESIGNATIONS[department] || []).filter((d) =>
        d.toLowerCase().includes(search.toLowerCase())
    );

    // Custom designation = user typed something not in the predefined list
    const isCustom = search.trim().length > 0 &&
        !DESIGNATIONS[department]?.some(
            (d) => d.toLowerCase() === search.trim().toLowerCase()
        );

    const handleDept = (dept) => {
        setDepartment(dept);
        setDesignation("");
        setSearch("");
        setStep(1);
    };

    const chooseDesignation = (d) => {
        setDesignation(d);
        setSearch("");
        setStep(2);
    };

    const handleSubmit = async () => {
        if (!experience) { setError("Please select your experience."); return; }
        setError("");
        setLoading(true);

        try {
            const token = localStorage.getItem("applync_token");
            const res = await fetch(`${BASE_URL}/user/job-profile`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    designation,
                    experienceYears: Number(experience),
                    jobCategory: department,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to save profile.");

            // Save to localStorage so /jobs picks it up
            const stored = JSON.parse(localStorage.getItem("applync_user") || "{}");
            localStorage.setItem("applync_user", JSON.stringify({
                ...stored,
                jobCategory: department,
                designation,
                experienceYears: Number(experience),
            }));

            // Cache jobs for /jobs page
            if (data.matchedJobs?.length) {
                localStorage.setItem("latestJobResults", JSON.stringify({
                    matchedJobs: data.matchedJobs,
                    jobCategory: department,
                }));
            }

            router.push("/jobs");
        } catch (err) {
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen" style={{ backgroundColor: "#F8FAFC" }}>
            <Sidebar />
            <main className="flex-1 lg:ml-64 p-6 lg:p-10 flex flex-col items-center">
                <div className="w-full max-w-2xl mt-6">

                    {/* ── Header ── */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#EEF2FF" }}>
                                <SparklesIcon className="w-5 h-5" style={{ color: "#4F46E5" }} />
                            </div>
                            <h1 className="text-2xl font-black" style={{ color: "#111827" }}>Find Jobs Without Resume</h1>
                        </div>
                        <p className="text-sm ml-[52px]" style={{ color: "#6B7280" }}>
                            Tell us your role and experience — we'll find matching jobs instantly. No resume needed.
                        </p>
                    </div>

                    {/* ── Step progress ── */}
                    <div className="flex items-center gap-2 mb-7">
                        {STEPS.map((s, i) => (
                            <div key={s} className="flex items-center gap-2">
                                <div
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                                    style={{
                                        backgroundColor: i < step ? "#DCFCE7" : i === step ? "#4F46E5" : "#F3F4F6",
                                        color: i < step ? "#16A34A" : i === step ? "#FFFFFF" : "#9CA3AF",
                                    }}
                                >
                                    {i < step
                                        ? <CheckCircleIcon className="w-3.5 h-3.5" />
                                        : <span>{i + 1}</span>
                                    }
                                    <span>{s}</span>
                                </div>
                                {i < STEPS.length - 1 && (
                                    <div className="h-px w-5" style={{ backgroundColor: i < step ? "#86EFAC" : "#E5E7EB" }} />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* ── STEP 0 : Department ── */}
                    <AnimatePresence mode="wait">
                        {step === 0 && (
                            <motion.section
                                key="step0"
                                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                                className="bg-white rounded-2xl p-8 shadow-sm"
                                style={{ border: "1px solid #E5E7EB" }}
                            >
                                <h2 className="text-lg font-bold mb-1" style={{ color: "#111827" }}>
                                    Which department are you targeting?
                                </h2>
                                <p className="text-sm mb-6" style={{ color: "#6B7280" }}>
                                    This helps us filter the right designation list for you.
                                </p>
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        {
                                            key: "IT",
                                            label: "IT & Tech",
                                            desc: "Software, Data, Cloud, AI, DevOps…",
                                            Icon: ComputerDesktopIcon,
                                            bg: "#EEF2FF",
                                            color: "#4F46E5",
                                        },
                                        {
                                            key: "NON_IT",
                                            label: "Non-IT",
                                            desc: "Sales, Finance, HR, Operations, Marketing…",
                                            Icon: BuildingOffice2Icon,
                                            bg: "#F5F3FF",
                                            color: "#7C3AED",
                                        },
                                    ].map((d) => (
                                        <button
                                            key={d.key}
                                            onClick={() => handleDept(d.key)}
                                            className="p-6 rounded-xl border-2 text-left group transition-all hover:shadow-md"
                                            style={{ borderColor: "#E5E7EB", backgroundColor: "#FAFAFA" }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.borderColor = d.color;
                                                e.currentTarget.style.backgroundColor = d.bg;
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.borderColor = "#E5E7EB";
                                                e.currentTarget.style.backgroundColor = "#FAFAFA";
                                            }}
                                        >
                                            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: d.bg }}>
                                                <d.Icon className="w-5 h-5" style={{ color: d.color }} />
                                            </div>
                                            <p className="font-bold text-base mb-1" style={{ color: "#111827" }}>{d.label}</p>
                                            <p className="text-xs" style={{ color: "#9CA3AF" }}>{d.desc}</p>
                                        </button>
                                    ))}
                                </div>
                            </motion.section>
                        )}

                        {/* ── STEP 1 : Designation ── */}
                        {step === 1 && (
                            <motion.section
                                key="step1"
                                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                                className="bg-white rounded-2xl p-8 shadow-sm"
                                style={{ border: "1px solid #E5E7EB" }}
                            >
                                <h2 className="text-lg font-bold mb-1" style={{ color: "#111827" }}>
                                    What is your target role?
                                </h2>
                                <p className="text-sm mb-5" style={{ color: "#6B7280" }}>
                                    Search from our list — or type any custom role if yours isn't here.
                                </p>

                                {/* Search input */}
                                <div className="relative mb-4">
                                    <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#9CA3AF" }} />
                                    <input
                                        ref={searchRef}
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" && search.trim()) chooseDesignation(search.trim());
                                        }}
                                        placeholder="Type to search or enter your own role…"
                                        className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all bg-white"
                                        style={{ border: "1px solid #E5E7EB", color: "#111827" }}
                                        onFocus={(e) => { e.target.style.borderColor = "#4F46E5"; e.target.style.boxShadow = "0 0 0 3px rgba(79,70,229,0.1)"; }}
                                        onBlur={(e) => { e.target.style.borderColor = "#E5E7EB"; e.target.style.boxShadow = "none"; }}
                                    />
                                </div>

                                {/* "Use custom role" button — appears when typed value is not in the list */}
                                <AnimatePresence>
                                    {isCustom && (
                                        <motion.button
                                            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                                            onClick={() => chooseDesignation(search.trim())}
                                            className="w-full mb-3 flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all"
                                            style={{ backgroundColor: "#EEF2FF", color: "#4F46E5", border: "1.5px dashed #4F46E5" }}
                                        >
                                            <span>Use "<strong>{search.trim()}</strong>" as my designation</span>
                                            <ArrowRightIcon className="w-4 h-4 shrink-0 ml-2" />
                                        </motion.button>
                                    )}
                                </AnimatePresence>

                                {/* Filtered preset list */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-1">
                                    {filteredList.length > 0 ? (
                                        filteredList.map((d) => (
                                            <button
                                                key={d}
                                                onClick={() => chooseDesignation(d)}
                                                className="px-4 py-2.5 rounded-xl border text-sm font-medium text-left transition-all"
                                                style={{ borderColor: "#E5E7EB", color: "#374151", backgroundColor: "#FAFAFA" }}
                                                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#4F46E5"; e.currentTarget.style.backgroundColor = "#EEF2FF"; e.currentTarget.style.color = "#4F46E5"; }}
                                                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.backgroundColor = "#FAFAFA"; e.currentTarget.style.color = "#374151"; }}
                                            >
                                                {d}
                                            </button>
                                        ))
                                    ) : search.trim().length === 0 ? (
                                        /* Show all when input is empty */
                                        (DESIGNATIONS[department] || []).map((d) => (
                                            <button
                                                key={d}
                                                onClick={() => chooseDesignation(d)}
                                                className="px-4 py-2.5 rounded-xl border text-sm font-medium text-left transition-all"
                                                style={{ borderColor: "#E5E7EB", color: "#374151", backgroundColor: "#FAFAFA" }}
                                                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#4F46E5"; e.currentTarget.style.backgroundColor = "#EEF2FF"; e.currentTarget.style.color = "#4F46E5"; }}
                                                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.backgroundColor = "#FAFAFA"; e.currentTarget.style.color = "#374151"; }}
                                            >
                                                {d}
                                            </button>
                                        ))
                                    ) : (
                                        <p className="text-sm col-span-2 py-3 text-center" style={{ color: "#9CA3AF" }}>
                                            No preset matches — use the button above to proceed with your custom role.
                                        </p>
                                    )}
                                </div>

                                <button onClick={() => setStep(0)} className="mt-5 text-sm hover:underline" style={{ color: "#9CA3AF" }}>
                                    ← Change department
                                </button>
                            </motion.section>
                        )}

                        {/* ── STEP 2 : Experience ── */}
                        {step === 2 && (
                            <motion.section
                                key="step2"
                                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                                className="bg-white rounded-2xl p-8 shadow-sm"
                                style={{ border: "1px solid #E5E7EB" }}
                            >
                                <h2 className="text-lg font-bold mb-1" style={{ color: "#111827" }}>
                                    How much experience do you have?
                                </h2>
                                <p className="text-sm mb-6" style={{ color: "#6B7280" }}>
                                    Select <strong>Fresher</strong> if you're a student or have just graduated.
                                </p>

                                {/* Quick experience tiles */}
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-6">
                                    {EXPERIENCE_OPTIONS.map((opt) => {
                                        const active = experience === opt.value;
                                        return (
                                            <button
                                                key={opt.value}
                                                onClick={() => setExperience(opt.value)}
                                                className="flex flex-col items-center justify-center py-4 px-2 rounded-xl border-2 text-center transition-all"
                                                style={{
                                                    borderColor: active ? "#4F46E5" : "#E5E7EB",
                                                    backgroundColor: active ? "#EEF2FF" : "#FAFAFA",
                                                    color: active ? "#4F46E5" : "#374151",
                                                }}
                                            >
                                                <span className="text-sm font-bold">{opt.label}</span>
                                                <span className="text-[10px] mt-0.5" style={{ color: active ? "#6366F1" : "#9CA3AF" }}>{opt.sub}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Or type a specific number */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>
                                        Or type exact years:
                                    </label>
                                    <input
                                        type="number"
                                        min="0" max="50"
                                        value={experience}
                                        onChange={(e) => setExperience(e.target.value)}
                                        placeholder="e.g. 3"
                                        className="w-28 px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                                        style={{ border: "1px solid #E5E7EB", color: "#111827" }}
                                        onFocus={(e) => { e.target.style.borderColor = "#4F46E5"; e.target.style.boxShadow = "0 0 0 3px rgba(79,70,229,0.1)"; }}
                                        onBlur={(e) => { e.target.style.borderColor = "#E5E7EB"; e.target.style.boxShadow = "none"; }}
                                    />
                                </div>

                                {/* Profile summary */}
                                {experience !== "" && (
                                    <div className="mb-6 px-4 py-3.5 rounded-xl text-sm" style={{ backgroundColor: "#F0FDF4", border: "1px solid #BBF7D0", color: "#15803D" }}>
                                        <span className="font-semibold">Ready to search: </span>
                                        <span className="font-bold">{designation}</span>
                                        {" · "}{department === "IT" ? "IT & Tech" : "Non-IT"}
                                        {" · "}
                                        {experience === "0" ? "Fresher" : `${experience} year${experience === "1" ? "" : "s"} experience`}
                                    </div>
                                )}

                                {error && (
                                    <p className="text-sm mb-4 px-3 py-2 rounded-lg" style={{ backgroundColor: "#FEE2E2", color: "#DC2626" }}>
                                        {error}
                                    </p>
                                )}

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setStep(1)}
                                        className="px-5 py-2.5 rounded-xl border text-sm font-semibold transition-colors hover:bg-gray-50"
                                        style={{ borderColor: "#E5E7EB", color: "#374151" }}
                                    >
                                        ← Back
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={loading || experience === ""}
                                        className="flex items-center gap-2 px-7 py-2.5 rounded-xl text-sm font-semibold text-white brand-gradient hover:opacity-90 transition-all disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <SparklesIcon className="w-4 h-4" />
                                        )}
                                        {loading ? "Finding jobs…" : "Find My Jobs"}
                                    </button>
                                </div>
                            </motion.section>
                        )}
                    </AnimatePresence>

                    {/* Bottom hint */}
                    <p className="text-center text-xs mt-6" style={{ color: "#9CA3AF" }}>
                        Have a resume?{" "}
                        <a href="/resume-upload" className="font-semibold hover:underline" style={{ color: "#4F46E5" }}>
                            Upload it for better AI matching →
                        </a>
                    </p>

                </div>
            </main>
        </div>
    );
}
