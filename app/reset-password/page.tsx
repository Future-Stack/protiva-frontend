"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useResetPasswordMutation } from "@/lib/features/auth/authApi";
import { Eye, EyeOff } from "lucide-react";
import Swal from 'sweetalert2';

const resetPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  otp: z.string().min(1, "OTP is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password")
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailQuery = searchParams.get("email");
  
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: emailQuery || "",
    }
  });

  useEffect(() => {
    if (emailQuery) {
      setValue("email", emailQuery);
    }
  }, [emailQuery, setValue]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      const res = await resetPassword({
        email: data.email,
        otp: data.otp,
        newPassword: data.newPassword,
      }).unwrap();
      
      Swal.fire({
        icon: "success",
        title: "Password Reset",
        text: res.data?.message || "Password reset successfully. You can now log in.",
        confirmButtonColor: "#4F46E5",
      });
      
      router.push("/");
    } catch (err: any) {
      const errorMessage = err?.data?.message || "Failed to reset password. Please check your OTP.";
      Swal.fire({
        icon: "error",
        title: "Reset Failed",
        text: errorMessage,
        confirmButtonColor: "#4F46E5",
      });
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Reset Password
          </h1>
          <p className="text-slate-500 text-sm">
            Enter the OTP sent to your email and your new password.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-semibold text-slate-900 block">
              Email address
            </label>
            <input
              type="email"
              {...register("email")}
              id="email"
              readOnly={!!emailQuery}
              placeholder="Enter your email"
              className={`w-full px-4 py-2.5 text-sm text-slate-900 rounded-lg border border-[#63636380] outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors ${emailQuery ? 'bg-slate-100' : ''}`}
            />
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="otp" className="text-sm font-semibold text-slate-900 block">
              OTP
            </label>
            <input
              type="text"
              {...register("otp")}
              id="otp"
              placeholder="Enter 6-digit OTP"
              className="w-full px-4 py-2.5 text-sm text-slate-900 rounded-lg border border-[#63636380] outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
            {errors.otp && <p className="text-xs text-red-500">{errors.otp.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="newPassword" className="text-sm font-semibold text-slate-900 block">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("newPassword")}
                id="newPassword"
                placeholder="Enter new password"
                className="w-full px-4 py-2.5 text-sm text-slate-900 rounded-lg border border-[#63636380] outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.newPassword && <p className="text-xs text-red-500">{errors.newPassword.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-semibold text-slate-900 block">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword")}
                id="confirmPassword"
                placeholder="Confirm new password"
                className="w-full px-4 py-2.5 text-sm text-slate-900 rounded-lg border border-[#63636380] outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors pr-12"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/80 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Resetting Password...
              </>
            ) : (
              "Reset Password"
            )}
          </button>
          
          <div className="text-center mt-4">
            <Link href="/" className="text-sm font-semibold text-blue-600 hover:underline">
              Back to Login
            </Link>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="w-full flex px-6 py-4 border-t border-[#F1F5F9] justify-between absolute bottom-2">
          <p className="text-sm font-semibold text-slate-600">All Right reserved by@2026</p>
          <p className="text-sm font-medium text-blue-800">Software version 3.3</p>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
