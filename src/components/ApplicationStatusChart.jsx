"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

// Mock data simulating backend response
const data = [
  { name: "Total Applied", value: 45 },
  { name: "Interviewing / Accept", value: 12 },
  { name: "Rejected", value: 30 },
];

// Softer, more exact colors from the reference image
const COLORS = ["#F1C453", "#41C4C1", "#F18D72"]; // Yellow, Teal, Orange

export default function ApplicationStatusChart() {
  return (
    <div className="bg-white rounded-[2rem] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.15)] flex flex-col h-full border border-slate-100 p-8 items-center transition-all duration-300 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.2)]">
      <h3 className="text-xl font-bold text-slate-800 tracking-wide mb-2 text-center w-full">
        Application Status
      </h3>
      <p className="text-sm font-medium text-slate-400 mb-6">Overview of your activity</p>
      
      {/* Increased height and adjusted padding to ensure the circle doesn't clip */}
      <div className="h-[220px] w-full flex justify-center items-center mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={0}
              outerRadius={85}
              dataKey="value"
              stroke="#ffffff"
              strokeWidth={3}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
                contentStyle={{
                    backgroundColor: "#ffffff",
                    borderRadius: "16px",
                    border: "1px solid #f1f5f9",
                    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
                    fontSize: '13px',
                    fontWeight: '700',
                    padding: '12px 16px'
                }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="w-full flex justify-center mb-8">
         <ul className="flex flex-col items-start gap-3">
            {data.map((entry, index) => (
                <li key={`item-${index}`} className="flex items-center text-sm font-bold text-slate-700">
                    <span 
                        className="w-4 h-4 rounded-md mr-3 shadow-sm" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }} 
                    />
                    {entry.name}
                    <span className="ml-2 text-slate-400">({entry.value})</span>
                </li>
            ))}
        </ul>
      </div>

      <div className="mt-auto px-6 py-2 bg-slate-50 rounded-full text-slate-500 font-bold tracking-wide text-xs uppercase border border-slate-100 shadow-inner">
          Data from Backend
      </div>
    </div>
  );
}
