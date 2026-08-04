import { useForm } from "react-hook-form";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";

interface SecurityFormProps {
  onSubmit: (data: any) => Promise<boolean> | boolean; 
  isLoading?: boolean;
}

export default function SecurityForm({ onSubmit, isLoading }: SecurityFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid }
  } = useForm({
    mode: "onChange"
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const newPassword = watch("newPassword");
  const currentPassword = watch("currentPassword");

  const onFormSubmit = async (data: any) => {
    const cleanedData = {
      currentPassword: data.currentPassword.trim(),
      newPassword: data.newPassword.trim(),
      confirmPassword: data.confirmPassword.trim(),
    };

    const success = await onSubmit(cleanedData);
    if (success) reset();
  };

  return (
    <div className="bg-white rounded-[10px] border border-slate-100 p-6 md:p-8">
      <div className="flex items-center gap-2 mb-6">
        <Lock className="text-slate-900" size={24} />
        <h2 className="text-xl font-bold text-slate-900">
          Security & Password
        </h2>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">

          {/* Current Password */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">
              Current Password
            </label>

            <div className="relative">
              <input
                {...register("currentPassword", {
                  required: "Current password is required"
                })}
                type={showCurrentPassword ? "text" : "password"}
                autoComplete="current-password"
                className="w-full px-4 py-2.5 pr-10 bg-slate-50 text-slate-700 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                placeholder="••••••••"
              />

              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {errors.currentPassword && (
              <p className="text-red-500 text-xs px-1">
                {errors.currentPassword.message as string}
              </p>
            )}
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">
              New Password
            </label>

            <div className="relative">
              <input
                {...register("newPassword", {
                  required: "New password is required",
                  validate: (value) =>
                    value !== currentPassword ||
                    "New password must be different from current password",
                  pattern: {
                    value:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    message:
                      "Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
                  }
                })}
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                className="w-full px-4 py-2.5 pr-10 bg-slate-50 text-slate-700 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                placeholder="••••••••"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {errors.newPassword && (
              <p className="text-red-500 text-xs px-1">
                {errors.newPassword.message as string}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">
              Confirm New Password
            </label>

            <div className="relative">
              <input
                {...register("confirmPassword", {
                  required: "Please confirm your new password",
                  validate: (value) =>
                    value === newPassword || "Passwords do not match"
                })}
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                className="w-full px-4 py-2.5 pr-10 bg-slate-50 text-slate-700 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                placeholder="••••••••"
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {errors.confirmPassword && (
              <p className="text-red-500 text-xs px-1">
                {errors.confirmPassword.message as string}
              </p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isLoading || !isValid}
            className={`px-8 py-2.5 bg-[#4F46E5] text-white font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-md ${isLoading || !isValid
                ? "opacity-70 cursor-not-allowed"
                : ""
              }`}
          >
            {isLoading ? "Updating Password..." : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
}