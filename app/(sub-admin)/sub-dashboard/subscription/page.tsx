"use client";

import { useRef, useState } from "react";
import { Trash2, ChevronLeft, ChevronRight, PencilLine, X, Camera } from "lucide-react";
import DeleteModal from "@/components/DeleteModal";

const SUBSCRIPTIONS = [
    { id: "01", provider: "Handyman service", rating: "★ 4.8", phone: "+65854425", email: "polo@gmail.com", plan: "10", activeStatus: "Basic", verificationPlan: "Complete", image: "https://picsum.photos/seed/01/100/100" },
    { id: "02", provider: "Handyman service", rating: "★ 4.8", phone: "+65854425", email: "polo@gmail.com", plan: "10", activeStatus: "Unlimited", verificationPlan: "Not Yet", image: "https://picsum.photos/seed/02/100/100" },
    { id: "03", provider: "Handyman service", rating: "★ 4.8", phone: "+65854425", email: "polo@gmail.com", plan: "10", activeStatus: "Basic", verificationPlan: "Complete", image: "https://picsum.photos/seed/03/100/100" },
    { id: "04", provider: "Handyman service", rating: "★ 4.8", phone: "+65854425", email: "polo@gmail.com", plan: "10", activeStatus: "Basic", verificationPlan: "Complete", image: "https://picsum.photos/seed/04/100/100" },
    { id: "05", provider: "Handyman service", rating: "★ 4.8", phone: "+65854425", email: "polo@gmail.com", plan: "10", activeStatus: "Basic", verificationPlan: "Complete", image: "https://picsum.photos/seed/05/100/100" },
    { id: "06", provider: "Handyman service", rating: "★ 4.8", phone: "+65854425", email: "polo@gmail.com", plan: "10", activeStatus: "Basic", verificationPlan: "Complete", image: "https://picsum.photos/seed/06/100/100" },
    { id: "07", provider: "Handyman service", rating: "★ 4.8", phone: "+65854425", email: "polo@gmail.com", plan: "10", activeStatus: "Basic", verificationPlan: "Complete", image: "https://picsum.photos/seed/07/100/100" },
    { id: "08", provider: "Handyman service", rating: "★ 4.8", phone: "+65854425", email: "polo@gmail.com", plan: "10", activeStatus: "Basic", verificationPlan: "Complete", image: "https://picsum.photos/seed/08/100/100" },
    { id: "09", provider: "Handyman service", rating: "★ 4.8", phone: "+65854425", email: "polo@gmail.com", plan: "10", activeStatus: "Basic", verificationPlan: "Complete", image: "https://picsum.photos/seed/09/100/100" },
    { id: "10", provider: "Handyman service", rating: "★ 4.8", phone: "+65854425", email: "polo@gmail.com", plan: "10", activeStatus: "Basic", verificationPlan: "Complete", image: "https://picsum.photos/seed/10/100/100" },
];

export default function SubscriptionPage() {
    const [subscriptions, setSubscriptions] = useState(SUBSCRIPTIONS);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredSubscriptions = subscriptions.filter(sub =>
        sub.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.phone.includes(searchQuery)
    );
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingSubscription, setEditingSubscription] = useState<typeof SUBSCRIPTIONS[0] | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDelete = (id: string) => {
        setItemToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (itemToDelete) {
            setSubscriptions(subscriptions.filter(s => s.id !== itemToDelete));
            setItemToDelete(null);
        }
        setIsDeleteModalOpen(false);
    };

    const handleEdit = (sub: typeof SUBSCRIPTIONS[0]) => {
        setEditingSubscription({ ...sub });
        setIsEditModalOpen(true);
    };

    const handleSaveEdit = () => {
        if (editingSubscription) {
            setSubscriptions(subscriptions.map(s =>
                s.id === editingSubscription.id ? editingSubscription : s
            ));
            setIsEditModalOpen(false);
            setEditingSubscription(null);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && editingSubscription) {
            const imageUrl = URL.createObjectURL(file);
            setEditingSubscription({ ...editingSubscription, image: imageUrl });
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };
    return (
        <div className="space-y-6 bg-white rounded-lg overflow-hidden px-[26px] py-[34px]">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Subscription Management</h2>
                <p className="text-sm text-slate-500 mt-1">Manage the current plan and track usage.</p>
            </div>

            {/* Main Card */}
            <div className="mt-5">

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border border-slate-300">
                        <thead>
                            <tr className="bg-[#EFF6FF]">
                                <th className="px-4 py-3.5 text-sm font-semibold text-[#475569] border-r border-slate-300">SL</th>
                                <th className="px-4 py-3.5 text-sm font-semibold text-[#475569] border-r border-slate-300">Provider</th>
                                <th className="px-4 py-3.5 text-sm font-semibold text-[#475569] border-r border-slate-300">Contact information</th>
                                <th className="px-4 py-3.5 text-sm font-semibold text-[#475569] border-r border-slate-300 text-center">Subscription Plan</th>
                                <th className="px-4 py-3.5 text-sm font-semibold text-[#475569] border-r border-slate-300 text-center">Active plan</th>
                                <th className="px-4 py-3.5 text-sm font-semibold text-[#475569] border-r border-slate-300 text-center">Verification Plan</th>
                                <th className="px-4 py-3.5 text-sm font-semibold text-[#475569] text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSubscriptions.map((sub) => (
                                <tr key={sub.id} className="border-t border-slate-300 hover:bg-slate-50/50 transition-colors">
                                    <td className="px-4 py-4 text-sm text-[#64748B] border-r border-slate-300">{sub.id}</td>
                                    <td className="px-4 py-4 border-r border-slate-300">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
                                                <img src={sub.image} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-[#0F172A]">{sub.provider}</div>
                                                <div className="text-xs text-[#FF8113]">{sub.rating.split(' ')[0]} <span className="text-[#475569]">{sub.rating.split(' ')[1]}</span></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 border-r border-slate-300">
                                        <div className="text-sm text-[#0F172A]">{sub.phone}</div>
                                        <div className="text-sm text-[#0F172A]">{sub.email}</div>
                                    </td>
                                    <td className="px-4 py-4 text-sm text-[#64748B] border-r border-slate-300 text-center">{sub.plan}</td>
                                    <td className="px-4 py-4 border-r border-slate-300 text-center">
                                        <span className={`text-sm font-medium ${sub.activeStatus === "Unlimited" ? "text-blue-700" : "text-slate-700"}`}>
                                            {sub.activeStatus}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 border-r border-slate-300 text-center">
                                        <span className={`text-sm font-medium ${sub.verificationPlan === "Not Yet" ? "text-red-700" : "text-slate-700"}`}>
                                            {sub.verificationPlan}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-2 justify-center">
                                            <button
                                                onClick={() => handleEdit(sub)}
                                                className="p-2 text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
                                                <PencilLine size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(sub.id)}
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

                {/* Edit Modal */}
                {isEditModalOpen && editingSubscription && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)}></div>
                        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                                <h3 className="text-lg font-bold text-slate-900">Edit Subscription</h3>
                                <button
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="p-6 space-y-6">
                                {/* Image Upload */}
                                <div className="flex flex-col items-center">
                                    <div className="relative group cursor-pointer" onClick={triggerFileInput}>
                                        <div className="w-24 h-24 rounded-full bg-slate-100 overflow-hidden border-2 border-slate-200">
                                            <img src={editingSubscription.image} alt="Provider Logo" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Camera className="text-white" size={24} />
                                        </div>
                                        <button className="absolute bottom-0 right-0 p-1.5 bg-blue-600 text-white rounded-full border-2 border-white shadow-sm">
                                            <PencilLine size={14} />
                                        </button>
                                    </div>
                                    <p className="text-sm text-slate-500 mt-2">Click to upload company logo</p>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />
                                </div>

                                {/* Status Edit */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Active Plan Status</label>
                                    <select
                                        value={editingSubscription.activeStatus}
                                        onChange={(e) => setEditingSubscription({ ...editingSubscription, activeStatus: e.target.value as "Basic" | "Unlimited" })}
                                        className="w-full text-slate-900 px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    >
                                        <option value="Basic">Basic</option>
                                        <option value="Unlimited">Unlimited</option>
                                    </select>
                                </div>
                            </div>
                            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                                <button
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-4 py-2 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveEdit}
                                    className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
