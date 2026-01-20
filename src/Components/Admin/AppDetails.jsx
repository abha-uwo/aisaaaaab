import React, { useState } from 'react';
import { Shield, Check, Info, ArrowLeft, Trash2, Globe, Loader2 } from 'lucide-react';
import apiService from '../../services/apiService';

import { getUserData } from '../../userStore/userData';
const AppDetails = ({ app, onBack, onDelete, onUpdate, isAdmin: propsIsAdmin }) => {
    const [status, setStatus] = useState(app ? (app.status || 'Inactive') : 'Inactive');
    const [reviewStatus, setReviewStatus] = useState(app ? (app.reviewStatus || 'Draft') : 'Draft');
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const userData = getUserData();
    const isAdmin = propsIsAdmin !== undefined ? propsIsAdmin : (userData?.role === 'admin');

    if (!app) return null;

    const handleGoLive = async () => {
        try {
            setIsUpdating(true);
            await apiService.updateAgent(app._id || app.id, { status: 'Live' });
            setStatus('Live');
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error("Failed to go live:", error);
            alert("Failed to update status.");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleSubmitForReview = async () => {
        try {
            setIsUpdating(true);
            const updated = await apiService.submitForReview(app._id || app.id);
            setReviewStatus('Pending Review');
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error("Failed to submit review:", error);
            alert("Failed to submit for review.");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this app? This action cannot be undone.")) return;

        try {
            setIsDeleting(true);
            await apiService.deleteAgent(app.id);
            if (onDelete) onDelete();
        } catch (error) {
            console.error("Failed to delete app:", error);
            alert("Failed to delete app.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="bg-secondary min-h-screen">
            {/* Main Header / Top Bar Area */}
            <div className="bg-card border-b border-border py-4 px-8 mb-6">
                <div className="max-w-[1400px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        {/* Shield Icon */}
                        <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20 shadow-sm">
                            <div className="w-10 h-10 bg-[#3B82F6] rounded-lg flex items-center justify-center text-white">
                                <Shield className="w-6 h-6" />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center gap-4 mb-2">
                                <h1 className="text-3xl font-bold text-maintext uppercase tracking-tight">
                                    {app.name || app.agentName}
                                </h1>
                            </div>
                            <div className="flex items-center gap-2">
                                {reviewStatus === 'Approved' ? (
                                    <span className="bg-green-500/10 text-green-600 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold">
                                        Approved
                                    </span>
                                ) : reviewStatus === 'Pending Review' ? (
                                    <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full text-xs font-bold border border-amber-500/20">
                                        Pending Review
                                    </span>
                                ) : reviewStatus === 'Rejected' ? (
                                    <span className="bg-red-500/10 text-red-600 dark:text-red-400 px-3 py-1 rounded-full text-xs font-bold border border-red-500/20">
                                        Rejected
                                    </span>
                                ) : (
                                    <span className="bg-secondary text-subtext px-3 py-1 rounded-full text-xs font-bold border border-border">
                                        Draft
                                    </span>
                                )}

                                {status === 'Live' && (
                                    <span className="bg-green-500/10 text-green-600 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold">
                                        Live
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={onBack}
                            className="bg-card border border-border text-subtext px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-secondary transition-all font-sans"
                        >
                            Back to List
                        </button>

                        {/* Vendor Action: Submit for Review */}
                        {!isAdmin && (reviewStatus === 'Draft' || reviewStatus === 'Rejected') ? (
                            <button
                                onClick={handleSubmitForReview}
                                disabled={isUpdating}
                                className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
                            >
                                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                                Submit for Review
                            </button>
                        ) : null}

                        {/* Admin Action: Force Live / Go Live */}
                        {isAdmin && status !== 'Live' ? (
                            <button
                                onClick={handleGoLive}
                                disabled={isUpdating}
                                className="bg-green-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-green-700 transition-all flex items-center gap-2 shadow-sm font-sans"
                            >
                                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                Go Live
                            </button>
                        ) : null}

                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-[#EF4444] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-[#DC2626] transition-all flex items-center gap-2 shadow-sm font-sans"
                        >
                            {isDeleting ? (
                                <Loader2 className="w-4 h-4 animate-spin text-white" />
                            ) : (
                                <span className="text-lg">×</span>
                            )}
                            Delete App
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="max-w-[1400px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* Main Content Column */}
                <div className="lg:col-span-3 space-y-8">
                    {/* Rejection Alert */}
                    {reviewStatus === 'Rejected' && app.rejectionReason && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 flex items-start gap-4">
                            <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center text-white shrink-0">
                                <Info className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-red-700 dark:text-red-300 font-bold mb-1">Feedback from Admin</h4>
                                <p className="text-red-600 dark:text-red-400 text-sm italic">"{app.rejectionReason}"</p>
                                <p className="text-red-600 dark:text-red-400 text-xs mt-3 font-medium">Please address these points and submit for review again.</p>
                            </div>
                        </div>
                    )}

                    {/* About Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-subtext">
                            <Info className="w-4 h-4" />
                            <h3 className="text-[11px] font-bold uppercase tracking-[1px]">About this App</h3>
                        </div>
                        <p className="text-maintext text-lg font-medium">
                            {app.description || 'No description provided.'}
                        </p>
                    </div>

                    {/* App Configuration Card */}
                    <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3 text-subtext">
                                <Globe className="w-5 h-5" />
                                <h3 className="text-[11px] font-bold uppercase tracking-[1px]">App Configuration</h3>
                            </div>
                            <button className="text-blue-600 text-sm font-bold hover:underline">Edit URL</button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <p className="text-[10px] font-bold text-subtext uppercase tracking-wider mb-2">App Live URL</p>
                                <p className="text-blue-600 font-bold text-lg hover:underline cursor-pointer">
                                    {app.url || 'No URL configured'}
                                </p>
                            </div>

                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex items-center gap-3">
                                <Info className="w-5 h-5 text-blue-600 shrink-0" />
                                <p className="text-sm font-medium text-blue-700 dark:text-blue-300 italic">
                                    An App Live URL is required to go Live on the Marketplace.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* User Usage Summary Card */}
                    <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
                        <div className="flex items-center gap-3 text-subtext mb-6">
                            <Globe className="w-5 h-5" />
                            <h3 className="text-[11px] font-bold uppercase tracking-[1px]">User Usage Summary</h3>
                        </div>

                        <div className="flex items-baseline gap-4">
                            <span className="text-6xl font-bold text-subtext/20">0</span>
                            <span className="text-subtext font-bold uppercase tracking-wider text-sm">Active Users</span>
                        </div>
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="space-y-8">

                    {/* Plan Distribution Card */}
                    <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
                        <h3 className="text-[11px] font-bold text-subtext uppercase tracking-[1px] mb-8">Plan Distribution</h3>

                        <div className="space-y-8">
                            <div className="flex items-center justify-between group">
                                <span className="text-sm font-bold text-maintext">{app.pricing ? 'Paid Tier' : 'Free Tier'}</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-bold text-subtext/20">0</span>
                                    <span className="text-[10px] font-bold text-subtext uppercase tracking-wider">Subscribers</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick App Info Card */}
                    <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
                        <h3 className="text-[11px] font-bold text-subtext uppercase tracking-[1px] mb-8">Quick App Info</h3>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-subtext">Pricing Model</span>
                                <span className="text-sm font-bold text-maintext">{app.pricing ? 'Fixed Price' : 'Free'}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-subtext">Price</span>
                                <span className="text-sm font-bold text-blue-600">{app.pricing || 'Free'}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-subtext">Visibility</span>
                                <span className={`text-sm font-bold cursor-pointer hover:underline ${status === 'Live' ? 'text-[#22C55E]' : 'text-amber-500'}`}>
                                    {status === 'Live' ? 'Public Marketplace' : 'Private Draft'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AppDetails;
