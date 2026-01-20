import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, FileText, Loader2, AlertCircle } from 'lucide-react';
import apiService from '../../services/apiService';

const Approvals = () => {
    const [pendingAgents, setPendingAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [approvalMessage, setApprovalMessage] = useState('');
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');

    const fetchPending = async () => {
        try {
            setLoading(true);
            const agents = await apiService.getAgents();
            const pending = agents.filter(a => a.reviewStatus === 'Pending Review');
            setPendingAgents(pending);
        } catch (err) {
            console.error("Failed to fetch pending approvals:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPending();
    }, []);

    const handleApprove = async () => {
        try {
            const id = selectedAgent._id || selectedAgent.id;
            setProcessingId(id);
            await apiService.approveAgent(id, approvalMessage);
            setPendingAgents(prev => prev.filter(a => (a._id || a.id) !== id));
            setShowApproveModal(false);
            setApprovalMessage('');
            setSelectedAgent(null);
        } catch (err) {
            alert("Approval failed");
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async () => {
        if (!rejectionReason.trim()) return;
        try {
            setProcessingId(selectedAgent._id || selectedAgent.id);
            await apiService.rejectAgent(selectedAgent._id || selectedAgent.id, rejectionReason);
            setPendingAgents(prev => prev.filter(a => (a._id || a.id) !== (selectedAgent._id || selectedAgent.id)));
            setShowRejectModal(false);
            setRejectionReason('');
            setSelectedAgent(null);
        } catch (err) {
            alert("Rejection failed");
        } finally {
            setProcessingId(null);
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
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-maintext">Approvals & Verification</h2>
                    <p className="text-subtext text-sm">Review and manage app submissions from vendors</p>
                </div>
                <div className="bg-amber-500/10 text-amber-700 dark:text-amber-400 px-4 py-2 rounded-xl text-xs font-bold border border-amber-500/20 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {pendingAgents.length} Pending Requests
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {pendingAgents.length > 0 ? (
                    pendingAgents.map((agent) => (
                        <div key={agent._id || agent.id} className="bg-card border border-border rounded-[32px] p-6 shadow-sm hover:shadow-md transition-all group">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center overflow-hidden border border-border">
                                        <img src={agent.avatar || 'https://cdn-icons-png.flaticon.com/512/2102/2102633.png'} alt="" className="w-10 h-10 object-contain" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-maintext group-hover:text-primary transition-colors">{agent.agentName}</h3>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-xs font-bold text-subtext uppercase tracking-wider">{agent.category}</span>
                                            <span className="w-1 h-1 bg-subtext/20 rounded-full"></span>
                                            <span className="text-xs text-subtext">Submitted by Vendor</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => {
                                            setSelectedAgent(agent);
                                            setShowApproveModal(true);
                                        }}
                                        disabled={processingId === (agent._id || agent.id)}
                                        className="bg-[#22C55E] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-[#16A34A] transition-all flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {processingId === (agent._id || agent.id) ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedAgent(agent);
                                            setShowRejectModal(true);
                                        }}
                                        disabled={processingId === (agent._id || agent.id)}
                                        className="bg-card border border-red-500/20 text-red-500 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-red-500/10 transition-all flex items-center gap-2 disabled:opacity-50"
                                    >
                                        <XCircle className="w-4 h-4" />
                                        Reject
                                    </button>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-border">
                                <p className="text-sm text-subtext line-clamp-2 leading-relaxed italic">
                                    "{agent.description}"
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-card border border-border rounded-[32px] p-16 text-center">
                        <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                            <Clock className="w-8 h-8 text-subtext/50" />
                        </div>
                        <h3 className="text-lg font-bold text-maintext">All caught up!</h3>
                        <p className="text-subtext text-sm">No pending app review requests at the moment.</p>
                    </div>
                )}
            </div>

            {/* Approval Modal */}
            {showApproveModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-card w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in duration-200">
                        <div className="p-8">
                            <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center mb-6">
                                <CheckCircle className="w-8 h-8 text-[#22C55E]" />
                            </div>
                            <h2 className="text-2xl font-bold text-maintext mb-2">Approve Agent</h2>
                            <p className="text-subtext mb-8">You can send a congratulatory message or additional notes to the vendor.</p>

                            <textarea
                                value={approvalMessage}
                                onChange={(e) => setApprovalMessage(e.target.value)}
                                className="w-full bg-secondary border border-border rounded-2xl p-5 text-sm outline-none focus:ring-2 focus:ring-green-500/10 focus:border-green-500 transition-all resize-none h-32 text-maintext placeholder-subtext/50"
                                placeholder="Message to Vendor (Optional)"
                            />

                            <div className="flex items-center gap-4 mt-8">
                                <button
                                    onClick={() => setShowApproveModal(false)}
                                    className="flex-1 px-6 py-4 rounded-2xl text-sm font-bold text-subtext hover:bg-secondary transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleApprove}
                                    disabled={processingId}
                                    className="flex-1 bg-[#22C55E] text-white px-6 py-4 rounded-2xl text-sm font-bold hover:bg-[#16A34A] transition-all disabled:opacity-50"
                                >
                                    Confirm Approval
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Rejection Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-card w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in duration-200">
                        <div className="p-8">
                            <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6">
                                <AlertCircle className="w-8 h-8 text-[#EF4444]" />
                            </div>
                            <h2 className="text-2xl font-bold text-maintext mb-2">Reject Agent</h2>
                            <p className="text-subtext mb-8">Please provide a professional reason for rejection. This will be visible to the vendor.</p>

                            <textarea
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                className="w-full bg-secondary border border-border rounded-2xl p-5 text-sm outline-none focus:ring-2 focus:ring-red-500/10 focus:border-red-500 transition-all resize-none h-32 text-maintext placeholder-subtext/50"
                                placeholder="Example: Icon resolution is too low, please upload a high-quality 512x512 image."
                            />

                            <div className="flex items-center gap-4 mt-8">
                                <button
                                    onClick={() => setShowRejectModal(false)}
                                    className="flex-1 px-6 py-4 rounded-2xl text-sm font-bold text-subtext hover:bg-secondary transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleReject}
                                    disabled={!rejectionReason.trim() || processingId}
                                    className="flex-1 bg-[#EF4444] text-white px-6 py-4 rounded-2xl text-sm font-bold hover:bg-[#DC2626] transition-all disabled:opacity-50"
                                >
                                    Confirm Rejection
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Approvals;
