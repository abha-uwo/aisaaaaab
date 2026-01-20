import React, { useState } from 'react';
import StatusBadge from './StatusBadge';
import PrimaryButton from './PrimaryButton';
import { ShieldCheck, Info, Users, Archive, AlertCircle, X, Send } from 'lucide-react';

const AppDetail = ({ app, usage, onDeactivate, onReactivate, onSubmitForReview, onDelete, onUpdateUrl, onBack }) => {
    const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
    const [isReactivateModalOpen, setIsReactivateModalOpen] = useState(false);
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [url, setUrl] = useState(app.url || '');
    const [isEditingUrl, setIsEditingUrl] = useState(false);

    const handleSaveUrl = () => {
        onUpdateUrl(url);
        setIsEditingUrl(false);
    };

    if (!app) return null;

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4">
            {/* Header Section */}
            <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/50">
                <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                        <ShieldCheck size={32} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{app.agentName}</h2>
                        <div className="flex items-center space-x-2 mt-1">
                            <StatusBadge status={app.status} />
                            <StatusBadge status={app.health} />
                        </div>
                    </div>
                </div>
                <div className="flex space-x-3">
                    <PrimaryButton variant="secondary" onClick={onBack}>
                        Back to List
                    </PrimaryButton>

                    {/* Consolidated Action Buttons */}
                    <div className="flex gap-2">
                        {/* Reactivate: Only for Inactive */}
                        {app.status === 'Inactive' && (
                            <PrimaryButton onClick={() => setIsReactivateModalOpen(true)} className="inline-flex items-center bg-green-600 hover:bg-green-700 border-green-600 text-white">
                                <ShieldCheck size={16} className="mr-2" /> Reactivate App
                            </PrimaryButton>
                        )}

                        {/* Submit: For Draft, Rejected, OR Inactive (User Request: "Sare app me submit option rkho") */}
                        {(app.status === 'Draft' || app.status === 'Rejected' || app.status === 'Inactive') && (
                            <PrimaryButton onClick={() => setIsSubmitModalOpen(true)} className="inline-flex items-center bg-blue-600 hover:bg-blue-700 shadow-blue-200">
                                <Send size={16} className="mr-2" /> {app.status === 'Rejected' ? 'Resubmit' : 'Submit for Review'}
                            </PrimaryButton>
                        )}

                        {/* Deactivate: For Live or Under Review (Cancel Request) */}
                        {(app.status === 'Live' || app.status === 'Under Review') && (
                            <PrimaryButton variant="danger" onClick={() => setIsDeactivateModalOpen(true)} className="inline-flex items-center bg-yellow-500 hover:bg-yellow-600 border-yellow-500 text-white">
                                <Archive size={16} className="mr-2" /> {app.status === 'Under Review' ? 'Cancel Review' : 'Deactivate App'}
                            </PrimaryButton>
                        )}

                        {/* Delete: ALWAYS Valid (User Request: "Sare app me option rhe") */}
                        <PrimaryButton variant="danger" onClick={() => setIsDeleteModalOpen(true)} className="inline-flex items-center">
                            <X size={16} className="mr-2" /> Delete
                        </PrimaryButton>
                    </div>

                </div>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Basic Info & Description */}
                <div className="lg:col-span-2 space-y-8">
                    <section>
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center">
                            <Info size={16} className="mr-2" /> About this App
                        </h3>
                        <p className="text-gray-700 leading-relaxed text-lg">
                            {app.description}
                        </p>
                    </section>

                    {/* App URL Configuration */}
                    <section className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center justify-between">
                            <div className="flex items-center"><Users size={16} className="mr-2" /> App Configuration</div>
                            {!isEditingUrl ? (
                                <button onClick={() => setIsEditingUrl(true)} className="text-blue-600 text-xs font-bold hover:underline">Edit URL</button>
                            ) : (
                                <div className="flex gap-2">
                                    <button onClick={() => setIsEditingUrl(false)} className="text-gray-500 text-xs font-bold hover:underline">Cancel</button>
                                    <button onClick={handleSaveUrl} className="text-green-600 text-xs font-bold hover:underline">Save</button>
                                </div>
                            )}
                        </h3>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">App Live URL</label>
                            {isEditingUrl ? (
                                <input
                                    type="url"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="https://yourapp.com"
                                />
                            ) : (
                                <div className="mt-1 text-gray-900 font-medium truncate">
                                    {app.url ? <a href={app.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{app.url}</a> : <span className="text-gray-400 italic">No URL configured</span>}
                                </div>
                            )}
                            <p className="text-xs text-gray-400 mt-2">This URL is where users will be redirected after subscribing.</p>
                        </div>
                    </section>

                    <section className="bg-blue-50/50 rounded-xl p-6 border border-blue-100">
                        <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-4 flex items-center">
                            <Users size={16} className="mr-2" /> User Usage Summary
                        </h3>
                        <div className="flex items-baseline space-x-2">
                            <span className="text-4xl font-bold text-gray-900">{usage.totalUsers}</span>
                            <span className="text-gray-500 font-medium">Total Active Users</span>
                        </div>
                    </section>
                </div>

                {/* Subscription Breakdown */}
                <div className="space-y-6">
                    <section className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Plan Distribution</h3>
                        <div className="space-y-3">
                            {usage.planBreakdown.map((plan, idx) => (
                                <div key={idx} className="flex justify-between items-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm transition-all hover:border-blue-200 hover:shadow-md group">
                                    <span className="text-sm font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{plan.name}</span>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-lg font-black text-gray-900">{plan.users}</span>
                                        <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Users</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center">
                            Quick App Info
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                <span className="text-sm text-gray-500">Pricing Models</span>
                                <span className="text-sm font-semibold text-gray-900">Usage-based, Fixed</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                <span className="text-sm text-gray-500">Active Plans</span>
                                <span className="text-sm font-semibold text-blue-600">3 Plans</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-sm text-gray-500">Visibility</span>
                                <span className="text-sm font-semibold text-green-600">Public Marketplace</span>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            {/* Deactivate Confirmation Modal */}
            {isDeactivateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95">
                        <div className="flex justify-between items-center mb-4">
                            <div className="p-2 bg-yellow-100 text-yellow-600 rounded-full">
                                <AlertCircle size={24} />
                            </div>
                            <button onClick={() => setIsDeactivateModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Deactivate App?</h3>
                        <p className="text-gray-500 mb-6">
                            Are you sure you want to deactivate <strong>{app.agentName}</strong>? This will immediately remove it from the A-Series Marketplace.
                        </p>
                        <div className="flex space-x-3">
                            <PrimaryButton variant="secondary" onClick={() => setIsDeactivateModalOpen(false)} className="flex-1">
                                Cancel
                            </PrimaryButton>
                            <PrimaryButton variant="danger" onClick={() => { onDeactivate(); setIsDeactivateModalOpen(false); }} className="flex-1 bg-yellow-500 hover:bg-yellow-600 border-yellow-500">
                                Confirm Deactivation
                            </PrimaryButton>
                        </div>
                    </div>
                </div>
            )}

            {/* Reactivate Confirmation Modal */}
            {isReactivateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95">
                        <div className="flex justify-between items-center mb-4">
                            <div className="p-2 bg-green-100 text-green-600 rounded-full">
                                <ShieldCheck size={24} />
                            </div>
                            <button onClick={() => setIsReactivateModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Reactivate App?</h3>
                        <p className="text-gray-500 mb-6">
                            Do you want to reactivate <strong>{app.agentName}</strong>? It will become visible in the marketplace immediately.
                        </p>
                        <div className="flex space-x-3">
                            <PrimaryButton variant="secondary" onClick={() => setIsReactivateModalOpen(false)} className="flex-1">
                                Cancel
                            </PrimaryButton>
                            <PrimaryButton onClick={() => { onReactivate(); setIsReactivateModalOpen(false); }} className="flex-1 bg-green-600 hover:bg-green-700">
                                Confirm Reactivation
                            </PrimaryButton>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95">
                        <div className="flex justify-between items-center mb-4">
                            <div className="p-2 bg-red-100 text-red-600 rounded-full">
                                <AlertCircle size={24} />
                            </div>
                            <button onClick={() => setIsDeleteModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Delete App Permanently?</h3>
                        <p className="text-gray-500 mb-6">
                            This action cannot be undone. <strong>{app.agentName}</strong> will be permanently removed from the dashboard and marketplace.
                        </p>
                        <div className="flex space-x-3">
                            <PrimaryButton variant="secondary" onClick={() => setIsDeleteModalOpen(false)} className="flex-1">
                                Cancel
                            </PrimaryButton>
                            <PrimaryButton variant="danger" onClick={() => { onDelete(); setIsDeleteModalOpen(false); }} className="flex-1">
                                Delete Permanently
                            </PrimaryButton>
                        </div>
                    </div>
                </div>
            )}
            {/* Submit Confirmation Modal */}
            {isSubmitModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95">
                        <div className="flex justify-between items-center mb-4">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
                                <Send size={24} />
                            </div>
                            <button onClick={() => setIsSubmitModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Submit for Review?</h3>
                        <p className="text-gray-500 mb-6">
                            This will send <strong>{app.agentName}</strong> to the Admin for approval. The app will become "Under Review" and will be visible in the marketplace only after approval.
                        </p>
                        <div className="flex space-x-3">
                            <PrimaryButton variant="secondary" onClick={() => setIsSubmitModalOpen(false)} className="flex-1">
                                Cancel
                            </PrimaryButton>
                            <PrimaryButton onClick={() => { onSubmitForReview(); setIsSubmitModalOpen(false); }} className="flex-1 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200">
                                Confirm Submit
                            </PrimaryButton>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AppDetail;
