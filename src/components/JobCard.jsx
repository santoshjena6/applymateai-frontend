"use client";

import { motion } from "framer-motion";
import {
    BriefcaseIcon,
    MapPinIcon,
    BuildingOfficeIcon,
    CheckCircleIcon
} from "@heroicons/react/24/outline";

const JobCard = ({ role, company, location, experience, source, applyLink, isSelected, onSelect, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ y: -4, shadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
            className={`group bg-white rounded-2xl p-6 border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between h-full
        ${isSelected ? 'border-blue-600 shadow-xl shadow-blue-600/5 ring-1 ring-blue-600' : 'border-slate-100 shadow-sm hover:border-blue-200'}
      `}
            onClick={() => onSelect?.(!isSelected)}
        >
            <div>
                <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shrink-0">
                        <BriefcaseIcon className="w-6 h-6 text-slate-400 group-hover:text-white" />
                    </div>

                    <div
                        onClick={(e) => {
                            e.stopPropagation();
                            onSelect?.(!isSelected);
                        }}
                        className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all duration-300 shrink-0 cursor-pointer
                            ${isSelected ? 'bg-blue-600 border-blue-600 shadow-lg shadow-blue-600/30' : 'bg-white border-slate-200 hover:border-blue-400'}
                        `}
                    >
                        {isSelected && <CheckCircleIcon className="w-4 h-4 text-white" />}
                    </div>
                </div>

                <div className="space-y-3">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight leading-tight">
                            {role}
                        </h3>
                        <div className="flex items-center mt-1 text-slate-500 font-semibold text-sm">
                            <BuildingOfficeIcon className="w-4 h-4 mr-1.5 opacity-50" />
                            <span className="truncate">{company}</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <div className="flex items-center px-2.5 py-1 rounded-lg bg-slate-50 text-slate-600 text-[11px] font-bold border border-slate-100 italic transition-colors group-hover:bg-blue-50 group-hover:border-blue-100 group-hover:text-blue-600">
                            <MapPinIcon className="w-3.5 h-3.5 mr-1 text-blue-500" />
                            {location}
                        </div>
                        {experience !== undefined && (
                            <div className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-[11px] font-bold border border-blue-100">
                                {experience} {experience === 1 ? 'Year' : 'Years'} Exp
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-5 border-t border-slate-50 flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Source</span>
                    <span className="text-xs font-bold text-slate-900">{source || 'Direct'}</span>
                </div>
                <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href={applyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-slate-900/10 hover:shadow-blue-600/30"
                >
                    Apply Now
                </motion.a>
            </div>
        </motion.div>
    );
};

export default JobCard;
