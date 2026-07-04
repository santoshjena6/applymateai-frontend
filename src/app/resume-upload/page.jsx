"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import ResumeUpload from "@/components/ResumeUpload";
import { CheckIcon, SparklesIcon } from "@heroicons/react/24/outline";

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
        // Persist jobCategory so dashboard & jobs pages know the user's category
        if (data?.jobCategory) {
            try {
                const existing = JSON.parse(localStorage.getItem("applync_user") || "{}");
                localStorage.setItem("applync_user", JSON.stringify({ ...existing, jobCategory: data.jobCategory }));
            } catch (_) {}
        }
        setExtractedData(data);
        setCurrentStep(3); // Move to results step
    };

    const handleUploadStart = () => {
        setCurrentStep(2); // Move to analysis step
    };

    const handleReset = () => {
        setExtractedData(null);
        setCurrentStep(1);
    };

    const goToJobs = (category) => router.push(`/jobs?category=${category || "IT"}`);

    return (
        <div className="flex min-h-screen bg-background font-sans">
            <Sidebar />

            <main className="flex-1 lg:ml-64 p-6 lg:p-12 flex flex-col items-center justify-start min-h-screen">
                
                {/* Header Section */}
                <div className="w-full max-w-3xl mx-auto text-center mb-10 mt-8">
                    <h1 className="text-4xl font-bold text-text-primary mb-4 tracking-tight">AI Resume Analysis</h1>
                    <p className="text-base text-text-secondary">
                        Upload your resume to instantly extract key skills and find highly matched opportunities.
                    </p>
                    {/* Manual entry option */}
                    <p className="mt-3 text-sm text-text-secondary">
                        Don&apos;t have a resume?{" "}
                        <a
                            href="/manual-profile"
                            className="font-semibold text-primary hover:underline"
                        >
                            Enter your details manually →
                        </a>
                    </p>
                </div>

                {/* Stepper */}
                <div className="w-full max-w-2xl mx-auto mb-12">
                    <div className="flex items-center justify-between relative">
                        {/* Connecting Line */}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-border-color z-0"></div>
                        
                        {/* Step 1: Upload */}
                        <div className="relative z-10 flex flex-col items-center bg-background px-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${currentStep >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                                {currentStep > 1 ? <CheckIcon className="w-4 h-4 text-white" /> : "1"}
                            </div>
                            <span className={`text-xs mt-2 font-medium ${currentStep >= 1 ? 'text-primary' : 'text-gray-500'}`}>Upload</span>
                        </div>

                        {/* Step 2: Analysis */}
                        <div className="relative z-10 flex flex-col items-center bg-background px-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${currentStep >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                                {currentStep > 2 ? <CheckIcon className="w-4 h-4 text-white" /> : "2"}
                            </div>
                            <span className={`text-xs mt-2 font-medium ${currentStep >= 2 ? 'text-primary' : 'text-gray-500'}`}>Analysis</span>
                        </div>

                        {/* Step 3: Results */}
                        <div className="relative z-10 flex flex-col items-center bg-background px-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${currentStep >= 3 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                                3
                            </div>
                            <span className={`text-xs mt-2 font-medium ${currentStep >= 3 ? 'text-primary' : 'text-gray-500'}`}>Results</span>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="w-full max-w-6xl mx-auto flex justify-center">
                    <div className={`grid gap-8 w-full transition-all duration-500 ${currentStep === 1 ? "grid-cols-1 max-w-3xl" : "grid-cols-1 lg:grid-cols-2 max-w-6xl"}`}>
                        
                        {/* Left Side: Upload / Scanner (Always mounted) */}
                        <div className={`bg-surface rounded-3xl p-8 sm:p-12 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-border-color h-fit transition-all duration-500 ${currentStep > 1 ? "animate-in fade-in slide-in-from-left-8" : ""}`}>
                            <ResumeUpload 
                                onUploadStart={handleUploadStart}
                                onUploadSuccess={handleUploadSuccess} 
                                isAnalyzing={currentStep === 2}
                            />
                        </div>
                        
                        {/* Right Side: Results or Loading (Only mounted for steps 2 and 3) */}
                        {currentStep > 1 && (
                            <div className="bg-surface rounded-3xl p-8 sm:p-12 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-border-color h-fit transition-all duration-500 animate-in fade-in slide-in-from-right-8">
                                {currentStep === 2 ? (
                                    <div className="text-center py-16 flex flex-col items-center justify-center h-full">
                                        <div className="w-16 h-16 bg-gray-50 rounded-2xl border border-border-color flex items-center justify-center mx-auto mb-6">
                                            <SparklesIcon className="w-8 h-8 text-primary animate-pulse" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-text-primary mb-2">Extracting Insights...</h2>
                                        <p className="text-text-secondary">Please wait while we analyze your resume for key skills and experience.</p>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <CheckIcon className="w-8 h-8 text-success" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-text-primary mb-2">Analysis Complete!</h2>
                                        <p className="text-text-secondary mb-8">We've successfully extracted your profile and found matching roles.</p>
                                        
                                        <div className="bg-background rounded-2xl p-6 border border-border-color mb-8 text-left">
                                            <h3 className="font-semibold text-text-primary mb-4 text-lg border-b border-border-color pb-3">Detected Profile</h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">Role</p>
                                                    <p className="font-medium text-text-primary">{extractedData?.jobTitle || "Software Engineer"}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">Experience</p>
                                                    <p className="font-medium text-text-primary">{extractedData?.experienceYears != null ? `${extractedData.experienceYears} Years` : "Evaluated"}</p>
                                                </div>
                                                <div className="col-span-2 mt-2">
                                                    <p className="text-xs text-text-secondary uppercase tracking-wider mb-2">Top Skills</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {extractedData?.skills?.slice(0, 8).map((skill, i) => (
                                                            <span key={i} className="px-3 py-1.5 bg-primary-light text-primary text-xs font-semibold rounded-lg">
                                                                {skill}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                                            <button 
                                                onClick={handleReset}
                                                className="px-6 py-3.5 rounded-xl font-medium text-text-secondary bg-background border border-border-color hover:bg-gray-50 transition-colors w-full sm:w-auto"
                                            >
                                                Upload Another
                                            </button>
                                            <button 
                                                onClick={() => goToJobs(extractedData?.jobCategory)}
                                                className="px-8 py-3.5 rounded-xl font-medium text-white bg-primary hover:bg-primary-hover transition-colors shadow-sm w-full sm:w-auto"
                                            >
                                                View Matching Jobs
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
