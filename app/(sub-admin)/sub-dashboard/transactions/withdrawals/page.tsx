"use client";

import { useState } from "react";
import { Search, Clock, CheckCircle, CircleDollarSign, X, Eye, Clock4, Trash2, Download } from "lucide-react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import DeleteModal from "@/components/DeleteModal";

interface WithdrawalRequest {
    id: string;
    provider: {
        name: string;
        email: string;
        image: string;
        role: string;
        service: string;
        jobsCompleted: number;
    };
    amount: string;
    accountNumber: string;
    requestDate: string;
    status: "Pending" | "Approved" | "Rejected";
}

const REQUESTS: WithdrawalRequest[] = [
    {
        id: "1",
        provider: { name: "Mike Johnson", email: "mike.johnson@email.com", image: "https://picsum.photos/seed/mike/100/100", role: "Handyman", service: "Plumbing", jobsCompleted: 45 },
        amount: "৳500.00",
        accountNumber: "234******129",
        requestDate: "Jan 18, 2025 10:20 AM",
        status: "Pending"
    },
    {
        id: "2",
        provider: { name: "Sarah Wilson", email: "sarah.wilson@email.com", image: "https://picsum.photos/seed/sarah/100/100", role: "Cleaner", service: "Home Cleaning", jobsCompleted: 28 },
        amount: "৳2,500.00",
        accountNumber: "987******567",
        requestDate: "Jan 18, 2025 09:15 AM",
        status: "Pending"
    },
    {
        id: "3",
        provider: { name: "David Chen", email: "david.chen@email.com", image: "https://picsum.photos/seed/david/100/100", role: "Electrician", service: "Electrical Services", jobsCompleted: 12 },
        amount: "৳1,200.00",
        accountNumber: "456******778",
        requestDate: "Jan 17, 2025 04:30 PM",
        status: "Approved"
    },
    {
        id: "4",
        provider: { name: "Emily Brown", email: "emily.brown@email.com", image: "https://picsum.photos/seed/emily/100/100", role: "Painter", service: "House Painting", jobsCompleted: 8 },
        amount: "৳3,500.00",
        accountNumber: "789******234",
        requestDate: "Jan 16, 2025 02:45 PM",
        status: "Approved"
    },
    {
        id: "5",
        provider: { name: "James Wilson", email: "james.wilson@email.com", image: "https://picsum.photos/seed/james/100/100", role: "Carpenter", service: "Furniture Repair", jobsCompleted: 33 },
        amount: "৳800.00",
        accountNumber: "321******456",
        requestDate: "Jan 16, 2025 11:00 AM",
        status: "Rejected"
    },
];

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
    const [requests, setRequests] = useState<WithdrawalRequest[]>(REQUESTS);
    const [selectedRequest, setSelectedRequest] = useState<WithdrawalRequest | null>(null);
    const [filter, setFilter] = useState("All");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [requestToDelete, setRequestToDelete] = useState<string | null>(null);

    const filteredRequests = requests.filter(r => {
        const matchesFilter = filter === "All" || r.status === filter;
        // Search logic can be improved if needed, but the UI has a search input that doesn't seem connected to state yet?
        // Ah, looking at the code, there IS a search input but no state connected to it in the original `view_file`?
        // Let's check line 145 in original. It has no value/onChange.
        return matchesFilter;
    });

    // We need search state
    const [searchQuery, setSearchQuery] = useState("");
    const searchFilteredRequests = filteredRequests.filter(r =>
        r.provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.accountNumber.includes(searchQuery)
    );

    const handleStatusChange = (id: string, newStatus: "Approved" | "Rejected") => {
        setRequests(requests.map(r => r.id === id ? { ...r, status: newStatus } : r));
        if (selectedRequest && selectedRequest.id === id) {
            setSelectedRequest({ ...selectedRequest, status: newStatus });
        }
    };

    const handleDeleteClick = (id: string) => {
        setRequestToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (requestToDelete) {
            setRequests(requests.filter(r => r.id !== requestToDelete));
            setRequestToDelete(null);
        }
        setIsDeleteModalOpen(false);
    };

    const handleDownload = () => {
        const headers = ["Provider", "Email", "Amount", "Account Number", "Date", "Status"];
        const csvContent = [
            headers.join(","),
            ...searchFilteredRequests.map(r => [
                r.provider.name,
                r.provider.email,
                `"${r.amount}"`, // Quote amount to handle currency symbols/commas
                `"${r.accountNumber}"`,
                `"${r.requestDate}"`,
                r.status
            ].join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "withdrawal_requests.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

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
                    value="2"
                    subtext="Pending Requests"
                    icon={Clock}
                    colorClass="text-amber-500"
                    bgClass="bg-amber-100"
                />
                <StatsCard
                    title="Approved Today"
                    value="2"
                    subtext="Approved Today"
                    icon={CheckCircle}
                    colorClass="text-green-500"
                    bgClass="bg-green-100"
                />
                <StatsCard
                    title="Total Pending Amount"
                    value="৳3,350"
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
                                onClick={() => setFilter(tab)}
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
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-sm text-black bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto mt-8 rounded-lg border border-slate-200">
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
                    <tbody className="divide-y divide-slate-200 bg-white">
                        {searchFilteredRequests.map((request) => (
                            <tr key={request.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={request.provider.image}
                                            alt={request.provider.name}
                                            className="w-10 h-10 rounded-full object-cover bg-slate-100"
                                        />
                                        <div>
                                            <div className="text-sm font-medium text-slate-900">{request.provider.name}</div>
                                            <div className="text-xs text-slate-500">{request.provider.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-base font-semibold text-slate-900">{request.amount}</td>
                                <td className="px-6 py-4 text-sm text-slate-500 font-mono">{request.accountNumber}</td>
                                <td className="px-6 py-4 text-sm text-slate-500">{request.requestDate}</td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${request.status === "Pending" ? "bg-amber-100 text-amber-700" :
                                        request.status === "Approved" ? "bg-green-100 text-green-700" :
                                            "bg-red-100 text-red-700"
                                        }`}>
                                        {request.status === "Pending" && <Clock size={14} />}
                                        {request.status === "Approved" && <CheckCircle size={14} />}
                                        {request.status === "Rejected" && <IoIosCloseCircleOutline size={16} />}
                                        {request.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-center gap-2">
                                        {request.status === "Pending" ? (
                                            <>
                                                <button
                                                    onClick={() => setSelectedRequest(request)}
                                                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleStatusChange(request.id, "Approved")}
                                                    className="px-3 py-1.5 bg-[#16A34A] text-white text-xs font-medium rounded hover:bg-green-700 transition-colors">
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleStatusChange(request.id, "Rejected")}
                                                    className="px-3 py-1.5 bg-[#DC2626] text-white text-xs font-medium rounded hover:bg-red-700 transition-colors">
                                                    Reject
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => setSelectedRequest(request)}
                                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                            >
                                                <Eye size={18} />
                                            </button>
                                        )}
                                       
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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
                                    <img
                                        src={selectedRequest.provider.image}
                                        alt={selectedRequest.provider.name}
                                        className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
                                    />
                                    <div>
                                        <div className="text-base font-bold text-[#0F172A]">{selectedRequest.provider.name}</div>
                                        <div className="text-sm text-[#64748B]">{selectedRequest.provider.email}</div>
                                        <div className="flex items-center gap-3 mt-1 text-sm text-[#64748B]">
                                            <div className="flex flex-col">
                                                <span>Total Earnings</span>
                                                <span className="text-base font-semibold text-[#0F172A]">{selectedRequest.amount}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span>Completed Jobs</span>
                                                <span className="text-base font-semibold text-[#0F172A]">{selectedRequest.provider.jobsCompleted}</span>
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
                                    <span className="text-lg font-bold text-slate-900">{selectedRequest.amount}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-600">Account Number</span>
                                    <span className="text-sm font-mono text-slate-900">{selectedRequest.accountNumber}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-600">Request Date</span>
                                    <span className="text-sm text-slate-900">{selectedRequest.requestDate}</span>
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                                    <span className="text-sm text-slate-600">Status</span>
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${selectedRequest.status === "Pending" ? "bg-amber-100 text-amber-700" :
                                        selectedRequest.status === "Approved" ? "bg-green-100 text-green-700" :
                                            "bg-red-100 text-red-700"
                                        }`}>
                                        {selectedRequest.status === "Pending" && <Clock size={14} />}
                                        {selectedRequest.status === "Approved" && <CheckCircle size={14} />}
                                        {selectedRequest.status === "Rejected" && <IoIosCloseCircleOutline size={16} />}
                                        {selectedRequest.status}
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            {selectedRequest.status === "Pending" && (
                                <div className="flex gap-3 pt-2">
                                    <button
                                        onClick={() => handleStatusChange(selectedRequest.id, "Approved")}
                                        className="flex-1 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors">
                                        Approve Request
                                    </button>
                                    <button
                                        onClick={() => handleStatusChange(selectedRequest.id, "Rejected")}
                                        className="flex-1 py-2.5 bg-white border border-red-200 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors">
                                        Reject Request
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {/* Delete Modal */}
            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Withdrawal Request"
                description="Are you sure you want to delete this withdrawal request? This action cannot be undone."
            />
        </div>
    );
}
