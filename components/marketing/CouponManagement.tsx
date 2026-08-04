"use client";

import { Plus, Trash2, Edit2, X, Search, Ticket, CheckCircle2, XCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import DeleteModal from "@/components/DeleteModal";
import { 
    useGetCouponsQuery, 
    useCreateCouponMutation, 
    useUpdateCouponMutation, 
    useDeleteCouponMutation 
} from "@/lib/features/super-admin/coupon/couponAPI";
import { Coupon } from "@/lib/features/super-admin/coupon/coupon.type";
import { useAppSelector } from "@/lib/hooks";
import Swal from "sweetalert2";

const StatsCard = ({ title, value, isLoading }: any) => (
    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex-1">
        {isLoading ? (
            <div className="h-9 w-16 bg-slate-100 animate-pulse rounded mb-7"></div>
        ) : (
            <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
        )}
        <p className="text-sm text-slate-500 mt-7">{title}</p>
    </div>
);

export default function CouponManagement() {
    const user = useAppSelector((state) => state.auth.user);
    const isSuperAdmin = user?.role === "SUPER_ADMIN";
    const [searchQuery, setSearchQuery] = useState("");
    const { data: response, isLoading: isFetching } = useGetCouponsQuery();
    const [createCoupon, { isLoading: isCreating }] = useCreateCouponMutation();
    const [updateCoupon, { isLoading: isUpdating }] = useUpdateCouponMutation();
    const [deleteCoupon, { isLoading: isDeleting }] = useDeleteCouponMutation();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [couponToDelete, setCouponToDelete] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        couponCode: "",
        discountPercentage: 0,
        isActive: true,
        totalUselimit: 0,
        expireAt: new Date().toISOString().split('T')[0]
    });

    const coupons = response?.data?.data || [];

    const filteredCoupons = useMemo(() => {
        return coupons.filter((c) =>
            c.couponCode.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [coupons, searchQuery]);

    const stats = useMemo(() => {
        return {
            total: coupons.length,
            active: coupons.filter(c => c.isActive).length,
            inactive: coupons.filter(c => !c.isActive).length
        };
    }, [coupons]);

    const handleOpenModal = (coupon?: Coupon) => {
        if (coupon) {
            setEditingCoupon(coupon);
            setFormData({
                couponCode: coupon.couponCode,
                discountPercentage: coupon.discountPercentage,
                isActive: coupon.isActive,
                totalUselimit: coupon.totalUselimit,
                expireAt: coupon.expireAt ? new Date(coupon.expireAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
            });
        } else {
            setEditingCoupon(null);
            setFormData({
                couponCode: "",
                discountPercentage: 0,
                isActive: true,
                totalUselimit: 0,
                expireAt: new Date().toISOString().split('T')[0]
            });
        }
        setIsModalOpen(true);
    };

    const handleSaveCoupon = async () => {
        if (!formData.couponCode || formData.discountPercentage <= 0 || formData.totalUselimit <= 0 || !formData.expireAt) {
            Swal.fire({
                icon: "warning",
                title: "Validation Error",
                text: "All fields are required and must be valid.",
            });
            return;
        }

        try {
            if (editingCoupon) {
                await updateCoupon({ id: editingCoupon.id, ...formData }).unwrap();
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Coupon updated successfully.",
                });
            } else {
                await createCoupon(formData).unwrap();
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Coupon created successfully.",
                });
            }
            setIsModalOpen(false);
        } catch (err: any) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err.data?.message || "Failed to save coupon.",
            });
        }
    };

    const handleDeleteClick = (id: string) => {
        setCouponToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (couponToDelete) {
            try {
                await deleteCoupon(couponToDelete).unwrap();
                Swal.fire({
                    icon: "success",
                    title: "Coupon deleted successfully.",
                });
            } catch (err: any) {
                Swal.fire({
                    icon: "error",
                    title: "Failed to delete coupon.",
                    text: err.data?.message || "Something went wrong",
                });
            }
            setCouponToDelete(null);
        }
        setIsDeleteModalOpen(false);
    };

    return (
        <div className="space-y-6 bg-white min-h-[calc(100vh-100px)] p-8 rounded-xl">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex-1 min-w-[300px]">
                    <h2 className="text-2xl font-bold text-slate-900">Coupon Management</h2>
                    <p className="text-sm text-slate-500 mt-1">Create and manage discount coupons for your customers</p>
                </div>

                <div className="flex flex-wrap items-center gap-4 flex-1 justify-end">
                    <div className="flex-1 max-w-md relative group">
                        <input
                            type="text"
                            placeholder="Search coupons..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-2 bg-white border border-slate-200 rounded-full text-sm text-black focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400"
                        />
                        <div className="absolute left-1 top-1 bottom-1 w-7.5 h-7.5 flex items-center justify-center bg-primary text-white rounded-full">
                            <Search size={14} />
                        </div>
                    </div>

                    {isSuperAdmin && (
                        <button
                            onClick={() => handleOpenModal()}
                            className="flex items-center gap-2 px-4 py-2.5 bg-[#6366F1] text-white rounded-lg text-sm font-medium hover:bg-[#6366F1]/90 transition-colors whitespace-nowrap"
                        >
                            <Plus size={18} />
                            Add New Coupon
                        </button>
                    )}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard title="Total Coupons" value={stats.total} isLoading={isFetching} />
                <StatsCard title="Active Coupons" value={stats.active} isLoading={isFetching} />
                <StatsCard title="Inactive Coupons" value={stats.inactive} isLoading={isFetching} />
            </div>

            {/* Coupon List */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="px-6 py-4 text-sm font-semibold text-slate-700">Coupon Code</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-700">Discount</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-700">Status</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-700">Use Limit</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-700">Expires At</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-700">Created At</th>
                            {isSuperAdmin && <th className="px-6 py-4 text-sm font-semibold text-slate-700 text-right">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {isFetching ? (
                            [1, 2, 3].map((i) => (
                                <tr key={i} className="animate-pulse">
                                    <td colSpan={5} className="px-6 py-4">
                                        <div className="h-4 bg-slate-100 rounded w-full"></div>
                                    </td>
                                </tr>
                            ))
                        ) : filteredCoupons.length > 0 ? (
                            filteredCoupons.map((coupon) => (
                                <tr key={coupon.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                                <Ticket size={16} />
                                            </div>
                                            <span className="font-medium text-slate-900">{coupon.couponCode}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        <span className="px-2 py-1 bg-green-50 text-green-700 rounded-md font-medium">
                                            {coupon.discountPercentage}% OFF
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {coupon.isActive ? (
                                            <div className="flex items-center gap-1.5 text-emerald-600 text-sm font-medium">
                                                <CheckCircle2 size={16} />
                                                <span>Active</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1.5 text-slate-400 text-sm font-medium">
                                                <XCircle size={16} />
                                                <span>Inactive</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        {coupon.totalUselimit}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        {coupon.expireAt ? new Date(coupon.expireAt).toLocaleDateString() : "N/A"}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        {new Date(coupon.createdAt).toLocaleDateString()}
                                    </td>
                                    {isSuperAdmin && (
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleOpenModal(coupon)}
                                                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                    title="Edit Coupon"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(coupon.id)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete Coupon"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={isSuperAdmin ? 7 : 6} className="px-6 py-20 text-center">
                                    <div className="flex flex-col items-center justify-center max-w-[400px] mx-auto">
                                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                            <Ticket size={40} className="text-slate-300" />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">No coupons found</h3>
                                        <p className="text-slate-500 mb-8 leading-relaxed text-sm">
                                            Try adjusting your search or create a new coupon.
                                        </p>
                                        {isSuperAdmin && (
                                            <button
                                                onClick={() => handleOpenModal()}
                                                className="flex items-center gap-2 px-6 py-3 bg-[#6366F1] text-white rounded-xl text-sm font-semibold hover:bg-[#6366F1]/90 shadow-lg shadow-indigo-200 transition-all active:scale-95"
                                            >
                                                <Plus size={20} />
                                                Create New Coupon
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md flex flex-col">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                            <h3 className="text-lg font-bold text-slate-900">{editingCoupon ? "Edit Coupon" : "Add New Coupon"}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700">Coupon Code</label>
                                <input
                                    type="text"
                                    placeholder="e.g. SAVE20"
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    value={formData.couponCode}
                                    onChange={(e) => setFormData({ ...formData, couponCode: e.target.value.toUpperCase() })}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700">Discount Percentage (%)</label>
                                <input
                                    type="number"
                                    placeholder="e.g. 20"
                                    min="1"
                                    max="100"
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    value={formData.discountPercentage}
                                    onChange={(e) => setFormData({ ...formData, discountPercentage: Number(e.target.value) })}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700">Total Use Limit</label>
                                <input
                                    type="number"
                                    placeholder="e.g. 100"
                                    min="1"
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    value={formData.totalUselimit}
                                    onChange={(e) => setFormData({ ...formData, totalUselimit: Number(e.target.value) })}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700">Expiration Date</label>
                                <input
                                    type="date"
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    value={formData.expireAt}
                                    onChange={(e) => setFormData({ ...formData, expireAt: e.target.value })}
                                />
                            </div>

                            <div className="flex items-center gap-3 py-2">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${formData.isActive ? 'bg-primary' : 'bg-slate-200'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                                <span className="text-sm font-medium text-slate-700">Active Status</span>
                            </div>

                            <div className="pt-4 flex items-center justify-end gap-3">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-slate-600 text-sm font-medium hover:bg-slate-50 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveCoupon}
                                    disabled={isCreating || isUpdating}
                                    className="px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                                >
                                    {isCreating || isUpdating ? "Saving..." : editingCoupon ? "Update Coupon" : "Create Coupon"}
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
                title="Delete Coupon"
                description="Are you sure you want to delete this coupon? This action cannot be undone."
            />
        </div>
    );
}
