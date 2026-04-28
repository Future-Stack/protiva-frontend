"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForgotPasswordMutation } from "@/lib/features/auth/authApi";
import Swal from 'sweetalert2';

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      const res = await forgotPassword({ email: data.email }).unwrap();
      
      Swal.fire({
        icon: "success",
        title: "OTP Sent",
        text: res.data?.message || "Please check your email for the OTP.",
        confirmButtonColor: "#4F46E5",
      });
      
      router.push(`/reset-password?email=${encodeURIComponent(data.email)}`);
    } catch (err: any) {
      const errorMessage = err?.data?.message || "Failed to send reset link.";
      Swal.fire({
        icon: "error",
        title: "Request Failed",
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
            Forgot Password?
          </h1>
          <p className="text-slate-500 text-sm">
            Enter your email address to receive a password reset OTP.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-semibold text-slate-900 block"
            >
              Email address
            </label>
            <input
              type="email"
              {...register("email")}
              id="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2.5 text-sm text-slate-900 rounded-lg border border-[#63636380] outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/80 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending OTP...
              </>
            ) : (
              "Send Reset OTP"
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
