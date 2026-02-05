"use client";

import { useState } from "react";
import {
    Eye,
    X,
    ChevronLeft,
    ChevronRight,
    Check,
    Trash2,
    Search
} from "lucide-react";
import DeleteModal from "@/components/DeleteModal";
import { ImgIcon, PdfIcon } from "@/app/assets/DocumentsIcon";

const BACKGROUND_CHECKS = [
    { id: "01", name: "Handyman service", rating: "★", phone: "+65954425", email: "polo@gmail.com", nid: "1202445221", documents: { pdf: true, image: true }, professionalDocs: { pdf: true, image: true } },
    { id: "02", name: "Handyman service", rating: "★", phone: "+65954425", email: "polo@gmail.com", nid: "1202445221", documents: { pdf: true, image: true }, professionalDocs: { pdf: true, image: true } },
    { id: "03", name: "Handyman service", rating: "★", phone: "+65954425", email: "polo@gmail.com", nid: "1202445221", documents: { pdf: true, image: true }, professionalDocs: { pdf: true, image: true } },
    { id: "04", name: "Handyman service", rating: "★", phone: "+65954425", email: "polo@gmail.com", nid: "1202445221", documents: { pdf: true, image: true }, professionalDocs: { pdf: true, image: true } },
    { id: "05", name: "Handyman service", rating: "★", phone: "+65954425", email: "polo@gmail.com", nid: "1202445221", documents: { pdf: true, image: true }, professionalDocs: { pdf: true, image: true } },
    { id: "06", name: "Handyman service", rating: "★", phone: "+65954425", email: "polo@gmail.com", nid: "1202445221", documents: { pdf: true, image: true }, professionalDocs: { pdf: true, image: true } },
    { id: "07", name: "Handyman service", rating: "★", phone: "+65954425", email: "polo@gmail.com", nid: "1202445221", documents: { pdf: true, image: true }, professionalDocs: { pdf: true, image: true } },
    { id: "08", name: "Handyman service", rating: "★", phone: "+65954425", email: "polo@gmail.com", nid: "1202445221", documents: { pdf: true, image: true }, professionalDocs: { pdf: true, image: true } },
    { id: "09", name: "Handyman service", rating: "★", phone: "+65954425", email: "polo@gmail.com", nid: "1202445221", documents: { pdf: true, image: true }, professionalDocs: { pdf: true, image: true } },
    { id: "10", name: "Handyman service", rating: "★", phone: "+65954425", email: "polo@gmail.com", nid: "1202445221", documents: { pdf: true, image: true }, professionalDocs: { pdf: true, image: true } },
];

export default function BackgroundCheckPage() {
    const [checks, setChecks] = useState(BACKGROUND_CHECKS);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCheck, setSelectedCheck] = useState<typeof BACKGROUND_CHECKS[0] | null>(null);

    const filteredChecks = checks.filter(check =>
        check.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        check.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        check.phone.includes(searchQuery) ||
        check.nid.includes(searchQuery)
    );

    const handleAction = (id: string, action: 'approve' | 'reject') => {
        if (confirm(`Are you sure you want to ${action} this provider?`)) {
            setChecks(checks.filter(c => c.id !== id));
        }
    };

    const handleDelete = (id: string) => {
        setItemToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (itemToDelete) {
            setChecks(checks.filter(c => c.id !== itemToDelete));
            setItemToDelete(null);
        }
        setIsDeleteModalOpen(false);
    };
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Background check</h2>
                <p className="text-sm text-slate-500 mt-1">Check the identification for authentic providers</p>
            </div>

            {/* Main Card */}
            <div className="bg-white  px-[26px] py-[34px] rounded-lg">

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border border-slate-300">
                        <thead>
                            <tr className="bg-[#EFF6FF]">
                                <th className="px-4 py-3.5 text-sm font-semibold text-[#475569] border-r border-slate-300">SL</th>
                                <th className="px-4 py-3.5 text-sm font-semibold text-[#475569] border-r border-slate-300">Provider Information</th>
                                <th className="px-4 py-3.5 text-sm font-semibold text-[#475569] border-r border-slate-300">Contact information</th>
                                <th className="px-4 py-3.5 text-sm font-semibold text-[#475569] border-r border-slate-300 text-center">NID number</th>
                                <th className="px-4 py-3.5 text-sm font-semibold text-[#475569] border-r border-slate-300 text-center">Documents</th>
                                <th className="px-4 py-3.5 text-sm font-semibold text-[#475569] text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredChecks.map((check) => (
                                <tr key={check.id} className="border-t border-slate-300 hover:bg-slate-50/50 transition-colors">
                                    <td className="px-4 py-4 text-sm text-[#64748B] border-r border-slate-300">{check.id}</td>
                                    <td className="px-4 py-4 border-r border-slate-300">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
                                                <img src={`https://picsum.photos/seed/${check.id}/100/100`} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-[#0F172A]">{check.name}</div>
                                                <div className="text-xs text-[#FF8113]">{check.rating} <span className="text-[#475569]">4.8</span></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 border-r border-slate-300">
                                        <div className="text-sm text-[#0F172A]">{check.phone}</div>
                                        <div className="text-sm text-[#0F172A]">{check.email}</div>
                                    </td>
                                    <td className="px-4 py-4 text-sm text-[#64748B] border-r border-slate-300 text-center">{check.nid}</td>
                                    <td className="px-4 py-4 border-r border-slate-300">
                                        <div className="flex items-center gap-2 justify-center">
                                            {check.documents.image && (
                                                <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                                                    <ImgIcon />
                                                </div>
                                            )}
                                            {check.documents.pdf && (
                                                <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                                                    <PdfIcon />
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-2 justify-center">

                                            <button
                                                onClick={() => setSelectedCheck(check)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleAction(check.id, 'approve')}
                                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                                                <Check size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleAction(check.id, 'reject')}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                <X size={18} />
                                            </button>
                                            
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="pt-4 flex items-center justify-center md:justify-end gap-1 md:gap-3">
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
            {/* Details Modal */}
            {selectedCheck && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedCheck(null)}></div>
                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                            <h3 className="text-lg font-bold text-slate-900">Background Check Details</h3>
                            <button
                                onClick={() => setSelectedCheck(null)}
                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-slate-200 overflow-hidden">
                                        <img src={`https://picsum.photos/seed/${selectedCheck.id}/100/100`} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-slate-900">{selectedCheck.name}</h4>
                                        <p className="text-sm text-slate-500">Rating: {selectedCheck.rating}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-slate-500 font-medium uppercase">Phone</label>
                                        <p className="text-sm font-medium text-slate-900">{selectedCheck.phone}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-slate-500 font-medium uppercase">Email</label>
                                        <p className="text-sm font-medium text-slate-900">{selectedCheck.email}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-xs text-slate-500 font-medium uppercase">NID Number</label>
                                        <p className="text-sm font-medium text-slate-900">{selectedCheck.nid}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-xs text-slate-500 font-medium uppercase">Documents</label>
                                        <div className="flex gap-2 mt-1">
                                            {selectedCheck.documents.image && <div className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded border border-green-200">Image Available</div>}
                                            {selectedCheck.documents.pdf && <div className="px-2 py-1 bg-red-50 text-red-700 text-xs rounded border border-red-200">PDF Available</div>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                            <button
                                onClick={() => setSelectedCheck(null)}
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
