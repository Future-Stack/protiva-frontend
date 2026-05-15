"use client";

import { useEffect, useRef, useState } from "react";
import { X, Upload, Pencil, Loader2 } from "lucide-react";
import ImageIcon2 from "@/app/assets/ImageIcon2.png"
import Swal from "sweetalert2";
import { useCreateSubCategoryMutation, useUpdateSubCategoryMutation } from "@/lib/features/super-admin/sub-category/subCategoryAPI";
import { SubCategoryItem } from "@/lib/features/super-admin/sub-category/subCategory.type";

interface SubCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    categoryId?: string;
    subCategory?: SubCategoryItem | null;
}

export default function SubCategoryModal({ isOpen, onClose, categoryId, subCategory }: SubCategoryModalProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [iconFile, setIconFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [iconPreview, setIconPreview] = useState<string | null>(null);

    const imageInputRef = useRef<HTMLInputElement>(null);
    const iconInputRef = useRef<HTMLInputElement>(null);

    const [createSubCategory, { isLoading: isCreating }] = useCreateSubCategoryMutation();
    const [updateSubCategory, { isLoading: isUpdating }] = useUpdateSubCategoryMutation();

    useEffect(() => {
        if (subCategory) {
            setName(subCategory.name);
            setDescription(subCategory.description);
            setImagePreview(subCategory.image);
            setIconPreview(subCategory.icon);
        } else {
            setName("");
            setDescription("");
            setImagePreview(null);
            setIconPreview(null);
            setImageFile(null);
            setIconFile(null);
        }
    }, [subCategory, isOpen]);

    if (!isOpen) return null;

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIconFile(file);
            setIconPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async () => {
        if (!name) {
            Swal.fire("Error", "Name is required", "error");
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description || "Sub-category description");
        formData.append("isActive", "true");
        
        if (imageFile) formData.append("image", imageFile);
        if (iconFile) formData.append("icon", iconFile);

        try {
            if (subCategory) {
                await updateSubCategory({ id: subCategory.id, formData }).unwrap();
                Swal.fire("Success", "Sub-category updated successfully", "success");
            } else if (categoryId) {
                formData.append("categoryId", categoryId);
                await createSubCategory(formData).unwrap();
                Swal.fire("Success", "Sub-category created successfully", "success");
            }
            onClose();
        } catch (error: any) {
            Swal.fire("Error", error?.data?.message || "Failed to save sub-category", "error");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b">
                    <h3 className="text-xl font-bold text-slate-900">
                        {subCategory ? "Edit Sub-category" : "Add New Sub-category"}
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                    <div>
                        <label className="block text-sm font-medium text-slate-900 mb-1">Sub-category Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 text-slate-900 placeholder:text-gray-400 border border-primary/50 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none "
                            placeholder="Enter name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-900 mb-1">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-2 text-slate-900 placeholder:text-gray-400 border border-primary/50 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none min-h-[100px] "
                            placeholder="Enter description"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-slate-900 mb-2">Image</label>
                            <input ref={imageInputRef} type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                            <div 
                                onClick={() => imageInputRef.current?.click()}
                                className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer relative"
                            >
                                {imagePreview ? (
                                    <img src={imagePreview} alt="preview" className="w-20 h-20 mx-auto object-cover rounded-lg" />
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <Upload className="w-8 h-8 text-slate-400 mb-2" />
                                        <p className="text-xs text-slate-500">Upload Image</p>
                                    </div>
                                )}
                                <div className="absolute bottom-2 right-2 p-1 bg-primary text-white rounded-full">
                                    <Pencil size={12} />
                                </div>
                            </div>
                        </div>

                        {/* Icon Upload */}
                        <div>
                            <label className="block text-sm font-medium text-slate-900 mb-2">Icon</label>
                            <input ref={iconInputRef} type="file" className="hidden" onChange={handleIconChange} accept="image/*" />
                            <div 
                                onClick={() => iconInputRef.current?.click()}
                                className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer relative"
                            >
                                {iconPreview ? (
                                    <img src={iconPreview} alt="preview" className="w-20 h-20 mx-auto object-cover rounded-lg" />
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <Upload className="w-8 h-8 text-slate-400 mb-2" />
                                        <p className="text-xs text-slate-500">Upload Icon</p>
                                    </div>
                                )}
                                <div className="absolute bottom-2 right-2 p-1 bg-primary text-white rounded-full">
                                    <Pencil size={12} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 p-6 border-t bg-slate-50">
                    <button 
                        onClick={onClose}
                        className="px-6 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        disabled={isCreating || isUpdating}
                        onClick={handleSubmit}
                        className="px-6 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                    >
                        {(isCreating || isUpdating) && <Loader2 className="w-4 h-4 animate-spin" />}
                        {subCategory ? "Update Sub-category" : "Create Sub-category"}
                    </button>
                </div>
            </div>
        </div>
    );
}
