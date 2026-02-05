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
        <div className={`relative overflow-hidden ${style.bg} border border-slate-100 pt-8 pl-6 pr-3 pb-3 rounded-[15px] transition-all hover:shadow-md h-[170px] flex flex-col justify-between`}>
            {/* Decorative background element - matches the soft shape in the top-left corner */}
            <div className={`absolute -left-32 -top-24 w-64 h-64 rounded-full ${style.shadow} opacity-30 blur-2xl pointer-events-none`} />

            <div className="relative z-10">
                <h3 className={`text-[32px] font-bold ${style.text} leading-tight`}>{value}</h3>
                <p className={`text-[17px] font-medium ${style.titleColor} mt-1`}>{title}</p>
            </div>

            <div className="flex justify-end pr-2 pb-1 relative z-10">
                <div className="w-[52px] h-[52px] flex items-center justify-center">
                    {style.icon}
                </div>
            </div>
        </div>
    );
}
