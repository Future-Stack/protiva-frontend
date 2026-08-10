import { BookingIcon, EarningIcon, ProviderIcon, SubscriptionIcon } from "@/app/assets/DashboardCardIcon";

interface DashboardCardProps {
    title: string;
    value: string | number;
    variant: "cyan" | "green" | "orange" | "pink";
}

const variants = {
    cyan: {
        bg: "bg-[#ECFEFF]",
        text: "text-[#0891B2]",
        iconColor: "text-[#0891B2]",
        titleColor: "text-[#0891B2]",
        icon: <EarningIcon />,
        shadow: "bg-[#A5F3FC]"
    },
    green: {
        bg: "bg-[#F0FDF4]",
        text: "text-[#14532D]",
        iconColor: "text-[#14532D]",
        titleColor: "text-[#14532D]",
        icon: <SubscriptionIcon />,
        shadow: "bg-green-300"
    },
    orange: {
        bg: "bg-[#FFF7ED]",
        text: "text-[#EA580C]",
        iconColor: "text-[#9A3412]",
        titleColor: "text-[#EA580C]",
        icon: <ProviderIcon />,
        shadow: "bg-[#FDBA74]"
    },
    pink: {
        bg: "bg-[#FDF2F8]",
        text: "text-[#9D174D]",
        iconColor: "text-[#831843]",
        titleColor: "text-[#9D174D]",
        icon: <BookingIcon />,
        shadow: "bg-[#F9A8D4]"
    },
};

export default function DashboardCard({ title, value, variant }: DashboardCardProps) {
    const style = variants[variant];

    return (
        <div className={`relative overflow-hidden ${style.bg} border border-slate-100 p-4 sm:pt-8 sm:pl-6 sm:pr-3 sm:pb-3 rounded-[15px] transition-all hover:shadow-md min-h-[140px] sm:h-[170px] flex flex-col justify-between`}>
            {/* Decorative background element - matches the soft shape in the top-left corner */}
            <div className={`absolute -left-32 -top-24 w-64 h-64 rounded-full ${style.shadow} opacity-30 blur-2xl pointer-events-none`} />

            <div className="relative z-10">
                <h3 className={`text-xl sm:text-2xl lg:text-[32px] font-bold ${style.text} leading-tight truncate`}>{value}</h3>
                <p className={`text-xs sm:text-sm lg:text-[17px] font-medium ${style.titleColor} mt-1 truncate`}>{title}</p>
            </div>

            <div className="flex justify-end pr-1 sm:pr-2 pb-1 relative z-10">
                <div className="w-10 h-10 sm:w-[52px] sm:h-[52px] flex items-center justify-center">
                    {style.icon}
                </div>
            </div>
        </div>
    );
}
