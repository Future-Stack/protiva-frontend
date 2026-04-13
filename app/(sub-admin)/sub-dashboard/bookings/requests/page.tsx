"use client";

import { useState } from "react";
import {
    Search,
    Download,
    Filter,
    Eye,
    DownloadIcon,
    ChevronLeft,
    ChevronRight,
    X
} from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import { useGetAllBookingsQuery } from "@/lib/features/super-admin/booking/bookingAPI";
import { Booking } from "@/lib/features/super-admin/booking/booking.type";
import { useAppSelector } from "@/lib/hooks";

export default function BookingRequestsPage() {
    const { user } = useAppSelector((state) => state.auth);
    const hasViewPermission = user?.role === "SUPER_ADMIN" || user?.adminPermissions?.isViewBooking;
    const hasManagePermission = user?.role === "SUPER_ADMIN" || user?.adminPermissions?.isManageBooking;

    const [activeTab, setActiveTab] = useState("All Bookings");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [paymentFilter, setPaymentFilter] = useState("");
    const [showPaymentFilter, setShowPaymentFilter] = useState(false);

    const STATUS_OPTIONS = [
        { value: "",       label: "All Status" },
        { value: "PENDING",   label: "Pending" },
        { value: "ACCEPTED", label: "Accepted" },
        { value: "REJECTED", label: "Rejected" },
        { value: "IN_PROGRESS", label: "In Progress" },
        { value: "COMPLETED", label: "Completed" },
        { value: "CANCELLED", label: "Cancelled" },
    ];
    
    // Map UI tabs to API statuses
    const statusMap: Record<string, any> = {
        "Pending": "PENDING",
        "Accepted": "ACCEPTED",
        "Rejected": "REJECTED",
        "In-Progress": "IN_PROGRESS",
    };

    const { data: response, isLoading, error } = useGetAllBookingsQuery({
        page: currentPage,
        limit: 10,
        status: paymentFilter || statusMap[activeTab],
        search: searchQuery || undefined
    }, {
        skip: !hasViewPermission
    });

    const allBookings = response?.data?.data?.data || [];
    const pagination = response?.data?.data?.pagination;

    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

    const getCount = (status: string) => {
        if (activeTab === status && pagination) return pagination.total;
        return null;
    };

    const handleDownload = () => {
        const headers = ["ID", "Booking Number", "Date", "Time", "Location", "Customer ID", "Provider ID", "Amount", "Status"];
        const csvContent = [
            headers.join(","),
            ...allBookings.map(b => [
                b.id,
                b.bookingNumber || "N/A",
                b.preferredDate,
                b.preferredTime,
                `"${b.locationDetails?.replace(/"/g, '""')}"`,
                b.clientId,
                b.providerId,
                `"${b.serviceAmount}৳"`,
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
        { name: "All Bookings", count: activeTab === "All Bookings" ? pagination?.total : null },
        { name: "Pending", count: getCount("Pending") },
        { name: "Accepted", count: getCount("Accepted") },
        { name: "Rejected", count: getCount("Rejected") },
        { name: "In-Progress", count: getCount("In-Progress") },
    ];

    if (!hasViewPermission) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Access Denied</h2>
                    <p className="text-slate-500">You do not have permission to view bookings.</p>
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="p-8 text-center text-red-500">Error loading bookings. Please try again.</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Booking Request</h2>
                <p className="text-sm text-slate-500 mt-1">Stay updated on customer bookings and provider responses.</p>
            </div>

            {/* Main Card */}
            <div className="overflow-hidden">
                {/* Tabs */}
                <div className="flex overflow-x-auto">
                    {tabs.map(tab => (
                        <button
                            key={tab.name}
                            onClick={() => {
                                setActiveTab(tab.name);
                                setCurrentPage(1);
                            }}
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
                
                <div className="mt-[34px] bg-white px-[26px] py-[34px] rounded-lg min-h-[400px]">
                    {/* Actions Bar */}
                    <div className="pb-6 flex flex-wrap items-center justify-between gap-4">
                        {/* Search Bar */}
                        <div className="hidden sm:flex items-center flex-1 max-w-md relative group">
                            <input
                                type="text"
                                placeholder="Search by booking ID, service..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full pl-15 px-4 py-1.5 h-[45px] bg-white border border-blue-300 rounded-[50px] text-sm font-normal text-black focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                            />
                            <button className="absolute left-1.5 top-1.2 bottom-1.2 w-9 h-9 flex items-center justify-center bg-[#787BEB] text-white rounded-full hover:bg-blue-700 transition-colors shadow-sm">
                                <Search size={18} />
                            </button>
                        </div>

                        <div className="flex items-center gap-3">
                            {hasManagePermission && (
                                <button
                                    onClick={handleDownload}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                                    <Download size={16} />
                                    Download CSV
                                </button>
                            )}
                            <div className="relative">
                                <button
                                    onClick={() => setShowPaymentFilter((v) => !v)}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                        showPaymentFilter || paymentFilter
                                            ? "bg-[#787BEB] text-white"
                                            : "bg-slate-900 text-white hover:bg-slate-800"
                                    }`}
                                >
                                    <Filter size={16} />
                                    Filter
                                    {paymentFilter && (
                                        <span className="ml-1 bg-white/20 text-white rounded-full px-1.5 py-0.5 text-xs">1</span>
                                    )}
                                </button>
                                {showPaymentFilter && (
                                    <div className="absolute right-0 top-full mt-2 z-20 bg-white border border-slate-200 rounded-xl shadow-lg p-4 w-56">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-sm font-semibold text-slate-700">Status</span>
                                            <button onClick={() => setShowPaymentFilter(false)} className="text-slate-400 hover:text-slate-600">
                                                <X size={16} />
                                            </button>
                                        </div>
                                        <div className="space-y-1">
                                            {STATUS_OPTIONS.map((opt) => (
                                                <button
                                                    key={opt.value}
                                                    onClick={() => { setPaymentFilter(opt.value); setShowPaymentFilter(false); setCurrentPage(1); }}
                                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                                                        paymentFilter === opt.value
                                                            ? "bg-[#787BEB]/10 text-[#787BEB] font-medium"
                                                            : "text-slate-600 hover:bg-slate-50"
                                                    }`}
                                                >
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Active filter chips */}
                    {paymentFilter && (
                        <div className="mb-4 flex flex-wrap items-center gap-2">
                            <span className="text-xs text-slate-500">Active filters:</span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#787BEB]/10 text-[#787BEB] text-xs font-medium rounded-full">
                                {STATUS_OPTIONS.find((o) => o.value === paymentFilter)?.label}
                                <button onClick={() => { setPaymentFilter(""); setCurrentPage(1); }} className="hover:text-blue-900">
                                    <X size={12} />
                                </button>
                            </span>
                        </div>
                    )}

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border">
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
                            <tbody className="divide-y divide-slate-300 relative">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={9} className="py-20 text-center text-slate-400">Loading bookings...</td>
                                    </tr>
                                ) : allBookings.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="py-20 text-center text-slate-400">No bookings found.</td>
                                    </tr>
                                ) : (
                                    allBookings.map((booking: Booking, idx: number) => (
                                        <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-4 py-4 text-sm text-slate-600 border-r-2 border-slate-300">
                                                {String(((currentPage - 1) * 10) + idx + 1).padStart(2, '0')}
                                            </td>
                                            <td className="px-4 py-4 text-sm font-medium text-slate-900 border-r-2 border-slate-300">
                                                {booking.bookingNumber || booking.id.slice(-6).toUpperCase()}
                                            </td>
                                            <td className="px-4 py-4 border-r-2 border-slate-300">
                                                <div className="text-sm text-slate-900">{new Date(booking.preferredDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                                                <div className="text-xs text-slate-500">{booking.preferredTime}</div>
                                            </td>
                                            <td className="px-4 py-4 text-sm text-slate-600 border-r-2 border-slate-300 truncate max-w-[150px]" title={booking.locationDetails}>
                                                {booking.locationDetails}
                                            </td>
                                            <td className="px-4 py-4 border-r-2 border-slate-300">
                                                <div className="text-sm text-slate-900 font-medium">{booking.client?.firstName + " " + booking.client?.lastName}</div>
                                                <div className="text-xs text-slate-500">{booking.contactPhone}</div>
                                            </td>
                                            <td className="px-4 py-4 border-r-2 border-slate-300">
                                                <div className="text-sm text-slate-900 font-medium">{booking.provider?.firstName + " " + booking.provider?.lastName}({booking.serviceName})</div>
                                                <div className="text-xs text-slate-500">{booking.provider?.phone}</div>
                                            </td>
                                            <td className="px-4 py-4 text-sm font-medium text-slate-900 border-r-2 border-slate-300">{booking.serviceAmount}৳</td>
                                            <td className="px-4 py-4 text-center border-r-2 border-slate-300">
                                                <StatusBadge status={booking.status as any} />
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => setSelectedBooking(booking)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                        <Eye size={20} />
                                                    </button>
                                                    {hasManagePermission && (
                                                        <button 
                                                            onClick={handleDownload}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                            <DownloadIcon size={20} />
                                                        </button>
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
                    {pagination && pagination.totalPages > 1 && (
                        <div className="py-6 border-t border-slate-200 flex items-center justify-center md:justify-end md:gap-3 gap-1">
                            <button 
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="flex items-center gap-1 px-4 py-2 text-sm text-slate-600 hover:text-slate-900 disabled:opacity-50 transition-colors"
                            >
                                <ChevronLeft size={16} className="-mt-1" />
                                Previous
                            </button>
                            <div className="flex items-center gap-1">
                                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(i => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(i)}
                                        className={`w-8 h-8 rounded-lg text-sm flex items-center justify-center -mt-1 font-medium transition-all ${i === currentPage
                                            ? 'border border-slate-200 text-black bg-slate-50'
                                            : 'text-slate-600 hover:bg-slate-100'
                                            }`}
                                    >
                                        {i}
                                    </button>
                                ))}
                            </div>
                            <button 
                                onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                                disabled={currentPage === pagination.totalPages}
                                className="flex items-center gap-1 px-4 py-2 text-sm text-slate-600 hover:text-slate-900 disabled:opacity-50 transition-colors"
                            >
                                Next
                                <ChevronRight size={16} className="-mt-1" />
                            </button>
                        </div>
                    )}
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
                        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-slate-500 font-medium uppercase">Booking ID</label>
                                    <p className="text-sm font-medium text-slate-900">{"**********" + selectedBooking.id.slice(-6).toUpperCase()}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500 font-medium uppercase">Date & Time</label>
                                    <p className="text-sm text-slate-900">
                                        {new Date(selectedBooking.preferredDate).toLocaleDateString()} at {selectedBooking.preferredTime}
                                    </p>
                                </div>
                                <div className="col-span-2">
                                    <label className="text-xs text-slate-500 font-medium uppercase">Service Name</label>
                                    <p className="text-sm text-slate-900 font-semibold">{selectedBooking.serviceName}</p>
                                </div>
                                <div className="col-span-2">
                                    <label className="text-xs text-slate-500 font-medium uppercase">Location</label>
                                    <p className="text-sm text-slate-900">{selectedBooking.locationDetails}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500 font-medium uppercase">Customer Name</label>
                                    <p className="text-sm text-slate-900">{selectedBooking.client?.firstName + " " + selectedBooking.client?.lastName}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500 font-medium uppercase">Contact Phone</label>
                                    <p className="text-sm text-slate-900">{selectedBooking.contactPhone}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500 font-medium uppercase">Provider Name</label>
                                    <p className="text-sm text-slate-900">{selectedBooking.provider?.firstName + " " + selectedBooking.provider?.lastName}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500 font-medium uppercase">Service Amount</label>
                                    <p className="text-sm font-medium text-slate-900">{selectedBooking.serviceAmount}৳</p>
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500 font-medium uppercase">Status</label>
                                    <div className="mt-1">
                                        <StatusBadge status={selectedBooking.status as any} />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500 font-medium uppercase">Payment Status</label>
                                    <p className={`text-sm font-medium ${selectedBooking.paymentStatus === 'PAID' ? 'text-green-600' : 'text-orange-500'}`}>
                                        {selectedBooking.paymentStatus}
                                    </p>
                                </div>
                                {selectedBooking.message && (
                                    <div className="col-span-2">
                                        <label className="text-xs text-slate-500 font-medium uppercase">Customer Message</label>
                                        <p className="text-sm text-slate-900 bg-slate-50 p-3 rounded-lg mt-1 italic">
                                            "{selectedBooking.message}"
                                        </p>
                                    </div>
                                )}
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
