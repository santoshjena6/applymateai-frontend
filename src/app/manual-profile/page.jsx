"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import {
    BriefcaseIcon,
    CheckCircleIcon,
    ChevronDownIcon,
    SparklesIcon,
} from "@heroicons/react/24/outline";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

// ─── Designations list ─────────────────────────────────────────────────────────
const DESIGNATIONS = {
    IT: [
        "Software Developer",
        "Java Developer",
        "Python Developer",
        "Frontend Developer",
        "Backend Developer",
        "Full Stack Developer",
        "React Developer",
        "Node.js Developer",
        "Angular Developer",
        "Data Scientist",
        "Data Analyst",
        "Machine Learning Engineer",
        "AI Engineer",
        "DevOps Engineer",
        "Cloud Engineer",
        "Android Developer",
        "iOS Developer",
        "Flutter Developer",
        "QA / Test Engineer",
        "Database Administrator",
        "System Administrator",
        "Network Engineer",
        "Cybersecurity Analyst",
        "Embedded Systems Engineer",
        "Technical Lead",
        "Software Architect",
        "UI/UX Designer",
        "Business Analyst (IT)",
        "PHP Developer",
        "Golang Developer",
        "C++ Developer",
        "Kotlin Developer",
    ],
    NON_IT: [
        "Sales Executive",
        "Sales Manager",
        "Marketing Executive",
        "Digital Marketing Manager",
        "HR Executive",
        "HR Manager",
        "Business Development Executive",
        "Operations Manager",
        "Supply Chain Manager",
        "Finance Executive",
        "Financial Analyst",
        "Accountant",
        "Civil Engineer",
        "Mechanical Engineer",
        "Electrical Engineer",
        "Project Manager",
        "Content Writer",
        "Graphic Designer",
        "Customer Service Executive",
        "Logistics Manager",
        "Procurement Manager",
        "Legal Executive",
        "Healthcare Professional",
        "Teacher / Educator",
        "Banking Executive",
        "Insurance Executive",
        "Real Estate Agent",
        "Event Manager",
    ],
};

const STEPS = ["Department", "Designation", "Experience"];

export default function ManualProfilePage() {
    const router = useRouter();
    const [step, setStep]               = useState(0); // 0,1,2
    const [department, setDepartment]   = useState(""); // IT or NON_IT
    const [designation, setDesignation] = useState("");
    const [experience, setExperience]   = useState("");
    const [loading, setLoading]         = useState(false);
    const [error, setError]             = useState("");

    useEffect(() => {
        if (!localStorage.getItem("applync_token")) router.replace("/login");
    }, [router]);

    const handleDept = (dept) => {
        setDepartment(dept);
        setDesignation("");
        setStep(1);
    };

    const handleDesignation = (d) => {
        setDesignation(d);
        setStep(2);
    };

    const handleSubmit = async () => {
        if (!experience || isNaN(experience) || Number(experience) < 0) {
            setError("Please enter a valid experience (0 for fresher).");
            return;
        }
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

            // Save to localStorage so /jobs page can use it
            const stored = JSON.parse(localStorage.getItem("applync_user") || "{}");
            localStorage.setItem("applync_user", JSON.stringify({
                ...stored,
                jobCategory: department,
                designation,
            }));

            // Cache jobs for /jobs page to pick up
            if (data.matchedJobs?.length) {
                localStorage.setItem("latestJobResults", JSON.stringify({
                    matchedJobs: data.matchedJobs,
                    jobCategory: department,
                }));
            }

            router.push("/jobs");
        } catch (err) {
            setError(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-background font-sans">
            <Sidebar />
            <main className="flex-1 lg:ml-64 p-6 lg:p-10 max-w-2xl mx-auto w-full">

                {/* Header */}
                <div className="mb-8 mt-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <SparklesIcon className="w-5 h-5 text-primary" />
                        </div>
                        <h1 className="text-2xl font-bold text-text-primary">Find Jobs Without Resume</h1>
                    </div>
                    <p className="text-text-secondary text-sm">
                        Tell us about yourself — we'll find the best matched jobs for you instantly.
                    </p>
                </div>

                {/* Step Progress */}
                <div className="flex items-center gap-2 mb-8">
                    {STEPS.map((s, i) => (
                        <div key={s} className="flex items-center gap-2">
                            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                                i < step
                                    ? "bg-green-100 text-green-700"
                                    : i === step
                                        ? "bg-primary text-white"
                                        : "bg-gray-100 text-text-secondary"
                            }`}>
                                {i < step
                                    ? <CheckCircleIcon className="w-3.5 h-3.5" />
                                    : <span>{i + 1}</span>
                                }
                                {s}
                            </div>
                            {i < STEPS.length - 1 && (
                                <div className={`h-px w-6 ${i < step ? "bg-green-400" : "bg-border-color"}`} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Step 0 — Department */}
                {step === 0 && (
                    <section className="bg-surface rounded-2xl border border-border-color p-8 shadow-sm">
                        <h2 className="text-lg font-semibold text-text-primary mb-6">
                            Which department are you in?
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { key: "IT",     label: "IT / Tech",    desc: "Software, Data, Cloud, AI…" },
                                { key: "NON_IT", label: "Non-IT",       desc: "Sales, HR, Finance, Ops…"  },
                            ].map((d) => (
                                <button
                                    key={d.key}
                                    onClick={() => handleDept(d.key)}
                                    className="p-6 rounded-xl border-2 border-border-color hover:border-primary hover:bg-primary/5 transition-all text-left group"
                                >
                                    <BriefcaseIcon className="w-7 h-7 text-primary mb-3" />
                                    <p className="font-bold text-text-primary group-hover:text-primary">{d.label}</p>
                                    <p className="text-xs text-text-secondary mt-1">{d.desc}</p>
                                </button>
                            ))}
                        </div>
                    </section>
                )}

                {/* Step 1 — Designation */}
                {step === 1 && (
                    <section className="bg-surface rounded-2xl border border-border-color p-8 shadow-sm">
                        <h2 className="text-lg font-semibold text-text-primary mb-2">
                            What is your designation?
                        </h2>
                        <p className="text-sm text-text-secondary mb-5">
                            Select your current or desired job title.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-96 overflow-y-auto pr-1">
                            {(DESIGNATIONS[department] || []).map((d) => (
                                <button
                                    key={d}
                                    onClick={() => handleDesignation(d)}
                                    className={`px-4 py-3 rounded-xl border text-sm font-medium text-left transition-all ${
                                        designation === d
                                            ? "border-primary bg-primary/10 text-primary"
                                            : "border-border-color hover:border-primary hover:bg-primary/5 text-text-primary"
                                    }`}
                                >
                                    {d}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setStep(0)}
                            className="mt-5 text-sm text-text-secondary hover:text-primary"
                        >
                            ← Change department
                        </button>
                    </section>
                )}

                {/* Step 2 — Experience */}
                {step === 2 && (
                    <section className="bg-surface rounded-2xl border border-border-color p-8 shadow-sm">
                        <h2 className="text-lg font-semibold text-text-primary mb-2">
                            How many years of experience do you have?
                        </h2>
                        <p className="text-sm text-text-secondary mb-6">
                            Enter <strong>0</strong> if you are a fresher / student.
                        </p>

                        {/* Quick select buttons */}
                        <div className="flex flex-wrap gap-2 mb-5">
                            {["0", "1", "2", "3", "4", "5", "6", "7", "8", "10", "12", "15+"].map((y) => (
                                <button
                                    key={y}
                                    onClick={() => setExperience(y === "15+" ? "15" : y)}
                                    className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-all ${
                                        experience === (y === "15+" ? "15" : y)
                                            ? "border-primary bg-primary text-white"
                                            : "border-border-color bg-background hover:border-primary text-text-primary"
                                    }`}
                                >
                                    {y === "0" ? "Fresher (0)" : `${y} yr${y === "1" ? "" : "s"}`}
                                </button>
                            ))}
                        </div>

                        {/* Or type it */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-text-primary mb-1.5">
                                Or type exact years
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="50"
                                value={experience}
                                onChange={(e) => setExperience(e.target.value)}
                                placeholder="e.g. 3"
                                className="w-32 px-4 py-2.5 rounded-xl border border-border-color bg-background text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                            />
                        </div>

                        {/* Summary */}
                        {experience !== "" && (
                            <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-xl text-sm">
                                <p className="text-text-primary">
                                    Looking for <strong>{designation}</strong> jobs in{" "}
                                    <strong>{department === "IT" ? "IT / Tech" : "Non-IT"}</strong> for{" "}
                                    <strong>
                                        {experience === "0" || experience === "" ? "Freshers" : `${experience} year${experience === "1" ? "" : "s"} experience`}
                                    </strong>
                                </p>
                            </div>
                        )}

                        {error && (
                            <p className="text-sm text-red-600 mb-4">{error}</p>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={() => setStep(1)}
                                className="px-5 py-2.5 rounded-xl border border-border-color text-sm font-semibold text-text-primary hover:bg-gray-50 transition-colors"
                            >
                                ← Back
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={loading || experience === ""}
                                className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60 flex items-center gap-2"
                            >
                                {loading ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <SparklesIcon className="w-4 h-4" />
                                )}
                                {loading ? "Finding jobs…" : "Find My Jobs"}
                            </button>
                        </div>
                    </section>
                )}

            </main>
        </div>
    );
}
