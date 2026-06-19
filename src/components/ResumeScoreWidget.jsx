"use client";

import { CheckBadgeIcon, SparklesIcon } from "@heroicons/react/24/outline";

const ResumeScoreWidget = ({ score = 78 }) => {
    const suggestions = [
        "Add Spring Boot projects",
        "Improve summary",
        "Add REST API experience"
    ];

    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-slate-900">Resume Score</h3>
                <SparklesIcon className="w-4 h-4 text-blue-500" />
            </div>

            <div className="flex flex-col items-center mb-8">
                <div className="relative w-24 h-24 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle
                            cx="48"
                            cy="48"
                            r="42"
                            fill="transparent"
                            stroke="currentColor"
                            strokeWidth="8"
                            className="text-slate-50"
                        />
                        <circle
                            cx="48"
                            cy="48"
                            r="42"
                            fill="transparent"
                            stroke="currentColor"
                            strokeWidth="8"
                            strokeDasharray={263.8}
                            strokeDashoffset={263.8 - (263.8 * score) / 100}
                            className="text-blue-600 transition-all duration-1000 ease-out"
                        />
                    </svg>
                    <span className="absolute text-xl font-black text-slate-900">{score}</span>
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-4">Out of 100</p>
            </div>

            <div className="space-y-3">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Improvement Tips</p>
                {suggestions.map((tip, i) => (
                    <div key={i} className="flex items-start p-3 rounded-xl bg-slate-50 border border-slate-100 group hover:border-blue-200 transition-all">
                        <CheckBadgeIcon className="w-4 h-4 text-emerald-500 mt-0.5 mr-3 shrink-0" />
                        <p className="text-xs font-bold text-slate-600 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{tip}</p>
                    </div>
                ))}
            </div>

            <button className="w-full mt-6 py-3 bg-white hover:bg-blue-600 text-blue-600 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-blue-600 shadow-sm">
                Analyze Again
            </button>
        </div>
    );
};

export default ResumeScoreWidget;
