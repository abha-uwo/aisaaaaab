import React, { useState, useEffect } from 'react';
import { Search, Filter, Clock, Loader2, Eye, X, User, DollarSign, Calendar } from 'lucide-react';
import apiService from '../../services/apiService';

const TransactionHistory = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const data = await apiService.getAdminTransactions();
            setTransactions(data);
        } catch (err) {
            console.error("Failed to fetch transactions:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleViewDetails = (transaction) => {
        setSelectedTransaction(transaction);
        setShowDetailsModal(true);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-maintext">Transaction History</h1>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-subtext group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Search transaction..."
                            className="bg-card border border-border rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all outline-none min-w-[280px] text-maintext placeholder:text-subtext/50"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-xl text-sm font-bold text-subtext hover:bg-secondary transition-all">
                        <Filter className="w-4 h-4" />
                        Filter
                    </button>
                </div>
            </div>

            <div className="bg-card border border-border rounded-[32px] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-secondary border-b border-border">
                            <tr>
                                <th className="px-8 py-4 text-[10px] font-bold text-subtext uppercase tracking-[1.5px]">Transaction ID</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-subtext uppercase tracking-[1.5px]">Date</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-subtext uppercase tracking-[1.5px]">Type</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-subtext uppercase tracking-[1.5px]">App / Details</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-subtext uppercase tracking-[1.5px]">Amount</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-subtext uppercase tracking-[1.5px]">Status</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-subtext uppercase tracking-[1.5px] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="py-24 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                            <p className="mt-4 text-sm font-bold text-subtext">Loading history...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : transactions.length > 0 ? (
                                transactions.map((t) => (
                                    <tr key={t.id} className="border-b border-secondary hover:bg-secondary transition-colors last:border-0 group">
                                        <td className="px-8 py-5">
                                            <span className="text-xs font-bold text-maintext">#{t.id.substring(t.id.length - 8).toUpperCase()}</span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="text-xs font-medium text-subtext">{formatDate(t.date)}</span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                                <span className="text-[11px] font-bold text-maintext uppercase tracking-wide">{t.type}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="text-sm font-bold text-maintext group-hover:text-primary transition-colors">{t.appName}</span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="text-sm font-black text-maintext">${t.amount.toFixed(2)}</span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-600 dark:text-green-400 rounded-full border border-green-500/20 text-[10px] font-black uppercase tracking-wider">
                                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                                {t.status}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <button
                                                onClick={() => handleViewDetails(t)}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-maintext rounded-xl text-xs font-bold hover:bg-border transition-all"
                                                title="View Transaction Details"
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                                Details
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="py-24 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-3">
                                            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-2">
                                                <Clock className="w-8 h-8 text-subtext/20" />
                                            </div>
                                            <p className="text-subtext text-sm font-medium">No transactions found yet.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Transaction Details Modal */}
            {showDetailsModal && selectedTransaction && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-card w-full max-w-2xl rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in duration-200">
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-maintext">Transaction Details</h2>
                                <button
                                    onClick={() => setShowDetailsModal(false)}
                                    className="p-2 hover:bg-secondary rounded-xl transition-colors"
                                >
                                    <X className="w-5 h-5 text-subtext" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Transaction ID & Date */}
                                <div className="bg-secondary rounded-2xl p-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs font-bold text-subtext uppercase mb-2">Transaction ID</p>
                                            <p className="text-sm font-bold text-maintext">#{selectedTransaction.id.substring(selectedTransaction.id.length - 12).toUpperCase()}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-subtext uppercase mb-2">Date</p>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-subtext" />
                                                <p className="text-sm font-medium text-maintext">{formatDate(selectedTransaction.date)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* App Details */}
                                <div>
                                    <p className="text-xs font-bold text-subtext uppercase mb-3">App / Product</p>
                                    <div className="bg-card border border-border rounded-2xl p-4">
                                        <p className="text-lg font-bold text-maintext">{selectedTransaction.appName}</p>
                                        <p className="text-xs text-subtext mt-1">{selectedTransaction.type}</p>
                                    </div>
                                </div>

                                {/* Amount Breakdown */}
                                <div>
                                    <p className="text-xs font-bold text-subtext uppercase mb-3">Amount Breakdown</p>
                                    <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <DollarSign className="w-4 h-4 text-subtext" />
                                                <span className="text-sm font-medium text-subtext">Gross Amount</span>
                                            </div>
                                            <span className="text-sm font-bold text-maintext">${selectedTransaction.amount.toFixed(2)}</span>
                                        </div>
                                        <div className="border-t border-border pt-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-subtext">Platform Fee (50%)</span>
                                                <span className="text-sm font-bold text-amber-600 dark:text-amber-400">-${(selectedTransaction.amount * 0.5).toFixed(2)}</span>
                                            </div>
                                        </div>
                                        <div className="border-t border-border pt-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-bold text-maintext">Vendor Earnings</span>
                                                <span className="text-lg font-black text-green-600 dark:text-green-400">${(selectedTransaction.amount * 0.5).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Status */}
                                <div>
                                    <p className="text-xs font-bold text-subtext uppercase mb-3">Status</p>
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-600 dark:text-green-400 rounded-xl border border-green-500/20">
                                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                                        <span className="text-sm font-bold uppercase">{selectedTransaction.status}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end">
                                <button
                                    onClick={() => setShowDetailsModal(false)}
                                    className="px-6 py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TransactionHistory;
