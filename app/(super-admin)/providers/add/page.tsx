"use client";

import { useRef, useState } from "react";
import { Check, ChevronDown, Pencil, Loader2, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import ImageIcon from "@/app/assets/ImageIcon.png";
import ImageIcon2 from "@/app/assets/ImageIcon2.png";
import { useAddProviderMutation } from "@/lib/features/super-admin/provider/providerAPI";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

const INITIAL_FORM = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    bio: "",
    city: "",
    serviceLocation: "",
    yearOfExprience: "",
    nidNumber: "",
};

export default function AddProviderPage() {
    const router = useRouter();
    const [addProvider, { isLoading }] = useAddProviderMutation();

    const [step, setStep] = useState(1);
    const [isCompleted, setIsCompleted] = useState(false);
    const [form, setForm] = useState(INITIAL_FORM);
    const [showPassword, setShowPassword] = useState(false);

    /* ── Avatar ── */
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [logo, setLogo] = useState<string | null>(null);

    /* ── NID Images ── */
    const idFrontFileInputRef = useRef<HTMLInputElement | null>(null);
    const [nidFrontFile, setNidFrontFile] = useState<File | null>(null);
    const [idFrontImage, setIdFrontImage] = useState<string | null>(null);
    const [idFrontFileName, setIdFrontFileName] = useState("No File Chosen");

    const idBackFileInputRef = useRef<HTMLInputElement | null>(null);
    const [nidBackFile, setNidBackFile] = useState<File | null>(null);
    const [idBackImage, setIdBackImage] = useState<string | null>(null);
    const [idBackFileName, setIdBackFileName] = useState("No File Chosen");

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

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
        setAvatarFile(file);
        setLogo(URL.createObjectURL(file));
        e.target.value = "";
    };

    const handleIdFrontChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setNidFrontFile(file);
        setIdFrontImage(URL.createObjectURL(file));
        setIdFrontFileName(file.name);
        e.target.value = "";
    };

    const handleIdBackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setNidBackFile(file);
        setIdBackImage(URL.createObjectURL(file));
        setIdBackFileName(file.name);
        e.target.value = "";
    };

    const handleReset = () => {
        setForm(INITIAL_FORM);
        setAvatarFile(null);
        setLogo(null);
        setNidFrontFile(null);
        setIdFrontImage(null);
        setIdFrontFileName("No File Chosen");
        setNidBackFile(null);
        setIdBackImage(null);
        setIdBackFileName("No File Chosen");
        setIsCompleted(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const requiredFields = [
            "firstName", "lastName", "email", "phone", "password",
            "bio", "city", "serviceLocation", "yearOfExprience", "nidNumber",
        ] as const;

        const missing = requiredFields.filter((k) => !form[k].trim());
        if (missing.length) {
            Swal.fire({
                icon: "warning",
                title: "Required Fields Missing",
                text: "Please fill in all fields before submitting.",
            });
            return;
        }
        if (!avatarFile) {
            Swal.fire({ icon: "warning", title: "Profile Photo Required", text: "Please upload a profile photo." });
            return;
        }
        if (!nidFrontFile) {
            Swal.fire({ icon: "warning", title: "NID Front Required", text: "Please upload the NID front side image." });
            return;
        }
        if (!nidBackFile) {
            Swal.fire({ icon: "warning", title: "NID Back Required", text: "Please upload the NID back side image." });
            return;
        }

        try {
            await addProvider({ 
                ...form, 
                avatar: avatarFile!, 
                nidImage: nidFrontFile!, 
                nidBackImage: nidBackFile! 
            }).unwrap();
            setIsCompleted(true);
            Swal.fire({
                icon: "success",
                title: "Provider Added",
                text: "The new provider has been successfully created.",
                timer: 2000,
                showConfirmButton: false,
            });
            handleReset();
            router.push("/providers");
        } catch (err: any) {
            Swal.fire({
                icon: "error",
                title: "Creation Failed",
                text: err?.data?.message || "Something went wrong while creating the provider.",
            });
        }
    };

    const inputCls =
        "w-full px-4 py-2.5 text-black border border-slate-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500";

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Add new Provider</h2>
                <p className="text-sm text-slate-500 mt-1">View and manage all registered providers</p>
            </div>

            <form onSubmit={handleSubmit}>
                {/* ── Card 1: General Information + Company Logo ── */}
                <div className="bg-white border border-slate-300 p-[50px] rounded-lg">
                    {/* Progress Steps */}
                    <div className="flex flex-col md:flex-row items-center gap-4 mb-[26px]">
                        <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step === 1 ? "bg-primary text-white" : "bg-white border border-primary text-primary"}`}>
                                {isCompleted ? <Check size={16} /> : 1}
                            </div>
                            <span className="text-sm font-medium text-[#5E6472]">Basic info</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step === 2 ? "bg-primary text-white" : "bg-white border border-primary text-primary"}`}>
                                2
                            </div>
                            <span className="text-sm font-medium text-[#5E6472]">Identity Info</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-between space-y-8">
                        {/* Left Column – General Information */}
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-slate-900 mb-4">General Information</h3>
                            <div className="space-y-5">
                                {/* First Name */}
                                <div>
                                    <label className="block text-sm font-medium text-[#666666] mb-2">First Name</label>
                                    <input name="firstName" type="text" placeholder="Ex. John" className={inputCls} value={form.firstName} onChange={handleChange} />
                                </div>
                                {/* Last Name */}
                                <div>
                                    <label className="block text-sm font-medium text-[#666666] mb-2">Last Name</label>
                                    <input name="lastName" type="text" placeholder="Ex. Doe" className={inputCls} value={form.lastName} onChange={handleChange} />
                                </div>
                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-[#666666] mb-2">Email address</label>
                                    <input name="email" type="email" placeholder="john.doe@email.com" className={inputCls} value={form.email} onChange={handleChange} />
                                </div>
                                {/* Phone */}
                                <div>
                                    <label className="block text-sm font-medium text-[#666666] mb-2">Phone Number</label>
                                    <input name="phone" type="tel" placeholder="+880 1700 000000" className={inputCls} value={form.phone} onChange={handleChange} />
                                </div>
                                {/* Password */}
                                <div>
                                    <label className="block text-sm font-medium text-[#666666] mb-2">Password</label>
                                    <div className="relative">
                                        <input
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Min. 8 characters"
                                            className={`${inputCls} pr-10`}
                                            value={form.password}
                                            onChange={handleChange}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((v) => !v)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>
                                {/* Bio */}
                                <div>
                                    <label className="block text-sm font-medium text-[#666666] mb-2">Bio</label>
                                    <textarea
                                        name="bio"
                                        rows={3}
                                        placeholder="Short professional description…"
                                        className={`${inputCls} resize-none`}
                                        value={form.bio}
                                        onChange={handleChange}
                                    />
                                </div>
                                {/* City */}
                                <div>
                                    <label className="block text-sm font-medium text-[#666666] mb-2">City</label>
                                    <input name="city" type="text" placeholder="Ex. Dhaka" className={inputCls} value={form.city} onChange={handleChange} />
                                </div>
                                {/* Service Location */}
                                <div>
                                    <label className="block text-sm font-medium text-[#666666] mb-2">Service Location</label>
                                    <input name="serviceLocation" type="text" placeholder="Ex. Dhaka City" className={inputCls} value={form.serviceLocation} onChange={handleChange} />
                                </div>
                                {/* Years of Experience */}
                                <div>
                                    <label className="block text-sm font-medium text-[#666666] mb-2">Years of Experience</label>
                                    <input name="yearOfExprience" type="text" placeholder="Ex. 3 years" className={inputCls} value={form.yearOfExprience} onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                        {/* Right Column – Company Logo */}
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 text-center">Profile Photo</h3>
                            <div className="mt-[25px]">
                                <div className="flex flex-col items-center justify-center text-center">
                                    <div className="relative w-32 h-32 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                                        {/* Preview / Placeholder */}
                                        {logo ? (
                                            <img src={logo} alt="Profile Photo" className="w-full h-full object-cover rounded-lg" />
                                        ) : (
                                            <Image src={ImageIcon2} alt="" />
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
                                            className="absolute -bottom-3 -right-3 w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full hover:opacity-90 transition-colors"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p className="text-sm xl:text-base text-[#5E6472] opacity-[0.75]">Image format - jpg, png, jpeg</p>
                                    <p className="text-sm xl:text-base text-[#5E6472] opacity-[0.75]">Image Size - maximum size 2 MB</p>
                                    <p className="text-sm xl:text-base text-[#5E6472] opacity-[0.75]">Image Ratio - 1:1</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Card 2: Identity Verification ── */}
                <div className="bg-white border border-slate-300 p-[50px] rounded-lg w-[100%] xl:w-[50%] mt-6">
                    <div className="justify-between space-y-8">
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">Identity Verification</h3>
                        <div className="space-y-6">
                            {/* NID Number */}
                            <div>
                                <label className="block text-sm font-medium text-[#666666] mb-2">NID Number</label>
                                <input
                                    name="nidNumber"
                                    type="text"
                                    placeholder="Ex. 1234567890"
                                    className={inputCls}
                                    value={form.nidNumber}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* NID Front Image */}
                                <div>
                                    <label className="block text-sm font-medium text-[#666666] mb-2">Front Side Image</label>
                                    <div className="border-2 border-slate-300 rounded-sm p-5 w-full pb-2">
                                        <div className="flex flex-col gap-3">
                                            <div className="w-[100px] h-[100px] bg-slate-100 rounded-sm flex items-center justify-center overflow-hidden">
                                                {idFrontImage ? (
                                                    <img src={idFrontImage} alt="ID Front Preview" className="w-full h-full object-cover" />
                                                ) : (
                                                    <Image src={ImageIcon} alt="" />
                                                )}
                                                <input
                                                    type="file"
                                                    accept="image/png, image/jpeg, image/jpg"
                                                    ref={idFrontFileInputRef}
                                                    onChange={handleIdFrontChange}
                                                    className="hidden"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-xs text-[#666666]">Square image &lt; 2MB</p>
                                                <div className="py-2 flex gap-4 items-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => idFrontFileInputRef.current?.click()}
                                                        className="px-4 py-1.5 bg-white border border-slate-800 rounded-sm text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                                                    >
                                                        Choose Front
                                                    </button>
                                                    <p className="text-xs text-slate-400 truncate max-w-[100px]">{idFrontFileName}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* NID Back Image */}
                                <div>
                                    <label className="block text-sm font-medium text-[#666666] mb-2">Back Side Image</label>
                                    <div className="border-2 border-slate-300 rounded-sm p-5 w-full pb-2">
                                        <div className="flex flex-col gap-3">
                                            <div className="w-[100px] h-[100px] bg-slate-100 rounded-sm flex items-center justify-center overflow-hidden">
                                                {idBackImage ? (
                                                    <img src={idBackImage} alt="ID Back Preview" className="w-full h-full object-cover" />
                                                ) : (
                                                    <Image src={ImageIcon} alt="" />
                                                )}
                                                <input
                                                    type="file"
                                                    accept="image/png, image/jpeg, image/jpg"
                                                    ref={idBackFileInputRef}
                                                    onChange={handleIdBackChange}
                                                    className="hidden"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-xs text-[#666666]">Square image &lt; 2MB</p>
                                                <div className="py-2 flex gap-4 items-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => idBackFileInputRef.current?.click()}
                                                        className="px-4 py-1.5 bg-white border border-slate-800 rounded-sm text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                                                    >
                                                        Choose Back
                                                    </button>
                                                    <p className="text-xs text-slate-400 truncate max-w-[100px]">{idBackFileName}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Action Buttons ── */}
                <div className="flex md:justify-start justify-center items-center gap-3 mt-8">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex items-center gap-2 px-10 md:px-20 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {isLoading ? "Submitting…" : "Submit"}
                    </button>
                    <button
                        type="button"
                        onClick={handleReset}
                        disabled={isLoading}
                        className="px-10 md:px-20 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-60"
                    >
                        Reset
                    </button>
                </div>
            </form>
        </div>
    );
}
