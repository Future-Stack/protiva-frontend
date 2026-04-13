"use client";

import ProfileHeader from "@/components/profile/ProfileHeader";
import PersonalDetailsForm from "@/components/profile/PersonalDetailsForm";
import SecurityForm from "@/components/profile/SecurityForm";
import { useUpdateProfileMutation, useChangePasswordMutation, useGetMeQuery } from "@/lib/features/auth/authApi";
import Swal from "sweetalert2";
import { useState } from "react";

export default function SubAdminProfile() {
  const { data: profileResponse, isLoading: isFetchingProfile } = useGetMeQuery();
  const [updateProfile] = useUpdateProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  
  const profile = profileResponse?.data?.user;
  const [isUpdating, setIsUpdating] = useState(false);

  const handleProfileUpdate = async (data: any) => {
    setIsUpdating(true);
    try {
      const fieldsToUpdate = [];
      if (data.firstName !== profile?.firstName) fieldsToUpdate.push({ fildName: "firstName", value: data.firstName });
      if (data.lastName !== profile?.lastName) fieldsToUpdate.push({ fildName: "lastName", value: data.lastName });
      if (data.phone && data.phone !== profile?.phone) fieldsToUpdate.push({ fildName: "phone", value: data.phone });

      for (const field of fieldsToUpdate) {
        await updateProfile(field).unwrap();
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
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Change Failed",
        text: error.data?.message || "Something went wrong while changing your password.",
      });
    }
  };

  const handleAvatarChange = async (file: File) => {
    Swal.fire({
      icon: "info",
      title: "Avatar Update",
      text: "Avatar update functionality is currently being reviewed for compatibility with the new API structure.",
    });
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
    <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
        <p className="text-slate-500">Manage your account settings and security preferences</p>
      </div>

      <ProfileHeader user={profile || {}} onAvatarChange={handleAvatarChange} />

      <div className="grid grid-cols-1 gap-8">
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

        <SecurityForm 
          onSubmit={handlePasswordChange}
          isLoading={isChangingPassword}
        />
      </div>
    </div>
  );
}
