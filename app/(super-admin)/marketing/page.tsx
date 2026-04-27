"use client";

import { Plus, Trash2, Edit2, X, Image as ImageIcon, UploadCloud, Calendar, ExternalLink, EyeIcon, EyeOffIcon, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useAppSelector } from "@/lib/hooks";
import { useEffect, useMemo, useState } from "react";
import DeleteModal from "@/components/DeleteModal";
import { 
    useGetMarketingBannersQuery, 
    useUpdateBannerStatusMutation, 
    useDeleteBannerMutation,
    useUpdateBannerMutation,
    useCreateBannerMutation
} from "@/lib/features/super-admin/marketing/marketingAPI";
import { Banner } from "@/lib/features/super-admin/marketing/marketing.type";
import Swal from "sweetalert2";

const StatsCard = ({ title, value, subtext, isLoading }: any) => (
    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex-1">
        {isLoading ? (
            <div className="h-9 w-16 bg-slate-100 animate-pulse rounded mb-7"></div>
        ) : (
            <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
        )}
        <p className="text-sm text-slate-500 mt-7">{title}</p>
        {subtext && <p className="text-xs text-slate-400 mt-2">{subtext}</p>}
    </div>
);

export default function MarketingManagementPage() {
    const globalSearch = useAppSelector((state) => state.search.query);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState(globalSearch || "");

    // Sync local search with global search
    useEffect(() => {
        setSearchQuery(globalSearch);
    }, [globalSearch]);

    // Reset pagination on search
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    // API Queries and Mutations
    const { data: response, isLoading: isFetching } = useGetMarketingBannersQuery({ 
        page: currentPage, 
        limit: 100 
    });
    const [updateStatus, { isLoading: isUpdating }] = useUpdateBannerStatusMutation();
    const [deleteBanner, { isLoading: isDeleting }] = useDeleteBannerMutation();
    const [updateBanner, { isLoading: isUpdatingBanner }] = useUpdateBannerMutation();
    const [createBanner, { isLoading: isCreating }] = useCreateBannerMutation();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [bannerToDelete, setBannerToDelete] = useState<string | null>(null);
    const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);

    const [formData, setFormData] = useState<{
        title: string;
        description: string;
        image: string;
        link: string;
        startDate: string;
        endDate: string;
        imageFile: File | null;
    }>({
        title: "",
        description: "",
        image: "",
        link: "",
        startDate: "",
        endDate: "",
        imageFile: null
    });

    const banners = response?.data || [];
    // console.log(banners);
    
    const filteredBanners = useMemo(() => {
        return banners.filter((b: any) => {
            const searchLower = searchQuery.toLowerCase();
            return (
                b.title.toLowerCase().includes(searchLower) ||
                b.description.toLowerCase().includes(searchLower) ||
                (b.link && b.link.toLowerCase().includes(searchLower))
            );
        });
    }, [banners, searchQuery]);

    const displayedBanners = filteredBanners.slice((currentPage - 1) * 10, currentPage * 10);
    const stats = response?.stats;
    const totalFiltered = filteredBanners.length;
    const totalPagesFiltered = Math.ceil(totalFiltered / 10);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData({ ...formData, imageFile: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, image: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveBanner = async () => {
        if (!formData.title || !formData.description) {
            Swal.fire({
                icon: "warning",
                title: "Validation Error",
                text: "Title and description are required.",
            });
            return;
        }

        try {
            if (editingBanner) {
                const data = new FormData();
                data.append("title", formData.title);
                data.append("description", formData.description);
                data.append("link", formData.link);
                data.append("startDate", formData.startDate);
                data.append("endDate", formData.endDate);

                if (formData.imageFile) {
                    data.append("image", formData.imageFile);
                }

                await updateBanner({ id: editingBanner.id, body: data }).unwrap();
                
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Banner updated successfully.",
                });
                setIsModalOpen(false);
            } else {
                const data = new FormData();
                data.append("title", formData.title);
                data.append("description", formData.description);
                data.append("link", formData.link);
                
                // Format dates to ISO strings if they exist
                if (formData.startDate) {
                    data.append("startDate", new Date(formData.startDate).toISOString());
                }
                if (formData.endDate) {
                    data.append("endDate", new Date(formData.endDate).toISOString());
                }

                if (formData.imageFile) {
                    data.append("image", formData.imageFile);
                } else {
                    Swal.fire({
                        icon: "warning",
                        title: "Validation Error",
                        text: "An image is required for new banners.",
                    });
                    return;
                }

                await createBanner(data).unwrap();
                
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Banner created successfully.",
                });
                setIsModalOpen(false);
            }
        } catch (err: any) {
            console.log("Failed to save banner:", err);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err.data?.message || "Failed to save banner functionality.",
            });
        }
    };

    const handleOpenModal = (banner?: Banner) => {
        if (banner) {
            setEditingBanner(banner);
            setFormData({
                title: banner.title,
                description: banner.description,
                image: banner.image,
                link: banner.link,
                startDate: banner.startDate?.split('T')[0] || "",
                endDate: banner.endDate?.split('T')[0] || "",
                imageFile: null
            });
        } else {
            setEditingBanner(null);
            setFormData({
                title: "",
                description: "",
                image: "",
                link: "",
                startDate: "",
                endDate: "",
                imageFile: null
            });
        }
        setIsModalOpen(true);
    };

    const handleToggleStatus = async (banner: Banner) => {
        try {
            setUpdatingStatusId(banner.id);
            const newStatus = banner.status === "ACTIVE" ? "DEACTIVATED" : "ACTIVE";
            await updateStatus({ id: banner.id, status: newStatus }).unwrap();
            Swal.fire({
                icon: "success",
                title: "Banner status updated successfully.",
            });
        } catch (err: any) {
            console.log("Failed to update status:", err);
            Swal.fire({
                icon: "error",
                title: "Failed to update banner status.",
                text: err.message,
            });
        } finally {
            setUpdatingStatusId(null);
        }
    };

    const handleDeleteClick = (id: string) => {
        setBannerToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (bannerToDelete) {
            try {
                await deleteBanner(bannerToDelete).unwrap();
                Swal.fire({
                    icon: "success",
                    title: "Banner deleted successfully.",
                });
            } catch (err: any) {
                console.log("Failed to delete banner:", err);
                Swal.fire({
                    icon: "error",
                    title: "Failed to delete banner.",
                    text: err.message,
                });
            }
            setBannerToDelete(null);
        }
        setIsDeleteModalOpen(false);
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return "N/A";
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'numeric',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // if (error) {
    //     return (
    //         <div className="flex flex-col items-center justify-center p-12 min-h-[400px] bg-red-50 border border-red-100 rounded-xl">
    //             <p className="text-red-700 font-medium mb-4">Failed to load marketing content</p>
    //             <button 
    //               onClick={() => window.location.reload()}
    //               className="px-4 py-2 bg-white border border-red-200 text-red-600 font-semibold rounded-lg hover:bg-red-100"
    //             >
    //                 Retry
    //             </button>
    //         </div>
    //     );
    // }

    return (
        <div className="space-y-6 bg-white min-h-[calc(100vh-100px)] p-8 rounded-xl">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex-1 min-w-[300px]">
                    <h2 className="text-2xl font-bold text-slate-900">Marketing Management</h2>
                    <p className="text-sm text-slate-500 mt-1">Manage promotional banners and marketing content for your mobile app</p>
                </div>

                <div className="flex flex-wrap items-center gap-4 flex-1 justify-end">
                    {/* Search Bar */}
                    <div className="flex-1 max-w-md relative group">
                        <input
                            type="text"
                            placeholder="Search banners..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-2 bg-white border border-slate-200 rounded-full text-sm text-black focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400"
                        />
                        <div className="absolute left-1 top-1 bottom-1 w-7.5 h-7.5 flex items-center justify-center bg-primary text-white rounded-full">
                            <Search size={14} />
                        </div>
                    </div>

                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 px-4 py-2.5 bg-[#6366F1] text-white rounded-lg text-sm font-medium hover:bg-[#6366F1]/90 transition-colors whitespace-nowrap"
                    >
                        <Plus size={18} />
                        Add New Banner
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatsCard title="Total Banners" value={stats?.total || 0} isLoading={isFetching} />
                <StatsCard title="Active Now" value={stats?.active || 0} isLoading={isFetching} />
                <StatsCard title="Scheduled" value={stats?.scheduled || 0} isLoading={isFetching} />
                <StatsCard title="Inactive" value={stats?.deactivated || 0} isLoading={isFetching} />
            </div>

            {/* Banner List */}
            <div className="space-y-4">
                {isFetching && banners.length === 0 ? (
                    <div className="space-y-4">
                        {[1, 2].map((i) => (
                            <div key={i} className="h-40 bg-slate-50 animate-pulse rounded-xl border border-slate-200"></div>
                        ))}
                    </div>
                ) : (
                    displayedBanners.map((banner) => (
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
                                            <span className={`px-2 py-0.5 text-xs font-normal rounded-lg ${banner.status === "ACTIVE" ? "bg-[#00C950] text-white" : "bg-slate-100 text-slate-600"
                                                }`}>
                                                {banner.status === "ACTIVE" ? "Active" : "Inactive"}
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
                                            <p className="text-xs text-slate-400 font-medium pt-0.5">
                                                {formatDate(banner.startDate)} - {formatDate(banner.endDate)}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <ExternalLink size={16} className="text-slate-500" />
                                            <p className="text-sm text-[#6366F1] truncate max-w-[200px]" title={banner.link}>{banner.link}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 mt-4">
                                    <button
                                        disabled={!!updatingStatusId}
                                        onClick={() => handleToggleStatus(banner)}
                                        className={`flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors border border-[#0000001A] text-[#0A0A0A] hover:bg-slate-100 disabled:opacity-50`}
                                    >
                                        {banner.status === "ACTIVE" ? (
                                            <>
                                                <EyeOffIcon size={16} />
                                                {updatingStatusId === banner.id ? "Processing..." : "Deactivate"}
                                            </>
                                        ) : (
                                            <>
                                                <EyeIcon size={16} />
                                                {updatingStatusId === banner.id ? "Processing..." : "Activate"}
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
                                        onClick={() => handleDeleteClick(banner.id)}
                                        className="px-3 py-1.5 flex items-center gap-1.5 text-red-600 text-xs font-medium border border-[#0000001A] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={14} /> <span>Delete</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}

                {!isFetching && displayedBanners.length === 0 && (
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

            {/* Pagination */}
            {totalPagesFiltered > 1 && (
                <div className="flex items-center justify-center gap-4 py-6 border-t border-slate-100">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1 || isFetching}
                        className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <span className="text-sm font-medium text-slate-700">
                        Page {currentPage} of {totalPagesFiltered}
                    </span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPagesFiltered))}
                        disabled={currentPage === totalPagesFiltered || isFetching}
                        className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}

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
                                        <input
                                            type="date"
                                            className="mt-1 w-full px-4 py-2.5 text-black bg-[#F3F3F5] border border-transparent text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#6366F1]"
                                            value={formData.startDate}
                                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-700">End Date</label>
                                        <input
                                            type="date"
                                            className="mt-1 text-black w-full px-4 py-2.5 bg-[#F3F3F5] border border-transparent text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#6366F1]"
                                            value={formData.endDate}
                                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        />
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
                                    disabled={isUpdatingBanner || isCreating}
                                    className="px-6 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/80 transition-colors shadow-sm shadow-blue-100 disabled:opacity-50">
                                    {(isUpdatingBanner || isCreating) ? (editingBanner ? "Updating..." : "Creating...") : editingBanner ? "Update Banner" : "Create Banner"}
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
                loading={isDeleting}
                title="Delete Banner"
                description="Are you sure you want to delete this marketing banner? This action cannot be undone."
            />
        </div >
    );
}
