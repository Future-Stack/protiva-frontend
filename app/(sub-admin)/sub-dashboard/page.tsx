"use client";

import DashboardCard from "@/components/DashboardCard";
import { FileText, CheckCircle2, Loader2, ChevronRight, ChevronLeft, ShieldCheck, Users, User, Layers, CircleDollarSign, Wallet, Briefcase, Megaphone } from "lucide-react";
import { useGetSubAdminDashboardQuery } from "@/lib/features/sub-admin/dashboard/dashboardAPI";
import { useState, ReactNode } from "react";

/* ─── Permission Item Component ────────────────────────────────────── */
interface PermissionItemProps {
    icon: ReactNode;
    label: string;
    view?: boolean;
    manage?: boolean;
    export?: boolean;
}

const PermissionItem = ({ icon, label, view, manage, export: canExport }: PermissionItemProps) => (
    <div className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0 group">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#6366F1]/10 group-hover:text-[#6366F1] transition-colors">
                {icon}
            </div>
            <span className="text-sm font-medium text-slate-700">{label}</span>
        </div>
        <div className="flex gap-1.5">
            {view !== undefined && (
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-tight uppercase ${view ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-400"}`}>
                    View
                </span>
            )}
            {manage !== undefined && (
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-tight uppercase ${manage ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-400"}`}>
                    Manage
                </span>
            )}
            {canExport !== undefined && (
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-tight uppercase ${canExport ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-400"}`}>
                    Export
                </span>
            )}
        </div>
    </div>
);

// Helper to format relative time
function timeAgo(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
}

export default function SubAdminDashboard() {
    const { data: dashboardData, isLoading } = useGetSubAdminDashboardQuery();

    const meta = dashboardData?.data?.meta;
    const permissions = dashboardData?.data?.myPermissions;
    const activities = dashboardData?.data?.userRecentActivity || [];
    const [currentPage, setCurrentPage] = useState(0);

    if (isLoading) {
        return (
            <div className="flex justify-center py-20 min-h-[50vh] items-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#6366F1]" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Business Analytics Heading */}
            <div className="bg-white border border-slate-100 p-6 rounded-[10px]">
                <h2 className="text-base font-semibold text-slate-900 mb-4">Business Analytics</h2>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    <DashboardCard
                        title="Total Bookings"
                        value={meta?.totalBooking?.toString() || "0"}
                        variant="cyan"
                    />
                    <DashboardCard
                        title="Completed"
                        value={meta?.totalCompliteBooking?.toString() || "0"}
                        variant="green"
                    />
                    <DashboardCard
                        title="Pending"
                        value={meta?.totalInProgressBooking?.toString() || "0"}
                        variant="orange"
                    />
                    <DashboardCard
                        title="Issues"
                        value={meta?.totalRejectBooking?.toString() || "0"}
                        variant="pink"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* My Account Permissions */}
                <div className="bg-white border border-slate-100 rounded-[10px] p-6 h-full shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-slate-900">My Account Permissions</h3>
                            <div className="flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-600 text-[10px] font-bold rounded-full">
                                <ShieldCheck size={12} />
                                Verified
                            </div>
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Role: Sub Admin</span>
                    </div>

                    <div className="space-y-1">
                        <PermissionItem 
                            icon={<FileText size={16} />} 
                            label="Booking Management" 
                            view={permissions?.isViewBooking} 
                            manage={permissions?.isManageBooking}
                            export={permissions?.isExportBooking}
                        />
                        <PermissionItem 
                            icon={<Users size={16} />} 
                            label="Provider Management" 
                            view={permissions?.isViewProvider} 
                            manage={permissions?.isManageProvider}
                        />
                        <PermissionItem 
                            icon={<User size={16} />} 
                            label="User Management" 
                            view={permissions?.isViewUser} 
                            manage={permissions?.isManageUser}
                        />
                        <PermissionItem 
                            icon={<Layers size={16} />} 
                            label="Category & Services" 
                            view={permissions?.isViewCategory} 
                            manage={permissions?.isManageCategory}
                        />
                        <PermissionItem 
                            icon={<CircleDollarSign size={16} />} 
                            label="Transaction History" 
                            view={permissions?.isViewTransaction} 
                        />
                        <PermissionItem 
                            icon={<Wallet size={16} />} 
                            label="Withdrawal Requests" 
                            view={permissions?.isViewWithdrawal} 
                            manage={permissions?.isManageWithdrawal}
                        />
                        <PermissionItem 
                            icon={<Briefcase size={16} />} 
                            label="Job Management" 
                            view={permissions?.isJobView} 
                            manage={permissions?.isJobManage}
                        />
                        {/* Marketing Permission — assuming it's in permissions even if not showing in recent type edit snippet */}
                        <PermissionItem 
                            icon={<Megaphone size={16} />} 
                            label="Marketing Tools" 
                            view={(permissions as any)?.isViewMarketing} 
                            manage={(permissions as any)?.isManageMarketing}
                        />
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-[11px] text-slate-500">Global Admin Access Enabled</span>
                        </div>
                        <p className="text-[10px] text-slate-400">ID: {permissions?.id?.slice(-8).toUpperCase()}</p>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white border border-slate-100 rounded-[10px] p-6 h-full">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-base font-bold text-slate-900">Recent Activity</h3>
                    <button className="text-slate-400 hover:text-slate-600">
                    <FileText size={18} />
                    </button>
                </div>

                <div className="relative pl-2 space-y-8">
                    <div className="absolute left-[3px] top-2 bottom-2 w-px bg-slate-100"></div>

                    {activities.length > 0 ? activities.slice(currentPage * 5, currentPage * 5 + 5).map((activity) => (
                    <div key={activity.id} className="relative pl-6">
                        <div className="absolute left-[-4px] top-1.5 w-3.5 h-3.5 rounded-full bg-[#6366F1] border-2 border-white shadow-sm z-10"></div>
                        <div>
                        <p className="text-sm font-semibold text-slate-900">{activity.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{activity.message}</p>
                        <p className="text-[10px] text-slate-400 mt-1">{timeAgo(activity.createdAt)}</p>
                        </div>
                    </div>
                    )) : (
                    <div className="text-sm text-slate-500 pl-6">No recent activity</div>
                    )}

                    <div className="flex justify-between items-center pt-2">
                        {currentPage > 0 ? (
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                                className="text-sm text-slate-500 flex items-center gap-1 cursor-pointer hover:text-[#6366F1] transition-colors"
                            >
                                <ChevronLeft size={16} /> previous activities
                            </button>
                        ) : <div />}

                        {(currentPage + 1) * 5 < activities.length && (
                            <button
                                onClick={() => setCurrentPage(prev => prev + 1)}
                                className="text-sm text-slate-500 flex items-center gap-1 cursor-pointer hover:text-[#6366F1] transition-colors"
                            >
                                more activities <ChevronRight size={16} />
                            </button>
                        )}
                    </div>
                </div>
                </div>
            </div>
        </div>
    );
}
