"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import ResumeUpload from "@/components/ResumeUpload";
import { CheckIcon, SparklesIcon } from "@heroicons/react/24/outline";

const SG = "'Special Gothic', sans-serif";
const SW = "'Switzer', sans-serif";
const dark = "#080b0f";
const gray = "#4b5b63";
const white = "#ffffff";
const borderCol = "#e8e8e8";
const accent = "#3a7ca5";

export default function ResumeUploadPage() {
    const router = useRouter();
    const [extractedData, setExtractedData] = useState(null);
    const [currentStep, setCurrentStep] = useState(1);

    useEffect(() => {
        // Auth guard
        const token = localStorage.getItem("applync_token");
        if (!token) router.replace("/login");
    }, [router]);

    const handleUploadSuccess = (data) => {
        if (data?.jobCategory) {
            try {
                const existing = JSON.parse(localStorage.getItem("applync_user") || "{}");
                localStorage.setItem("applync_user", JSON.stringify({ ...existing, jobCategory: data.jobCategory }));
            } catch (_) {}
        }
        setExtractedData(data);
        setCurrentStep(3);
    };

    const handleUploadStart = () => setCurrentStep(2);
    const handleReset = () => { setExtractedData(null); setCurrentStep(1); };
    const goToJobs = (category) => router.push(`/jobs?category=${category || "IT"}`);

    return (
        <div style={{ display: "flex", minHeight: "100vh", fontFamily: SW, background: "linear-gradient(to bottom, #d5ecfa, #e9f2f9)" }}>
            <Sidebar />

            <main style={{ flex: 1, padding: "24px 40px", marginLeft: "256px" }} className="lg:ml-64 flex flex-col items-center justify-center min-h-screen">
                
                {/* Header Section */}
                <div style={{ width: "100%", maxWidth: 800, textAlign: "center", marginBottom: 24 }}>
                    <h1 style={{ fontFamily: SG, fontSize: 36, fontWeight: 800, color: dark, letterSpacing: "-1px", marginBottom: 12 }}>
                        AI Resume Analysis
                    </h1>
                    <p style={{ fontFamily: SW, fontSize: 15, color: gray, lineHeight: 1.5, maxWidth: 500, margin: "0 auto" }}>
                        Upload your resume to instantly extract key skills and find highly matched opportunities.
                    </p>
                    <p style={{ marginTop: 12, fontSize: 13, color: gray }}>
                        Don't have a resume?{" "}
                        <a href="/manual-profile" style={{ fontWeight: 700, color: dark, textDecoration: "none" }}>
                            Enter details manually →
                        </a>
                    </p>
                </div>

                {/* Stepper */}
                <div style={{ width: "100%", maxWidth: 500, margin: "0 auto 32px", position: "relative" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
                        <div style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: "100%", height: 2, background: "rgba(255,255,255,0.6)", zIndex: 0 }} />
                        
                        {[
                            { num: 1, label: "Upload" },
                            { num: 2, label: "Analysis" },
                            { num: 3, label: "Results" }
                        ].map((step, idx) => {
                            const active = currentStep >= step.num;
                            const passed = currentStep > step.num;
                            return (
                                <div key={step.num} style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center" }}>
                                    <div style={{
                                        width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                                        fontFamily: SW, fontSize: 14, fontWeight: 700,
                                        background: active ? dark : "rgba(255,255,255,0.8)",
                                        color: active ? white : gray,
                                        boxShadow: active ? "0 4px 12px rgba(8,11,15,0.15)" : "none",
                                        border: active ? "none" : `1px solid ${borderCol}`,
                                        transition: "all 0.3s ease"
                                    }}>
                                        {passed ? <CheckIcon style={{ width: 18, height: 18, color: white }} /> : step.num}
                                    </div>
                                    <span style={{ fontSize: 12, fontWeight: 600, marginTop: 8, color: active ? dark : gray }}>{step.label}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Main Content Area */}
                <div style={{ width: "100%", maxWidth: 1100, display: "flex", justifyContent: "center" }}>
                    <div className={`grid gap-8 w-full transition-all duration-500 ${currentStep === 1 ? "grid-cols-1 max-w-3xl" : "grid-cols-1 lg:grid-cols-2 max-w-6xl"}`}>
                        
                        {/* Left Side: Upload / Scanner */}
                        <div style={{
                            background: white, borderRadius: 24, padding: "32px",
                            boxShadow: "0 24px 80px rgba(0,0,0,0.07), 0 4px 20px rgba(0,0,0,0.04)",
                            border: `1px solid rgba(255,255,255,0.5)`
                        }} className={`transition-all duration-500 ${currentStep > 1 ? "animate-in fade-in slide-in-from-left-8" : ""}`}>
                            <ResumeUpload 
                                onUploadStart={handleUploadStart}
                                onUploadSuccess={handleUploadSuccess} 
                                isAnalyzing={currentStep === 2}
                            />
                        </div>
                        
                        {/* Right Side: Results or Loading */}
                        {currentStep > 1 && (
                            <div style={{
                                background: white, borderRadius: 24, padding: "32px",
                                boxShadow: "0 24px 80px rgba(0,0,0,0.07), 0 4px 20px rgba(0,0,0,0.04)",
                                border: `1px solid rgba(255,255,255,0.5)`,
                                display: "flex", flexDirection: "column", justifyContent: "center"
                            }} className="transition-all duration-500 animate-in fade-in slide-in-from-right-8">
                                
                                {currentStep === 2 ? (
                                    <div style={{ textAlign: "center", padding: "24px 0" }}>
                                        <div style={{ width: 56, height: 56, background: "#f8fafc", borderRadius: 16, border: `1px solid ${borderCol}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                                            <SparklesIcon style={{ width: 28, height: 28, color: dark }} className="animate-pulse" />
                                        </div>
                                        <h2 style={{ fontFamily: SG, fontSize: 24, fontWeight: 800, color: dark, marginBottom: 8, letterSpacing: "-0.5px" }}>Extracting Insights...</h2>
                                        <p style={{ fontSize: 14, color: gray, lineHeight: 1.5 }}>Please wait while our AI analyzes your resume.</p>
                                    </div>
                                ) : (
                                    <div style={{ textAlign: "center" }}>
                                        <div style={{ width: 48, height: 48, background: "#ecfdf5", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                                            <CheckIcon style={{ width: 24, height: 24, color: "#10b981" }} />
                                        </div>
                                        <h2 style={{ fontFamily: SG, fontSize: 24, fontWeight: 800, color: dark, marginBottom: 8, letterSpacing: "-0.5px" }}>Analysis Complete!</h2>
                                        <p style={{ fontSize: 14, color: gray, marginBottom: 24 }}>We've successfully extracted your profile and found matching roles.</p>
                                        
                                        <div style={{ background: "#fcfcfc", borderRadius: 16, padding: 20, border: `1px solid ${borderCol}`, marginBottom: 24, textAlign: "left" }}>
                                            <h3 style={{ fontFamily: SW, fontWeight: 700, fontSize: 15, color: dark, marginBottom: 12, borderBottom: `1px solid ${borderCol}`, paddingBottom: 8 }}>Detected Profile</h3>
                                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                                <div>
                                                    <p style={{ fontSize: 11, color: gray, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700, marginBottom: 4 }}>Role</p>
                                                    <p style={{ fontSize: 15, fontWeight: 600, color: dark }}>{extractedData?.jobTitle || "Software Engineer"}</p>
                                                </div>
                                                <div>
                                                    <p style={{ fontSize: 11, color: gray, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700, marginBottom: 4 }}>Experience</p>
                                                    <p style={{ fontSize: 15, fontWeight: 600, color: dark }}>{extractedData?.experienceYears != null ? `${extractedData.experienceYears} Years` : "Evaluated"}</p>
                                                </div>
                                                <div style={{ gridColumn: "span 2", marginTop: 8 }}>
                                                    <p style={{ fontSize: 11, color: gray, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700, marginBottom: 8 }}>Top Skills</p>
                                                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                                        {extractedData?.skills?.slice(0, 8).map((skill, i) => (
                                                            <span key={i} style={{ padding: "6px 12px", background: "#f1f5f9", color: dark, fontSize: 12, fontWeight: 600, borderRadius: 8 }}>
                                                                {skill}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
                                            <button 
                                                onClick={() => goToJobs(extractedData?.jobCategory)}
                                                style={{ width: "100%", padding: "14px 24px", background: dark, color: white, borderRadius: 999, border: "none", fontFamily: SW, fontSize: 15, fontWeight: 600, cursor: "pointer", transition: "all 0.2s ease" }}
                                                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(8,11,15,0.2)"; }}
                                                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
                                            >
                                                View Matching Jobs →
                                            </button>
                                            <button 
                                                onClick={handleReset}
                                                style={{ width: "100%", padding: "14px 24px", background: "transparent", color: gray, borderRadius: 999, border: `1px solid ${borderCol}`, fontFamily: SW, fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all 0.2s ease" }}
                                                onMouseEnter={e => e.currentTarget.style.background = "#f9f9f9"}
                                                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                            >
                                                Upload Another Resume
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
