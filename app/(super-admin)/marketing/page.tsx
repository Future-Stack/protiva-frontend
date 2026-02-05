"use client";

import { useState } from "react";
import { Search, Plus, Trash2, Edit2, X, Image as ImageIcon, UploadCloud, CalendarRange, Calendar, ExternalLink, EyeIcon, EyeOffIcon } from "lucide-react";
import DeleteModal from "@/components/DeleteModal";

interface Banner {
    id: number;
    title: string;
    description: string;
    image: string;
    link: string;
    status: "Active" | "Inactive";
    startDate: string;
    endDate: string;
}

const BANNERS: Banner[] = [
    {
        id: 1,
        title: "Winter Handyman Special",
        description: "Get 20% off on all home repair services this winter. Book now!",
        image: "https://picsum.photos/seed/winter/300/150",
        link: "/offers/winter-special",
        status: "Active",
        startDate: "2025-01-01",
        endDate: "2025-02-28"
    },
    {
        id: 2,
        title: "Weekend Cleaning Bundle",
        description: "Full house cleaning package starting at just $99. Limited time offer.",
        image: "https://picsum.photos/seed/cleaning/300/150",
        link: "/services/cleaning-bundle",
        status: "Active",
        startDate: "2025-01-15",
        endDate: "2025-01-30"
    },
];

const StatsCard = ({ title, value, subtext }: any) => (
    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex-1">
        <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
        <p className="text-sm text-slate-500 mt-7">{title}</p>
        {subtext && <p className="text-xs text-slate-400 mt-2">{subtext}</p>}
    </div>
);

export default function MarketingManagementPage() {
    const [banners, setBanners] = useState<Banner[]>(BANNERS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [bannerToDelete, setBannerToDelete] = useState<number | null>(null);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        image: "",
        link: "",
        startDate: "",
        endDate: ""
    });

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, image: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveBanner = () => {
        if (!formData.title || !formData.description || !formData.image) {
            alert("Please fill in all required fields");
            return;
        }

        if (editingBanner) {
            setBanners(banners.map(b => b.id === editingBanner.id ? {
                ...b,
                ...formData,
                id: b.id, // Preserve ID
                status: b.status // Preserve status unless we add a field for it
            } : b));
        } else {
            const newBanner: Banner = {
                id: Math.max(...banners.map(b => b.id), 0) + 1,
                ...formData,
                status: "Active"
            };
            setBanners([...banners, newBanner]);
        }
        setIsModalOpen(false);
    };

    const handleOpenModal = (banner?: Banner) => {
        if (banner) {
            setEditingBanner(banner);
            setFormData({
                title: banner.title,
                description: banner.description,
                image: banner.image,
                link: banner.link,
                startDate: banner.startDate,
                endDate: banner.endDate
            });
        } else {
            setEditingBanner(null);
            setFormData({
                title: "",
                description: "",
                image: "",
                link: "",
                startDate: "",
                endDate: ""
            });
        }
        setIsModalOpen(true);
    };

    const handleToggleStatus = (id: number) => {
        setBanners(banners.map(b =>
            b.id === id ? { ...b, status: b.status === "Active" ? "Inactive" : "Active" } : b
        ));
    };

    const handleDelete = (id: number) => {
        setBannerToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (bannerToDelete) {
            setBanners(banners.filter(b => b.id !== bannerToDelete));
            setBannerToDelete(null);
        }
        setIsDeleteModalOpen(false);
    };

    return (
        <div className="space-y-6 bg-white min-h-[calc(100vh-100px)] p-8 rounded-xl">
            <div className="flex flex-wrap items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Marketing Management</h2>
                    <p className="text-sm text-slate-500 mt-1">Manage promotional banners and marketing content for your mobile app</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 mt-4 md:mt-0 px-4 py-2.5 bg-[#6366F1] text-white rounded-lg text-sm font-medium hover:bg-[#6366F1]/90 transition-colors"
                >
                    <Plus size={18} />
                    Add New Banner
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatsCard title="Total Banners" value={banners.length} />
                <StatsCard title="Active Now" value={banners.filter(b => b.status === "Active").length} />
                <StatsCard title="Scheduled" value="0" />
                <StatsCard title="Inactive" value={banners.filter(b => b.status === "Inactive").length} />
            </div>

            {/* Banner List */}
            <div className="space-y-4">
                {banners.map((banner) => (
                    <div key={banner.id} className="flex flex-col md:flex-row gap-6 p-4 border border-slate-200 rounded-xl bg-white hover:border-slate-300 transition-colors">
                        <div className="w-full md:w-48 h-32 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0 relative group">
                            <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="text-white text-xs font-medium">View Image</span>
                            </div>
                        </div>
                        <div className="flex-1 space-y-2">
                            <div className="">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-semibold text-slate-900">{banner.title}</h3>
                                        <span className={`px-2 py-0.5 text-xs font-normal rounded-lg ${banner.status === "Active" ? "bg-[#00C950] text-white" : "bg-slate-100 text-slate-600"
                                            }`}>
                                            {banner.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">{banner.description}</p>
                                </div>

                            </div>
                            <div className="pt-2">
                                <div className="flex flex-wrap gap-2 md:gap-6">
                                    <div className="flex items-center gap-2">
                                        <div>

                                            <Calendar size={16} className="text-slate-500" />
                                        </div>
                                        <p className="text-xs text-slate-400 font-medium pt-0.5">1/15/2026 - 2/15/2026</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <ExternalLink size={16} className="text-slate-500" />
                                        <p className="text-sm text-[#6366F1] truncate">{banner.link}</p>

                                    </div>

                                </div>
                            </div>
                            <div className="flex items-center gap-2 mt-4">
                                <button
                                    onClick={() => handleToggleStatus(banner.id)}
                                    className={`flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors border border-[#0000001A] text-[#0A0A0A] hover:bg-slate-100`}
                                >
                                    {banner.status === "Active" ? (
                                        <>
                                            <EyeOffIcon size={16} />
                                            Deactivate
                                        </>
                                    ) : (
                                        <>
                                            <EyeIcon size={16} />
                                            Activate
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={() => handleOpenModal(banner)}
                                    className="px-3 py-1.5 flex items-center gap-1.5 text-[#0A0A0A] text-xs font-medium border border-[#0000001A] hover:text-[#6366F1] hover:bg-indigo-50 rounded-lg transition-colors"
                                >
                                    <Edit2 size={12} /> <span>Edit</span>
                                </button>
                                <button
                                    onClick={() => handleDelete(banner.id)}
                                    className="px-3 py-1.5 flex items-center gap-1.5 text-red-600 text-xs font-medium border border-[#0000001A] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 size={14} /> <span>Delete</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {banners.length === 0 && (
                    <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <ImageIcon className="text-slate-400" size={24} />
                        </div>
                        <h3 className="text-slate-900 font-medium">No banners found</h3>
                        <p className="text-slate-500 text-sm mt-1 mb-4">Create your first marketing banner to get started</p>
                        <button
                            onClick={() => handleOpenModal()}
                            className="px-4 py-2 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50"
                        >
                            Create Banner
                        </button>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl flex flex-col max-h-[85vh]">
                        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">{editingBanner ? "Edit Banner" : "Add New Banner"}</h3>
                                <p className="text-sm text-slate-500 mt-1">Manage promotional banners for your mobile app</p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="mt-1 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-8 overflow-y-auto custom-scrollbar space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700">Title *</label>
                                <input
                                    type="text"
                                    placeholder="Enter banner title"
                                    className="mt-1 w-full px-4 py-2.5 bg-[#F3F3F5] border border-[#00000000] text-slate-900 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#6366F1] transition-all"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700">Description *</label>
                                <textarea
                                    placeholder="Enter banner description"
                                    rows={3}
                                    className="mt-1 w-full px-4 py-2.5 bg-[#F3F3F5] border border-[#00000000] text-slate-900 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#6366F1] transition-all"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700 -mt-1">Image URL *</label>
                                <div className="flex gap-4">
                                    <input
                                        type="text"
                                        placeholder="https://example.com/image.jpg"
                                        className="mt-1 flex-1 px-4 py-2.5 bg-[#F3F3F5] border border-[#00000000] text-slate-900 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#6366F1] transition-all"
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        id="image-upload"
                                        onChange={handleImageUpload}
                                    />
                                    <label
                                        htmlFor="image-upload"
                                        className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg border border-slate-200 hover:bg-slate-200 transition-colors cursor-pointer flex items-center justify-center"
                                    >
                                        <UploadCloud size={20} />
                                    </label>
                                </div>
                                {formData.image && (
                                    <div className="mt-2 h-32 w-full rounded-lg overflow-hidden bg-[#F3F3F5] border border-[#00000000] text-slate-900">
                                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">Link *</label>
                                    <input
                                        type="text"
                                        placeholder="/offers/summer-sale"
                                        className="mt-1 w-full px-4 py-2.5 bg-[#F3F3F5] border border-[#00000000] text-slate-900 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#6366F1] transition-all"
                                        value={formData.link}
                                        onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-700">Start Date</label>
                                        <div className="relative">
                                            {!formData.startDate && (
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">
                                                    eg: 01/01/2023
                                                </span>
                                            )}

                                            <input
                                                type="date"
                                                className="mt-1 w-full px-4 py-2.5 text-black bg-[#F3F3F5] border border-transparent text-sm rounded-lg
      focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#6366F1]"
                                                value={formData.startDate}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, startDate: e.target.value })
                                                }
                                            />
                                        </div>

                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-700">End Date</label>
                                        <div className="relative">
                                            {!formData.endDate && (
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">
                                                    eg: 01/01/2023
                                                </span>
                                            )}

                                            <input
                                                type="date"
                                                className="mt-1 text-black w-full px-4 py-2.5 bg-[#F3F3F5] border border-transparent text-sm rounded-lg
      focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#6366F1]"
                                                value={formData.endDate}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, endDate: e.target.value })
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 flex items-center justify-end gap-3 border-t border-slate-100 mt-2">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveBanner}
                                    className="px-6 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/80 transition-colors shadow-sm shadow-blue-100">
                                    {editingBanner ? "Update Banner" : "Create Banner"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}


            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Banner"
                description="Are you sure you want to delete this marketing banner? This action cannot be undone."
            />
        </div >
    );
}
