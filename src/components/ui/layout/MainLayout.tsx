import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

export function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-background border-b sticky top-0 z-10">
                <div className="container mx-auto px-4">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center space-x-8">
                            <h1 className="text-2xl font-bold text-primary">TALENTFLOW</h1>
                            <nav className="flex items-center space-x-6 text-sm font-medium">
                                <NavLink 
                                    to="/jobs" 
                                    className={({ isActive }) => 
                                        cn("transition-colors hover:text-primary", 
                                       !isActive && "text-muted-foreground")
                                    }
                                >
                                    Jobs
                                </NavLink>
                                <NavLink 
                                    to="/candidates" 
                                    className={({ isActive }) => 
                                        cn("transition-colors hover:text-primary", 
                                       !isActive && "text-muted-foreground")
                                    }
                                >
                                    Candidates
                                </NavLink>
                            </nav>
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