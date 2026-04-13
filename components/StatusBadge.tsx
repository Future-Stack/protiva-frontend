export type StatusType = 
    | "Pending" | "Accepted" | "Rejected" | "In-Progress" | "Cancelled"
    | "PENDING" | "ACCEPTED" | "REJECTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "REFUNDED";

interface StatusBadgeProps {
    status: StatusType;
}

const statusStyles = {
    Pending: "text-[#FFBB38]",
    Accepted: "text-[#22C55E]",
    Rejected: "text-[#DC2626]",
    Cancelled: "text-[#DC2626]",
    'In-Progress': "text-[#7E22CE]",
    // API Statuses
    PENDING: "text-[#FFBB38]",
    ACCEPTED: "text-[#22C55E]",
    REJECTED: "text-[#DC2626]",
    IN_PROGRESS: "text-[#7E22CE]",
    COMPLETED: "text-[#22C55E]",
    CANCELLED: "text-[#DC2626]",
    REFUNDED: "text-[#64748B]",
};

export default function StatusBadge({ status }: StatusBadgeProps) {
    const displayStatus = status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
    
    return (
        <span className={`px-3 py-1 rounded-full text-sm font-normal ${statusStyles[status] || "bg-slate-50 text-slate-500 border-slate-100"}`}>
            {displayStatus}
        </span>
    );
}
