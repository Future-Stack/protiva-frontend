"use client";

import { useAppSelector } from "@/lib/hooks";
import { useGetAllTransactionsQuery } from "@/lib/features/super-admin/transaction/transactionAPI";
import { ChevronLeft, ChevronRight, Loader2, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useMemo } from "react";

const getStatusStyle = (status: string) => {
    switch (status) {
        case "COMPLETED": return "text-green-600 bg-green-50";
        case "FAILED":    return "text-red-600 bg-red-50";
        case "CANCELLED": return "text-slate-600 bg-slate-50";
        case "PENDING":   return "text-amber-600 bg-amber-50";
        default:          return "text-blue-600 bg-blue-50";
    }
};

const fmt = (d: string) => d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "-";
const fmtTime = (d: string) => d ? new Date(d).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }) : "-";

export default function TransactionsPage() {
    const { user } = useAppSelector((state) => state.auth);
    const hasViewPermission = user?.role === "SUPER_ADMIN" || user?.adminPermissions?.isViewTransaction;

    const [page, setPage] = useState(1);
    const globalSearch = useAppSelector((state) => state.search.query);
    const [searchQuery, setSearchQuery] = useState(globalSearch || "");
    const { data, isLoading, isError, isFetching } = useGetAllTransactionsQuery({ page, limit: 100 });

    useEffect(() => {
        setSearchQuery(globalSearch);
    }, [globalSearch]);

    const transactions = data?.data?.data || [];
    const meta         = data?.data?.meta;

    const filteredTransactions = useMemo(() => {
        return transactions.filter((t: any) => {
            const searchLower = searchQuery.toLowerCase();
            return (
                t.bookingId?.toLowerCase().includes(searchLower) ||
                t.transactionId?.toLowerCase().includes(searchLower) ||
                t.gateway?.toLowerCase().includes(searchLower) ||
                t.status?.toLowerCase().includes(searchLower) ||
                t.amount?.toString().includes(searchQuery)
            );
        });
    }, [transactions, searchQuery]);

    const displayedTransactions = filteredTransactions.slice((page - 1) * 10, page * 10);

    if (!hasViewPermission) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Access Denied</h2>
                    <p className="text-slate-500">You do not have permission to view transactions.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 bg-white px-[26px] py-[34px] rounded-lg overflow-hidden min-h-[80vh]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Transaction</h2>
                    <p className="text-sm text-slate-500 mt-1">Track all payments and refunds in one place</p>
                </div>
                <div className="flex-1 max-w-md relative group">
                    <input
                        type="text"
                        placeholder="Search by Booking ID or Transaction ID..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setPage(1);
                        }}
                        className="w-full pl-12 pr-4 py-2 bg-white border border-slate-200 rounded-full text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                    />
                    <div className="absolute left-1 top-1 bottom-1 w-7.5 h-7.5 flex items-center justify-center bg-[#787BEB] text-white rounded-full">
                        <Search size={14} />
                    </div>
                </div>
            </div>

            <div className="mt-6">
                <div className="overflow-x-auto border border-slate-300 rounded-sm">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-[#EFF6FF]">
                                <th className="px-4 py-3.5 text-sm font-semibold text-[#475569] border-r border-slate-300 text-center">SL</th>
                                <th className="px-4 py-3.5 text-sm font-semibold text-[#475569] border-r border-slate-300">Booking ID</th>
                                <th className="px-4 py-3.5 text-sm font-semibold text-[#475569] border-r border-slate-300">Transaction ID</th>
                                <th className="px-4 py-3.5 text-sm font-semibold text-[#475569] border-r border-slate-300">Date & Time</th>
                                <th className="px-4 py-3.5 text-sm font-semibold text-[#475569] border-r border-slate-300">Gateway</th>
                                <th className="px-4 py-3.5 text-sm font-semibold text-[#475569] border-r border-slate-300 text-center">Amount</th>
                                <th className="px-4 py-3.5 text-sm font-semibold text-[#475569] border-r border-slate-300 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan={7} className="py-20 text-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                        <p className="text-sm text-slate-500">Loading transactions...</p>
                                    </div>
                                </td></tr>
                            ) : displayedTransactions.length === 0 ? (
                                <tr><td colSpan={7} className="py-20 text-center text-slate-500 italic">No transactions found.</td></tr>
                            ) : (
                                displayedTransactions.map((t: any, index: number) => (
                                    <tr key={t.id} className="border-t border-slate-300 hover:bg-slate-50/50 transition-colors">
                                        <td className="px-4 py-4 text-sm text-[#2C2C2C] border-r border-slate-300 text-center">{index + 1 + (page - 1) * 10}</td>
                                        <td className="px-4 py-4 text-sm text-[#0F172A] border-r border-slate-300 font-medium">{t.bookingId}</td>
                                        <td className="px-4 py-4 text-sm text-[#64748b] border-r border-slate-300 break-all max-w-[150px]">{t.transactionId}</td>
                                        <td className="px-4 py-4 border-r border-slate-300">
                                            <div className="text-sm text-[#0F172A] font-medium">{fmt(t.initiatedAt)}</div>
                                            <div className="text-xs text-[#64748b]">{fmtTime(t.initiatedAt)}</div>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-[#0F172A] border-r border-slate-300 uppercase tracking-tight">{t.gateway}</td>
                                        <td className="px-4 py-4 text-sm text-[#0F172A] border-r border-slate-300 text-center font-bold">{t.amount} {t.currency}</td>
                                        <td className="px-4 py-4 text-center border-r border-slate-300">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(t.status)}`}>{t.status}</span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="py-4 border-t border-slate-300 flex items-center justify-end gap-3">
                    <button disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 transition-colors disabled:opacity-50">
                        <ChevronLeft size={16} /> Previous
                    </button>
                    <div className="flex items-center gap-1">
                        {Array.from({ length: Math.ceil(filteredTransactions.length / 10) }, (_, i) => i + 1).map((i) => (
                            <button key={i} onClick={() => setPage(i)}
                                className={`w-8 h-8 rounded text-sm flex items-center justify-center font-medium transition-all ${i === page ? "bg-slate-100 text-slate-900 border border-slate-300 shadow-sm" : "text-slate-600 hover:bg-slate-50"}`}
                            >{i}</button>
                        ))}
                    </div>
                    <button disabled={page >= Math.ceil(filteredTransactions.length / 10)} onClick={() => setPage(p => Math.min(Math.ceil(filteredTransactions.length / 10), p + 1))}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 transition-colors disabled:opacity-50">
                        Next <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
