"use client";

import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline";

const SG = "'Special Gothic', sans-serif";
const SW = "'Switzer', sans-serif";
const dark = "#080b0f";
const gray = "#4b5b63";
const white = "#ffffff";
const borderCol = "#e8e8e8";

const KpiCard = ({ title, value, trend, trendType, icon: Icon, loading = false }) => {
    if (loading) {
        return (
            <div className="p-6 rounded-[24px]" style={{ background: white, border: `1px solid rgba(255,255,255,0.5)`, boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
                <div className="flex justify-between items-start">
                    <div className="space-y-3">
                        <div className="h-3 w-24 rounded-full skeleton" />
                        <div className="h-8 w-16 rounded-full skeleton" />
                        <div className="h-3 w-20 rounded-full skeleton" />
                    </div>
                    <div className="w-12 h-12 rounded-full skeleton" />
                </div>
            </div>
        );
    }

    return (
        <div
            className="p-6 transition-all duration-300"
            style={{ 
                background: white, 
                borderRadius: 24, 
                border: `1px solid rgba(255,255,255,0.8)`, 
                boxShadow: "0 10px 40px rgba(0,0,0,0.04), 0 2px 10px rgba(0,0,0,0.02)",
                fontFamily: SW
            }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 24px 80px rgba(0,0,0,0.07), 0 4px 20px rgba(0,0,0,0.04)";
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "0 10px 40px rgba(0,0,0,0.04), 0 2px 10px rgba(0,0,0,0.02)";
            }}
        >
            <div className="flex justify-between items-start">
                <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: gray, textTransform: "uppercase", letterSpacing: "0.05em" }}>{title}</p>
                    <h3 style={{ fontFamily: SG, fontSize: 36, fontWeight: 800, color: dark, marginTop: 4, letterSpacing: "-1px" }}>{value ?? "—"}</h3>
                    
                    {trend && (
                        <div style={{ display: "flex", alignItems: "center", marginTop: 8, fontSize: 12, fontWeight: 700, color: trendType === "up" ? "#10b981" : "#ef4444" }}>
                            {trendType === "up" ? <ArrowUpIcon className="w-3 h-3 mr-1 stroke-[3]" /> : <ArrowDownIcon className="w-3 h-3 mr-1 stroke-[3]" />}
                            {trend} vs last month
                        </div>
                    )}
                </div>
                
                {Icon && (
                    <div style={{ padding: 12, borderRadius: "50%", background: "#f8fafc", border: `1px solid ${borderCol}` }}>
                        <Icon className="w-6 h-6" style={{ color: dark }} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default KpiCard;
