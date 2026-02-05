import Link from "next/link";
import { ShieldCheck, UserCog, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl w-full text-center space-y-12">
        <div className="space-y-4">
          <h1 className="text-6xl font-black text-slate-900 tracking-tight">
            KAAJ <span className="text-blue-600">BD</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            A premium administration suite for efficient management and oversight.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          <Link href="/dashboard" className="group">
            <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col items-center text-center space-y-6">
              <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                <ShieldCheck size={40} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Super Admin</h3>
                <p className="text-slate-500">Access full system controls, user management, and detailed analytics.</p>
              </div>
              <div className="flex items-center text-blue-600 font-bold group-hover:translate-x-2 transition-transform">
                Enter Panel <ArrowRight size={20} className="ml-2" />
              </div>
            </div>
          </Link>

          <Link href="/sub-dashboard" className="group">
            <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col items-center text-center space-y-6">
              <div className="w-20 h-20 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                <UserCog size={40} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">Sub Admin</h3>
                <p className="text-slate-500">Manage assigned tasks, track progress, and generate operational reports.</p>
              </div>
              <div className="flex items-center text-indigo-600 font-bold group-hover:translate-x-2 transition-transform">
                Enter Panel <ArrowRight size={20} className="ml-2" />
              </div>
            </div>
          </Link>
        </div>

        <div className="pt-12 text-slate-400 text-sm font-medium">
          © 2026 KAAJ BD Administration Suite. All rights reserved.
        </div>
      </div>
    </main>
  );
}
