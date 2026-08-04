export default function Footer() {
    return (
        <footer className=" py-4 px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-sm text-slate-500">
                    © {new Date().getFullYear()} KAAJ BD. All rights reserved.
                </p>
                <div className="flex items-center gap-6">
                    <a href="#" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
                        Privacy Policy
                    </a>
                    <a href="#" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
                        Terms of Service
                    </a>
                    <a href="#" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
                        Contact
                    </a>
                </div>
            </div>
        </footer>
    );
}
