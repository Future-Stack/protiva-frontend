"use client";

import { useEffect, useState } from "react";
import {
    Search, Clock, CheckCircle, CircleDollarSign,
    X, Eye, ChevronLeft, ChevronRight, Loader2,
} from "lucide-react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import {
    useGetAllWithdrawalsQuery,
    useApproveWithdrawalMutation,
    useRejectWithdrawalMutation,
} from "@/lib/features/super-admin/withdraw/withdrawAPI";
import { WithdrawalItem } from "@/lib/features/super-admin/withdraw/withdraw.type";
import Swal from "sweetalert2";

/* ─── Stats card ─────────────────────────────────────────────────────── */
const StatsCard = ({ value, subtext, icon: Icon, colorClass, bgClass }: any) => (
    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex-1">
        <div className={`w-12 h-12 rounded-lg ${bgClass} flex items-center justify-center mb-4`}>
            <Icon className={`w-6 h-6 ${colorClass}`} />
        </div>
        <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
        <p className="text-sm text-slate-500 mt-1">{subtext}</p>
    </div>
);

/* ─── Status badge ───────────────────────────────────────────────────── */
function StatusBadge({ status }: { status: string }) {
    const isPending   = status === "PENDING";
    const isApproved  = status === "APPROVED" || status === "COMPLETED";
    const cls = isPending
        ? "bg-amber-100 text-amber-700"
        : isApproved
        ? "bg-green-100 text-green-700"
        : "bg-red-100 text-red-700";
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${cls}`}>
            {isPending  && <Clock size={13} />}
            {isApproved && <CheckCircle size={13} />}
            {!isPending && !isApproved && <IoIosCloseCircleOutline size={15} />}
            {status.charAt(0) + status.slice(1).toLowerCase()}
        </span>
    );
}

/* ─── Detail row ─────────────────────────────────────────────────────── */
function DetailRow({ label, value }: { label: string; value?: string | null }) {
    return (
        <div className="max-w-md flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
            <span className="text-sm text-slate-500">{label}</span>
            <span className="text-sm font-medium text-slate-900 text-right">
                {value ?? <span className="text-slate-400 italic">N/A</span>}
            </span>
        </div>
    );
}

/* ─── Page ───────────────────────────────────────────────────────────── */
export default function WithdrawalManagementPage() {
    const [searchQuery, setSearchQuery]     = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [filter, setFilter]               = useState("All");
    const [currentPage, setCurrentPage]     = useState(1);
    const [selectedRequest, setSelectedRequest] = useState<WithdrawalItem | null>(null);

    /* Debounce */
    useEffect(() => {
        const t = setTimeout(() => { setDebouncedSearch(searchQuery); setCurrentPage(1); }, 400);
        return () => clearTimeout(t);
    }, [searchQuery]);

    const statusMap: Record<string, string> = {
        Pending: "PENDING", Approved: "APPROVED", Rejected: "REJECTED",
    };

    /* ── API ── */
    const { data: response, isLoading, isError } = useGetAllWithdrawalsQuery({
        page: currentPage,
        limit: 10,
        search: debouncedSearch || undefined,
        status: statusMap[filter] || undefined,
    });
    const [approveWithdrawal, { isLoading: isApproving }] = useApproveWithdrawalMutation();
    const [rejectWithdrawal,  { isLoading: isRejecting  }] = useRejectWithdrawalMutation();

    /* Navigate the nested response: response.data.data → { pagination, meta, data[] } */
    const payload    = response?.data?.data;
    const requests   = payload?.data ?? [];
    const meta       = payload?.meta;
    const pagination = payload?.pagination;

    /* ── Actions ── */
    const handleApprove = async (id: string) => {
        try {
            await approveWithdrawal(id).unwrap();
            if (selectedRequest?.id === id) setSelectedRequest(null);
            Swal.fire({ icon: "success", title: "Approved", timer: 1500, showConfirmButton: false });
        } catch {
            Swal.fire({ icon: "error", title: "Failed to approve", text: "Please try again." });
        }
    };

    const handleReject = async (id: string) => {
        try {
            await rejectWithdrawal(id).unwrap();
            if (selectedRequest?.id === id) setSelectedRequest(null);
            Swal.fire({ icon: "success", title: "Rejected", timer: 1500, showConfirmButton: false });
        } catch {
            Swal.fire({ icon: "error", title: "Failed to reject", text: "Please try again." });
        }
    };

    const fmtDate = (d?: string | null) =>
        d ? new Date(d).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";

    if (isError) return (
        <div className="flex flex-col items-center justify-center h-96 gap-4">
            <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">Failed to load withdrawal requests.</div>
            <button onClick={() => window.location.reload()} className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm hover:bg-slate-800 transition-colors">Retry</button>
        </div>
    );

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Withdrawal Management</h2>
                <p className="text-sm text-slate-500 mt-1">Review and manage provider withdrawal requests</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard value={meta?.totalPending ?? 0} subtext="Pending Requests"    icon={Clock}             colorClass="text-amber-500" bgClass="bg-amber-100" />
                <StatsCard value={meta?.todayApproved ?? 0} subtext="Approved Today"    icon={CheckCircle}       colorClass="text-green-500" bgClass="bg-green-100" />
                <StatsCard value={`৳${Number(meta?.totalPendingAmount ?? 0).toLocaleString()}`} subtext="Total Pending Amount" icon={CircleDollarSign} colorClass="text-blue-500" bgClass="bg-blue-100" />
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Filter + Search */}
                <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                        {["All", "Pending", "Approved", "Rejected"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => { setFilter(tab); setCurrentPage(1); }}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${filter === tab ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div className="relative w-full max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search…"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-sm text-black bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border border-slate-200">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm font-semibold">
                                <th className="px-6 py-4 border-r border-slate-200">SL</th>
                                <th className="px-6 py-4 border-r border-slate-200">User ID</th>
                                <th className="px-6 py-4 border-r border-slate-200">Amount</th>
                                <th className="px-6 py-4 border-r border-slate-200">Net Amount</th>
                                <th className="px-6 py-4 border-r border-slate-200">Bank Type</th>
                                <th className="px-6 py-4 border-r border-slate-200">Phone</th>
                                <th className="px-6 py-4 text-center border-r border-slate-200">Status</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {isLoading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={8} className="px-6 py-5">
                                            <div className="h-4 bg-slate-100 rounded w-full" />
                                        </td>
                                    </tr>
                                ))
                            ) : requests.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-20 text-center text-slate-400 text-sm">
                                        No withdrawal requests found.
                                    </td>
                                </tr>
                            ) : (
                                requests.map((req, idx) => (
                                    <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-slate-500 border-r border-slate-200">
                                            {(currentPage - 1) * 10 + idx + 1}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-mono text-slate-700 max-w-[140px] truncate border-r border-slate-200" title={req.userId}>
                                            {req.userId.slice(0, 12)}…
                                        </td>
                                        <td className="px-6 py-4 text-sm font-semibold text-slate-900 border-r border-slate-200">
                                            ৳{Number(req.amount).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-semibold text-green-700 border-r border-slate-200">
                                            ৳{Number(req.netAmount).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 border-r border-slate-200">
                                            <span className="text-xs font-medium px-2 py-1 rounded bg-blue-50 text-blue-700">
                                                {req.bankType === "MOBILE_BANKING" ? req.mobileBankingType ?? "Mobile" : "Bank"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 border-r border-slate-200">
                                            {req.phoneNumber ?? req.mobileBankingPaymentTakeNumber ?? "—"}
                                        </td>
                                        <td className="px-6 py-4 text-center border-r border-slate-200">
                                            <StatusBadge status={req.status} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                {/* Eye — view all details */}
                                                <button
                                                    onClick={() => setSelectedRequest(req)}
                                                    title="View details"
                                                    className="p-2 text-slate-400 hover:text-[#6366F1] hover:bg-[#EEF2FF] rounded-lg transition-colors"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                {/* {req.status === "PENDING" && ( */}
                                                    <>
                                                        <button
                                                            onClick={() => handleApprove(req.id)}
                                                            disabled={isApproving || isRejecting}
                                                            className={`px-3 py-1.5 bg-[#16A34A] text-white text-xs font-medium rounded hover:bg-green-700 transition-colors disabled:opacity-50 ${req.status === "APPROVED" ? "cursor-disabled opacity-50" : "cursor-pointer"}`}
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(req.id)}
                                                            disabled={isApproving || isRejecting}
                                                            className={`px-3 py-1.5 bg-[#DC2626] text-white text-xs font-medium rounded hover:bg-red-700 transition-colors disabled:opacity-50 ${req.status === "REJECTED" ? "cursor-disabled opacity-50" : "cursor-pointer"}`}
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                {/* )} */}
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

            {/* ── Detail Modal ────────────────────────────────────────── */}
            {selectedRequest && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedRequest(null)} />
                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-900">Withdrawal Details</h3>
                            <button onClick={() => setSelectedRequest(null)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                            {/* Status badge prominent */}
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-slate-700">Status</span>
                                <StatusBadge status={selectedRequest.status} />
                            </div>

                            {/* Amount summary */}
                            <div className="bg-slate-50 rounded-xl p-4 grid grid-cols-3 gap-3 text-center">
                                <div>
                                    <p className="text-xs text-slate-400 mb-1">Amount</p>
                                    <p className="text-base font-bold text-slate-900">৳{Number(selectedRequest.amount).toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 mb-1">Fee</p>
                                    <p className="text-base font-bold text-red-500">-৳{Number(selectedRequest.fee).toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 mb-1">Net Amount</p>
                                    <p className="text-base font-bold text-green-600">৳{Number(selectedRequest.netAmount).toLocaleString()}</p>
                                </div>
                            </div>

                            {/* All fields */}
                            <div className="divide-y divide-slate-100">
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
                                <DetailRow label="Processed At"       value={fmtDate(selectedRequest.processedAt)} />
                                <DetailRow label="Rejection Reason"   value={selectedRequest.rejectionReason} />
                                <DetailRow label="Requested At"       value={fmtDate(selectedRequest.requestedAt)} />
                                <DetailRow label="Created At"         value={fmtDate(selectedRequest.createdAt)} />
                            </div>
                        </div>

                        {/* Footer actions */}
                        {selectedRequest.status === "PENDING" && (
                            <div className="px-6 py-4 border-t border-slate-100 flex gap-3">
                                <button
                                    onClick={() => handleApprove(selectedRequest.id)}
                                    disabled={isApproving || isRejecting}
                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#16A34A] text-white text-sm font-semibold rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50"
                                >
                                    {isApproving && <Loader2 size={15} className="animate-spin" />}
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleReject(selectedRequest.id)}
                                    disabled={isApproving || isRejecting}
                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white border-2 border-red-500 text-red-500 text-sm font-semibold rounded-xl hover:bg-red-50 transition-colors disabled:opacity-50"
                                >
                                    {isRejecting && <Loader2 size={15} className="animate-spin" />}
                                    Reject
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
