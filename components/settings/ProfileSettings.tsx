"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import ProfileHeader from "@/components/profile/ProfileHeader";
import PersonalDetailsForm from "@/components/profile/PersonalDetailsForm";
import SecurityForm from "@/components/profile/SecurityForm";
import { useUpdateProfileMutation, useChangePasswordMutation, useGetMeQuery, useUpdateAvatarMutation } from "@/lib/features/auth/authApi";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/lib/hooks";
import { updateUser } from "@/lib/features/auth/authSlice";

export default function SuperAdminProfile() {
  const dispatch = useAppDispatch();
  const { data: profileResponse, isLoading: isFetchingProfile } = useGetMeQuery();
  console.log("Profile Data: ", profileResponse);
  const [updateProfile] = useUpdateProfileMutation();
  const [updateAvatar] = useUpdateAvatarMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();

  const profile = (profileResponse?.data as any)?.user || profileResponse?.data;
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeMenu, setActiveMenu] = useState("edit-profile");

  const handleProfileUpdate = async (data: any) => {
    setIsUpdating(true);
    try {
      // The API only supports updating one field at a time
      // We check which fields have changed and update them sequentially
      const fieldsToUpdate = [];
      if (data.firstName !== profile?.firstName)
        fieldsToUpdate.push({ fildName: "firstName", value: data.firstName });
      if (data.lastName !== profile?.lastName)
        fieldsToUpdate.push({ fildName: "lastName", value: data.lastName });
      if (data.phone && data.phone !== profile?.phone)
        fieldsToUpdate.push({ fildName: "phone", value: data.phone });

      if (fieldsToUpdate.length === 0) {
        Swal.fire({
          icon: "info",
          title: "No Changes",
          text: "No profile information has been changed.",
          confirmButtonColor: "#4F46E5",
        });
        setIsUpdating(false);
        return;
      }

      for (const field of fieldsToUpdate) {
        await updateProfile(field).unwrap();
        dispatch(updateUser({ [field.fildName]: field.value }));
      }

      Swal.fire({
        icon: "success",
        title: "Profile Updated",
        text: "Your profile information has been updated successfully.",
        confirmButtonColor: "#4F46E5",
      });
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.data?.message || "Something went wrong while updating your profile.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordChange = async (data: any) => {
    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }).unwrap();

      Swal.fire({
        icon: "success",
        title: "Password Changed",
        text: "Your password has been updated successfully.",
        confirmButtonColor: "#4F46E5",
      });
      return true;
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Change Failed",
        text: error.data?.message || "Something went wrong while changing your password.",
      });
      return false;
    }
  };

  const handleAvatarChange = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const result = await updateAvatar(formData).unwrap();

      const newAvatar = result?.data?.avatar || result?.data?.user?.avatar || (typeof result?.data === 'string' ? result.data : null);

      if (newAvatar) {
        dispatch(updateUser({ avatar: newAvatar }));
      }

      Swal.fire({
        icon: "success",
        title: "Avatar Updated",
        text: "Your profile picture has been updated successfully.",
        confirmButtonColor: "#4F46E5",
      });
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: error.data?.message || "Something went wrong while updating your avatar.",
      });
    }
  };

  if (isFetchingProfile) {
    return (
      <div className="max-w-5xl mx-auto space-y-8 p-6 animate-pulse">
        <div className="h-8 w-48 bg-slate-100 rounded" />
        <div className="h-40 w-full bg-slate-100 rounded-xl" />
        <div className="h-64 w-full bg-slate-100 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-180px)]">
      {/* Left Sidebar Menu - Horizontal on mobile, vertical on desktop */}
      <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible w-full lg:w-[240px] shrink-0 space-x-2 lg:space-x-0 lg:space-y-1 pb-2 lg:pb-0 scrollbar-hide">
        <button
          onClick={() => setActiveMenu("edit-profile")}
          className={`whitespace-nowrap px-4 py-2.5 lg:py-3 rounded-lg text-sm font-semibold transition-colors ${activeMenu === "edit-profile"
            ? "bg-blue-50 text-blue-600"
            : "text-slate-600 hover:bg-slate-50"
            }`}
        >
          Edit Profile
        </button>
        <button
          onClick={() => setActiveMenu("security")}
          className={`whitespace-nowrap px-4 py-2.5 lg:py-3 rounded-lg text-sm font-semibold transition-colors ${activeMenu === "security"
            ? "bg-blue-50 text-blue-600"
            : "text-slate-600 hover:bg-slate-50"
            }`}
        >
          Security
        </button>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-100 p-4 sm:p-8">
        {activeMenu === "edit-profile" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Edit Profile</h2>
              <p className="text-sm text-slate-500 mt-1">Manage your personal information</p>
            </div>

            <ProfileHeader user={profile || {}} onAvatarChange={handleAvatarChange} />

            <PersonalDetailsForm
              initialData={{
                firstName: profile?.firstName || "",
                lastName: profile?.lastName || "",
                email: profile?.email || "",
                phone: profile?.phone || "",
              }}
              onSubmit={handleProfileUpdate}
              isLoading={isUpdating}
            />
          </div>
        )}

        {activeMenu === "security" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Security Settings</h2>
              <p className="text-sm text-slate-500 mt-1">Update your password to keep your account secure</p>
            </div>

            <SecurityForm
              onSubmit={handlePasswordChange}
              isLoading={isChangingPassword}
            />
          </div>
        )}
      </div>
    </div>
  );
}
