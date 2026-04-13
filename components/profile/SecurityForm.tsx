import { useForm } from "react-hook-form";
import { Lock } from "lucide-react";

interface SecurityFormProps {
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export default function SecurityForm({ onSubmit, isLoading }: SecurityFormProps) {
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();
  const newPassword = watch("newPassword");

  const onFormSubmit = (data: any) => {
    onSubmit(data);
    reset();
  };

  return (
    <div className="bg-white rounded-[10px] border border-slate-100 p-6 md:p-8">
      <div className="flex items-center gap-2 mb-6">
        <Lock className="text-slate-900" size={24} />
        <h2 className="text-xl font-bold text-slate-900">Security & Password</h2>
      </div>
      
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Current Password</label>
            <input
              {...register("currentPassword", { required: "Current password is required" })}
              type="password"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
              placeholder="••••••••"
            />
            {errors.currentPassword && <p className="text-red-500 text-xs px-1">{errors.currentPassword.message as string}</p>}
          </div>

          <div className="hidden md:block"></div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">New Password</label>
            <input
              {...register("newPassword", { 
                required: "New password is required",
                minLength: { value: 6, message: "Password must be at least 6 characters" }
              })}
              type="password"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
              placeholder="••••••••"
            />
            {errors.newPassword && <p className="text-red-500 text-xs px-1">{errors.newPassword.message as string}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Confirm New Password</label>
            <input
              {...register("confirmPassword", { 
                required: "Please confirm your new password",
                validate: (value) => value === newPassword || "Passwords do not match"
              })}
              type="password"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
              placeholder="••••••••"
            />
            {errors.confirmPassword && <p className="text-red-500 text-xs px-1">{errors.confirmPassword.message as string}</p>}
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className={`px-8 py-2.5 bg-[#4F46E5] text-white font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-md ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Updating Password...' : 'Update Password'}
          </button>
        </div>
      </form>
    </div>
  );
}
