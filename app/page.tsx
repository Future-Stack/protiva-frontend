"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
export const users = [
  {
    id: 1,
    name: "Super Admin",
    email: "superadmin@example.com",
    password: "123456",
  },
  {
    id: 2,
    name: "Sub Admin",
    email: "subadmin@example.com",
    password: "123456",
  },
];
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find((user) => user.email === email && user.password === password);
    if (!user) {
      console.log("Invalid email or password");
      return;
    }
    if (user.email === "superadmin@example.com") {
      router.push("/dashboard");
    }
    if (user.email === "subadmin@example.com") {
      router.push("/sub-dashboard");
    }
    console.log("Login successful!", user);
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

        <form className="space-y-4" onSubmit={handleLogin}>
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-semibold text-slate-900 block"
            >
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2.5 text-sm text-slate-900 rounded-lg border border-[#63636380] outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary/80 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-sm"
          >
            Sign in
          </button>


        </form>
      </div>

      <div className="flex justify-between w-full max-w-7xl absolute bottom-6 px-6 text-xs text-slate-800 font-medium">
        <div>All Right reserved by@2026</div>
        <div className="text-blue-600">Software version 3.3</div>
      </div>
    </main>
  );
}
