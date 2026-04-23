"use client";

import { useEffect, useState } from "react";
import { Search, Clock, CheckCircle, CircleDollarSign, X, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useGetAllWithdrawalsQuery, useApproveWithdrawalMutation, useRejectWithdrawalMutation } from "@/lib/features/super-admin/withdraw/withdrawAPI";
import { WithdrawalItem } from "@/lib/features/super-admin/withdraw/withdraw.type";
import { useAppSelector } from "@/lib/hooks";
import Swal from "sweetalert2";

const StatsCard = ({ value, subtext, icon: Icon, colorClass, bgClass }: any) => (
    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex-1">
        <div className={`w-12 h-12 rounded-lg ${bgClass} flex items-center justify-center mb-4`}>
            <Icon className={`w-6 h-6 ${colorClass}`} />
        </div>
        <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
        <p className="text-sm text-slate-500 mt-1">{subtext}</p>
    </div>
);

/* ─── Detail row helper for modal ────────────────────────────────────── */
const DetailRow = ({ label, value }: { label: string; value: string | null | undefined }) => (
    <div className="flex items-center justify-between py-2.5">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-tight">{label}</span>
        <span className="text-sm font-medium text-slate-700 truncate max-w-[200px]" title={value || ""}>{value || "—"}</span>
    </div>
);

export default function WithdrawalManagementPage() {
    const { user } = useAppSelector((state) => state.auth);
    const hasViewPermission   = user?.role === "SUPER_ADMIN" || user?.adminPermissions?.isViewWithdrawal || user?.adminPermissions?.isManageWithdrawal;
    const hasManagePermission = user?.role === "SUPER_ADMIN" || user?.adminPermissions?.isManageWithdrawal;

    const [searchQuery, setSearchQuery]   = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [filter, setFilter]             = useState("All");
    const [currentPage, setCurrentPage]   = useState(1);
    const [selectedRequest, setSelectedRequest] = useState<WithdrawalItem | null>(null);

    // Debounce search
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setCurrentPage(1);
        }, 400);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    const statusMap: Record<string, string> = {
        "Pending":  "PENDING",
        "Approved": "APPROVED",
        "Rejected": "REJECTED",
    };

    const { data: response, isLoading, isError } = useGetAllWithdrawalsQuery({
        page:   currentPage,
        limit:  10,
        search: debouncedSearch || undefined,
        status: statusMap[filter] || undefined,
    }, { skip: !hasViewPermission });

    const [approveWithdrawal] = useApproveWithdrawalMutation();
    const [rejectWithdrawal]  = useRejectWithdrawalMutation();

    const resultsPayload = response?.data?.data;
    const requests   = resultsPayload?.data || [];
    const meta       = resultsPayload?.meta || { totalPending: 0, totalPendingAmount: 0, todayApproved: 0 };
    const pagination = resultsPayload?.pagination;

    const handleApprove = async (id: string) => {
        if (!hasManagePermission) return;
        try {
            await approveWithdrawal(id).unwrap();
            if (selectedRequest?.id === id) setSelectedRequest(null);
        } catch {
            Swal.fire({ icon: "error", title: "Failed to approve withdrawal", text: "Please try again later" });
        }
    };

    const handleReject = async (id: string) => {
        if (!hasManagePermission) return;
        try {
            await rejectWithdrawal(id).unwrap();
            if (selectedRequest?.id === id) setSelectedRequest(null);
        } catch {
            Swal.fire({ icon: "error", title: "Failed to reject withdrawal", text: "Please try again later" });
        }
    };

    /* ── Access denied ── */
    if (!hasViewPermission) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Access Denied</h2>
                    <p className="text-slate-500">You do not have permission to view withdrawals.</p>
                </div>
            </div>
        );
    }

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
                <StatsCard value={meta.totalPending || 0}        subtext="Pending Requests"    icon={Clock}           colorClass="text-amber-500" bgClass="bg-amber-100" />
                <StatsCard value={meta.todayApproved || 0}       subtext="Approved Today"       icon={CheckCircle}     colorClass="text-green-500" bgClass="bg-green-100" />
                <StatsCard value={`৳${(meta.totalPendingAmount || 0).toLocaleString()}`} subtext="Total Pending Amount" icon={CircleDollarSign} colorClass="text-blue-500" bgClass="bg-blue-100" />
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Filters & Search */}
                <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                        {["All", "Pending", "Approved", "Rejected"].map((tab) => (
                            <button key={tab} onClick={() => { setFilter(tab); setCurrentPage(1); }}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${filter === tab ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                            >{tab}</button>
                        ))}
                    </div>
                    <div className="relative w-full max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input type="text" placeholder="Search by provider name or account..." value={searchQuery}
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
                                <th className="px-6 py-4">User ID</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Net Amount</th>
                                <th className="px-6 py-4">Bank Type</th>
                                <th className="px-6 py-4">Phone</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                {hasManagePermission && <th className="px-6 py-4 text-center">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white min-h-[200px]">
                            {isLoading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={6} className="px-6 py-6 border-b border-slate-100">
                                            <div className="h-4 bg-slate-100 rounded w-full" />
                                        </td>
                                    </tr>
                                ))
                            ) : requests.length === 0 ? (
                                <tr><td colSpan={6} className="px-6 py-20 text-center text-slate-400">No withdrawal requests found.</td></tr>
                            ) : (
                                requests.map((request) => (
                                    <tr key={request.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4 cursor-pointer" onClick={() => setSelectedRequest(request)}>
                                            <div className="text-sm font-mono text-slate-700 max-w-[140px] truncate" title={request.userId}>
                                                {request.userId.slice(0, 12)}…
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-semibold text-slate-900">৳{Number(request.amount).toLocaleString()}</td>
                                        <td className="px-6 py-4 text-sm font-semibold text-green-700">৳{Number(request.netAmount).toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-medium px-2 py-1 rounded bg-blue-50 text-blue-700">
                                                {request.bankType === "MOBILE_BANKING" ? request.mobileBankingType ?? "Mobile" : "Bank"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {request.phoneNumber ?? request.mobileBankingPaymentTakeNumber ?? "—"}
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
                                        {hasManagePermission && (
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    {/* Approve / Reject only if pending */}
                                                    {request.status === "PENDING" ? (
                                                        <>
                                                            <button onClick={() => handleApprove(request.id)}
                                                                className="px-3 py-1.5 bg-[#16A34A] text-white text-xs font-medium rounded hover:bg-green-700 transition-colors">
                                                                Approve
                                                            </button>
                                                            <button onClick={() => handleReject(request.id)}
                                                                className="px-3 py-1.5 bg-[#DC2626] text-white text-xs font-medium rounded hover:bg-red-700 transition-colors">
                                                                Reject
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <span className="text-xs text-slate-400 italic">No actions available</span>
                                                    )}
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPage > 1 && (
                    <div className="py-6 border-t border-slate-200 flex items-center justify-end gap-3 px-6">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 transition-colors disabled:opacity-50"
                        >
                            <ChevronLeft size={16} />
                            Previous
                        </button>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: Math.min(pagination.totalPage, 5) }, (_, i) => {
                                let pageNum = i + 1;
                                if (pagination.totalPage > 5 && currentPage > 3) {
                                    pageNum = currentPage - 3 + i;
                                    if (pageNum + (5 - i) > pagination.totalPage) {
                                        pageNum = pagination.totalPage - 5 + i + 1;
                                    }
                                }
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`w-8 h-8 rounded text-sm flex items-center justify-center font-medium transition-all ${pageNum === currentPage
                                            ? 'bg-slate-100 text-slate-900 border border-slate-300 shadow-sm'
                                            : 'text-slate-600 hover:bg-slate-50'
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                            {pagination.totalPage > 5 && currentPage < pagination.totalPage - 2 && (
                                <span className="px-1 text-slate-400">...</span>
                            )}
                        </div>
                        <button
                            disabled={currentPage === pagination.totalPage}
                            onClick={() => setCurrentPage((p) => Math.min(pagination.totalPage, p + 1))}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 transition-colors disabled:opacity-50"
                        >
                            Next
                            <ChevronRight size={16} />
                        </button>
                    </div>
                )}
            </div>

            {/* Details Modal */}
            {selectedRequest && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedRequest(null)} />
                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-900">Withdrawal Details</h3>
                            <button onClick={() => setSelectedRequest(null)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors"><X size={20} /></button>
                        </div>
                        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                            {/* Status */}
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-slate-700">Status</span>
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                                    selectedRequest.status === "PENDING" ? "bg-amber-100 text-amber-700" :
                                    selectedRequest.status === "APPROVED" || selectedRequest.status === "COMPLETED" ? "bg-green-100 text-green-700" :
                                    "bg-red-100 text-red-700"
                                }`}>
                                    {selectedRequest.status.charAt(0) + selectedRequest.status.slice(1).toLowerCase()}
                                </span>
                            </div>

                            {/* Amount Summary */}
                            <div className="bg-slate-50 rounded-xl p-4 grid grid-cols-3 gap-3 text-center">
                                <div>
                                    <p className="text-[10px] uppercase text-slate-400 mb-1 font-bold">Amount</p>
                                    <p className="text-sm font-bold text-slate-900">৳{Number(selectedRequest.amount).toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase text-slate-400 mb-1 font-bold">Fee</p>
                                    <p className="text-sm font-bold text-red-500">-৳{Number(selectedRequest.fee || 0).toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase text-slate-400 mb-1 font-bold">Net</p>
                                    <p className="text-sm font-bold text-green-600">৳{Number(selectedRequest.netAmount).toLocaleString()}</p>
                                </div>
                            </div>

                            {/* Fields */}
                            <div className="divide-y divide-slate-100 pt-2 text-black">
                                <DetailRow label="Withdrawal ID"      value={selectedRequest.id} />
                                <DetailRow label="User ID"            value={selectedRequest.userId} />
                                <DetailRow label="Bank Type"          value={selectedRequest.bankType} />
                                <DetailRow label="Mobile Banking Type" value={selectedRequest.mobileBankingType} />
                                <DetailRow label="Phone Number"       value={selectedRequest.phoneNumber} />
                                <DetailRow label="Payment Take Number" value={selectedRequest.mobileBankingPaymentTakeNumber} />
                                <DetailRow label="Bank Name"          value={selectedRequest.bankName} />
                                <DetailRow label="Account Number"     value={selectedRequest.accountNumber} />
                                <DetailRow label="Account Holder"     value={selectedRequest.accountHolderName} />
                                <DetailRow label="Branch Name"        value={selectedRequest.branchName} />
                                <DetailRow label="Routing Number"     value={selectedRequest.routingNumber} />
                                <DetailRow label="Processed By"       value={selectedRequest.processedBy} />
                                <DetailRow label="Requested At"       value={selectedRequest.requestedAt ? new Date(selectedRequest.requestedAt).toLocaleString() : ""} />
                            </div>

                            {/* Actions */}
                            {hasManagePermission && selectedRequest.status === "PENDING" && (
                                <div className="flex gap-3 pt-4">
                                    <button onClick={() => handleApprove(selectedRequest.id)}
                                        className="flex-1 py-2.5 bg-[#16A34A] text-white text-sm font-bold rounded-xl hover:bg-green-700 transition-all shadow-lg shadow-green-100">
                                        Approve
                                    </button>
                                    <button onClick={() => handleReject(selectedRequest.id)}
                                        className="flex-1 py-2.5 bg-white border-2 border-red-500 text-red-500 text-sm font-bold rounded-xl hover:bg-red-50 transition-all">
                                        Reject
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
