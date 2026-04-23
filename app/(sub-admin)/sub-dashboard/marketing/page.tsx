"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2, X, Image as ImageIcon, UploadCloud, Calendar, ExternalLink, EyeIcon, EyeOffIcon, ChevronLeft, ChevronRight } from "lucide-react";
import DeleteModal from "@/components/DeleteModal";
import { 
    useGetMarketingBannersQuery, 
    useUpdateBannerStatusMutation, 
    useDeleteBannerMutation,
    useUpdateBannerMutation,
    useCreateBannerMutation
} from "@/lib/features/super-admin/marketing/marketingAPI";
import { Banner } from "@/lib/features/super-admin/marketing/marketing.type";
import { useAppSelector } from "@/lib/hooks";
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

export default function SubAdminMarketingPage() {
    const { user } = useAppSelector((state) => state.auth);
    const hasViewPermission = user?.role === "SUPER_ADMIN" || user?.adminPermissions?.isViewManageMarketing || user?.adminPermissions?.isManageMarketing;
    const hasManagePermission = user?.role === "SUPER_ADMIN" || user?.adminPermissions?.isManageMarketing;
    const canDelete = user?.role === "SUPER_ADMIN";

    const [currentPage, setCurrentPage] = useState(1);
    
    // API Queries and Mutations
    const { data: response, isLoading: isFetching } = useGetMarketingBannersQuery({ 
        page: currentPage, 
        limit: 10 
    }, { skip: !hasViewPermission });

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
    const stats = response?.stats;
    const pagination = response?.pagination;

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!hasManagePermission) return;
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
        if (!hasManagePermission) return;
        if (!formData.title || !formData.description) {
            Swal.fire({ icon: "warning", title: "Validation Error", text: "Title and description are required." });
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
                if (formData.imageFile) data.append("image", formData.imageFile);

                await updateBanner({ id: editingBanner.id, body: data }).unwrap();
                Swal.fire({ icon: "success", title: "Success", text: "Banner updated successfully." });
                setIsModalOpen(false);
            } else {
                const data = new FormData();
                data.append("title", formData.title);
                data.append("description", formData.description);
                data.append("link", formData.link);
                if (formData.startDate) data.append("startDate", new Date(formData.startDate).toISOString());
                if (formData.endDate) data.append("endDate", new Date(formData.endDate).toISOString());
                if (formData.imageFile) {
                    data.append("image", formData.imageFile);
                } else {
                    Swal.fire({ icon: "warning", title: "Validation Error", text: "An image is required for new banners." });
                    return;
                }

                await createBanner(data).unwrap();
                Swal.fire({ icon: "success", title: "Success", text: "Banner created successfully." });
                setIsModalOpen(false);
            }
        } catch (err: any) {
            Swal.fire({ icon: "error", title: "Error", text: err.data?.message || "Failed to save banner." });
        }
    };

    const handleOpenModal = (banner?: Banner) => {
        if (!hasManagePermission) return;
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
            setFormData({ title: "", description: "", image: "", link: "", startDate: "", endDate: "", imageFile: null });
        }
        setIsModalOpen(true);
    };

    const handleToggleStatus = async (banner: Banner) => {
        if (!hasManagePermission) return;
        try {
            setUpdatingStatusId(banner.id);
            const newStatus = banner.status === "ACTIVE" ? "DEACTIVATED" : "ACTIVE";
            await updateStatus({ id: banner.id, status: newStatus }).unwrap();
            Swal.fire({ icon: "success", title: "Banner status updated." });
        } catch (err: any) {
            Swal.fire({ icon: "error", title: "Failed", text: err.message });
        } finally {
            setUpdatingStatusId(null);
        }
    };

    const handleDeleteClick = (id: string) => {
        if (!canDelete) return;
        setBannerToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!canDelete || !bannerToDelete) return;
        try {
            await deleteBanner(bannerToDelete).unwrap();
            Swal.fire({ icon: "success", title: "Banner deleted." });
        } catch (err: any) {
            Swal.fire({ icon: "error", title: "Failed", text: err.message });
        }
        setBannerToDelete(null);
        setIsDeleteModalOpen(false);
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return "N/A";
        return new Date(dateStr).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });
    };

    if (!hasViewPermission) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <div className="text-center p-8 bg-rose-50 rounded-2xl border border-rose-100">
                    <h2 className="text-2xl font-bold text-rose-900 uppercase">Access Denied</h2>
                    <p className="text-rose-600 mt-2 text-sm">You do not have permission to view marketing tools.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 bg-white min-h-[calc(100vh-100px)] p-8 rounded-xl">
            <div className="flex flex-wrap items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Marketing Management</h2>
                    <p className="text-sm text-slate-500 mt-1">Manage promotional banners and marketing content</p>
                </div>
                {hasManagePermission && (
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 mt-4 md:mt-0 px-4 py-2.5 bg-[#6366F1] text-white rounded-lg text-sm font-medium hover:bg-[#6366F1]/90 transition-colors"
                    >
                        <Plus size={18} />
                        Add New Banner
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatsCard title="Total Banners" value={stats?.total || 0} isLoading={isFetching} />
                <StatsCard title="Active Now" value={stats?.active || 0} isLoading={isFetching} />
                <StatsCard title="Scheduled" value={stats?.scheduled || 0} isLoading={isFetching} />
                <StatsCard title="Inactive" value={stats?.deactivated || 0} isLoading={isFetching} />
            </div>

            <div className="space-y-4">
                {isFetching && banners.length === 0 ? (
                    <div className="space-y-4">
                        {[1, 2].map((i) => (
                            <div key={i} className="h-40 bg-slate-50 animate-pulse rounded-xl border border-slate-200"></div>
                        ))}
                    </div>
                ) : (
                    banners.map((banner: any) => (
                        <div key={banner.id} className="flex flex-col md:flex-row gap-6 p-4 border border-slate-200 rounded-xl bg-white hover:border-slate-300 transition-colors">
                            <div className="w-full md:w-48 h-32 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0 relative group">
                                <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-3">
                                    <h3 className="font-semibold text-slate-900">{banner.title}</h3>
                                    <span className={`px-2 py-0.5 text-xs font-normal rounded-lg ${banner.status === "ACTIVE" ? "bg-[#00C950] text-white" : "bg-slate-100 text-slate-600"}`}>
                                        {banner.status === "ACTIVE" ? "Active" : "Inactive"}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-500 line-clamp-2">{banner.description}</p>
                                <div className="pt-2 flex flex-wrap gap-4">
                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                        <Calendar size={16} />
                                        <span>{formatDate(banner.startDate)} - {formatDate(banner.endDate)}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-[#6366F1]">
                                        <ExternalLink size={16} />
                                        <span className="truncate max-w-[200px]">{banner.link}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 mt-4">

                                        <>
                                            <button
                                                disabled={!!updatingStatusId}
                                                onClick={() => handleToggleStatus(banner)}
                                                className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors border border-[#0000001A] text-[#0A0A0A] hover:bg-slate-100 disabled:opacity-50"
                                            >
                                                {banner.status === "ACTIVE" ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                                                {banner.status === "ACTIVE" ? "Deactivate" : "Activate"}
                                            </button>
                                            <button
                                                onClick={() => handleOpenModal(banner)}
                                                className="px-3 py-1.5 flex items-center gap-1.5 text-[#0A0A0A] text-xs font-medium border border-[#0000001A] hover:text-[#6366F1] hover:bg-indigo-50 rounded-lg transition-colors"
                                            >
                                                <Edit2 size={12} /> Edit
                                            </button>
                                        </>
                                    
                                    {canDelete && (
                                        <button
                                            onClick={() => handleDeleteClick(banner.id)}
                                            className="px-3 py-1.5 flex items-center gap-1.5 text-red-600 text-xs font-medium border border-slate-200 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={14} /> Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl flex flex-col max-h-[85vh]">
                        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">{editingBanner ? "Edit Banner" : "Add New Banner"}</h3>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full"><X size={20} /></button>
                        </div>
                        <div className="p-8 overflow-y-auto space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700">Title *</label>
                                <input type="text" className="w-full px-4 py-2.5 bg-slate-50 border border-transparent rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700">Description *</label>
                                <textarea rows={3} className="w-full px-4 py-2.5 bg-slate-50 border border-transparent rounded-lg text-sm" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700">Image URL / Upload *</label>
                                <div className="flex gap-4">
                                    <input type="text" className="flex-1 px-4 py-2.5 bg-slate-50 border border-transparent rounded-lg text-sm" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} />
                                    <input type="file" accept="image/*" className="hidden" id="image-upload" onChange={handleImageUpload} />
                                    <label htmlFor="image-upload" className="px-4 py-2 bg-slate-100 rounded-lg cursor-pointer flex items-center justify-center border border-slate-200"><UploadCloud size={20} /></label>
                                </div>
                                {formData.image && <img src={formData.image} className="mt-2 h-32 w-full object-cover rounded-lg" />}
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700">Link *</label>
                                <input type="text" className="w-full px-4 py-2.5 bg-slate-50 border border-transparent rounded-lg text-sm" value={formData.link} onChange={(e) => setFormData({ ...formData, link: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-slate-700">Start Date</label>
                                    <input type="date" className="w-full px-4 py-2.5 bg-slate-50 border border-transparent rounded-lg text-sm" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700">End Date</label>
                                    <input type="date" className="w-full px-4 py-2.5 bg-slate-50 border border-transparent rounded-lg text-sm" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} />
                                </div>
                            </div>
                            <div className="pt-6 flex justify-end gap-3">
                                <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 border border-slate-200 rounded-lg text-sm">Cancel</button>
                                <button onClick={handleSaveBanner} className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium">Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <DeleteModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={confirmDelete} loading={isDeleting} title="Delete Banner" description="Are you sure?" />
        </div>
    );
}
