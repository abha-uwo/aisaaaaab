import React from 'react';
import { NavLink } from 'react-router';
import { LayoutDashboard, MessageSquare } from 'lucide-react';

const Sidebar = () => {
    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/agents/aibase' },
        { icon: MessageSquare, label: 'Chat', path: '/agents/aibase/chat' },
    ];

    return (
        <aside className="w-64 bg-white border-r border-border h-screen sticky top-0 flex flex-col">
            <div className="p-2 border-b border-border">
                <div className="flex items-center justify-start">
                    <img src="/logo-new.jpg" alt="AIBASE" className="w-32 h-auto object-contain" />
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                                : 'text-subtext hover:bg-surface hover:text-maintext'
                            }`
                        }
                    >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-border">
                {/* Sign Out removed for AIOffice integration */}
            </div>
        </aside>
    );
};

export default Sidebar;
