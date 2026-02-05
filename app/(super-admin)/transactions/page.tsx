"use client";

import DeleteModal from "@/components/DeleteModal";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { useState } from "react";

const TRANSACTIONS = [
    { id: "01", bookingId: "100129", date: "25-Aug-2025", time: "11:25am", location: "Customer Location", customerInfo: "Okanla Desk +5596865 +5596865", providerInfo: "Jemmy Kelly Handyman service! +5596865 +5596865", amount: "482.02৳", status: "Paid" },
    { id: "02", bookingId: "100129", date: "25-Aug-2025", time: "11:25am", location: "Customer Location", customerInfo: "Okanla Desk +5596865 +5596865", providerInfo: "Jemmy Kelly Handyman service! +5596865 +5596865", amount: "482.02৳", status: "Refund" },
    { id: "03", bookingId: "100129", date: "25-Aug-2025", time: "11:25am", location: "Customer Location", customerInfo: "Okanla Desk +5596865 +5596865", providerInfo: "Jemmy Kelly Handyman service! +5596865 +5596865", amount: "482.02৳", status: "Paid" },
    { id: "04", bookingId: "100129", date: "25-Aug-2025", time: "11:25am", location: "Customer Location", customerInfo: "Okanla Desk +5596865 +5596865", providerInfo: "Jemmy Kelly Handyman service! +5596865 +5596865", amount: "482.02৳", status: "Paid" },
    { id: "05", bookingId: "100129", date: "25-Aug-2025", time: "11:25am", location: "Customer Location", customerInfo: "Okanla Desk +5596865 +5596865", providerInfo: "Jemmy Kelly Handyman service! +5596865 +5596865", amount: "482.02৳", status: "Paid" },
    { id: "06", bookingId: "100129", date: "25-Aug-2025", time: "11:25am", location: "Customer Location", customerInfo: "Okanla Desk +5596865 +5596865", providerInfo: "Jemmy Kelly Handyman service! +5596865 +5596865", amount: "482.02৳", status: "Paid" },
    { id: "07", bookingId: "100129", date: "25-Aug-2025", time: "11:25am", location: "Customer Location", customerInfo: "Okanla Desk +5596865 +5596865", providerInfo: "Jemmy Kelly Handyman service! +5596865 +5596865", amount: "482.02৳", status: "Paid" },
    { id: "08", bookingId: "100129", date: "25-Aug-2025", time: "11:25am", location: "Customer Location", customerInfo: "Okanla Desk +5596865 +5596865", providerInfo: "Jemmy Kelly Handyman service! +5596865 +5596865", amount: "482.02৳", status: "Paid" },
    { id: "09", bookingId: "100129", date: "25-Aug-2025", time: "11:25am", location: "Customer Location", customerInfo: "Okanla Desk +5596865 +5596865", providerInfo: "Jemmy Kelly Handyman service! +5596865 +5596865", amount: "482.02৳", status: "Paid" },
    { id: "10", bookingId: "100129", date: "25-Aug-2025", time: "11:25am", location: "Customer Location", customerInfo: "Okanla Desk +5596865 +5596865", providerInfo: "Jemmy Kelly Handyman service! +5596865 +5596865", amount: "482.02৳", status: "Paid" },
];

export default function TransactionsPage() {
        const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
        const [itemToDelete, setItemToDelete] = useState<string | null>(null);
        const handleDelete = (id: string) => {
        setItemToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (itemToDelete) {
            setItemToDelete(null);
        }
        setIsDeleteModalOpen(false);
    };

    return (
        <div className="space-y-6 bg-white px-[26px] py-[34px] rounded-lg overflow-hidden">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Transaction</h2>
                <p className="text-sm text-slate-500 mt-1">Track all your payments and refunds in one place</p>
            </div>

            {/* Main Card */}
            <div className="mt-6">
                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border border-slate-300">
                        <thead>
                            <tr className="bg-[#EFF6FF]">
                                <th className="px-4 py-3.5 text-sm font-semibold text-[#475569] border-r border-slate-300">SL</th>
                                <th className="px-4 py-3.5 text-sm font-semibold text-[#475569] border-r border-slate-300">Booking ID</th>
                                <th className="px-4 py-3.5 text-sm font-semibold text-[#475569] border-r border-slate-300">Booking Date</th>
                                <th className="px-4 py-3.5 text-sm font-semibold text-[#475569] border-r border-slate-300">Service Location</th>
                                <th className="px-4 py-3.5 text-sm font-semibold text-[#475569] border-r border-slate-300">Customer info</th>
                                <th className="px-4 py-3.5 text-sm font-semibold text-[#475569] border-r border-slate-300">Provider Info</th>
                                <th className="px-4 py-3.5 text-sm font-semibold text-[#475569] border-r border-slate-300 text-center">Total Amount</th>
                                <th className="px-4 py-3.5 text-sm font-semibold text-[#475569] border-r border-slate-300 text-center">Status</th>
                                <th className="px-4 py-3.5 text-base font-semibold text-[#475569] capitalize text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {TRANSACTIONS.map((transaction) => (
                                <tr key={transaction.id} className="border-t border-slate-300 hover:bg-slate-50/50 transition-colors">
                                    <td className="px-4 py-4 text-sm text-[#2C2C2C] border-r border-slate-300">{transaction.id}</td>
                                    <td className="px-4 py-4 text-sm text-[#0F172A] border-r border-slate-300">{transaction.bookingId}</td>
                                    <td className="px-4 py-4 border-r border-slate-300">
                                        <div className="text-sm text-[#0F172A]">{transaction.date}</div>
                                        <div className="text-sm text-[#0F172A]">{transaction.time}</div>
                                    </td>
                                    <td className="px-4 py-4 text-sm text-[#0F172A] border-r border-slate-300">{transaction.location}</td>
                                    <td className="px-4 py-4 border-r border-slate-300">
                                        <div className="text-sm text-[#0F172A] max-w-[200px]">{transaction.customerInfo.split('+')[0]}</div>
                                        <div className="text-sm text-[#0F172A]">+{transaction.customerInfo.split('+')[1]}</div>
                                    </td>
                                    <td className="px-4 py-4 border-r border-slate-300">
                                        <div className="text-sm text-[#0F172A] max-w-[250px]">{transaction.providerInfo.split('+')[0]}</div>
                                        <div className="text-sm text-[#0F172A]">+{transaction.providerInfo.split('+')[1]}</div>
                                    </td>
                                    <td className="px-4 py-4 text-sm text-[#0F172A] border-r border-slate-300 text-center">{transaction.amount}</td>
                                    <td className="px-4 py-4 text-center border-r border-slate-300">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${transaction.status === "Paid" ? "text-[#0085B1]" : " text-pink-600"}`}>
                                            {transaction.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <button onClick={() => handleDelete(transaction.id)} className="p-2 text-red-800 hover:bg-red-50 rounded-lg transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="py-4 border-t border-slate-300 flex items-center justify-end gap-3">
                    <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 transition-colors">
                        <ChevronLeft size={16} />
                        Previous
                    </button>
                    <div className="flex items-center gap-1">
                        {[1, 2, 3].map(i => (
                            <button
                                key={i}
                                className={`w-8 h-8 rounded text-sm flex items-center justify-center font-medium transition-all ${i === 1
                                    ? 'bg-slate-100 text-slate-900'
                                    : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                {i}
                            </button>
                        ))}
                        <span className="px-1 text-slate-400">...</span>
                    </div>
                    <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 transition-colors">
                        Next
                        <ChevronRight size={16} />
                    </button>
                </div>
                <DeleteModal
                                    isOpen={isDeleteModalOpen}
                                    onClose={() => setIsDeleteModalOpen(false)}
                                    onConfirm={confirmDelete}
                                    title="Delete Subscription"
                                    description="Are you sure you want to delete this subscription record? This action cannot be undone."
                                />
            </div>
        </div>
    );
}
