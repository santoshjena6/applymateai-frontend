"use client";

import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline";

const StatsCard = ({ title, value, trend, trendType, icon: Icon }) => {
    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-blue-200 transition-all duration-300 group shadow-sm">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
                    <h3 className="text-2xl font-black mt-1 text-slate-900">{value}</h3>

                    {trend && (
                        <div className={`flex items-center mt-2 text-[10px] font-black uppercase tracking-widest ${trendType === "up" ? "text-emerald-600" : "text-rose-600"
                            }`}>
                            {trendType === "up" ? (
                                <ArrowUpIcon className="w-3 h-3 mr-1" />
                            ) : (
                                <ArrowDownIcon className="w-3 h-3 mr-1" />
                            )}
                            {trend} vs last month
                        </div>
                    )}
                </div>

                <div className="p-3 rounded-xl bg-slate-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 border border-slate-100">
                    <Icon className="w-5 h-5" />
                </div>
            </div>
        </div>
    );
};

export default StatsCard;
