"use client";

import { useState } from "react";
import { Search, Download, Trash2, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import DeleteModal from "@/components/DeleteModal";

const USERS = [
    { id: "01", name: "Emir Ansal", phone: "+65824125", email: "polo@gmail.com", bookings: 10, status: "Pending" },
    { id: "02", name: "Emir Ansal", phone: "+65824125", email: "polo@gmail.com", bookings: 10, status: "Cancelled" },
    { id: "03", name: "Emir Ansal", phone: "+65824125", email: "polo@gmail.com", bookings: 10, status: "Rejected" },
    { id: "04", name: "Emir Ansal", phone: "+65824125", email: "polo@gmail.com", bookings: 10, status: "Accepted" },
    { id: "05", name: "Emir Ansal", phone: "+65824125", email: "polo@gmail.com", bookings: 10, status: "In-progress" },
    { id: "06", name: "Emir Ansal", phone: "+65824125", email: "polo@gmail.com", bookings: 10, status: "In-progress" },
    { id: "07", name: "Emir Ansal", phone: "+65824125", email: "polo@gmail.com", bookings: 10, status: "In-progress" },
    { id: "08", name: "Emir Ansal", phone: "+65824125", email: "polo@gmail.com", bookings: 10, status: "In-progress" },
    { id: "09", name: "Emir Ansal", phone: "+65824125", email: "polo@gmail.com", bookings: 10, status: "In-progress" },
    { id: "10", name: "Emir Ansal", phone: "+65824125", email: "polo@gmail.com", bookings: 10, status: "In-progress" },
];

const getStatusColor = (status: string) => {
    switch (status) {
        case "Pending": return "text-[#FFBB38]";
        case "Cancelled": return "text-[#DC2626]";
        case "Rejected": return "text-[#DC2626]";
        case "Accepted": return "text-[#22C55E]";
        case "In-progress": return "text-[#7E22CE]";
        default: return "text-slate-600";
    }
};

export default function UsersPage() {
    const [users, setUsers] = useState(USERS);
    const [searchQuery, setSearchQuery] = useState("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone.includes(searchQuery)
    );

    const handleDelete = (id: string) => {
        setItemToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (itemToDelete) {
            setUsers(users.filter(u => u.id !== itemToDelete));
            setItemToDelete(null);
        }
        setIsDeleteModalOpen(false);
    };

    const handleDownload = () => {
        const headers = ["ID", "Name", "Email", "Phone", "Bookings", "Status"];
        const csvContent = [
            headers.join(","),
            ...filteredUsers.map(u => [
                u.id,
                `"${u.name}"`,
                u.email,
                `"${u.phone}"`,
                u.bookings,
                u.status
            ].join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "users_list.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    return (
        <div className="space-y-6 bg-white overflow-hidden px-[28px] py-[34px] rounded-lg">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-black">User List</h2>
                <p className="text-sm text-slate-700 mt-2">Monitor user activity and account status</p>
            </div>

            {/* Main Card */}
            <div className="mt-12">
                {/* Search and Filter Bar */}
                {/* Actions Bar */}
                <div className="pb-6 flex flex-wrap items-center justify-between gap-4">
                    {/* Search Bar */}
                    <div className="hidden sm:flex items-center flex-1 max-w-md relative group">
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
                <div className="border border-slate-300 overflow-x-auto">
                    <table className="w-full text-left ">
                        <thead>
                            <tr className="bg-[#EFF6FF]">
                                <th className="px-4 py-3.5 text-sm font-semibold text-[#475569] border-r border-slate-300">SL</th>
                                <th className="px-4 py-3.5 text-sm font-semibold text-[#475569] border-r border-slate-300">User name</th>
                                <th className="px-4 py-3.5 text-sm font-semibold text-[#475569] border-r border-slate-300">Contact information</th>
                                <th className="px-4 py-3.5 text-sm font-semibold text-[#475569] border-r border-slate-300 text-center">Total Bookings</th>
                                <th className="px-4 py-3.5 text-sm font-semibold text-[#475569] border-r border-slate-300 text-center">Status</th>
                                <th className="px-4 py-3.5 text-sm font-semibold text-[#475569] text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="border-t border-slate-300 hover:bg-slate-50/50 transition-colors">
                                    <td className="px-4 py-4 text-sm text-[#2C2C2C] border-r border-slate-300">{user.id}</td>
                                    <td className="px-4 py-4 border-r border-slate-300">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
                                                <img src={`https://picsum.photos/seed/${user.id}/100/100`} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div className="text-sm font-medium text-[#0F172A]">{user.name}</div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 border-r border-slate-300">
                                        <div className="text-sm text-[#0F172A]">{user.phone}</div>
                                        <div className="text-sm text-[#0F172A]">{user.email}</div>
                                    </td>
                                    <td className="px-4 py-4 text-sm text-[#2C2C2C] border-r border-slate-300 text-center">{user.bookings}</td>
                                    <td className="px-4 py-4 border-r border-slate-300 text-center">
                                        <span className={`text-sm font-medium ${getStatusColor(user.status)}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center justify-center">
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="p-2 text-red-800 hover:bg-red-50 rounded-lg transition-colors">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="py-4 border-t border-slate-300 flex items-center md:justify-end gap-1 md:gap-3">
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
            </div>

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete User"
                description="Are you sure you want to delete this user? This action cannot be undone."
            />
        </div>
    );
}
