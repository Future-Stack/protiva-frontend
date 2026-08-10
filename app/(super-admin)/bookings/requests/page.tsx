"use client";

import { useState, useRef } from "react";
import {
    Search,
    Download,
    Filter,
    Eye,
    DownloadIcon,
    ChevronLeft,
    ChevronRight,
    X,
    Calendar
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import StatusBadge, { StatusType } from "@/components/StatusBadge";
import { useGetAllBookingsQuery } from "@/lib/features/super-admin/booking/bookingAPI";
import { Booking } from "@/lib/features/super-admin/booking/booking.type";
import { useEffect, useMemo } from "react";
import { useAppSelector } from "@/lib/hooks";

export default function BookingRequestsPage() {
    const globalSearch = useAppSelector((state) => state.search.query);
    const [activeTab, setActiveTab] = useState("All Bookings");
    const [searchQuery, setSearchQuery] = useState(globalSearch || "");
    const [currentPage, setCurrentPage] = useState(1);
    const [paymentFilter, setPaymentFilter] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [showPaymentFilter, setShowPaymentFilter] = useState(false);
    const dateRef = useRef<HTMLInputElement>(null);

    const formatDateDisplay = (dateStr: string) => {
        if (!dateStr) return "";
        const [y, m, d] = dateStr.split('-');
        return `${d}-${m}-${y}`;
    };

    // Sync local search with global search
    useEffect(() => {
        setSearchQuery(globalSearch);
    }, [globalSearch]);

    const debouncedSearch = searchQuery; // We'll filter on frontend, so no need for separate debounced search state if we use searchQuery directly in useMemo

    const STATUS_OPTIONS = [
        { value: "",       label: "All Status" },
        { value: "PENDING",   label: "Pending" },
        { value: "ACCEPTED", label: "Accepted" },
        { value: "REJECTED", label: "Rejected" },
        { value: "IN_PROGRESS", label: "In Progress" },
        { value: "COMPLETED", label: "Completed" },
        { value: "CANCELLED", label: "Cancelled" },
    ];

    // Reset pagination on search
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    // Reset pagination on tab change
    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab]);
    
    // Map UI tabs to API statuses
    const statusMap: Record<string, any> = {
        "Pending": "PENDING",
        "Accepted": "ACCEPTED",
        "Rejected": "REJECTED",
        "In-Progress": "IN_PROGRESS",
        "All Bookings": "",
        "Completed": "COMPLETED",
        "Cancelled": "CANCELLED",
        "Refunded": "REFUNDED",
    };

    const { data: response, isLoading, error, isFetching } = useGetAllBookingsQuery({
        page: currentPage,
        limit: 100,
        status: paymentFilter || statusMap[activeTab],
        date: selectedDate,
    });

    const allBookings = response?.data?.data?.data || [];
    
    const filteredBookings = useMemo(() => {
        return allBookings.filter((b: any) => {
            const searchLower = searchQuery.toLowerCase();
            const clientName = `${b.client?.firstName || ""} ${b.client?.lastName || ""}`.toLowerCase();
            const providerName = `${b.provider?.firstName || ""} ${b.provider?.lastName || ""}`.toLowerCase();
            
            const matchesSearch = (
                b.id.toLowerCase().includes(searchLower) ||
                (b.bookingNumber && b.bookingNumber.toLowerCase().includes(searchLower)) ||
                b.serviceName.toLowerCase().includes(searchLower) ||
                clientName.includes(searchLower) ||
                providerName.includes(searchLower) ||
                (b.contactPhone && b.contactPhone.includes(searchQuery)) ||
                (b.locationDetails && b.locationDetails.toLowerCase().includes(searchLower))
            );

            // Frontend date filtering fallback
            const bookingDate = b.preferredDate ? new Date(b.preferredDate).toISOString().split('T')[0] : "";
            const matchesDate = !selectedDate || bookingDate === selectedDate;

            return matchesSearch && matchesDate;
        });
    }, [allBookings, searchQuery, selectedDate]);

    const displayedBookings = filteredBookings.slice((currentPage - 1) * 10, currentPage * 10);
    const pagination = response?.data?.data?.pagination;
    const totalFiltered = filteredBookings.length;
    const totalPagesFiltered = Math.ceil(totalFiltered / 10);

    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

    const getCount = (status: string) => {
        // Note: Real count should ideally come from the API for each status
        // For now, we'll just show the count for the current filtered view if active
        if (activeTab === status && pagination) return pagination.total;
        return null;
    };

    const handleDownloadAllCSV = () => {
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

    const handleDownloadPDF = (booking: Booking) => {
        const doc = new jsPDF();
        
        // Add Header
        doc.setFontSize(22);
        doc.setTextColor(44, 62, 80);
        doc.text("Protiva - Booking Details", 20, 20);
        
        doc.setFontSize(10);
        doc.setTextColor(127, 140, 141);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 28);
        
        doc.setLineWidth(0.5);
        doc.line(20, 32, 190, 32);

        // Booking Info
        doc.setFontSize(12);
        doc.setTextColor(44, 62, 80);
        doc.setFont("helvetica", "bold");
        doc.text("Booking Information", 20, 45);
        
        const bookingData = [
            ["Booking ID", booking.id],
            ["Booking Number", booking.bookingNumber || "N/A"],
            ["Service Name", booking.serviceName],
            ["Date & Time", `${new Date(booking.preferredDate).toLocaleDateString()} at ${booking.preferredTime}`],
            ["Location", booking.locationDetails],
            ["Amount", `${booking.serviceAmount} BDT`],
            ["Status", booking.status],
            ["Payment Status", booking.paymentStatus]
        ];

        autoTable(doc, {
            startY: 50,
            head: [["Field", "Details"]],
            body: bookingData,
            theme: "striped",
            headStyles: { fillColor: [120, 123, 235] },
            margin: { left: 20, right: 20 }
        });

        // Client & Provider Info
        const currentY = (doc as any).lastAutoTable.finalY + 15;
        doc.text("Customer & Provider Details", 20, currentY);

        const detailsData = [
            ["Customer Name", booking.client ? `${booking.client.firstName} ${booking.client.lastName}` : "N/A"],
            ["Customer Phone", booking.contactPhone || "N/A"],
            ["Provider Name", booking.provider ? `${booking.provider.firstName} ${booking.provider.lastName}` : "N/A"],
            ["Provider Phone", booking.provider?.phone || "N/A"]
        ];

        autoTable(doc, {
            startY: currentY + 5,
            head: [["Role", "Information"]],
            body: detailsData,
            theme: "grid",
            headStyles: { fillColor: [52, 73, 94] },
            margin: { left: 20, right: 20 }
        });

        // Footer
        const finalY = (doc as any).lastAutoTable.finalY + 20;
        doc.setFontSize(10);
        doc.setTextColor(127, 140, 141);
        doc.text("Thank you for using Protiva.", 20, finalY);
        doc.text("This is a computer-generated document.", 20, finalY + 5);

        doc.save(`booking_${booking.id.slice(-6)}.pdf`);
    };

    const tabs = [
        { name: "All Bookings", count: activeTab === "All Bookings" ? totalFiltered : null },
        { name: "Pending", count: activeTab === "Pending" ? totalFiltered : null },
        { name: "Accepted", count: activeTab === "Accepted" ? totalFiltered : null },
        { name: "Rejected", count: activeTab === "Rejected" ? totalFiltered : null },
        { name: "In-Progress", count: activeTab === "In-Progress" ? totalFiltered : null },
    ];

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
            <div className={`overflow-hidden transition-opacity ${isFetching ? "opacity-60" : "opacity-100"}`}>
                {/* Tabs */}
                <div className="flex overflow-x-auto scrollbar-hide space-x-1 border-b border-slate-200 pb-1">
                    {tabs.map(tab => (
                        <button
                            key={tab.name}
                            onClick={() => {
                                setActiveTab(tab.name);
                                setCurrentPage(1);
                            }}
                            className={`py-3 px-4 text-sm font-medium transition-all relative shrink-0 whitespace-nowrap ${activeTab === tab.name
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
                
                <div className="mt-6 bg-white p-4 sm:px-[26px] sm:py-[34px] rounded-lg min-h-[400px]">
                    {/* Actions Bar */}
                    <div className="pb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                        {/* Search Bar */}
                        <div className="w-full md:flex-1 md:max-w-md relative group">
                            <input
                                type="text"
                                placeholder="Search by booking ID, service..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full pl-12 pr-4 py-2 bg-white border border-slate-200 rounded-full text-sm text-black focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400"
                            />
                            <div className="absolute left-1 top-1 bottom-1 w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full">
                                <Search size={16} />
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                             <button
                                onClick={handleDownloadAllCSV}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                                <Download size={16} />
                                Download CSV
                            </button>
                            {/* Premium Date Picker */}
                            <div 
                                className="relative group cursor-pointer flex-1 sm:flex-none"
                                onClick={() => {
                                    try {
                                        (dateRef.current as any)?.showPicker();
                                    } catch (e) {
                                        dateRef.current?.focus();
                                    }
                                }}
                            >
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-hover:text-primary transition-colors pointer-events-none z-10">
                                    <Calendar size={16} />
                                </div>
                                <input
                                    type="text"
                                    readOnly
                                    value={selectedDate ? formatDateDisplay(selectedDate) : ""}
                                    placeholder="DD-MM-YYYY"
                                    className="pl-12 pr-10 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all cursor-pointer w-full sm:w-[180px] hover:border-primary/50 "
                                />
                                <input
                                    ref={dateRef}
                                    type="date"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    value={selectedDate}
                                    onChange={(e) => {
                                        setSelectedDate(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                />
                                {selectedDate && (
                                    <button 
                                        onClick={(e) => { 
                                            e.stopPropagation();
                                            setSelectedDate(""); 
                                            setCurrentPage(1); 
                                        }}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-red-500 transition-colors z-20"
                                    >
                                        <X size={14} />
                                    </button>
                                )}
                            </div>

                           
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
                    <div className="w-full overflow-x-auto border border-slate-200 rounded-xl scrollbar-hide">
                        <table className="w-full text-left border min-w-[900px]">
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
                                ) : displayedBookings.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="py-20 text-center text-slate-400">No bookings found.</td>
                                    </tr>
                                ) : (
                                    displayedBookings.map((booking, idx) => (
                                        <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-4 py-4 text-sm text-slate-600 border-r-2 border-slate-300">
                                                {String(((currentPage - 1) * 10) + idx + 1).padStart(2, '0')}
                                            </td>
                                            <td className="px-4 py-4 text-sm font-medium text-slate-900 border-r-2 border-slate-300">
                                                {booking.bookingNumber || booking.id.slice(-8)}
                                            </td>
                                            <td className="px-4 py-4 border-r-2 border-slate-300">
                                                <div className="text-sm text-slate-900">{new Date(booking.preferredDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                                                <div className="text-xs text-slate-500">{booking.preferredTime}</div>
                                            </td>
                                            <td className="px-4 py-4 text-sm text-slate-600 border-r-2 border-slate-300 truncate max-w-[150px]" title={booking.locationDetails}>
                                                {booking.locationDetails}
                                            </td>
                                            <td className="px-4 py-4 border-r-2 border-slate-300">
                                                <div className="text-sm text-slate-900 font-medium">{booking.client.firstName + " " + booking.client.lastName}</div>
                                                <div className="text-xs text-slate-500">{booking.contactPhone}</div>
                                            </td>
                                            <td className="px-4 py-4 border-r-2 border-slate-300">
                                                <div className="text-sm text-slate-900 font-medium">{booking.provider.firstName + " " + booking.provider.lastName}({booking.serviceName})</div>
                                                <div className="text-xs text-slate-500">{booking.provider.phone}</div>
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
                                                    <button 
                                                        onClick={() => handleDownloadPDF(booking)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                        <DownloadIcon size={20} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPagesFiltered > 1 && (
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
                                {Array.from({ length: totalPagesFiltered }, (_, i) => i + 1).map(i => (
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
                                onClick={() => setCurrentPage(prev => Math.min(totalPagesFiltered, prev + 1))}
                                disabled={currentPage === totalPagesFiltered}
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
                                    {/* <p className="text-sm font-medium text-slate-900">{selectedBooking.bookingNumber}</p> */}
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
