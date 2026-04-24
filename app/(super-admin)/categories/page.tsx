"use client";

import DeleteModal from "@/components/DeleteModal";
import { useCreateCategoryMutation, useDeleteCategoryMutation, useGetAllCategoriesQuery, useGetSubCategoriesQuery, useUpdateCategoryMutation } from "@/lib/features/super-admin/category/categoryAPI";
import Swal from "sweetalert2";
import { ChevronLeft, ChevronRight, Loader2, Pencil, PencilLine, Trash2, Upload, Plus, Eye, ListFilter, Search } from "lucide-react";
import { useAppSelector } from "@/lib/hooks";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import SubCategoryModal from "@/components/SubCategoryModal";
import SubCategoryRowList from "@/components/SubCategoryRowList";
import { CategoryItem } from "@/lib/features/super-admin/category/category.type";
import { SubCategoryItem } from "@/lib/features/super-admin/sub-category/subCategory.type";
import ImageIcon2 from "@/app/assets/ImageIcon2.png";
import { useCreateSubCategoryMutation, useDeleteSubCategoryMutation } from "@/lib/features/super-admin/sub-category/subCategoryAPI";

const SubCategoryCount = ({ categoryId }: { categoryId: string }) => {
    const { data } = useGetSubCategoriesQuery({ categoryId, limit: 1 });
    return <>{data?.data?.data?.total || 0}</>;
};

export default function CategoriesPage() {
    const [page, setPage] = useState(1);
    const globalSearch = useAppSelector((state) => state.search.query);
    const [searchQuery, setSearchQuery] = useState(globalSearch || "");

    // Sync local search with global search
    useEffect(() => {
        setSearchQuery(globalSearch);
    }, [globalSearch]);

    const { data: categoriesData, isLoading: isCategoriesLoading } = useGetAllCategoriesQuery({ page, limit: 100 });
    // const SubCategoriesLength = categoriesData?.data?.length;
    const [categoryName, setCategoryName] = useState("");
    const [description, setDescription] = useState("");
    const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);

    // Sub-category modal and expandable list state
    const [isSubModalOpen, setIsSubModalOpen] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>();
    const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategoryItem | null>(null);
    const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null);
    const [subCategoryToDelete, setSubCategoryToDelete] = useState<string | null>(null);
    const [isSubDeleteModalOpen, setIsSubDeleteModalOpen] = useState(false);

    const imageInputRef = useRef<HTMLInputElement | null>(null);
    const iconInputRef = useRef<HTMLInputElement | null>(null);

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [iconFile, setIconFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [iconPreview, setIconPreview] = useState<string | null>(null);

    const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
    const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
    const [deleteCategory] = useDeleteCategoryMutation();
    const [deleteSubCategory] = useDeleteSubCategoryMutation();

    const categories = categoriesData?.data?.data?.data || [];
    console.log(categories);
    const meta = categoriesData?.data?.data;

    const filteredCategories = useMemo(() => {
        return categories.filter((c: any) =>
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.id.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [categories, searchQuery]);

    const displayedCategories = filteredCategories.slice((page - 1) * 10, page * 10);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) return;
        if (file.size > 2 * 1024 * 1024) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setIconFile(file);
        setIconPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async () => {
        if (!categoryName) {
            Swal.fire({ icon: "warning", title: "Required Field", text: "Please provide a category name." });
            return;
        }

        const formData = new FormData();
        formData.append("name", categoryName);
        formData.append("description", description || "Category Description");
        formData.append("isActive", "true");

        if (imageFile) formData.append("image", imageFile);
        if (iconFile) formData.append("icon", iconFile);

        try {
            if (editingCategory) {
                await updateCategory({ id: editingCategory.id, formData }).unwrap();
                Swal.fire({
                    icon: "success",
                    title: "Category Updated",
                    text: `Category "${categoryName}" has been updated successfully.`,
                    timer: 2000,
                    showConfirmButton: false
                });
            } else {
                const result = await createCategory(formData).unwrap();
                Swal.fire({
                    icon: "success",
                    title: "Category Created",
                    text: `Category "${result.data?.name}" has been created successfully.`,
                    timer: 2000,
                    showConfirmButton: false
                });
            }
            handleReset();
        } catch (err: any) {
            Swal.fire({
                icon: "error",
                title: editingCategory ? "Update Failed" : "Creation Failed",
                text: err?.data?.message || "Something went wrong.",
            });
        }
    };

    const handleReset = () => {
        setCategoryName("");
        setDescription("");
        setImageFile(null);
        setIconFile(null);
        setImagePreview(null);
        setIconPreview(null);
        setEditingCategory(null);
    };

    const handleEdit = (category: CategoryItem) => {
        setCategoryName(category.name);
        setDescription(category.description);
        setImagePreview(category.image);
        setIconPreview(category.icon);
        setEditingCategory(category);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = (id: string) => {
        setItemToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (itemToDelete) {
            try {
                await deleteCategory(itemToDelete).unwrap();
                Swal.fire("Deleted!", "Category has been deleted.", "success");
            } catch (err: any) {
                Swal.fire("Error", err?.data?.message || "Failed to delete.", "error");
            }
            setItemToDelete(null);
        }
        setIsDeleteModalOpen(false);
    };

    const handleAddSubCategory = (id: string) => {
        setSelectedCategoryId(id);
        setSelectedSubCategory(null);
        setIsSubModalOpen(true);
    };

    const handleEditSubCategory = (subCategory: SubCategoryItem) => {
        setSelectedSubCategory(subCategory);
        setSelectedCategoryId(subCategory.categoryId);
        setIsSubModalOpen(true);
    };

    const handleDeleteSubCategory = (id: string) => {
        setSubCategoryToDelete(id);
        setIsSubDeleteModalOpen(true);
    };

    const confirmDeleteSubCategory = async () => {
        if (subCategoryToDelete) {
            try {
                await deleteSubCategory(subCategoryToDelete).unwrap();
                Swal.fire("Deleted!", "Sub-category has been deleted.", "success");
            } catch (err: any) {
                Swal.fire("Error", err?.data?.message || "Failed to delete sub-category.", "error");
            }
            setSubCategoryToDelete(null);
        }
        setIsSubDeleteModalOpen(false);
    };

    const toggleExpand = (id: string) => {
        setExpandedCategoryId(expandedCategoryId === id ? null : id);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Category setup</h2>
                <p className="text-sm text-slate-500 mt-1">Create and organize service categories for easy navigation.</p>
            </div>

            {/* Main Card */}
            <div className="bg-white rounded-lg overflow-hidden">
                <div className="px-[55px] py-[41px] space-y-6">
                    {/* Category Name Input */}
                    <div>
                        <label className="block text-sm font-medium text-black mb-1">
                            Category Name(Default)
                        </label>
                        <input
                            type="text"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            className="w-full px-4 py-2.5 text-black border border-[#66666659] rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter category name"
                        />
                    </div>

                    {/* Description Input */}
                    <div>
                        <label className="block text-sm font-medium text-black mb-1">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-2.5 text-black border border-[#66666659] rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
                            placeholder="Enter category description"
                        />
                    </div>

                    {/* Upload Image and Icon */}
                    <div className="mt-6 flex flex-wrap gap-8">
                        <div>
                            <input
                                ref={imageInputRef}
                                type="file"
                                accept="image/png, image/jpeg, image/jpg"
                                className="hidden"
                                onChange={handleImageChange}
                            />

                            <div
                                onClick={() => imageInputRef.current?.click()}
                                className="w-fit border-2 border-dashed border-slate-300 rounded-lg
                                           px-10 py-6 text-center hover:border-blue-400
                                           transition-colors cursor-pointer"
                            >
                                <div className="flex flex-col items-center gap-2">
                                    <h6 className="text-base font-semibold text-[#18181A] mb-2">
                                        Category Image
                                    </h6>

                                    <div className="flex flex-col items-center justify-center text-center">
                                        <div className="relative w-16 h-16 bg-slate-100 rounded-lg
                                                        flex items-center justify-center mb-4">

                                            {imagePreview ? (
                                                <img
                                                    src={imagePreview}
                                                    alt="preview"
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                            ) : (
                                                <>
                                                    <Upload className="w-8 h-8 text-slate-400" />
                                                    <img src={ImageIcon2.src} alt="" />
                                                </>
                                            )}

                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    imageInputRef.current?.click();
                                                }}
                                                className="absolute -bottom-5 -right-2 w-4 h-4
                                                           flex items-center justify-center
                                                           bg-[#4153B395] hover:bg-primary/80
                                                           text-white rounded-full transition-colors mb-3"
                                            >
                                                <Pencil className="w-2 h-2" />
                                            </button>
                                        </div>

                                        <p className="text-xs text-[#5E6472] opacity-75">
                                            (jpg, png, jpeg - Max 2MB)
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <input
                                ref={iconInputRef}
                                type="file"
                                accept="image/png, image/jpeg, image/jpg, image/svg+xml"
                                className="hidden"
                                onChange={handleIconChange}
                            />

                            <div
                                onClick={() => iconInputRef.current?.click()}
                                className="w-fit border-2 border-dashed border-slate-300 rounded-lg
                                           px-10 py-6 text-center hover:border-blue-400
                                           transition-colors cursor-pointer"
                            >
                                <div className="flex flex-col items-center gap-2">
                                    <h6 className="text-base font-semibold text-[#18181A] mb-2">
                                        Category Icon
                                    </h6>

                                    <div className="flex flex-col items-center justify-center text-center">
                                        <div className="relative w-16 h-16 bg-slate-100 rounded-lg
                                                        flex items-center justify-center mb-4">

                                            {iconPreview ? (
                                                <img
                                                    src={iconPreview}
                                                    alt="preview"
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                            ) : (
                                                <>
                                                    <Upload className="w-8 h-8 text-slate-400" />
                                                    <img src={ImageIcon2.src} alt="" />
                                                </>
                                            )}

                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    iconInputRef.current?.click();
                                                }}
                                                className="absolute -bottom-5 -right-2 w-4 h-4
                                                           flex items-center justify-center
                                                           bg-[#4153B395] hover:bg-primary/80
                                                           text-white rounded-full transition-colors mb-3"
                                            >
                                                <Pencil className="w-2 h-2" />
                                            </button>
                                        </div>

                                        <p className="text-xs text-[#5E6472] opacity-75">
                                            (svg, png, jpg - Max 2MB)
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mt-10">
                        <button
                            disabled={isCreating || isUpdating}
                            onClick={handleSubmit}
                            className="px-20 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                            {(isCreating || isUpdating) ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                            {editingCategory ? ((isCreating || isUpdating) ? "Updating..." : "Update") : ((isCreating || isUpdating) ? "Submitting..." : "Submit")}
                        </button>
                        <button
                            onClick={handleReset}
                            className="px-20 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                            Reset
                        </button>
                    </div>
                </div>

            </div>
            <div className="bg-white rounded-lg overflow-hidden">
                <div className="p-10">
                    {/* Actions Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
                        {/* <div className="flex items-center justify-between gap-4 mb-6"> */}
                            <h3 className="text-lg font-bold text-slate-800">Category List</h3>
                            <div className="flex-1 max-w-md relative group">
                                <input
                                    type="text"
                                    placeholder="Search categories..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-2 bg-white border border-slate-200 rounded-full text-sm text-black focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400"
                                />
                                <div className="absolute left-1 top-1 bottom-1 w-7.5 h-7.5 flex items-center justify-center bg-primary text-white rounded-full">
                                    <Search size={14} />
                                </div>
                            {/* </div> */}
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto border border-slate-300">
                        <table className="w-full text-left ">
                            <thead>
                                <tr className="bg-[#EFF6FF]">
                                    <th className="px-4 py-3.5 text-sm font-semibold text-[#475569] border-r border-slate-300 text-center">SL</th>
                                    <th className="px-4 py-3.5 text-sm font-semibold text-[#475569] border-r border-slate-300 text-center">Category name</th>
                                    <th className="px-4 py-3.5 text-sm font-semibold text-[#475569] border-r border-slate-300 text-center">Sub category count</th>
                                    <th className="px-4 py-3.5 text-sm font-semibold text-[#475569] text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isCategoriesLoading ? (
                                    <tr>
                                        <td colSpan={4} className="py-10 text-center">
                                            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                                            <p className="mt-2 text-sm text-slate-500 font-medium">Loading categories...</p>
                                        </td>
                                    </tr>
                                ) : displayedCategories.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="py-10 text-center text-slate-500">No categories found.</td>
                                    </tr>
                                ) : (
                                    displayedCategories.map((category: CategoryItem, index: number) => (
                                        <Fragment key={category.id}>
                                            <tr className={`border-t border-slate-300 hover:bg-slate-50/50 transition-colors ${expandedCategoryId === category.id ? 'bg-slate-50' : ''}`}>
                                                <td className="px-4 py-4 text-sm text-[#2C2C2C] border-r border-slate-300 text-center ">{index + 1 + (page - 1) * 10}</td>
                                                <td className="px-4 py-4 text-sm text-[#0F172A] border-r border-slate-300 text-center ">
                                                    <div className="flex items-center gap-3 justify-center">
                                                        {category.icon && <img src={category.icon} className="w-6 h-6 object-contain" alt="" />}
                                                        {category.name}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-sm text-[#2C2C2C] border-r border-slate-300 text-center " onClick={() => toggleExpand(category.id)}>
                                                    <div className="flex items-center justify-center gap-2">

                                                        <span className=""><SubCategoryCount categoryId={category.id} /> <span className="text-[10px] text-slate-400 font-medium hover:text-primary/90 cursor-pointer transition-colors hover:underline">(Click to view)</span></span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-2 justify-center">
                                                        <button
                                                            onClick={() => toggleExpand(category.id)}
                                                            className={`p-2 rounded-lg transition-colors ${expandedCategoryId === category.id ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                                                            title="View Sub-categories"
                                                        >
                                                            <Eye size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleEdit(category)}
                                                            className="p-2 text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="Edit Category"
                                                        >
                                                            <PencilLine size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(category.id)}
                                                            className="p-2 text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Delete Category"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleAddSubCategory(category.id)}
                                                            className="inline-flex items-center gap-1 text-primary hover:underline font-medium text-xs border border-primary/20 px-2 py-1 rounded"
                                                        >
                                                            <Plus size={12} /> Sub
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                            {expandedCategoryId === category.id && (
                                                <tr>
                                                    <td colSpan={4} className="p-0 border-b border-slate-200">
                                                        <SubCategoryRowList
                                                            categoryId={category.id}
                                                            onEdit={handleEditSubCategory}
                                                            onDelete={handleDeleteSubCategory}

                                                        />
                                                    </td>
                                                </tr>
                                            )}
                                        </Fragment>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className=" py-4 border-t border-slate-300 flex items-center justify-center md:justify-end gap-1 md:gap-3">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 transition-colors disabled:opacity-50">
                            <ChevronLeft size={16} />
                            Previous
                        </button>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: Math.ceil(filteredCategories.length / 10) }, (_, i) => i + 1).map(i => (
                                <button
                                    key={i}
                                    onClick={() => setPage(i)}
                                    className={`w-8 h-8 rounded text-sm flex items-center justify-center font-medium transition-all ${i === page
                                        ? 'bg-slate-100 text-slate-900 border border-slate-300'
                                        : 'text-slate-600 hover:bg-slate-50'
                                        }`}
                                >
                                    {i}
                                </button>
                            ))}
                        </div>
                        <button
                            disabled={page >= Math.ceil(filteredCategories.length / 10)}
                            onClick={() => setPage(p => p + 1)}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 transition-colors disabled:opacity-50">
                            Next
                            <ChevronRight size={16} />
                        </button>
                    </div>

                </div>
            </div>

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Category"
                description="Are you sure you want to delete this category? This action cannot be undone."
            />

            <SubCategoryModal
                isOpen={isSubModalOpen}
                onClose={() => setIsSubModalOpen(false)}
                categoryId={selectedCategoryId}
                subCategory={selectedSubCategory}
            />

            <DeleteModal
                isOpen={isSubDeleteModalOpen}
                onClose={() => setIsSubDeleteModalOpen(false)}
                onConfirm={confirmDeleteSubCategory}
                title="Delete Sub-category"
                description="Are you sure you want to delete this sub-category? This action cannot be undone."
            />
        </div>
    );
}
