"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import ResumeUpload from "@/components/ResumeUpload";
import FilterPanel from "@/components/FilterPanel";
import JobCard from "@/components/JobCard";
import { SparklesIcon, BriefcaseIcon, RocketLaunchIcon } from "@heroicons/react/24/outline";
import { getFilteredJobs } from "@/services/resumeService";
import { motion, AnimatePresence } from "framer-motion";

export default function JobsPage() {
    const [jobs, setJobs] = useState([]);
    const [selectedJobIds, setSelectedJobIds] = useState(new Set());
    const [loading, setLoading] = useState(false);
    const [showUpload, setShowUpload] = useState(false);

    useEffect(() => {
        const storedJobs = localStorage.getItem("latestJobResults");
        if (storedJobs) {
            setJobs(JSON.parse(storedJobs));
            localStorage.removeItem("latestJobResults");
        }
    }, []);

    const handleFilterChange = async (filters) => {
        setLoading(true);
        try {
            const filteredJobs = await getFilteredJobs(filters);
            setJobs(filteredJobs);
        } catch (err) {
            console.error("Failed to filter jobs", err);
        } finally {
            // Simulated delay for premium feel and to show skeleton
            setTimeout(() => setLoading(false), 600);
        }
    };

    const toggleJobSelection = (index, isSelected) => {
        const newSelection = new Set(selectedJobIds);
        if (isSelected) {
            newSelection.add(index);
        } else {
            newSelection.delete(index);
        }
        setSelectedJobIds(newSelection);
    };

    const handleAutoApply = () => {
        if (selectedJobIds.size === 0) return;
        alert(`Initializing ApplyMate AI to auto-apply to ${selectedJobIds.size} jobs...`);
    };

    return (
        <div className="flex min-h-screen bg-slate-50/50">
            <Sidebar />

            <main className="flex-1 lg:ml-64 p-6 lg:p-12">
                <motion.header
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12"
                >
                    <div className="space-y-1">
                        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-50/50 rounded-full border border-blue-100/50">
                            <SparklesIcon className="w-3.5 h-3.5 text-blue-600" />
                            <span className="text-[10px] font-bold text-blue-600 tracking-wider uppercase">Advanced AI Matcher</span>
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">System Opportunities</h1>
                        <p className="text-slate-500 font-medium">Personalized career matches optimized for your profile.</p>
                    </div>

                    <div className="flex items-center space-x-4">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setShowUpload(!showUpload)}
                            className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
                        >
                            {showUpload ? "Close Uploader" : "Update Resume"}
                        </motion.button>
                        <motion.button
                            whileHover={selectedJobIds.size > 0 ? { scale: 1.02 } : {}}
                            whileTap={selectedJobIds.size > 0 ? { scale: 0.98 } : {}}
                            onClick={handleAutoApply}
                            className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all shadow-lg flex items-center
                                ${selectedJobIds.size > 0 ? "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/20" : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"}
                            `}
                        >
                            <RocketLaunchIcon className="w-4 h-4 mr-2" />
                            Auto Apply ({selectedJobIds.size})
                        </motion.button>
                    </div>
                </motion.header>

                <AnimatePresence>
                    {showUpload && (
                        <motion.section
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-12 overflow-hidden"
                        >
                            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200/60 shadow-xl shadow-slate-200/40">
                                <ResumeUpload onUploadSuccess={(data) => { setJobs(data); setShowUpload(false); }} />
                            </div>
                        </motion.section>
                    )}
                </AnimatePresence>

                <div className="mb-10">
                    <FilterPanel onFilterChange={handleFilterChange} />
                </div>

                <div className="relative">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-100">
                                <BriefcaseIcon className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 tracking-tight leading-tight">Matched Vacancies</h2>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                                    {jobs.length} Optimized Results
                                </p>
                            </div>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6"
                            >
                                {[1, 2, 3, 4].map(idx => (
                                    <div key={idx} className="h-64 rounded-3xl bg-slate-100/50 animate-pulse border border-slate-100 shimmer" />
                                ))}
                            </motion.div>
                        ) : jobs.length > 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6"
                            >
                                {jobs.map((job, index) => (
                                    <JobCard
                                        key={index}
                                        index={index}
                                        role={job.role}
                                        company={job.company}
                                        location={job.location}
                                        experience={job.experience}
                                        source={job.source}
                                        applyLink={job.applyLink}
                                        isSelected={selectedJobIds.has(index)}
                                        onSelect={(isSelected) => toggleJobSelection(index, isSelected)}
                                    />
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-slate-200"
                            >
                                <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
                                    <BriefcaseIcon className="w-10 h-10 text-slate-300" />
                                </div>
                                <h4 className="text-xl font-bold text-slate-900 mb-2">No vacancies matched yet</h4>
                                <p className="text-slate-500 font-medium max-w-sm mx-auto">
                                    Refine your filters above or upload your resume for immediate AI matching.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
