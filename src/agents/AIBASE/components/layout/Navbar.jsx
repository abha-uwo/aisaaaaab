import React, { useState } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router';
import { Search, Menu, CheckCircle, Info, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();

    const isDashboard = location.pathname === '/';

    const handleSearch = (e) => {
        const term = e.target.value;
        if (term) {
            // Navigate to Dashboard with search param
            navigate(`/?search=${encodeURIComponent(term)}`);
        } else {
            // If on Dashboard, remove param, else go to Dashboard
            navigate('/');
        }
    };

    return (
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-border sticky top-0 z-50 px-8 flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
                {/* Mobile Menu Trigger could go here */}
                {isDashboard ? (
                    <div className="relative w-full max-w-md hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-subtext" />
                        <input
                            type="text"
                            placeholder="Search knowledge base..."
                            value={searchParams.get('search') || ''}
                            onChange={handleSearch}
                            className="w-full pl-10 pr-4 py-2 bg-surface rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm text-maintext"
                        />
                    </div>
                ) : (
                    <div className="flex items-center">
                        <span className="text-lg font-medium text-subtext">
                            Chat with your Knowledge Base
                        </span>
                    </div>
                )}
            </div>

            {isDashboard && (
                <div className="flex items-center gap-6">


                    <div className="flex items-center gap-3 pl-6 border-l border-border">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold text-maintext">Admin User</p>
                            <p className="text-xs text-subtext">admin@aibase.com</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-purple-500 p-0.5">
                            <div className="w-full h-full bg-white rounded-full p-0.5">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="User" className="w-full h-full rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
