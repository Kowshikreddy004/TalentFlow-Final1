import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

import { FakeLogin } from "../auth/FakeLogin";
import { useAuth } from "../../.././providers/AuthContext";

export function MainLayout({ children }: { children: React.ReactNode }) {
    const { role } = useAuth();
    return (
        <div className="min-h-screen flex flex-col">
            <header className="sticky top-0 z-10 border-b bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-500 text-white">
                <div className="container mx-auto px-4">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center gap-6">
                            <h1 className="text-xl md:text-2xl font-extrabold tracking-tight">TalentFlow</h1>
                            <nav className="flex items-center gap-2 text-sm">
                                <NavLink
                                    to="/jobs"
                                    className={({ isActive }) =>
                                        cn(
                                          "px-3 py-1.5 rounded-full transition-colors",
                                          isActive ? "bg-white text-indigo-600" : "hover:bg-white/10"
                                        )
                                    }
                                >
                                    Jobs
                                </NavLink>
                                <NavLink
                                    to="/candidates"
                                    className={({ isActive }) =>
                                        cn(
                                          "px-3 py-1.5 rounded-full transition-colors",
                                          isActive ? "bg-white text-indigo-600" : "hover:bg-white/10"
                                        )
                                    }
                                >
                                    Candidates
                                </NavLink>
                                <NavLink
                                    to="/dashboard"
                                    className={({ isActive }) =>
                                        cn(
                                          "px-3 py-1.5 rounded-full transition-colors",
                                          isActive ? "bg-white text-indigo-600" : "hover:bg-white/10"
                                        )
                                    }
                                >
                                    Dashboard
                                </NavLink>
                            </nav>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="hidden sm:inline text-white/90 text-sm capitalize">{role}</span>
                            <FakeLogin />
                        </div>
                    </div>
                </div>
            </header>
            <main className="flex-1 container mx-auto p-4 md:p-8">
                {children}
            </main>
        </div>
    );
}
