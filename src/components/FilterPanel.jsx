"use client";

import { useState } from "react";
import { MagnifyingGlassIcon, FunnelIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

const FilterPanel = ({ onFilterChange }) => {
    const [filters, setFilters] = useState({
        role: "",
        location: "",
        source: "",
        experience: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newFilters = { ...filters, [name]: value };
        setFilters(newFilters);
        // Instant filter application
        onFilterChange(newFilters);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/50 backdrop-blur-md p-8 rounded-[2.5rem] border border-slate-200/60 shadow-lg shadow-slate-200/20 mb-10"
        >
            <div className="flex items-center space-x-3 mb-8 text-slate-900">
                <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-lg shadow-slate-900/10">
                    <FunnelIcon className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="text-xl font-bold tracking-tight leading-tight">Search Engine</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5 opacity-60">Optimize your discovery</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Role */}
                <div className="space-y-2">
                    <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider px-1">Target Role</label>
                    <div className="relative group">
                        <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                        <input
                            name="role"
                            value={filters.role}
                            onChange={handleChange}
                            placeholder="e.g. Java Lead"
                            className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all shadow-sm placeholder:text-slate-300"
                        />
                    </div>
                </div>

                {/* Location */}
                <div className="space-y-2">
                    <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider px-1">Location</label>
                    <div className="relative">
                        <select
                            name="location"
                            value={filters.location}
                            onChange={handleChange}
                            className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all appearance-none cursor-pointer shadow-sm"
                        >
                            <option value="">Worldwide / Remote</option>
                            <option value="India">India</option>
                            <option value="Remote">Remote Only</option>
                            <option value="Bangalore">Bangalore</option>
                            <option value="Hyderabad">Hyderabad</option>
                            <option value="USA">USA</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                        </div>
                    </div>
                </div>

                {/* Source */}
                <div className="space-y-2">
                    <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider px-1">Platform</label>
                    <div className="relative">
                        <select
                            name="source"
                            value={filters.source}
                            onChange={handleChange}
                            className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all appearance-none cursor-pointer shadow-sm"
                        >
                            <option value="">All Networks</option>
                            <option value="LinkedIn">LinkedIn</option>
                            <option value="Indeed">Indeed</option>
                            <option value="Company Site">Company Direct</option>
                            <option value="Workday">Workday Cloud</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                        </div>
                    </div>
                </div>

                {/* Experience */}
                <div className="space-y-2">
                    <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider px-1">Seniority</label>
                    <div className="relative">
                        <select
                            name="experience"
                            value={filters.experience}
                            onChange={handleChange}
                            className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all appearance-none cursor-pointer shadow-sm"
                        >
                            <option value="">Any Seniority</option>
                            {[...Array(10)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>{i + 1} Year{i + 1 > 1 ? 's' : ''} +</option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default FilterPanel;
