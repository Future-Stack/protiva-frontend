"use client";

import { useGetSubCategoriesQuery } from "@/lib/features/super-admin/category/categoryAPI";
import { SubCategoryItem } from "@/lib/features/super-admin/sub-category/subCategory.type";
import { Loader2, PencilLine, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface SubCategoryRowListProps {
    categoryId: string;
    onEdit?: (subCategory: SubCategoryItem) => void;
    onDelete?: (id: string) => void;
}

export default function SubCategoryRowList({ categoryId, onEdit, onDelete }: SubCategoryRowListProps) {
    const [page, setPage] = useState(1);
    const { data: subCategoriesData, isLoading } = useGetSubCategoriesQuery({ 
        categoryId, 
        page, 
        limit: 5 
    });

    // Handle nested response structure from provided example
    const subCategories = subCategoriesData?.data?.data?.data || [];
    const meta = subCategoriesData?.data?.data;

    if (isLoading) {
        return (
            <div className="py-8 flex flex-col items-center justify-center bg-slate-50/30">
                <Loader2 className="w-6 h-6 animate-spin text-primary mb-2" />
                <p className="text-xs text-slate-500 font-medium italic">Loading sub-categories...</p>
            </div>
        );
    }

    if (subCategories.length === 0) {
        return (
            <div className="py-8 text-center bg-slate-50/30 text-slate-500 text-sm italic">
                No sub-categories found for this category.
            </div>
        );
    }

    return (
        <div className="bg-slate-50/50 p-4 border-l-4 border-primary/20">
            <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-100/50 border-b border-slate-200">
                            <th className="px-4 py-3 text-[11px] font-bold text-slate-600 uppercase tracking-wider border-r border-slate-200">Sub-category Name</th>
                            <th className="px-4 py-3 text-[11px] font-bold text-slate-600 uppercase tracking-wider text-center border-r border-slate-200">Image</th>
                            {/* <th className="px-4 py-3 text-[11px] font-bold text-slate-600 uppercase tracking-wider text-center border-r border-slate-200">Icon</th> */}
                            <th className="px-4 py-3 text-[11px] font-bold text-slate-600 uppercase tracking-wider text-center border-r border-slate-200">Services</th>
                            <th className="px-4 py-3 text-[11px] font-bold text-slate-600 uppercase tracking-wider text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {subCategories.map((sub: SubCategoryItem) => (
                            <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-4 py-3 text-sm font-medium text-slate-900 border-r border-slate-200">{sub.name}</td>
                                <td className="px-4 py-3 text-center border-r border-slate-200">
                                    {sub.image ? (
                                        <img src={sub.image} alt="" className="w-8 h-8 rounded object-cover mx-auto border border-slate-200" />
                                    ) : (
                                        <span className="text-slate-300 text-xs">-</span>
                                    )}
                                </td>
                                {/* <td className="px-4 py-3 text-center border-r border-slate-200">
                                    {sub.icon ? (
                                        <img src={sub.icon} alt="" className="w-6 h-6 object-contain mx-auto" />
                                    ) : (
                                        <span className="text-slate-300 text-xs">-</span>
                                    )} */}
                                {/* </td> */}
                                <td className="px-4 py-3 text-center border-r border-slate-200 text-sm text-slate-600">
                                    {sub._count?.jobs || 0}
                                </td>
                                <td className="px-4 py-3 ">
                                    <div className="flex items-center justify-center gap-1">
                                        <button 
                                            onClick={() => onEdit?.(sub)}
                                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                            title="Edit Sub-category"
                                        >
                                            <PencilLine size={16} />
                                        </button>
                                        <button 
                                            onClick={() => onDelete?.(sub.id)}
                                            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                            title="Delete Sub-category"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {meta && meta.totalPage > 1 && (
                <div className="mt-3 flex items-center justify-end gap-3">
                    <button 
                        disabled={page === 1}
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        className="flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-primary disabled:opacity-30 transition-colors"
                    >
                        <ChevronLeft size={14} />
                        PREV
                    </button>
                    <div className="flex items-center gap-1">
                        {Array.from({ length: meta.totalPage }, (_, i) => i + 1).map((i) => (
                            <button
                                key={i}
                                onClick={() => setPage(i)}
                                className={`w-5 h-5 rounded text-[10px] flex items-center justify-center font-bold transition-all ${
                                    i === page
                                        ? 'bg-primary text-white'
                                        : 'text-slate-400 hover:text-slate-600'
                                }`}
                            >
                                {i}
                            </button>
                        ))}
                    </div>
                    <button 
                        disabled={page === meta.totalPage}
                        onClick={() => setPage(p => p + 1)}
                        className="flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-primary disabled:opacity-30 transition-colors"
                    >
                        NEXT
                        <ChevronRight size={14} />
                    </button>
                </div>
            )}
        </div>
    );
}
