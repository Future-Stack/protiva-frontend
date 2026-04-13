"use client";

import DashboardCard from "@/components/DashboardCard";
import { FileText, CheckCircle2, Loader2,ChevronRight, ChevronLeft,  } from "lucide-react";
import { useGetSubAdminDashboardQuery } from "@/lib/features/sub-admin/dashboard/dashboardAPI";
import { useState } from "react";

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
                {/* My Pending Tasks */}
                <div className="bg-white border border-slate-100 rounded-[10px] p-6 h-full">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-base font-bold text-slate-900">My Pending Tasks</h3>
                        <span className="px-3 py-1 bg-[#6366F1] text-white text-xs font-medium rounded-full">3 pending</span>
                    </div>

                    <div className="space-y-6">
                        {/* Task 1 */}
                        <div className="flex items-start gap-3">
                            <div className="mt-1 w-5 h-5 rounded-full border-2 border-slate-300 flex-shrink-0 cursor-pointer hover:border-[#6366F1]"></div>
                            <div>
                                <p className="text-sm font-medium text-slate-900">Approve booking #1234</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-medium rounded">High</span>
                                    <span className="text-xs text-slate-400">5 min ago</span>
                                </div>
                            </div>
                        </div>

                        {/* Task 2 */}
                        <div className="flex items-start gap-3">
                            <div className="mt-1 w-5 h-5 rounded-full border-2 border-slate-300 flex-shrink-0 cursor-pointer hover:border-[#6366F1]"></div>
                            <div>
                                <p className="text-sm font-medium text-slate-900">Review provider profile - Sarah Jones</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="px-2 py-0.5 bg-amber-50 text-amber-600 text-[10px] font-medium rounded">Medium</span>
                                    <span className="text-xs text-slate-400">1 hour ago</span>
                                </div>
                            </div>
                        </div>

                        {/* Task 3 */}
                        <div className="flex items-start gap-3">
                            <div className="mt-1 w-5 h-5 rounded-full border-2 border-slate-300 flex-shrink-0 cursor-pointer hover:border-[#6366F1]"></div>
                            <div>
                                <p className="text-sm font-medium text-slate-900">Update booking #1189 status</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-medium rounded">High</span>
                                    <span className="text-xs text-slate-400">2 hours ago</span>
                                </div>
                            </div>
                        </div>

                        {/* Task 4 - Completed */}
                        <div className="flex items-start gap-3 opacity-60">
                            <div className="mt-1 w-5 h-5 rounded-full bg-green-500 border-2 border-green-500 flex items-center justify-center flex-shrink-0">
                                <CheckCircle2 size={12} className="text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-900 line-through">Check provider verification docs</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-medium rounded">Low</span>
                                    <span className="text-xs text-slate-400">3 hours ago</span>
                                </div>
                            </div>
                        </div>

                        {/* Task 5 */}
                        <div className="flex items-start gap-3">
                            <div className="mt-1 w-5 h-5 rounded-full border-2 border-slate-300 flex-shrink-0 cursor-pointer hover:border-[#6366F1]"></div>
                            <div>
                                <p className="text-sm font-medium text-slate-900">Export weekly booking report</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="px-2 py-0.5 bg-amber-50 text-amber-600 text-[10px] font-medium rounded">Medium</span>
                                    <span className="text-xs text-slate-400">5 hours ago</span>
                                </div>
                            </div>
                        </div>
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
