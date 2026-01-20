import React, { useState, useEffect } from 'react';
import { BadgeCheck, AlertCircle, Clock, CheckCircle2, Search, Filter, MessageSquare, User, Loader2 } from 'lucide-react';
import apiService from '../../services/apiService';

const AdminSupport = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, open, resolved
    const [selectedReport, setSelectedReport] = useState(null);
    const [resolutionNote, setResolutionNote] = useState('');
    const [isResolving, setIsResolving] = useState(false);

    const fetchReports = async () => {
        try {
            const data = await apiService.getReports();
            setReports(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const handleResolve = async (status) => {
        if (!selectedReport) return;
        setIsResolving(true);
        try {
            await apiService.resolveReport(selectedReport._id, status, resolutionNote);
            await fetchReports();
            setSelectedReport(null);
            setResolutionNote('');
        } catch (err) {
            alert("Failed to update report");
        } finally {
            setIsResolving(false);
        }
    };

    const filteredReports = reports.filter(r => {
        if (filter === 'all') return true;
        if (filter === 'open') return ['open', 'in-progress'].includes(r.status);
        if (filter === 'resolved') return ['resolved', 'closed'].includes(r.status);
        return true;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'open': return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';
            case 'in-progress': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
            case 'resolved': return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20';
            default: return 'bg-secondary text-subtext border-border';
        }
    };

    if (loading) return <div className="h-96 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

    return (
        <div className="space-y-6 max-h-[calc(100vh-100px)] flex flex-col">
            <div className="flex items-center justify-between shrink-0">
                <div>
                    <h2 className="text-2xl font-bold text-maintext">User Support</h2>
                    <p className="text-subtext text-sm">Manage user complaints and inquiries</p>
                </div>
                <div className="flex gap-2">
                    {['all', 'open', 'resolved'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${filter === f ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-card text-subtext hover:bg-secondary border border-border'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
                {/* Reports List */}
                <div className="lg:col-span-1 bg-card border border-border rounded-2xl overflow-hidden flex flex-col shadow-sm">
                    <div className="p-4 border-b border-border bg-secondary">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-subtext" />
                            <input type="text" placeholder="Search reports..." className="w-full bg-card border border-border rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 text-maintext placeholder-subtext/50" />
                        </div>
                    </div>
                    <div className="overflow-y-auto flex-1 p-2 space-y-2">
                        {filteredReports.map(report => (
                            <div
                                key={report._id}
                                onClick={() => setSelectedReport(report)}
                                className={`p-4 rounded-xl cursor-pointer transition-all border ${selectedReport?._id === report._id ? 'bg-primary/5 border-primary/20 shadow-sm' : 'bg-card border-transparent hover:bg-secondary'}`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${report.type === 'bug' ? 'bg-red-500/10 text-red-700 dark:text-red-400' : 'bg-blue-500/10 text-blue-700 dark:text-blue-400'}`}>{report.type}</span>
                                    <span className="text-[10px] text-subtext">{new Date(report.timestamp).toLocaleDateString()}</span>
                                </div>
                                <h4 className="font-bold text-maintext text-sm line-clamp-1">{report.description}</h4>
                                <div className="flex items-center gap-2 mt-2 text-xs text-subtext">
                                    <User className="w-3 h-3" />
                                    <span>{report.userId?.name || 'Unknown User'}</span>
                                </div>
                                <div className="mt-2 flex items-center justify-between">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColor(report.status)} uppercase`}>{report.status}</span>
                                    {report.priority === 'high' && <AlertCircle className="w-4 h-4 text-red-500" />}
                                </div>
                            </div>
                        ))}
                        {filteredReports.length === 0 && <div className="p-8 text-center text-subtext text-sm">No reports found</div>}
                    </div>
                </div>

                {/* Report Details */}
                <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-8 flex flex-col shadow-sm overflow-y-auto">
                    {selectedReport ? (
                        <>
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-bold text-maintext">Report Details</h3>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(selectedReport.status)}`}>{selectedReport.status}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-subtext">
                                        <Clock className="w-4 h-4" />
                                        <span>Submitted on {new Date(selectedReport.timestamp).toLocaleString()}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-maintext">{selectedReport.userId?.name || 'Unknown User'}</p>
                                    <p className="text-xs text-subtext">{selectedReport.userId?.email || 'No Email'}</p>
                                </div>
                            </div>

                            <div className="bg-secondary rounded-xl p-6 mb-6 border border-border">
                                <h4 className="text-xs font-bold text-subtext uppercase tracking-wider mb-2">Description</h4>
                                <p className="text-maintext whitespace-pre-wrap leading-relaxed">{selectedReport.description}</p>
                            </div>

                            <div className="mt-auto pt-6 border-t border-border">
                                <h4 className="text-sm font-bold text-maintext mb-3">Resolution Action</h4>
                                <textarea
                                    className="w-full bg-card border border-border rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none min-h-[100px] mb-4 text-maintext placeholder-subtext/50"
                                    placeholder="Add notes about the resolution or response..."
                                    value={resolutionNote}
                                    onChange={(e) => setResolutionNote(e.target.value)}
                                />
                                <div className="flex gap-3 justify-end">
                                    {selectedReport.status !== 'resolved' && (
                                        <button
                                            disabled={isResolving}
                                            onClick={() => handleResolve('resolved')}
                                            className="bg-green-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-500/20 disabled:opacity-50 flex items-center gap-2"
                                        >
                                            {isResolving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                            Mark Resolved
                                        </button>
                                    )}
                                    {selectedReport.status === 'open' && (
                                        <button
                                            disabled={isResolving}
                                            onClick={() => handleResolve('in-progress')}
                                            className="bg-amber-500 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/20 disabled:opacity-50"
                                        >
                                            Mark In-Progress
                                        </button>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-subtext opacity-50">
                            <MessageSquare className="w-16 h-16 mb-4 text-subtext/50" />
                            <p className="font-medium">Select a report to view details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminSupport;
