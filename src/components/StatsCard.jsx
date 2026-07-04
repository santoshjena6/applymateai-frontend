"use client";

import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline";

const StatsCard = ({ title, value, trend, trendType, icon: Icon }) => {
    return (
        <div className="p-6 rounded-2xl transition-all duration-300 group"
            style={{ backgroundColor: "#0f0f1e", border: "1px solid #1e1e3a" }}>
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: "#475569" }}>{title}</p>
                    <h3 className="text-2xl font-black mt-1" style={{ color: "#e2e8f0" }}>{value}</h3>
                    {trend && (
                        <div className={`flex items-center mt-2 text-[10px] font-black uppercase tracking-widest ${trendType === "up" ? "text-emerald-400" : "text-rose-400"}`}>
                            {trendType === "up" ? <ArrowUpIcon className="w-3 h-3 mr-1" /> : <ArrowDownIcon className="w-3 h-3 mr-1" />}
                            {trend} vs last month
                        </div>
                    )}
                </div>
                <div className="p-3 rounded-xl transition-all duration-300 group-hover:brand-gradient"
                    style={{ backgroundColor: "rgba(99,102,241,0.12)", border: "1px solid #1e1e3a" }}>
                    <Icon className="w-5 h-5" style={{ color: "#6366f1" }} />
                </div>
            </div>
        </div>
    );
};

export default StatsCard;
