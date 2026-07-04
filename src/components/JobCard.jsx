// JobCard — white card for a single job listing with apply button
"use client";

import { motion } from "framer-motion";
import { BriefcaseIcon, MapPinIcon, BuildingOfficeIcon, CheckCircleIcon, ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

// Category badge styles
const CATEGORY_STYLE = {
    IT:     { label: "IT",     bg: "#EEF2FF", color: "#4F46E5" },
    NON_IT: { label: "Non-IT", bg: "#F5F3FF", color: "#7C3AED" },
};

const JobCard = (props) => {
    const { isSelected, onSelect, index, job } = props;

    // Support both flat props and nested job object
    const role        = props.role        || job?.role        || job?.title;
    const company     = props.company     || job?.company;
    const location    = props.location    || job?.location;
    const source      = props.source      || job?.source;
    const applyLink   = props.applyLink   || job?.applyLink;
    const description = props.description || job?.description;
    const category    = props.category    || job?.category;

    // Build experience string
    const minExp = props.minExperience ?? job?.minExperience;
    const maxExp = props.maxExperience ?? job?.maxExperience;
    const exp    = props.experience    ?? job?.experience;
    let expStr = null;
    if (minExp != null && maxExp != null) expStr = `${minExp}–${maxExp} Yrs`;
    else if (minExp != null)             expStr = `${minExp}+ Yrs`;
    else if (exp != null)                expStr = `${exp} ${exp === 1 ? "Yr" : "Yrs"}`;

    const cat = CATEGORY_STYLE[category] || null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: (index ?? 0) * 0.05 }}
            onClick={() => onSelect?.(!isSelected)}
            className="group flex flex-col justify-between h-full rounded-2xl p-6 cursor-pointer transition-all duration-200 hover:shadow-md bg-white"
            style={{
                border: `1px solid ${isSelected ? "#4F46E5" : "#E5E7EB"}`,
                boxShadow: isSelected
                    ? "0 0 0 2px rgba(79,70,229,0.2), 0 1px 3px rgba(0,0,0,0.08)"
                    : "0 1px 3px rgba(0,0,0,0.08)",
            }}
        >
            <div>
                {/* Card top row — icon + category badge + select checkbox */}
                <div className="flex items-start justify-between mb-5">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#EEF2FF" }}>
                        <BriefcaseIcon className="w-5 h-5" style={{ color: "#4F46E5" }} />
                    </div>
                    <div className="flex items-center space-x-2">
                        {cat && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                                style={{ backgroundColor: cat.bg, color: cat.color }}>
                                {cat.label}
                            </span>
                        )}
                        {/* Select toggle */}
                        <div
                            onClick={(e) => { e.stopPropagation(); onSelect?.(!isSelected); }}
                            className="w-6 h-6 rounded-lg flex items-center justify-center transition-all cursor-pointer"
                            style={{
                                backgroundColor: isSelected ? "#4F46E5" : "transparent",
                                border: `1px solid ${isSelected ? "#4F46E5" : "#D1D5DB"}`,
                            }}
                        >
                            {isSelected && <CheckCircleIcon className="w-4 h-4 text-white" />}
                        </div>
                    </div>
                </div>

                {/* Job details */}
                <div className="space-y-2">
                    <h3 className="text-base font-bold leading-tight" style={{ color: "#111827" }}>{role}</h3>
                    <div className="flex items-center text-sm" style={{ color: "#6B7280" }}>
                        <BuildingOfficeIcon className="w-4 h-4 mr-1.5 shrink-0" />
                        <span className="truncate">{company}</span>
                    </div>
                    {description && (
                        <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "#9CA3AF" }}>{description}</p>
                    )}
                    {/* Location + experience pills */}
                    <div className="flex flex-wrap gap-2 pt-1">
                        <div className="flex items-center px-2.5 py-1 rounded-lg text-[11px] font-medium" style={{ backgroundColor: "#F3F4F6", color: "#6B7280" }}>
                            <MapPinIcon className="w-3.5 h-3.5 mr-1" style={{ color: "#4F46E5" }} />
                            <span className="truncate max-w-[120px]">{location}</span>
                        </div>
                        {expStr && (
                            <div className="px-2.5 py-1 rounded-lg text-[11px] font-medium" style={{ backgroundColor: "#F3F4F6", color: "#6B7280" }}>
                                {expStr}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom row — source + apply button */}
            <div className="mt-5 pt-4 flex items-center justify-between" style={{ borderTop: "1px solid #E5E7EB" }}>
                <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider block mb-0.5" style={{ color: "#9CA3AF" }}>Source</span>
                    <span className="text-xs font-semibold" style={{ color: "#6B7280" }}>{source || "Direct"}</span>
                </div>
                <motion.a
                    whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                    href={applyLink} target="_blank" rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-white brand-gradient hover:opacity-90 transition-all"
                >
                    <span>Apply</span>
                    <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
                </motion.a>
            </div>
        </motion.div>
    );
};

export default JobCard;
