import { Camera } from "lucide-react";

interface ProfileHeaderProps {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    avatar?: string | null;
  };
  onAvatarChange?: (file: File) => void;
}

export default function ProfileHeader({ user, onAvatarChange }: ProfileHeaderProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onAvatarChange?.(e.target.files[0]);
    }
  };

  return (
    <div className="bg-white rounded-[10px] border border-slate-100 p-6 md:p-8">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="relative group">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-md bg-slate-100">
            <img
              src={user.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + user.firstName}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <label className="absolute bottom-1 right-1 w-8 h-8 md:w-10 md:h-10 bg-[#4F46E5] text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-indigo-700 transition-colors shadow-lg border-2 border-white">
            <Camera size={18} />
            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
          </label>
        </div>

        <div className="text-center md:text-left">
          <h1 className="text-xl md:text-2xl font-bold text-slate-900">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-slate-500 font-medium mt-1">{user.email}</p>
          <div className="mt-3 inline-flex items-center px-3 py-1 bg-indigo-50 text-indigo-700 text-sm font-semibold rounded-full capitalize">
            {user.role.replace("_", " ")}
          </div>
        </div>
      </div>
    </div>
  );
}
