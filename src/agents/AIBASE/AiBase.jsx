import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import Dashboard from './pages/dashboard/Dashboard';
import Chat from './pages/chat/Chat';
import UserManagement from './pages/admin/UserManagement';

function AiBase() {
    const location = useLocation();
    const isChat = location.pathname.includes('/chat');

    return (
        <div className="flex h-screen overflow-hidden bg-surface font-sans text-maintext">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 h-full">
                <Navbar />

                {/* Conditional Padding/Scroll: Chat should handle its own scrolling */}
                {/* We use flex-1 to automatically fill remaining height (no calc needed) */}
                <main className={`flex-1 relative ${isChat ? 'p-0 overflow-hidden' : 'p-8 overflow-y-auto'}`}>
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/chat" element={<Chat />} />
                        <Route path="/admin" element={<UserManagement />} />
                        <Route path="*" element={<Navigate to="" replace />} />
                    </Routes>
                </main>
            </div>
            <Toaster position="top-right" toastOptions={{ duration: 4000, style: { background: '#333', color: '#fff' } }} />
        </div>
    );
}

export default AiBase;
