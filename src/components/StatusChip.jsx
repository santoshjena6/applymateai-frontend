// StatusChip — colored status badge for Applied / In Progress / Interview / Rejected
"use client";

const STATUS_STYLES = {
    Applied:       { bg: "#EEF2FF", color: "#4F46E5" },
    "In Progress": { bg: "#FEF3C7", color: "#D97706" },
    Interview:     { bg: "#D1FAE5", color: "#059669" },
    Interviewing:  { bg: "#D1FAE5", color: "#059669" },
    Offer:         { bg: "#D1FAE5", color: "#059669" },
    Rejected:      { bg: "#FEE2E2", color: "#DC2626" },
    Hired:         { bg: "#D1FAE5", color: "#059669" },
};

const StatusChip = ({ status }) => {
    const style = STATUS_STYLES[status] || { bg: "#EEF2FF", color: "#4F46E5" };
    return (
        <span
            className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-semibold"
            style={{ backgroundColor: style.bg, color: style.color }}
        >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: style.color }} />
            <span>{status}</span>
        </span>
    );
};

export default StatusChip;
