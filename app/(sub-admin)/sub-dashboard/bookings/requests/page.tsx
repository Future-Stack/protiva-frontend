"use client";

import { useState } from "react";
import {
    Search,
    Download,
    Filter,
    Eye,
    DownloadIcon,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import StatusBadge, { StatusType } from "@/components/StatusBadge";
import { X } from "lucide-react";

const BOOKINGS = [
    { id: "100129", date: "25-Aug-2025\n11:25am", location: "Customer Location", customer: "Charlotte Davis\n+5596965", provider: "Jemmi Kelly (Handyman service)\n+5596965", amount: "482.50৳", status: "Pending" as StatusType },
    { id: "100129", date: "25-Aug-2025\n11:25am", location: "Customer Location", customer: "Charlotte Davis\n+5596965", provider: "Jemmi Kelly (Handyman service)\n+5596965", amount: "482.50৳", status: "Cancelled" as StatusType },
    { id: "100129", date: "25-Aug-2025\n11:25am", location: "Customer Location", customer: "Charlotte Davis\n+5596965", provider: "Jemmi Kelly (Handyman service)\n+5596965", amount: "482.50৳", status: "Rejected" as StatusType },
    { id: "100129", date: "25-Aug-2025\n11:25am", location: "Customer Location", customer: "Charlotte Davis\n+5596965", provider: "Jemmi Kelly (Handyman service)\n+5596965", amount: "482.50৳", status: "Accepted" as StatusType },
    { id: "100129", date: "25-Aug-2025\n11:25am", location: "Customer Location", customer: "Charlotte Davis\n+5596965", provider: "Jemmi Kelly (Handyman service)\n+5596965", amount: "482.50৳", status: "In-Progress" as StatusType },
    { id: "100129", date: "25-Aug-2025\n11:25am", location: "Customer Location", customer: "Charlotte Davis\n+5596965", provider: "Jemmi Kelly (Handyman service)\n+5596965", amount: "482.50৳", status: "In-Progress" as StatusType },
    { id: "100129", date: "25-Aug-2025\n11:25am", location: "Customer Location", customer: "Charlotte Davis\n+5596965", provider: "Jemmi Kelly (Handyman service)\n+5596965", amount: "482.50৳", status: "In-Progress" as StatusType },
    { id: "100129", date: "25-Aug-2025\n11:25am", location: "Customer Location", customer: "Charlotte Davis\n+5596965", provider: "Jemmi Kelly (Handyman service)\n+5596965", amount: "482.50৳", status: "In-Progress" as StatusType },
    { id: "100129", date: "25-Aug-2025\n11:25am", location: "Customer Location", customer: "Charlotte Davis\n+5596965", provider: "Jemmi Kelly (Handyman service)\n+5596965", amount: "482.50৳", status: "In-Progress" as StatusType },
    { id: "100129", date: "25-Aug-2025\n11:25am", location: "Customer Location", customer: "Charlotte Davis\n+5596965", provider: "Jemmi Kelly (Handyman service)\n+5596965", amount: "482.50৳", status: "In-Progress" as StatusType },
];

export default function BookingRequestsPage() {
    const [activeTab, setActiveTab] = useState("All Bookings");
    const [searchQuery, setSearchQuery] = useState("");
    const [bookings, setBookings] = useState(BOOKINGS);
    const [selectedBooking, setSelectedBooking] = useState<typeof BOOKINGS[0] | null>(null);

    const filteredBookings = bookings.filter(booking => {
        const matchesTab = activeTab === "All Bookings" || booking.status === activeTab;
        const matchesSearch =
            booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            booking.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
            booking.provider.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const getCount = (status: string) => {
        if (status === "All Bookings") return null; // Or bookings.length
        return bookings.filter(b => b.status === status).length;
    };

    const handleDownload = () => {
        const headers = ["ID", "Date", "Location", "Customer", "Provider", "Amount", "Status"];
        const csvContent = [
            headers.join(","),
            ...filteredBookings.map(b => [
                b.id,
                `"${b.date.replace(/\n/g, ' ')}"`,
                `"${b.location}"`,
                `"${b.customer.replace(/\n/g, ' ')}"`,
                `"${b.provider.replace(/\n/g, ' ')}"`,
                `"${b.amount}"`,
                b.status
            ].join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "booking_requests.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const tabs = [
        { name: "All Bookings", count: null },
        { name: "Pending", count: getCount("Pending") },
        { name: "Accepted", count: getCount("Accepted") },
        { name: "Rejected", count: getCount("Rejected") },
        { name: "In-Progress", count: getCount("In-Progress") },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Booking Request</h2>
                <p className="text-sm text-slate-500 mt-1">Stay updated on customer bookings and provider responses.</p>
            </div>

            {/* Main Card */}
            <div className="  overflow-hidden">
                {/* Tabs */}
                <div className="flex overflow-x-auto">
                    {tabs.map(tab => (
                        <button
                            key={tab.name}
                            onClick={() => setActiveTab(tab.name)}
                            className={`py-3 px-4 text-sm font-medium transition-all relative ${activeTab === tab.name
                                ? "text-slate-900 bg-slate-200 rounded-sm"
                                : "text-slate-500 hover:text-slate-700"
                                }`}
                        >
                            {tab.name}{tab.count !== null && `(${String(tab.count).padStart(2, '0')})`}
                            {activeTab === tab.name && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></div>
                            )}
                        </button>
                    ))}
                </div>
                <div className=" mt-[34px] bg-white  px-[26px] py-[34px] rounded-lg">

                    {/* Actions Bar */}
                    <div className="pb-6 flex flex-wrap items-center justify-between gap-4 ">
                        {/* Search Bar */}
                        <div className="hidden sm:flex items-center flex-1 max-w-md relative group ">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-15 px-4 py-1.5 h-[45px] bg-white border border-blue-300 rounded-[50px] text-sm font-normal text-black focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                            />
                            <button className="absolute left-1.5 top-1.2 bottom-1.2 w-9 h-9 flex items-center justify-center bg-[#787BEB] text-white rounded-full hover:bg-blue-700 transition-colors shadow-sm">
                                <Search size={18} />
                            </button>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleDownload}
                                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                                <Download size={16} />
                                Download CSV
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
                                <Filter size={16} />
                                Filter
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left 
                        border">
                            <thead>
                                <tr className="bg-blue-50 border-r border-b border-slate-300">
                                    <th className="px-4 py-3 text-base font-semibold text-slate-600 capitalize border-r-2 border-slate-300">SL</th>
                                    <th className="px-4 py-3 text-base font-semibold text-slate-600 capitalize border-r-2 border-slate-300">Booking ID</th>
                                    <th className="px-4 py-3 text-base font-semibold text-slate-600 capitalize border-r-2 border-slate-300">Booking Date</th>
                                    <th className="px-4 py-3 text-base font-semibold text-slate-600 capitalize border-r-2 border-slate-300">Service Location</th>
                                    <th className="px-4 py-3 text-base font-semibold text-slate-600 capitalize border-r-2 border-slate-300">Customer Info</th>
                                    <th className="px-4 py-3 text-base font-semibold text-slate-600 capitalize border-r-2 border-slate-300">Provider Info</th>
                                    <th className="px-4 py-3 text-base font-semibold text-slate-600 capitalize border-r-2 border-slate-300">Total Amount</th>
                                    <th className="px-4 py-3 text-base font-semibold text-slate-600 text-center capitalize border-r-2 border-slate-300">Status</th>
                                    <th className="px-4 py-3 text-base font-semibold text-slate-600 text-center capitalize">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-300">
                                {filteredBookings.map((booking, idx) => (
                                    <tr key={`${booking.id}-${idx}`} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-4 py-4 text-sm text-slate-600 border-r-2 border-slate-300">{String(idx + 1).padStart(2, '0')}</td>
                                        <td className="px-4 py-4 text-sm font-medium text-slate-900 border-r-2 border-slate-300">{booking.id}</td>
                                        <td className="px-4 py-4 border-r-2 border-slate-300">
                                            <div className="text-sm text-slate-900 ">{booking.date.split('\n')[0]}</div>
                                            <div className="text-xs text-slate-500">{booking.date.split('\n')[1]}</div>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-slate-600 border-r-2 border-slate-300">{booking.location}</td>
                                        <td className="px-4 py-4 border-r-2 border-slate-300">
                                            <div className="text-sm text-slate-900 ">{booking.customer.split('\n')[0]}</div>
                                            <div className="text-xs text-slate-500 ">{booking.customer.split('\n')[1]}</div>
                                        </td>
                                        <td className="px-4 py-4 border-r-2 border-slate-300">
                                            <div className="text-sm text-slate-900">{booking.provider.split('\n')[0]}</div>
                                            <div className="text-xs text-slate-500">{booking.provider.split('\n')[1]}</div>
                                        </td>
                                        <td className="px-4 py-4 text-sm font-medium text-slate-900 border-r-2 border-slate-300">{booking.amount}</td>
                                        <td className="px-4 py-4 text-center border-r-2 border-slate-300">
                                            <StatusBadge status={booking.status} />
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => setSelectedBooking(booking)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                    <Eye size={20} />
                                                </button>
                                                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                    <DownloadIcon size={20} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="py-6 border-t border-slate-200 flex items-center justify-center md:justify-end md:gap-3 gap-1">
                        <button className="flex items-center gap-1 px-4 py-2 text-sm text-slate-600 hover:text-slate-900 transition-colors">
                            <ChevronLeft size={16} className="-mt-1" />
                            Previous
                        </button>
                        <div className="flex items-center gap-1">
                            {[1, 2, 3].map(i => (
                                <button
                                    key={i}
                                    className={`w-8 h-8 rounded-lg text-sm flex items-center justify-center -mt-1 font-medium transition-all ${i === 1
                                        ? 'border border-slate-200 text-black'
                                        : 'text-slate-600 hover:bg-slate-100'
                                        }`}
                                >
                                    {i}
                                </button>
                            ))}
                            <span className="px-2 text-slate-400">...</span>
                        </div>
                        <button className="flex items-center gap-1 px-4 py-2 text-sm text-slate-600 hover:text-slate-900 transition-colors">
                            Next
                            <ChevronRight size={16} className="-mt-1" />
                        </button>
                    </div>
                </div>

            </div>
            {/* Booking Details Modal */}
            {selectedBooking && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedBooking(null)}></div>
                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                            <h3 className="text-lg font-bold text-slate-900">Booking Details</h3>
                            <button
                                onClick={() => setSelectedBooking(null)}
                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-slate-500 font-medium uppercase">Booking ID</label>
                                    <p className="text-sm font-medium text-slate-900">{selectedBooking.id}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500 font-medium uppercase">Date</label>
                                    <p className="text-sm text-slate-900 whitespace-pre-line">{selectedBooking.date}</p>
                                </div>
                                <div className="col-span-2">
                                    <label className="text-xs text-slate-500 font-medium uppercase">Location</label>
                                    <p className="text-sm text-slate-900">{selectedBooking.location}</p>
                                </div>
                                <div className="col-span-2">
                                    <label className="text-xs text-slate-500 font-medium uppercase">Customer</label>
                                    <p className="text-sm text-slate-900 whitespace-pre-line">{selectedBooking.customer}</p>
                                </div>
                                <div className="col-span-2">
                                    <label className="text-xs text-slate-500 font-medium uppercase">Provider</label>
                                    <p className="text-sm text-slate-900 whitespace-pre-line">{selectedBooking.provider}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500 font-medium uppercase">Amount</label>
                                    <p className="text-sm font-medium text-slate-900">{selectedBooking.amount}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500 font-medium uppercase">Status</label>
                                    <div className="mt-1">
                                        <StatusBadge status={selectedBooking.status} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                            <button
                                onClick={() => setSelectedBooking(null)}
                                className="px-4 py-2 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
