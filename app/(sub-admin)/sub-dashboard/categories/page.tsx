"use client";

import { useRef, useState } from "react";
import { Edit2, Trash2, ChevronLeft, ChevronRight, Upload, Pencil, PencilLine } from "lucide-react";
import ImageIcon2 from "@/app/assets/ImageIcon2.png"
import DeleteModal from "@/components/DeleteModal";

const CATEGORIES = [
    { id: "01", name: "Shifting", subCount: 10 },
    { id: "02", name: "Plumbing", subCount: 10 },
    { id: "03", name: "Handyman", subCount: 10 },
    { id: "04", name: "Shifting", subCount: 10 },
    { id: "05", name: "Shifting", subCount: 10 },
    { id: "06", name: "Shifting", subCount: 10 },
    { id: "07", name: "Shifting", subCount: 10 },
    { id: "08", name: "Shifting", subCount: 10 },
    { id: "09", name: "Shifting", subCount: 10 },
    { id: "10", name: "Shifting", subCount: 10 },
];

export default function CategoriesPage() {
    const [categories, setCategories] = useState(CATEGORIES);
    const [categoryName, setCategoryName] = useState("");
    const [subcategoryName, setSubcategoryName] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) return;
        if (file.size > 2 * 1024 * 1024) return;

        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = () => {
        if (!categoryName) return;

        if (editingId) {
            setCategories(categories.map(c =>
                c.id === editingId ? { ...c, name: categoryName } : c
            ));
            setEditingId(null);
        } else {
            const newCategory = {
                id: String(categories.length + 1).padStart(2, '0'),
                name: categoryName,
                subCount: subcategoryName ? 1 : 0
            };
            setCategories([...categories, newCategory]);
        }
        handleReset();
    };

    const handleReset = () => {
        setCategoryName("");
        setSubcategoryName("");
        setEditingId(null);
    };

    const handleEdit = (category: typeof CATEGORIES[0]) => {
        setCategoryName(category.name);
        setEditingId(category.id);
    };

    const handleDelete = (id: string) => {
        setItemToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (itemToDelete) {
            setCategories(categories.filter(c => c.id !== itemToDelete));
            setItemToDelete(null);
        }
        setIsDeleteModalOpen(false);
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

                    {/* Subcategory Name Input */}
                    <div>
                        <label className="block text-sm font-medium text-black mb-1">
                            Subcategory name
                        </label>
                        <input
                            type="text"
                            value={subcategoryName}
                            onChange={(e) => setSubcategoryName(e.target.value)}
                            className="w-full px-4 py-2.5 text-black border border-[#66666659] rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter subcategory name"
                        />
                    </div>

                    {/* Upload Image */}
                    <div className="mt-6">
                        {/* <label className="block text-sm font-medium text-slate-700 mb-2">
                            Upload image
                        </label> */}
                        {/* <div className="w-fit border-2 border-dashed border-slate-300 rounded-lg px-10 py-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                            <div className="flex flex-col items-center gap-2">
                                <h6 className="text-base text-bold text-[#18181A] mb-2">Upload Image</h6>
                                <div className="">
                                    <div className="flex flex-col items-center justify-center text-center">
                                        <div className="relative w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                                            <Upload className="w-8 h-8 text-slate-400" />
                                            <img src={ImageIcon2.src} alt="" />
                                            <button className="absolute -bottom-5 -right-2 w-4 h-4 flex items-center justify-center  bg-[#4153B395] hover:bg-primary/80 text-white rounded-full transition-colors mb-3">
                                                <Pencil className="w-2 h-2" />
                                            </button>
                                        </div>

                                        <p className="text-sm xl:text-base  text-[#5E6472] opacity-[0.75]">Image format - jpg,png, jpeg</p>
                                        <p className="text-sm xl:text-base text-[#5E6472] opacity-[0.75]">Image Size - maximum size 2 MB Image Ratio - 1:1</p>
                                    </div>
                                </div>
                            </div>

                        </div> */}

                         {/* Hidden Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Upload Box */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="w-fit border-2 border-dashed border-slate-300 rounded-lg
                   px-10 py-6 text-center hover:border-blue-400
                   transition-colors cursor-pointer"
      >
        <div className="flex flex-col items-center gap-2">
          <h6 className="text-base font-semibold text-[#18181A] mb-2">
            Upload Image
          </h6>

          <div className="flex flex-col items-center justify-center text-center">
            <div className="relative w-16 h-16 bg-slate-100 rounded-lg
                            flex items-center justify-center mb-4">

              {preview ? (
                <img
                  src={preview}
                  alt="preview"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <>
                  <Upload className="w-8 h-8 text-slate-400" />
                  <img src={ImageIcon2.src} alt="" />
                </>
              )}

              {/* Pencil */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="absolute -bottom-5 -right-2 w-4 h-4
                           flex items-center justify-center
                           bg-[#4153B395] hover:bg-primary/80
                           text-white rounded-full transition-colors mb-3"
              >
                <Pencil className="w-2 h-2" />
              </button>
            </div>

            <p className="text-sm xl:text-base text-[#5E6472] opacity-75">
              Image format - jpg, png, jpeg
            </p>
            <p className="text-sm xl:text-base text-[#5E6472] opacity-75">
              Image Size - maximum size 2 MB • Image Ratio - 1:1
            </p>
          </div>
        </div>
      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mt-10">
                        <button
                            onClick={handleSubmit}
                            className="px-20 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                            {editingId ? "Update" : "Submit"}
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
                                {categories.map((category) => (
                                    <tr key={category.id} className="border-t border-slate-300 hover:bg-slate-50/50 transition-colors">
                                        <td className="px-4 py-4 text-sm text-[#2C2C2C] border-r border-slate-300 text-center ">{category.id}</td>
                                        <td className="px-4 py-4 text-sm text-[#0F172A] border-r border-slate-300 text-center ">{category.name}</td>
                                        <td className="px-4 py-4 text-sm text-[#2C2C2C] border-r border-slate-300 text-center ">{category.subCount}</td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2 justify-center">
                                                <button
                                                    onClick={() => handleEdit(category)}
                                                    className="p-2 text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
                                                    <PencilLine size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(category.id)}
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
                    <div className=" py-4 border-t border-slate-300 flex items-center justify-center md:justify-end gap-1 md:gap-3">
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
            </div>

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Category"
                description="Are you sure you want to delete this category? This action cannot be undone."
            />
        </div>
    );
}
