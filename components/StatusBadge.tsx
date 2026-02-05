export type StatusType = "Pending" | "Accepted" | "Rejected" | "In-Progress";

interface StatusBadgeProps {
    status: StatusType;
}

const statusStyles = {
    Pending: " text-[#FFBB38] ",
    Accepted: " text-[#22C55E] ",
    Rejected: "text-[#DC2626]",
    Cancelled: "text-[#DC2626]",
    'In-Progress': "text-[#7E22CE]",
};

export default function StatusBadge({ status }: StatusBadgeProps) {
    return (
        <span className={`px-3 py-1 rounded-full text-sm font-normal ${statusStyles[status] || "bg-slate-50 text-slate-500 border-slate-100"}`}>
            {status}
        </span>
    );
}
