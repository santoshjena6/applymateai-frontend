// SkeletonLoader — light-theme skeleton cards for loading states
"use client";

const SkeletonLoader = ({ type = "card", count = 4 }) => {
    // Table row skeletons for the dashboard recent-applications table
    if (type === "table-row") {
        return Array.from({ length: count }).map((_, i) => (
            <tr key={i} style={{ borderBottom: "1px solid #E5E7EB" }}>
                {[1, 2, 3, 4].map((j) => (
                    <td key={j} className="px-6 py-4">
                        <div
                            className="h-3 rounded skeleton"
                            style={{ width: j === 1 ? "80px" : j === 2 ? "140px" : j === 3 ? "70px" : "90px" }}
                        />
                    </td>
                ))}
            </tr>
        ));
    }

    // Kanban card skeletons
    if (type === "kanban") {
        return Array.from({ length: count }).map((_, i) => (
            <div key={i} className="p-4 rounded-xl bg-white" style={{ border: "1px solid #E5E7EB" }}>
                <div className="flex items-start justify-between mb-3">
                    <div className="w-8 h-8 rounded-lg skeleton" />
                    <div className="h-2.5 w-12 rounded skeleton" />
                </div>
                <div className="space-y-2">
                    <div className="h-3 rounded skeleton w-3/4" />
                    <div className="h-2.5 rounded skeleton w-1/2" />
                </div>
            </div>
        ));
    }

    // Default — job card skeletons
    return Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl p-6 bg-white" style={{ border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
            <div className="flex items-start justify-between mb-5">
                <div className="w-11 h-11 rounded-xl skeleton" />
                <div className="w-6 h-6 rounded-lg skeleton" />
            </div>
            <div className="space-y-2.5">
                <div className="h-4 rounded-lg skeleton w-3/4" />
                <div className="h-3 rounded-lg skeleton w-1/2" />
                <div className="h-3 rounded-lg skeleton w-2/3" />
            </div>
            <div className="mt-6 pt-5 flex items-center justify-between" style={{ borderTop: "1px solid #E5E7EB" }}>
                <div className="h-3 rounded skeleton w-16" />
                <div className="h-8 w-20 rounded-xl skeleton" />
            </div>
        </div>
    ));
};

export default SkeletonLoader;
