"use client";

import { useEffect, useState } from "react";
import { Search, Clock, CheckCircle, CircleDollarSign, X, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useGetAllWithdrawalsQuery, useApproveWithdrawalMutation, useRejectWithdrawalMutation } from "@/lib/features/super-admin/withdraw/withdrawAPI";
import { WithdrawalItem } from "@/lib/features/super-admin/withdraw/withdraw.type";
import Swal from "sweetalert2";

const StatsCard = ({ title, value, subtext, icon: Icon, colorClass, bgClass }: any) => (
    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex-1">
        <div className={`w-12 h-12 rounded-lg ${bgClass} flex items-center justify-center mb-4`}>
            <Icon className={`w-6 h-6 ${colorClass}`} />
        </div>
        <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
        <p className="text-sm text-slate-500 mt-1">{subtext}</p>
    </div>
);

export default function WithdrawalManagementPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [filter, setFilter] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRequest, setSelectedRequest] = useState<WithdrawalItem | null>(null);

    // Debounce search query
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setCurrentPage(1);
        }, 400);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    // Map UI filter to API status
    const statusMap: Record<string, string> = {
        "Pending": "PENDING",
        "Approved": "APPROVED",
        "Rejected": "REJECTED",
    };

    const { data: response, isLoading, isError } = useGetAllWithdrawalsQuery({
        page: currentPage,
        limit: 10,
        search: debouncedSearch || undefined,
        status: statusMap[filter] || undefined
    });

    const [approveWithdrawal] = useApproveWithdrawalMutation();
    const [rejectWithdrawal] = useRejectWithdrawalMutation();

    // response.data is the Level 1 wrapper { success, message, data }
    // response.data.data is the Level 2 object { pagination, meta, data (the array) }
    const resultsPayload = response?.data?.data;
    const requests = resultsPayload?.data || [];
    const meta = resultsPayload?.meta || { totalPending: 0, totalPendingAmount: 0, todayApproved: 0 };
    const pagination = resultsPayload?.pagination;

    const handleApprove = async (id: string) => {
        try {
            await approveWithdrawal(id).unwrap();
            if (selectedRequest?.id === id) setSelectedRequest(null);
        } catch (err) {
            // console.error("Failed to approve withdrawal:", err);
            Swal.fire({
                icon: "error",
                title: "Failed to approve withdrawal",
                text: "Please try again later",
            });
        }
    };

    const handleReject = async (id: string) => {
        try {
            await rejectWithdrawal(id).unwrap();
            if (selectedRequest?.id === id) setSelectedRequest(null);
        } catch (err) {
            // console.error("Failed to reject withdrawal:", err);
            Swal.fire({
                icon: "error",
                title: "Failed to reject withdrawal",
                text: "Please try again later",
            });
        }
    };

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center h-96 space-y-4">
                <div className="p-4 bg-red-50 text-red-600 rounded-lg">Error loading withdrawal requests. Please check your connection.</div>
                <button onClick={() => window.location.reload()} className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors">Retry</button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h2 className="text-2xl font-bold text-slate-900">Withdrawal Management</h2>
                <p className="text-sm text-slate-500">Review and manage provider withdrawal requests</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard
                    title="Pending Requests"
                    value={meta.totalPending || 0}
                    subtext="Pending Requests"
                    icon={Clock}
                    colorClass="text-amber-500"
                    bgClass="bg-amber-100"
                />
                <StatsCard
                    title="Approved Today"
                    value={meta.todayApproved || 0}
                    subtext="Approved Today"
                    icon={CheckCircle}
                    colorClass="text-green-500"
                    bgClass="bg-green-100"
                />
                <StatsCard
                    title="Total Pending Amount"
                    value={`৳${(meta.totalPendingAmount || 0).toLocaleString()}`}
                    subtext="Total Pending Amount"
                    icon={CircleDollarSign}
                    colorClass="text-blue-500"
                    bgClass="bg-blue-100"
                />
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Filters & Search */}
                <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                        {["All", "Pending", "Approved", "Rejected"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => {
                                    setFilter(tab);
                                    setCurrentPage(1);
                                }}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${filter === tab
                                    ? "bg-white text-slate-900 shadow-sm"
                                    : "text-slate-500 hover:text-slate-700"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by provider name or account..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-sm text-black bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm font-semibold">
                                <th className="px-6 py-4">Provider</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Account Number</th>
                                <th className="px-6 py-4">Request Date</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white min-h-[200px]">
                            {isLoading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={6} className="px-6 py-6 border-b border-slate-100">
                                            <div className="h-4 bg-slate-100 rounded w-full"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : requests.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center text-slate-400">No withdrawal requests found.</td>
                                </tr>
                            ) : (
                                requests.map((request) => (
                                    <tr key={request.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden flex-shrink-0">
                                                    <img
                                                        src={request.provider.image || `https://ui-avatars.com/api/?name=${request.provider.firstName}+${request.provider.lastName}&background=random`}
                                                        alt=""
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-slate-900">{request.provider.firstName} {request.provider.lastName}</div>
                                                    <div className="text-xs text-slate-500">{request.provider.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-base font-semibold text-slate-900">৳{request.amount.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-sm text-slate-500 font-mono">{request.accountNumber}</td>
                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            {request.createdAt ? new Date(request.createdAt).toLocaleString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            }) : "N/A"}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                                                request.status === "PENDING" ? "bg-amber-100 text-amber-700" :
                                                request.status === "APPROVED" || request.status === "COMPLETED" ? "bg-green-100 text-green-700" :
                                                "bg-red-100 text-red-700"
                                            }`}>
                                                {request.status === "PENDING" && <Clock size={14} />}
                                                {(request.status === "APPROVED" || request.status === "COMPLETED") && <CheckCircle size={14} />}
                                                {(request.status === "REJECTED" || request.status === "CANCELLED") && <IoIosCloseCircleOutline size={16} />}
                                                {request.status.charAt(0) + request.status.slice(1).toLowerCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => setSelectedRequest(request)}
                                                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                {request.status === "PENDING" && (
                                                    <>
                                                        <button
                                                            onClick={() => handleApprove(request.id)}
                                                            className="px-3 py-1.5 bg-[#16A34A] text-white text-xs font-medium rounded hover:bg-green-700 transition-colors">
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(request.id)}
                                                            className="px-3 py-1.5 bg-[#DC2626] text-white text-xs font-medium rounded hover:bg-red-700 transition-colors">
                                                            Reject
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPage > 1 && (
                    <div className="py-6 border-t border-slate-100 flex items-center justify-center gap-2">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            className="p-2 text-slate-400 hover:text-slate-600 disabled:opacity-50 transition-colors"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: pagination.totalPage }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                                        currentPage === page
                                            ? "bg-slate-900 text-white"
                                            : "text-slate-500 hover:bg-slate-100"
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                        <button
                            disabled={currentPage === pagination.totalPage}
                            onClick={() => setCurrentPage(prev => Math.min(pagination.totalPage, prev + 1))}
                            className="p-2 text-slate-400 hover:text-slate-600 disabled:opacity-50 transition-colors"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                )}
            </div>


            {/* Details Modal */}
            {selectedRequest && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedRequest(null)}></div>
                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-[#0F172A]">Withdrawal Request Details</h3>
                            <button onClick={() => setSelectedRequest(null)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-full">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Provider Info */}
                            <div>
                                <h4 className="text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-4">Provider Information</h4>
                                <div className="bg-[#F8FAFC] p-4 rounded-lg flex items-start gap-4">
                                    <div className="w-16 h-16 rounded-full bg-white overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
                                        <img
                                            src={selectedRequest.provider.image || `https://ui-avatars.com/api/?name=${selectedRequest.provider.firstName}+${selectedRequest.provider.lastName}&background=random`}
                                            alt=""
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-base font-bold text-[#0F172A]">{selectedRequest.provider.firstName} {selectedRequest.provider.lastName}</div>
                                        <div className="text-sm text-[#64748B]">{selectedRequest.provider.email}</div>
                                        <div className="grid grid-cols-2 gap-4 mt-3">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] uppercase text-slate-400 font-bold">Role</span>
                                                <span className="text-sm font-semibold text-[#0F172A]">{selectedRequest.provider.role}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] uppercase text-slate-400 font-bold">Jobs completed</span>
                                                <span className="text-sm font-semibold text-[#0F172A]">{selectedRequest.provider.completedJobs || 0}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Withdrawal Details */}
                            <div className="bg-slate-50 rounded-xl p-5 space-y-4">
                                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Withdrawal Details</h4>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-600">Withdrawal Amount</span>
                                    <span className="text-lg font-bold text-slate-900">৳{selectedRequest.amount.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-600">Account Number</span>
                                    <span className="text-sm font-mono text-slate-900">{selectedRequest.accountNumber}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-600">Payment Method</span>
                                    <span className="text-sm text-slate-900">{selectedRequest.paymentMethod}</span>
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                                    <span className="text-sm text-slate-600">Status</span>
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                                        selectedRequest.status === "PENDING" ? "bg-amber-100 text-amber-700" :
                                        selectedRequest.status === "APPROVED" || selectedRequest.status === "COMPLETED" ? "bg-green-100 text-green-700" :
                                        "bg-red-100 text-red-700"
                                    }`}>
                                        {selectedRequest.status === "PENDING" && <Clock size={14} />}
                                        {(selectedRequest.status === "APPROVED" || selectedRequest.status === "COMPLETED") && <CheckCircle size={14} />}
                                        {(selectedRequest.status === "REJECTED" || selectedRequest.status === "CANCELLED") && <IoIosCloseCircleOutline size={16} />}
                                        {selectedRequest.status}
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            {selectedRequest.status === "PENDING" && (
                                <div className="flex gap-3 pt-2">
                                    <button
                                        onClick={() => handleApprove(selectedRequest.id)}
                                        className="flex-1 py-3 bg-[#16A34A] text-white font-bold rounded-xl hover:bg-green-700 transition-all shadow-lg shadow-green-100">
                                        Approve Request
                                    </button>
                                    <button
                                        onClick={() => handleReject(selectedRequest.id)}
                                        className="flex-1 py-3 bg-white border-2 border-red-500 text-red-500 font-bold rounded-xl hover:bg-red-50 transition-all">
                                        Reject Request
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
