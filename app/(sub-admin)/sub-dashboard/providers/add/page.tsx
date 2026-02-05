"use client";

import { useRef, useState } from "react";
import { Check, ChevronDown, Pencil, Upload } from "lucide-react";
import ImageIcon from "@/app/assets/ImageIcon.png"
import ImageIcon2 from "@/app/assets/ImageIcon2.png"

export default function AddProviderPage() {
    const [step, setStep] = useState(1);
    const [isCompleted, setIsCompleted] = useState(false);
const fileInputRef = useRef<HTMLInputElement | null>(null);
const [logo, setLogo] = useState<string | null>(null);
const idFileInputRef = useRef<HTMLInputElement | null>(null);
const [idImage, setIdImage] = useState<string | null>(null);
const [idFileName, setIdFileName] = useState("No File Chosen");


const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
    alert("Only JPG, PNG, JPEG allowed");
    return;
  }

  if (file.size > 2 * 1024 * 1024) {
    alert("Max file size is 2MB");
    return;
  }

  setLogo(URL.createObjectURL(file));
  e.target.value = "";
};

const handleIdImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
    alert("Only JPG, PNG, JPEG allowed");
    return;
  }

  if (file.size > 500 * 1024) {
    alert("Max file size is 500KB");
    return;
  }

  setIdImage(URL.createObjectURL(file));
  setIdFileName(file.name);
  e.target.value = "";
};


    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Add new Provider</h2>
                <p className="text-sm text-slate-500 mt-1">View and manage all registered providers</p>
            </div>

            {/* Main Card */}
            <div className="bg-white border border-slate-300 p-[50px] rounded-lg">
                {/* Progress Steps */}
                <div className="flex items-center gap-4 mb-[26px]">
                    <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step === 1 ? 'bg-primary text-white' : 'bg-white border border-primary text-primary'
                            }`}>
                            {isCompleted ? <Check size={16} /> : 1}
                        </div>
                        <span className="text-sm font-medium text-[#5E6472]">Basic info</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step === 2 ? 'bg-primary text-white ' : 'bg-white border border-primary text-primary'
                            }`}>
                            2
                        </div>
                        <span className="text-sm font-medium text-[#5E6472]">Set Business Plan</span>
                    </div>
                </div>

                <div className="gap-8">
                    {/* Left Column - Forms */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-between space-y-8">
                        {/* General Information */}
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-slate-900  mb-4">General Information</h3>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-[#666666] mb-2">Business name</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2.5 text-black border border-slate-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#666666] mb-2">User name</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2.5 text-black border border-slate-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#666666] mb-2">Email address</label>
                                    <input
                                        type="email"
                                        className="w-full px-4 py-2.5 text-black border border-slate-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#666666] mb-2">Areas</label>
                                    <div className="relative">
                                        <select className="w-full px-4 py-2.5 border text-black border-slate-300 appearance-none rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                                            <option value="">Select area</option>
                                            <option value="">Electrician</option>
                                            <option value="">Plumber</option>
                                            <option value="">Painter</option>
                                            <option value="">Carpenter</option>
                                            <option value="">AC Technician</option>
                                            <option value="">Appliance Repair</option>
                                            <option value="">Cleaning Services</option>
                                            <option value="">Pest Control</option>
                                            <option value="">Gardening Services</option>
                                            <option value="">Handyman Services</option>
                                        </select>
                                        <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#666666] mb-2">Rates</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2.5 text-black border border-slate-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                       
                    {/* Right Column - Company Logo */}
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 text-center">Company Logo</h3>
                        <div className="mt-[25px]">
                            <div className="flex flex-col items-center justify-center text-center">
                                <div className="relative w-32 h-32 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                                     {/* Preview / Placeholder */}
          {logo ? (
            <img
              src={logo}
              alt="Company Logo"
              className="w-full h-full object-cover"
            />
          ) : (
            // <Upload className="w-8 h-8 text-slate-400" />
            <img src={ImageIcon2.src} alt="" />

          )}

          {/* Hidden input */}
          <input
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Pencil button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-3 -right-3 w-8 h-8 flex items-center justify-center
              bg-primary text-white rounded-full hover:opacity-90 transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </button>
                                    {/* <Upload className="w-8 h-8 text-slate-400" />
                                    <img src={ImageIcon2.src} alt="" />
                                <button className="absolute -bottom-5 -right-5 w-8 h-8 flex items-center justify-center  bg-primary opacity-[0.95] text-white rounded-full hover:bg-primary transition-colors mb-3">
                                    <Pencil className="w-4 h-4" />
                                </button> */}
                                </div>
                                <p className="text-sm xl:text-base  text-[#5E6472] opacity-[0.75]">Image format - jpg,png, jpeg</p>
                                <p className="text-sm xl:text-base text-[#5E6472] opacity-[0.75]">Image Size - maximum size 2 MB</p>
                                <p className="text-sm xl:text-base text-[#5E6472] opacity-[0.75]">Image Ratio - 1:1</p>
                            </div>
                        </div>
                    </div>
                    </div>
                     

                </div>
            </div>
             <div className="bg-white border border-slate-300 p-[50px] rounded-lg w-[100%] xl:w-[50%] ">

                {/* Business Information */}
                        <div className=" justify-between space-y-8">
                            <h3 className="text-lg font-semibold text-slate-900 mb-4">Business Information</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#666666] mb-2">Select Identity Type</label>
                                    <div className="relative">
                                        <select className="w-full appearance-none px-4 py-2.5 text-black border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                                            <option value="">Select type</option>
                                            <option value="nid">NID</option>
                                            <option value="passport">Passport</option>
                                        </select>
                                        <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#666666] mb-2">Identity Number</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2.5 text-black border border-slate-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#666666] mb-2">Identification Image</label>
                                    {/* <div className="border-2 border-slate-300 rounded-sm p-5 w-fit pb-2">
                                        <div className="flex gap-5 ">
                                            <div className="w-[100px] h-[100px] bg-slate-100 rounded-sm flex items-center justify-center mb-3">
                                                <Upload className="w-6 h-6 text-slate-400" />
                                                <img src={ImageIcon.src} alt="" />

                                            </div>
                                            <div>
                                                <p className="text-sm text-[#000000]">Please upload square image less than 500kb</p>
                                                <div className="py-2.5 flex gap-[30px] items-center">
                                                    <button className="px-5 py-2 bg-white border border-slate-800 rounded-sm text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors mt-2">
                                                        Choose File
                                                    </button>
                                                    <p className="text-sm text-slate-400 mt-2">No File Chosen</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div> */}
                                    <div className="border-2 border-slate-300 rounded-sm p-5 w-fit pb-2">
  <div className="flex gap-5">
    <div className="w-[100px] h-[100px] bg-slate-100 rounded-sm flex items-center justify-center mb-3 overflow-hidden">
      
      {idImage ? (
        <img src={idImage} alt="ID Preview" className="w-full h-full object-cover" />
      ) : (
        // <Upload className="w-6 h-6 text-slate-400" />
                                                        <img src={ImageIcon.src} alt="" />

      )}

      {/* Hidden input */}
      <input
        type="file"
        accept="image/png, image/jpeg, image/jpg"
        ref={idFileInputRef}
        onChange={handleIdImageChange}
        className="hidden"
      />
    </div>

    <div>
      <p className="text-sm text-[#000000]">
        Please upload square image less than 500kb
      </p>

      <div className="py-2.5 flex gap-[30px] items-center">
        <button
          type="button"
          onClick={() => idFileInputRef.current?.click()}
          className="px-5 py-2 bg-white border border-slate-800 rounded-sm text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors mt-2"
        >
          Choose File
        </button>

        <p className="text-sm text-slate-400 mt-2">
          {idFileName}
        </p>
      </div>
    </div>
  </div>
</div>

                                </div>
                            </div>
                        </div>
                    </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 mt-8">
                    <button className=" px-20 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                        Submit
                    </button>
                    <button className="px-20 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                        Reset
                    </button>
                </div>
        </div>
    );
}
