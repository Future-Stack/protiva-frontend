"use client";

import { useState } from "react";
import {
    Search,
    Download,
    Filter,
    Trash2,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import DeleteModal from "@/components/DeleteModal";

const PROVIDERS = [
    { id: "01", name: "Handyman service", rating: "★", phone: "+65954425", email: "polo@gmail.com", bookings: 10, available: true, status: "Basic" },
    { id: "02", name: "Handyman service", rating: "★", phone: "+65954425", email: "polo@gmail.com", bookings: 10, available: false, status: "Unlimited" },
    { id: "03", name: "Handyman service", rating: "★", phone: "+65954425", email: "polo@gmail.com", bookings: 10, available: false, status: "Basic" },
    { id: "04", name: "Handyman service", rating: "★", phone: "+65954425", email: "polo@gmail.com", bookings: 10, available: false, status: "Basic" },
    { id: "05", name: "Handyman service", rating: "★", phone: "+65954425", email: "polo@gmail.com", bookings: 10, available: false, status: "Basic" },
    { id: "06", name: "Handyman service", rating: "★", phone: "+65954425", email: "polo@gmail.com", bookings: 10, available: false, status: "Basic" },
    { id: "07", name: "Handyman service", rating: "★", phone: "+65954425", email: "polo@gmail.com", bookings: 10, available: false, status: "Basic" },
    { id: "08", name: "Handyman service", rating: "★", phone: "+65954425", email: "polo@gmail.com", bookings: 10, available: false, status: "Basic" },
    { id: "09", name: "Handyman service", rating: "★", phone: "+65954425", email: "polo@gmail.com", bookings: 10, available: false, status: "Basic" },
    { id: "10", name: "Handyman service", rating: "★", phone: "+65954425", email: "polo@gmail.com", bookings: 10, available: false, status: "Basic" },
];

export default function ProviderListPage() {
    const [providers, setProviders] = useState(PROVIDERS);
    const [searchQuery, setSearchQuery] = useState("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);

    const filteredProviders = providers.filter(provider =>
        provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.phone.includes(searchQuery)
    );

    const toggleAvailability = (id: string) => {
        setProviders(providers.map(p =>
            p.id === id ? { ...p, available: !p.available } : p
        ));
    };

    const toggleStatus = (id: string) => {
        setProviders(providers.map(p =>
            p.id === id ? { ...p, status: p.status === "Basic" ? "Unlimited" : "Basic" } : p
        ));
    };

    const handleDelete = (id: string) => {
        setItemToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (itemToDelete) {
            setProviders(providers.filter(p => p.id !== itemToDelete));
            setItemToDelete(null);
        }
        setIsDeleteModalOpen(false);
    };

    const handleDownload = () => {
        const headers = ["ID", "Name", "Email", "Phone", "Bookings", "Status", "Available"];
        const csvContent = [
            headers.join(","),
            ...filteredProviders.map(p => [
                p.id,
                `"${p.name}"`,
                p.email,
                `"${p.phone}"`,
                p.bookings,
                p.status,
                p.available ? "Yes" : "No"
            ].join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "providers_list.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };



    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Provider list</h2>
                <p className="text-sm text-slate-500 mt-2">View and manage all registered providers</p>
            </div>

            {/* Main Card */}
            <div className="bg-white border border-slate-300 px-[26px] py-[34px] rounded-lg">
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
                <div className="overflow-x-auto">
                    <table className="w-full text-left border">
                        <thead>
                            <tr className="bg-blue-50 border-r border-b border-slate-300">
                                <th className="px-4 py-3 text-base font-semibold text-slate-600 capitalize border-r-2 border-slate-300 ">SL</th>
                                <th className="px-4 py-3 text-base font-semibold text-slate-600 capitalize border-r-2 border-slate-300">Provider</th>
                                <th className="px-4 py-3 text-base font-semibold text-slate-600 capitalize border-r-2 border-slate-300">Contact information</th>
                                <th className="px-4 py-3 text-base font-semibold text-slate-600 capitalize border-r-2 border-slate-300 text-center">Total Bookings served</th>
                                <th className="px-4 py-3 text-base font-semibold text-slate-600 capitalize border-r-2 border-slate-300 text-center">Service Availability</th>
                                <th className="px-4 py-3 text-base font-semibold text-slate-600 capitalize border-r-2 border-slate-300 text-center">Status</th>
                                <th className="px-4 py-3 text-base font-semibold text-slate-600 capitalize text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-300">
                            {filteredProviders.map((provider) => (
                                <tr key={provider.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-4 py-4 text-sm text-slate-600 border-r-2 border-slate-300 ">{provider.id}</td>
                                    <td className="px-4 py-4 border-r-2 border-slate-300">
                                        <div className="flex items-center gap-3">
                                            <div>
                                                <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                                                    <img src={`https://picsum.photos/seed/${provider.id}/100/100`} alt="" className="w-full h-full object-cover" />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-[#0F172A]">{provider.name}</div>
                                                <div className="text-xs text-[#FF8113]">{provider.rating} <span className="text-[#475569]">4.8</span></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 border-r-2 border-slate-300">
                                        <div className="text-base text-[#2C2C2C]">{provider.phone}</div>
                                        <div className="text-sm text-[#2C2C2C]">{provider.email}</div>
                                    </td>
                                    <td className="px-4 py-4 text-base text-[#2C2C2C] border-r-2 border-slate-300 text-center">{provider.bookings}</td>
                                    <td className="px-4 py-4 border-r-2 border-slate-300 text-center">
                                        <button
                                            onClick={() => toggleAvailability(provider.id)}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${provider.available ? 'bg-[#000000]' : 'bg-slate-500'
                                                }`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${provider.available ? 'translate-x-6' : 'translate-x-1'
                                                    }`}
                                            />
                                        </button>
                                    </td>
                                    <td className="px-4 py-4 border-r-2 border-slate-300 text-center">
                                        <button
                                            onClick={() => toggleStatus(provider.id)}
                                            className={`inline-block px-3 py-1 rounded-md text-base font-medium hover:bg-slate-100 transition-colors ${provider.status === 'Unlimited'
                                                ? ' text-blue-700'
                                                : ' text-slate-700'
                                                }`}>
                                            {provider.status}
                                        </button>
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <button
                                            onClick={() => handleDelete(provider.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="py-6 border-t border-slate-200 flex items-center justify-end gap-4">
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

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Provider"
                description="Are you sure you want to delete this provider? This action cannot be undone."
            />
        </div>
    );
}
