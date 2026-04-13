"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/hooks";
import { setCredentials } from "@/lib/features/auth/authSlice";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLoginMutation } from "@/lib/features/auth/authApi";
import Swal from 'sweetalert2'
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),

  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
    // .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    // .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    // .regex(/[0-9]/, "Password must contain at least one number")
    // .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
});

type LoginFormData = z.infer<typeof loginSchema>;
export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
  try {
    const res = await login(data).unwrap();
    console.log(res);

    dispatch(setCredentials(res.data)); // save to redux + localStorage

    Swal.fire({
      icon: "success",
      title: "Login successful",
      showConfirmButton: false,
      timer: 1500,
    });
    
    // ✅ Redirect immediately (BEST UX)
    if (res.data.user.role === "SUPER_ADMIN") {
      router.push("/dashboard");
    } else if (res.data.user.role === "SUB_ADMIN" || res.data.user.role === "ADMIN") {
      router.push("/sub-dashboard");
    } else {
      router.push("/dashboard");
    }

  } catch (err: any) {
    const errorMessage = err?.data?.message || "Invalid credentials or server error";
    console.error("Login Error:", errorMessage);
    Swal.fire({
      icon: "error",
      title: "Login failed",
      text: errorMessage,
      showConfirmButton: false,
      timer: 1500,
    });
  }
};


  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative">

      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Sign in to manage your organization
          </h1>
          <p className="text-slate-500 text-sm">
            Welcome back! Please enter your details.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
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

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-semibold text-slate-900 block"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                id="password"
                placeholder="Enter your password"
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
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>



          <div className="flex items-center justify-between text-xs -mt-2">
            <Link
              href="#"
              className="text-orange-500 font-medium hover:underline flex items-center gap-1"
            >
              <span className="border border-orange-500 rounded-full w-3 h-3 flex items-center justify-center text-[8px] font-bold">?</span> Having trouble logging in?
            </Link>
            <Link
              href="#"
              className="text-blue-600 font-medium hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
              {error.message}
            </div>
          )} */}

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
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </button>



        </form>
      </div>

      {/* Footer */}
            <div className="w-full flex px-6 py-4 border-t border-[#F1F5F9] justify-between  absolute bottom-2">
                <p className="text-sm font-semibold text-slate-600">All Right reserved by@2026</p>
                <p className="text-sm font-medium text-blue-800">Software version 3.3</p>
            </div>

      {/* <div className="flex justify-between w-full max-w-7xl absolute bottom-6 px-6 text-xs text-slate-800 font-medium">
        <div>All Right reserved by@2026</div>
        <div className="text-blue-600">Software version 3.3</div>
      </div> */}
    </main>
  );
}

