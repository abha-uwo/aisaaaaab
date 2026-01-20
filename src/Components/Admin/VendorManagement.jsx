import React, { useState, useEffect } from 'react';
import { MessageSquare, Loader2, Clock, CheckCircle, AlertCircle, User, Mail, Send, X } from 'lucide-react';
import apiService from '../../services/apiService';

import { useToast } from '../../Components/Toast/ToastContext';

const VendorManagement = () => {
    const toast = useToast();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [showReplyModal, setShowReplyModal] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [replyMessage, setReplyMessage] = useState('');
    const [sending, setSending] = useState(false);

    useEffect(() => {
        fetchVendorTickets();
    }, []);

    const fetchVendorTickets = async () => {
        try {
            setLoading(true);
            const reports = await apiService.getReports();
            setTickets(Array.isArray(reports) ? reports : []);
        } catch (err) {
            console.error("Failed to fetch vendor tickets:", err);
            setTickets([]);
        } finally {
            setLoading(false);
        }
    };

    const handleResolve = async (id) => {
        try {
            await apiService.resolveReport(id, 'resolved', 'Issue resolved by admin');
            toast.success("Ticket resolved successfully");
            fetchVendorTickets();
        } catch (err) {
            console.error(err);
            toast.error("Failed to resolve ticket");
        }
    };

    const handleReplyClick = (ticket) => {
        setSelectedTicket(ticket);
        setReplyMessage('');
        setShowReplyModal(true);
    };

    const handleSendReply = async () => {
        if (!replyMessage.trim()) {
            toast.error("Please enter a message");
            return;
        }

        try {
            setSending(true);
            await apiService.replyToVendorTicket(selectedTicket._id, replyMessage);
            toast.success("Reply sent successfully via email!");
            setShowReplyModal(false);
            setReplyMessage('');
            fetchVendorTickets();
        } catch (err) {
            toast.error("Failed to send reply: " + (err.response?.data?.error || err.message));
        } finally {
            setSending(false);
        }
    };

    const filteredTickets = tickets.filter(ticket => {
        if (filter === 'all') return true;
        return ticket.status === filter;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'open': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
            case 'in-progress': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
            case 'resolved': return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20';
            default: return 'bg-secondary text-subtext border-border';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'open': return <Clock className="w-3 h-3" />;
            case 'in-progress': return <AlertCircle className="w-3 h-3" />;
            case 'resolved': return <CheckCircle className="w-3 h-3" />;
            default: return <MessageSquare className="w-3 h-3" />;
        }
    };

    if (loading) {
        return (
            <div className="h-64 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-maintext">Vendor Support</h2>
                    <p className="text-sm text-subtext">Manage vendor support tickets and issues</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filter === 'all' ? 'bg-primary text-white' : 'bg-card border border-border text-subtext hover:bg-secondary'}`}
                    >
                        All ({tickets.length})
                    </button>
                    <button
                        onClick={() => setFilter('open')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filter === 'open' ? 'bg-amber-500 text-white' : 'bg-card border border-border text-subtext hover:bg-secondary'}`}
                    >
                        Open ({tickets.filter(t => t.status === 'open').length})
                    </button>
                    <button
                        onClick={() => setFilter('resolved')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filter === 'resolved' ? 'bg-green-500 text-white' : 'bg-card border border-border text-subtext hover:bg-secondary'}`}
                    >
                        Resolved ({tickets.filter(t => t.status === 'resolved').length})
                    </button>
                </div>
            </div>

            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="bg-secondary border-b border-border">
                        <tr>
                            <th className="px-6 py-4 text-[10px] font-bold text-subtext uppercase tracking-wider">Ticket ID</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-subtext uppercase tracking-wider">User</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-subtext uppercase tracking-wider">Type</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-subtext uppercase tracking-wider">Description</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-subtext uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-subtext uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {filteredTickets.length > 0 ? (
                            filteredTickets.map((ticket) => (
                                <tr key={ticket._id} className="hover:bg-secondary transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-bold text-maintext">
                                            #{ticket._id.substring(ticket._id.length - 8).toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4 text-subtext" />
                                            <span className="text-sm font-medium text-maintext">
                                                {ticket.userId?.name || ticket.userId || 'Anonymous'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-secondary text-subtext rounded-lg text-[10px] font-bold uppercase">
                                            {ticket.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-subtext line-clamp-2">{ticket.description}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(ticket.status)} uppercase`}>
                                            {getStatusIcon(ticket.status)}
                                            {ticket.status}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleReplyClick(ticket)}
                                                className="px-3 py-2 bg-blue-500 text-white rounded-xl text-xs font-bold hover:bg-blue-600 transition-all flex items-center gap-1"
                                            >
                                                <Mail className="w-3 h-3" />
                                                Reply
                                            </button>
                                            {ticket.status !== 'resolved' && (
                                                <button
                                                    onClick={() => handleResolve(ticket._id)}
                                                    className="px-3 py-2 bg-green-500 text-white rounded-xl text-xs font-bold hover:bg-green-600 transition-all"
                                                >
                                                    Resolve
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-6 py-20 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center">
                                            <MessageSquare className="w-8 h-8 text-subtext/50" />
                                        </div>
                                        <p className="text-sm font-medium text-subtext">No vendor support tickets found.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Reply Modal */}
            {showReplyModal && selectedTicket && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-card w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in duration-200">
                        <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-500">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Mail className="w-6 h-6 text-white" />
                                    <h2 className="text-xl font-bold text-white">Reply to Vendor</h2>
                                </div>
                                <button
                                    onClick={() => setShowReplyModal(false)}
                                    className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                                >
                                    <X className="w-5 h-5 text-white" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Ticket Info */}
                            <div className="bg-secondary rounded-xl p-4">
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <span className="text-subtext">Vendor:</span>
                                        <span className="ml-2 font-bold text-maintext">{selectedTicket.userId?.name || 'Anonymous'}</span>
                                    </div>
                                    <div>
                                        <span className="text-subtext">Email:</span>
                                        <span className="ml-2 font-bold text-maintext">{selectedTicket.userId?.email || 'N/A'}</span>
                                    </div>
                                    <div className="col-span-2">
                                        <span className="text-subtext">Issue:</span>
                                        <p className="mt-1 text-maintext">{selectedTicket.description}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Reply Message */}
                            <div>
                                <label className="block text-sm font-bold text-maintext mb-2">Your Message</label>
                                <textarea
                                    value={replyMessage}
                                    onChange={(e) => setReplyMessage(e.target.value)}
                                    placeholder="Type your reply here..."
                                    rows="6"
                                    className="w-full border border-border rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none bg-card text-maintext placeholder-subtext/50"
                                />
                                <p className="text-xs text-subtext mt-2">This message will be sent to the vendor's email address.</p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                                <button
                                    onClick={() => setShowReplyModal(false)}
                                    className="px-5 py-2.5 bg-secondary text-maintext rounded-xl font-bold text-sm hover:bg-border transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSendReply}
                                    disabled={sending}
                                    className="px-5 py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-all flex items-center gap-2 disabled:opacity-50"
                                >
                                    {sending ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4" />
                                            Send Reply
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VendorManagement;
