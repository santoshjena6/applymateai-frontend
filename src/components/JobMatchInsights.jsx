"use client";

import { ChartBarIcon } from "@heroicons/react/24/outline";

const JobMatchInsights = () => {
    const stats = [
        { label: "High Match", count: 42, color: "bg-blue-600", percentage: "85%+" },
        { label: "Medium Match", count: 68, color: "bg-purple-500", percentage: "60-85%" },
        { label: "Low Match", count: 14, color: "bg-gray-400", percentage: "< 60%" },
    ];

    const total = stats.reduce((acc, curr) => acc + curr.count, 0);

    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-slate-900">Match Insights</h3>
                <ChartBarIcon className="w-4 h-4 text-purple-500" />
            </div>

            <div className="space-y-6">
                {stats.map((stat, i) => (
                    <div key={i}>
                        <div className="flex justify-between items-end mb-2">
                            <div>
                                <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">{stat.label}</p>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">{stat.percentage} match</p>
                            </div>
                            <span className="text-xs font-black text-slate-900">{stat.count}</span>
                        </div>
                        <div className="w-full bg-slate-50 rounded-full h-1.5 overflow-hidden border border-slate-100">
                            <div
                                className={`${stat.color} h-full rounded-full transition-all duration-1000`}
                                style={{ width: `${(stat.count / total) * 100}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-50">
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="text-left">
                        <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Top Category</p>
                        <p className="text-sm font-black text-slate-900 uppercase tracking-tight">Fullstack Developer</p>
                    </div>
                    <div className="p-2 bg-blue-600 rounded-lg text-white font-black text-[10px]">
                        98%
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobMatchInsights;
