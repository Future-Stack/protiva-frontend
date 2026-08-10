"use client";

import DeleteModal from "@/components/DeleteModal";
import { useGetAllTransactionsQuery } from "@/lib/features/super-admin/transaction/transactionAPI";
import { ChevronLeft, ChevronRight, Loader2, Search } from "lucide-react";
import { useAppSelector } from "@/lib/hooks";
import { useEffect, useState, useMemo } from "react";

export default function TransactionsPage() {
    const [page, setPage] = useState(1);
    const globalSearch = useAppSelector((state) => state.search.query);
    const [searchInput, setSearchInput] = useState(globalSearch || "");
    
    // Sync local search with global search
    useEffect(() => {
        setSearchInput(globalSearch);
    }, [globalSearch]);

    const { data: transactionsData, isLoading, isError, isFetching } = useGetAllTransactionsQuery({ page, limit: 100 });

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);

    const transactions = transactionsData?.data?.data || [];
    const meta = transactionsData?.data?.meta;

    const filteredTransactions = useMemo(() => {
        return transactions.filter((t: any) => {
            const searchLower = searchInput.toLowerCase();
            return (
                t.bookingId?.toLowerCase().includes(searchLower) ||
                t.transactionId?.toLowerCase().includes(searchLower) ||
                t.gateway?.toLowerCase().includes(searchLower) ||
                t.status?.toLowerCase().includes(searchLower) ||
                t.amount?.toString().includes(searchInput)
            );
        });
    }, [transactions, searchInput]);

    const displayedTransactions = filteredTransactions.slice((page - 1) * 10, page * 10);

    const confirmDelete = () => {
        // No delete API provided yet, just UI feedback
        if (itemToDelete) {
            setItemToDelete(null);
        }
        setIsDeleteModalOpen(false);
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    const formatTime = (dateString: string) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        });
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "COMPLETED":
                return "text-green-600 bg-green-50";
            case "FAILED":
                return "text-red-600 bg-red-50";
            case "CANCELLED":
                return "text-red-600 bg-red-50";
            case "PENDING":
                return "text-amber-600 bg-amber-50";
            default:
                return "text-blue-600 bg-blue-50";
        }
    };

    return (
        <div className="space-y-6 bg-white p-4 sm:px-[26px] sm:py-[34px] rounded-lg overflow-hidden min-h-[80vh]">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Transaction</h2>
                <p className="text-sm text-slate-500 mt-1">Track all your payments and refunds in one place</p>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                <div className="flex items-center w-full md:flex-1 md:max-w-md relative group">
                    <input
                        type="text"
                        placeholder="Search by Booking ID or Transaction ID..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="w-full pl-12 pr-4 py-2.5 bg-white border border-slate-200 rounded-full text-sm text-black focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400"
                    />
                    <div className="absolute left-1 top-1 bottom-1 w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full">
                        <Search size={16} />
                    </div>
                </div>
            </div>

            {/* Main Card */}
            <div className="mt-6">
                {/* Table */}
                <div className="w-full overflow-x-auto rounded-xl border border-slate-300 scrollbar-hide">
                    <table className="w-full text-left min-w-[750px]">
                        <thead>
                            <tr className="bg-[#EFF6FF]">
                                <th className="px-4 py-3.5 text-sm font-semibold text-[#475569] border-r border-slate-300 text-center">SL</th>
                                <th className="px-4 py-3.5 text-sm font-semibold text-[#475569] border-r border-slate-300">Booking ID</th>
                                <th className="px-4 py-3.5 text-sm font-semibold text-[#475569] border-r border-slate-300">Transaction ID</th>
                                <th className="px-4 py-3.5 text-sm font-semibold text-[#475569] border-r border-slate-300">Date & Time</th>
                                <th className="px-4 py-3.5 text-sm font-semibold text-[#475569] border-r border-slate-300">Gateway</th>
                                <th className="px-4 py-3.5 text-sm font-semibold text-[#475569] border-r border-slate-300 text-center">Amount</th>
                                <th className="px-4 py-3.5 text-sm font-semibold text-[#475569] border-r border-slate-300 text-center">Status</th>
                                {/* <th className="px-4 py-3.5 text-base font-semibold text-[#475569] capitalize text-center">Action</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={8} className="py-20 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                            <p className="text-sm text-slate-500 font-medium">Loading transactions...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : displayedTransactions.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="py-20 text-center text-slate-500 italic">
                                        No transactions found.
                                    </td>
                                </tr>
                            ) : (
                                displayedTransactions.map((transaction: any, index: number) => (
                                    <tr key={transaction.id} className="border-t border-slate-300 hover:bg-slate-50/50 transition-colors">
                                        <td className="px-4 py-4 text-sm text-[#2C2C2C] border-r border-slate-300 text-center">
                                            {index + 1 + (page - 1) * 10}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-[#0F172A] border-r border-slate-300 font-medium">
                                            {transaction.bookingId}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-[#64748b] border-r border-slate-300 break-all max-w-[150px]">
                                            {transaction.transactionId}
                                        </td>
                                        <td className="px-4 py-4 border-r border-slate-300">
                                            <div className="text-sm text-[#0F172A] font-medium">{formatDate(transaction.initiatedAt)}</div>
                                            <div className="text-xs text-[#64748b]">{formatTime(transaction.initiatedAt)}</div>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-[#0F172A] border-r border-slate-300 uppercase tracking-tight">
                                            {transaction.gateway}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-[#0F172A] border-r border-slate-300 text-center font-bold">
                                            {transaction.amount} {transaction.currency}
                                        </td>
                                        <td className="px-4 py-4 text-center border-r border-slate-300">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(transaction.status)}`}>
                                                {transaction.status}
                                            </span>
                                        </td>
                                        {/* <td className="px-4 py-4 text-center">
                                            <button
                                                onClick={() => handleDelete(transaction.id)}
                                                className="p-2 text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td> */}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="py-4 border-t border-slate-300 flex items-center justify-end gap-3">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 transition-colors disabled:opacity-50"
                    >
                        <ChevronLeft size={16} />
                        Previous
                    </button>
                    <div className="flex items-center gap-1">
                        {Array.from({ length: Math.ceil(filteredTransactions.length / 10) }, (_, i) => i + 1).map((pageNum) => (
                            <button
                                key={pageNum}
                                onClick={() => setPage(pageNum)}
                                className={`w-8 h-8 rounded text-sm flex items-center justify-center font-medium transition-all ${pageNum === page
                                    ? 'bg-slate-100 text-slate-900 border border-slate-300 shadow-sm'
                                    : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                {pageNum}
                            </button>
                        ))}
                    </div>
                    <button
                        disabled={page >= Math.ceil(filteredTransactions.length / 10)}
                        onClick={() => setPage(p => p + 1)}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 transition-colors disabled:opacity-50"
                    >
                        Next
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Transaction"
                description="Are you sure you want to delete this transaction record? This action cannot be undone."
            />
        </div>
    );
}


// "use client";

// import DeleteModal from "@/components/DeleteModal";
// import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
// import { useState } from "react";

// const TRANSACTIONS = [
//     { id: "01", bookingId: "100129", date: "25-Aug-2025", time: "11:25am", location: "Customer Location", customerInfo: "Okanla Desk +5596865 +5596865", providerInfo: "Jemmy Kelly Handyman service! +5596865 +5596865", amount: "482.02৳", status: "Paid" },
//     { id: "02", bookingId: "100129", date: "25-Aug-2025", time: "11:25am", location: "Customer Location", customerInfo: "Okanla Desk +5596865 +5596865", providerInfo: "Jemmy Kelly Handyman service! +5596865 +5596865", amount: "482.02৳", status: "Refund" },
//     { id: "03", bookingId: "100129", date: "25-Aug-2025", time: "11:25am", location: "Customer Location", customerInfo: "Okanla Desk +5596865 +5596865", providerInfo: "Jemmy Kelly Handyman service! +5596865 +5596865", amount: "482.02৳", status: "Paid" },
//     { id: "04", bookingId: "100129", date: "25-Aug-2025", time: "11:25am", location: "Customer Location", customerInfo: "Okanla Desk +5596865 +5596865", providerInfo: "Jemmy Kelly Handyman service! +5596865 +5596865", amount: "482.02৳", status: "Paid" },
//     { id: "05", bookingId: "100129", date: "25-Aug-2025", time: "11:25am", location: "Customer Location", customerInfo: "Okanla Desk +5596865 +5596865", providerInfo: "Jemmy Kelly Handyman service! +5596865 +5596865", amount: "482.02৳", status: "Paid" },
//     { id: "06", bookingId: "100129", date: "25-Aug-2025", time: "11:25am", location: "Customer Location", customerInfo: "Okanla Desk +5596865 +5596865", providerInfo: "Jemmy Kelly Handyman service! +5596865 +5596865", amount: "482.02৳", status: "Paid" },
//     { id: "07", bookingId: "100129", date: "25-Aug-2025", time: "11:25am", location: "Customer Location", customerInfo: "Okanla Desk +5596865 +5596865", providerInfo: "Jemmy Kelly Handyman service! +5596865 +5596865", amount: "482.02৳", status: "Paid" },
//     { id: "08", bookingId: "100129", date: "25-Aug-2025", time: "11:25am", location: "Customer Location", customerInfo: "Okanla Desk +5596865 +5596865", providerInfo: "Jemmy Kelly Handyman service! +5596865 +5596865", amount: "482.02৳", status: "Paid" },
//     { id: "09", bookingId: "100129", date: "25-Aug-2025", time: "11:25am", location: "Customer Location", customerInfo: "Okanla Desk +5596865 +5596865", providerInfo: "Jemmy Kelly Handyman service! +5596865 +5596865", amount: "482.02৳", status: "Paid" },
//     { id: "10", bookingId: "100129", date: "25-Aug-2025", time: "11:25am", location: "Customer Location", customerInfo: "Okanla Desk +5596865 +5596865", providerInfo: "Jemmy Kelly Handyman service! +5596865 +5596865", amount: "482.02৳", status: "Paid" },
// ];

// export default function TransactionsPage() {
//     const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//     const [itemToDelete, setItemToDelete] = useState<string | null>(null);
//     const handleDelete = (id: string) => {
//         setItemToDelete(id);
//         setIsDeleteModalOpen(true);
//     };

//     const confirmDelete = () => {
//         if (itemToDelete) {
//             setItemToDelete(null);
//         }
//         setIsDeleteModalOpen(false);
//     };

//     return (
//         <div className="space-y-6 bg-white px-[26px] py-[34px] rounded-lg overflow-hidden">
//             {/* Header */}
//             <div>
//                 <h2 className="text-2xl font-bold text-slate-900">Transaction</h2>
//                 <p className="text-sm text-slate-500 mt-1">Track all your payments and refunds in one place</p>
//             </div>

//             {/* Main Card */}
//             <div className="mt-6">
//                 {/* Table */}
//                 <div className="overflow-x-auto">
//                     <table className="w-full text-left border border-slate-300">
//                         <thead>
//                             <tr className="bg-[#EFF6FF]">
//                                 <th className="px-4 py-3.5 text-sm font-semibold text-[#475569] border-r border-slate-300">SL</th>
//                                 <th className="px-4 py-3.5 text-sm font-semibold text-[#475569] border-r border-slate-300">Booking ID</th>
//                                 <th className="px-4 py-3.5 text-sm font-semibold text-[#475569] border-r border-slate-300">Booking Date</th>
//                                 <th className="px-4 py-3.5 text-sm font-semibold text-[#475569] border-r border-slate-300">Service Location</th>
//                                 <th className="px-4 py-3.5 text-sm font-semibold text-[#475569] border-r border-slate-300">Customer info</th>
//                                 <th className="px-4 py-3.5 text-sm font-semibold text-[#475569] border-r border-slate-300">Provider Info</th>
//                                 <th className="px-4 py-3.5 text-sm font-semibold text-[#475569] border-r border-slate-300 text-center">Total Amount</th>
//                                 <th className="px-4 py-3.5 text-sm font-semibold text-[#475569] border-r border-slate-300 text-center">Status</th>
//                                 <th className="px-4 py-3.5 text-base font-semibold text-[#475569] capitalize text-center">Action</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {TRANSACTIONS.map((transaction) => (
//                                 <tr key={transaction.id} className="border-t border-slate-300 hover:bg-slate-50/50 transition-colors">
//                                     <td className="px-4 py-4 text-sm text-[#2C2C2C] border-r border-slate-300">{transaction.id}</td>
//                                     <td className="px-4 py-4 text-sm text-[#0F172A] border-r border-slate-300">{transaction.bookingId}</td>
//                                     <td className="px-4 py-4 border-r border-slate-300">
//                                         <div className="text-sm text-[#0F172A]">{transaction.date}</div>
//                                         <div className="text-sm text-[#0F172A]">{transaction.time}</div>
//                                     </td>
//                                     <td className="px-4 py-4 text-sm text-[#0F172A] border-r border-slate-300">{transaction.location}</td>
//                                     <td className="px-4 py-4 border-r border-slate-300">
//                                         <div className="text-sm text-[#0F172A] max-w-[200px]">{transaction.customerInfo.split('+')[0]}</div>
//                                         <div className="text-sm text-[#0F172A]">+{transaction.customerInfo.split('+')[1]}</div>
//                                     </td>
//                                     <td className="px-4 py-4 border-r border-slate-300">
//                                         <div className="text-sm text-[#0F172A] max-w-[250px]">{transaction.providerInfo.split('+')[0]}</div>
//                                         <div className="text-sm text-[#0F172A]">+{transaction.providerInfo.split('+')[1]}</div>
//                                     </td>
//                                     <td className="px-4 py-4 text-sm text-[#0F172A] border-r border-slate-300 text-center">{transaction.amount}</td>
//                                     <td className="px-4 py-4 text-center border-r border-slate-300">
//                                         <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${transaction.status === "Paid" ? "text-[#0085B1]" : " text-pink-600"}`}>
//                                             {transaction.status}
//                                         </span>
//                                     </td>
//                                     <td className="px-4 py-4 text-center">
//                                         <button onClick={() => handleDelete(transaction.id)} className="p-2 text-red-800 hover:bg-red-50 rounded-lg transition-colors">
//                                             <Trash2 size={18} />
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>

//                 {/* Pagination */}
//                 <div className="py-4 border-t border-slate-300 flex items-center justify-end gap-3">
//                     <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 transition-colors">
//                         <ChevronLeft size={16} />
//                         Previous
//                     </button>
//                     <div className="flex items-center gap-1">
//                         {[1, 2, 3].map(i => (
//                             <button
//                                 key={i}
//                                 className={`w-8 h-8 rounded text-sm flex items-center justify-center font-medium transition-all ${i === 1
//                                     ? 'bg-slate-100 text-slate-900'
//                                     : 'text-slate-600 hover:bg-slate-50'
//                                     }`}
//                             >
//                                 {i}
//                             </button>
//                         ))}
//                         <span className="px-1 text-slate-400">...</span>
//                     </div>
//                     <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 transition-colors">
//                         Next
//                         <ChevronRight size={16} />
//                     </button>
//                 </div>
//                 <DeleteModal
//                     isOpen={isDeleteModalOpen}
//                     onClose={() => setIsDeleteModalOpen(false)}
//                     onConfirm={confirmDelete}
//                     title="Delete Subscription"
//                     description="Are you sure you want to delete this subscription record? This action cannot be undone."
//                 />
//             </div>
//         </div>
//     );
// }

