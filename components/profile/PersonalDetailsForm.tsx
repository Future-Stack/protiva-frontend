import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useAppSelector } from "@/lib/hooks";
import { RootState } from "@/lib/store";

interface PersonalDetailsFormProps {
  initialData: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export default function PersonalDetailsForm({ initialData, onSubmit, isLoading }: PersonalDetailsFormProps) {
  const user = useAppSelector((state: RootState) => state.auth.user);
  console.log(user);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: initialData
  });

  useEffect(() => {
    reset(initialData);
  }, [initialData, reset]);

  return (
    <div className="bg-white rounded-[10px] border border-slate-100 p-6 md:p-8">
      <h2 className="text-xl font-bold text-slate-900 mb-6">Personal Information</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">First Name</label>
            <input
              {...register("firstName", { required: "First name is required" })}
              type="text"
              className="w-full px-4 py-2.5 bg-slate-50 text-black border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
              placeholder="Enter first name"
            />
            {errors.firstName && <p className="text-red-500 text-xs px-1">{errors.firstName.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Last Name</label>
            <input
              {...register("lastName", { required: "Last name is required" })}
              type="text"
              className="w-full px-4 py-2.5 bg-slate-50 text-black border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
              placeholder="Enter last name"
            />
            {errors.lastName && <p className="text-red-500 text-xs px-1">{errors.lastName.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Email Address</label>
            <input
              {...register("email", { 
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              })}
              type="email"
              className="w-full px-4 py-2.5 bg-slate-50 text-black border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
              placeholder="Enter email"
            />
            {errors.email && <p className="text-red-500 text-xs px-1">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Phone Number</label>
            <input
              {...register("phone")}
              type="tel"
              className="w-full px-4 py-2.5 bg-slate-50 text-black border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
              placeholder="Enter phone number"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className={`px-8 py-2.5 bg-[#4F46E5] text-white font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-md ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
