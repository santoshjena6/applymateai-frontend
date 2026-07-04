// KpiCard — white stat card with title, value, trend indicator
"use client";

import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline";

const KpiCard = ({ title, value, trend, trendType, icon: Icon, loading = false }) => {
    // Loading skeleton state
    if (loading) {
        return (
            <div className="p-6 rounded-2xl bg-white" style={{ border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
                <div className="flex justify-between items-start">
                    <div className="space-y-2">
                        <div className="h-2.5 w-24 rounded skeleton" />
                        <div className="h-7 w-16 rounded skeleton" />
                        <div className="h-2.5 w-20 rounded skeleton" />
                    </div>
                    <div className="w-11 h-11 rounded-xl skeleton" />
                </div>
            </div>
        );
    }

    return (
        <div
            className="p-6 rounded-2xl bg-white transition-all duration-200 hover:shadow-md"
            style={{ border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
        >
            <div className="flex justify-between items-start">
                <div>
                    {/* Card title */}
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#6B7280" }}>{title}</p>
                    {/* Metric value */}
                    <h3 className="text-2xl font-black mt-1" style={{ color: "#111827" }}>{value ?? "—"}</h3>
                    {/* Trend indicator */}
                    {trend && (
                        <div className={`flex items-center mt-2 text-[11px] font-semibold ${trendType === "up" ? "text-emerald-600" : "text-red-500"}`}>
                            {trendType === "up"
                                ? <ArrowUpIcon className="w-3 h-3 mr-1" />
                                : <ArrowDownIcon className="w-3 h-3 mr-1" />}
                            {trend} vs last month
                        </div>
                    )}
                </div>
                {/* Icon badge */}
                {Icon && (
                    <div className="p-3 rounded-xl" style={{ backgroundColor: "#EEF2FF" }}>
                        <Icon className="w-5 h-5" style={{ color: "#4F46E5" }} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default KpiCard;
