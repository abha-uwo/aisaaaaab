import React, { useState, useEffect } from 'react';
import { Ban, Search, User, Loader2, Bot, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';
import apiService from '../../services/apiService';

import { useToast } from '../../Components/Toast/ToastContext';

const UserManagement = () => {
    const toast = useToast();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedUser, setExpandedUser] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await apiService.getAllUsers();
            setUsers(data);
        } catch (err) {
            console.error("Failed to fetch users", err);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount || 0);
    };

    const toggleExpand = (userId) => {
        if (expandedUser === userId) {
            setExpandedUser(null);
        } else {
            setExpandedUser(userId);
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleBlockUser = async (userId, currentStatus) => {
        try {
            await apiService.toggleBlockUser(userId, !currentStatus);
            // Optimistic update or refetch
            setUsers(users.map(u => u.id === userId ? { ...u, isBlocked: !currentStatus, status: !currentStatus ? 'Blocked' : (u.isVerified ? 'Active' : 'Pending') } : u));
            toast.success(`User ${!currentStatus ? 'blocked' : 'unblocked'} successfully`);
        } catch (err) {
            console.error("Block/Unblock failed:", err);
            toast.error("Failed to update user status: " + (err.response?.data?.error || err.message));
        }
    };



    if (loading) return <div className="h-96 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-maintext">User Management</h2>
                    <p className="text-sm text-subtext">Manage platform users and view subscriptions</p>
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-subtext" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2 bg-card border border-border rounded-xl text-sm outline-none w-64 focus:ring-2 focus:ring-primary/10 text-maintext placeholder-subtext/50"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="bg-secondary border-b border-border text-[11px] font-bold text-subtext uppercase tracking-wider">
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Subscribed Agents</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Total Spent</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-secondary transition-colors align-top">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-secondary border border-border flex items-center justify-center text-maintext font-bold text-sm">
                                                {user.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" /> : user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-maintext">{user.name}</p>
                                                <p className="text-xs text-subtext">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${user.role === 'admin' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' : 'bg-secondary text-subtext border-border'} uppercase`}>
                                            {user.role === 'admin' && <ShieldCheck className="w-3 h-3" />}
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="relative">
                                            <button
                                                onClick={() => toggleExpand(user.id)}
                                                className="flex items-center gap-2 text-sm font-medium text-maintext hover:text-primary transition-colors focus:outline-none"
                                            >
                                                <span>{user.agents?.length || 0} Agents</span>
                                                {expandedUser === user.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                            </button>

                                            {/* Dropdown */}
                                            {expandedUser === user.id && (
                                                <div className="absolute top-full left-0 mt-2 w-64 bg-card border border-border rounded-xl shadow-xl z-10 animate-in fade-in zoom-in duration-200">
                                                    <div className="p-2 space-y-1 max-h-60 overflow-y-auto">
                                                        {user.agents && user.agents.length > 0 ? (
                                                            user.agents.map((agent, idx) => (
                                                                <div key={idx} className="flex items-center justify-between p-2 hover:bg-secondary rounded-lg">
                                                                    <div className="flex items-center gap-2">
                                                                        <Bot className="w-3 h-3 text-subtext" />
                                                                        <span className="text-sm font-medium text-maintext line-clamp-1">{agent.agentName || agent.name}</span>
                                                                    </div>
                                                                    {(() => {
                                                                        const priceType = typeof agent.pricing === 'object' ? agent.pricing?.type : agent.pricing;
                                                                        return (
                                                                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${priceType === 'Pro' ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' : priceType === 'Basic' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'bg-secondary text-subtext'}`}>
                                                                                {priceType || 'Free'}
                                                                            </span>
                                                                        );
                                                                    })()}
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="p-3 text-xs text-center text-subtext italic">No subscriptions found</div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase ${user.isBlocked ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20' : (user.status === 'Active' ? 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20')}`}>
                                            {user.isBlocked ? 'Blocked' : user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-bold text-maintext">
                                        {formatCurrency(user.spent)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleBlockUser(user.id, user.isBlocked)}
                                                className={`p-2 rounded-xl transition-colors ${user.isBlocked ? 'text-green-600 hover:bg-green-500/10' : 'text-subtext hover:text-red-500 hover:bg-red-500/10'}`}
                                                title={user.isBlocked ? "Unblock User" : "Block User"}
                                            >
                                                <Ban className={`w-4 h-4 ${user.isBlocked ? 'rotate-180' : ''}`} />
                                            </button>

                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-6 py-12 text-center text-subtext">
                                    No users found matching your search.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;
