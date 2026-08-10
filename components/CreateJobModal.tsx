"use client";

import { useEffect, useRef, useState } from "react";
import { X, Upload, Pencil, Loader2, Plus, Minus, ChevronDownIcon } from "lucide-react";
import Swal from "sweetalert2";
import { useCreateJobMutation } from "@/lib/features/super-admin/job/jobAPI";
import { useGetAllCategoriesQuery, useGetSubCategoriesQuery } from "@/lib/features/super-admin/category/categoryAPI";
import { useGetAllProvidersQuery } from "@/lib/features/super-admin/provider/providerAPI";

interface CreateJobModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateJobModal({ isOpen, onClose }: CreateJobModalProps) {
    const [categoryId, setCategoryId] = useState("");
    const [subCategoryId, setSubCategoryId] = useState("");
    const [providerId, setProviderId] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [basePrice, setBasePrice] = useState("");
    const [priceType, setPriceType] = useState<"FIXED" | "HOURLY">("FIXED");
    const [includeService, setIncludeService] = useState<string[]>([""]);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const imageInputRef = useRef<HTMLInputElement>(null);

    const { data: categoriesData, isLoading: isLoadingCategories } = useGetAllCategoriesQuery({ limit: 100, page: 1 });
    const { data: subCategoriesData, isLoading: isLoadingSubCategories } = useGetSubCategoriesQuery({ categoryId: categoryId, limit: 100, page: 1 }, { skip: !categoryId });
    const { data: providersData, isLoading: isLoadingProviders } = useGetAllProvidersQuery({ limit: 100, page: 1 });

    const categories = categoriesData?.data?.data?.data || [];
    const subCategories = subCategoriesData?.data?.data?.data || [];
    const allProviders = providersData?.data?.data || providersData?.data || [];
    const verifiedProviders = (Array.isArray(allProviders) ? allProviders : []).filter((p: any) => p.verificationStatus === "VERIFIED");

    const [createJob, { isLoading: isCreating }] = useCreateJobMutation();

    useEffect(() => {
        if (!isOpen) {
            setCategoryId("");
            setSubCategoryId("");
            setProviderId("");
            setTitle("");
            setDescription("");
            setBasePrice("");
            setPriceType("FIXED");
            setIncludeService([""]);
            setImageFile(null);
            setImagePreview(null);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleAddService = () => {
        setIncludeService([...includeService, ""]);
    };

    const handleRemoveService = (index: number) => {
        const newServices = [...includeService];
        newServices.splice(index, 1);
        setIncludeService(newServices);
    };

    const handleServiceChange = (index: number, value: string) => {
        const newServices = [...includeService];
        newServices[index] = value;
        setIncludeService(newServices);
    };

    const handleSubmit = async () => {
        if (!categoryId || !subCategoryId || !title || !description || !basePrice || !imageFile) {
            Swal.fire("Error", "Please fill all required fields including image", "error");
            return;
        }

        const validServices = includeService.filter(s => s.trim() !== "");
        if (validServices.length === 0) {
             Swal.fire("Error", "Please add at least one include service", "error");
             return;
        }

        const formData = new FormData();
        formData.append("categoryId", categoryId);
        formData.append("subCategoryId", subCategoryId);
        if (providerId) formData.append("providerId", providerId);
        formData.append("title", title);
        formData.append("description", description);
        formData.append("basePrice", basePrice);
        formData.append("priceType", priceType);
        
        validServices.forEach(service => {
            formData.append("includeService", service);
        });
        
        if (imageFile) formData.append("image", imageFile);

        try {
            await createJob(formData).unwrap();
            Swal.fire("Success", "Job created successfully", "success");
            onClose();
        } catch (error: any) {
            Swal.fire("Error", error?.data?.message || "Failed to create job", "error");
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-[95vw] max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-6 border-b shrink-0">
                    <h3 className="text-xl font-bold text-slate-900">
                        Create New Job
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                <div className="p-6 space-y-4 overflow-y-auto flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-900 mb-1">Category</label>
                            <div className="relative">
                            <select
                                value={categoryId}
                                onChange={(e) => {
                                    setCategoryId(e.target.value);
                                    setSubCategoryId("");
                                }}
                                className="w-full px-4 py-2 text-slate-900 border border-primary/50 rounded-lg focus:ring-2 focus:ring-primary/20 appearance-none outline-none"
                            >
                                <option value="">Select Category</option>
                                {categories.map((cat: any) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                            <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-900 mb-1">Sub Category</label>
                            <div className="relative">
                            <select
                                value={subCategoryId}
                                onChange={(e) => setSubCategoryId(e.target.value)}
                                disabled={!categoryId || isLoadingSubCategories}
                                className="w-full px-4 py-2 text-slate-900 border border-primary/50 rounded-lg focus:ring-2 focus:ring-primary/20 appearance-none outline-none disabled:bg-slate-100"
                            >
                                <option value="">Select Sub Category</option>
                                {subCategories.map((sub: any) => (
                                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                                ))}
                            </select>
                            <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-900 mb-1">Select Verified Provider</label>
                        <div className="relative">
                            <select
                                value={providerId}
                                onChange={(e) => setProviderId(e.target.value)}
                                className="w-full px-4 py-2 text-slate-900 border border-primary/50 rounded-lg focus:ring-2 focus:ring-primary/20 appearance-none outline-none"
                            >
                                <option value="">Select Verified Provider (Optional)</option>
                                {verifiedProviders.map((provider: any) => (
                                    <option key={provider.id} value={provider.id}>
                                        {provider.firstName} {provider.lastName} {provider.email ? `(${provider.email})` : ''}
                                    </option>
                                ))}
                            </select>
                            <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-900 mb-1">Job Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2 text-slate-900 placeholder:text-gray-400 border border-primary/50 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                            placeholder="Enter job title"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-900 mb-1">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-2 text-slate-900 placeholder:text-gray-400 border border-primary/50 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none min-h-[100px]"
                            placeholder="Enter description"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-900 mb-1">Base Price</label>
                            <input
                                type="number"
                                value={basePrice}
                                onChange={(e) => setBasePrice(e.target.value)}
                                className="w-full px-4 py-2 text-slate-900 placeholder:text-gray-400 border border-primary/50 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                placeholder="Enter base price"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-900 mb-1">Price Type</label>
                            <div className="relative">
                            <select
                                value={priceType}
                                onChange={(e) => setPriceType(e.target.value as "FIXED" | "HOURLY")}
                                className="w-full px-4 py-2 text-slate-900 border border-primary/50 rounded-lg appearance-none focus:ring-2 focus:ring-primary/20 outline-none"
                            >
                                <option value="FIXED">Fixed</option>
                                <option value="HOURLY">Hourly</option>
                            </select>
                            <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-900 mb-1">Included Services</label>
                        {includeService.map((service, index) => (
                            <div key={index} className="flex items-center gap-2 mb-2">
                                <input
                                    type="text"
                                    value={service}
                                    onChange={(e) => handleServiceChange(index, e.target.value)}
                                    className="flex-1 px-4 py-2 text-slate-900 border border-primary/50 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                    placeholder="e.g. Cleaning"
                                />
                                {includeService.length > 1 && (
                                    <button
                                        onClick={() => handleRemoveService(index)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Minus size={20} />
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            onClick={handleAddService}
                            className="text-sm text-primary font-medium flex items-center gap-1 hover:underline mt-1"
                        >
                            <Plus size={16} /> Add another service
                        </button>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-900 mb-2">Job Image</label>
                        <input ref={imageInputRef} type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                        <div 
                            onClick={() => imageInputRef.current?.click()}
                            className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer relative"
                        >
                            {imagePreview ? (
                                <img src={imagePreview} alt="preview" className="w-32 h-32 mx-auto object-cover rounded-lg" />
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
                </div>

                <div className="flex items-center justify-end gap-3 p-6 border-t bg-slate-50 shrink-0">
                    <button 
                        onClick={onClose}
                        className="px-6 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        disabled={isCreating}
                        onClick={handleSubmit}
                        className="px-6 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                    >
                        {isCreating && <Loader2 className="w-4 h-4 animate-spin" />}
                        Create Job
                    </button>
                </div>
            </div>
        </div>
    );
}
