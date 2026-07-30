"use client";

import { Camera } from "lucide-react";
import { useState, useEffect } from "react";

interface ProfileHeaderProps {
  user: {
    firstName?: string;
    lastName?: string;
    name?: string;
    email?: string;
    role?: string;
    avatar?: string | null;
  };
  onAvatarChange?: (file: File) => void;
}

export default function ProfileHeader({ user, onAvatarChange }: ProfileHeaderProps) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [user?.avatar]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onAvatarChange?.(e.target.files[0]);
    }
  };

  const getInitials = (userObj: any) => {
    if (!userObj) return "U";
    const firstName = userObj.firstName?.trim() || "";
    const lastName = userObj.lastName?.trim() || "";

    if (firstName || lastName) {
      const f = firstName ? firstName[0].toUpperCase() : "";
      const l = lastName ? lastName[0].toUpperCase() : "";
      return `${f}${l}` || "U";
    }

    if (userObj.name?.trim()) {
      const parts = userObj.name.trim().split(/\s+/);
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
      }
      return userObj.name.trim().slice(0, 2).toUpperCase();
    }

    if (userObj.email?.trim()) {
      return userObj.email.trim().slice(0, 2).toUpperCase();
    }

    return "U";
  };

  return (
    <div className="bg-[#F8FAFC] rounded-[10px] border border-slate-100 p-6 md:p-8">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="relative group">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-md bg-slate-100">
            {user?.avatar && !imgError ? (
              <img
                src={user.avatar}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full bg-primary flex items-center justify-center">
                <span className="text-white text-2xl md:text-4xl font-bold">
                  {getInitials(user)}
                </span>
              </div>
            )}
          </div>
          <label className="absolute bottom-1 right-1 w-8 h-8 md:w-10 md:h-10 bg-[#4F46E5] text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-indigo-700 transition-colors shadow-lg border-2 border-white">
            <Camera size={18} />
            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
          </label>
        </div>

        <div className="text-center md:text-left">
          <h1 className="text-xl md:text-2xl font-bold text-slate-900">
            {user?.firstName} {user?.lastName}
          </h1>
          <p className="text-slate-500 font-medium mt-1">{user?.email}</p>
          {user?.role && (
            <div className="mt-3 inline-flex items-center px-3 py-1 bg-indigo-50 text-indigo-700 text-sm font-semibold rounded-full capitalize">
              {user.role.replace("_", " ")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
