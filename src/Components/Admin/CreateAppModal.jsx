import React, { useState } from 'react';
import { X, Sparkles, AlertCircle } from 'lucide-react';

const CreateAppModal = ({ isOpen, onClose, onSubmit }) => {
    const initialFormData = {
        agentName: '',
        description: '',
        agentUrl: '',
        category: 'Business OS',
        pricing: 'Free'
    };

    const [formData, setFormData] = useState(initialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const resetForm = () => {
        setFormData(initialFormData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSubmit(formData);
            resetForm();
            onClose();
        } catch (error) {
            console.error("Failed to create app:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-card w-full max-w-2xl rounded-[32px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="px-8 py-6 border-b border-border flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-maintext">Create New App</h2>
                            <p className="text-sm text-subtext">Add a new AI agent to your marketplace</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-secondary rounded-full transition-colors text-subtext"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6 overflow-y-auto max-h-[75vh]">
                    <div className="space-y-2">
                        <label className="text-[11px] font-extrabold text-maintext uppercase tracking-wider flex items-center gap-1">
                            App Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="agentName"
                            required
                            placeholder="e.g., My Awesome AI App"
                            autoComplete="off"
                            value={formData.agentName}
                            onChange={handleChange}
                            className="w-full bg-secondary border border-border rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-subtext/50 text-maintext"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[11px] font-extrabold text-maintext uppercase tracking-wider flex items-center gap-1">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="description"
                            required
                            rows={4}
                            placeholder="Describe what your AI agent does..."
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full bg-secondary border border-border rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none text-maintext placeholder:text-subtext/50"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[11px] font-extrabold text-maintext uppercase tracking-wider">
                            App Live URL
                        </label>
                        <input
                            type="text"
                            name="agentUrl"
                            placeholder="e.g., yourapp.com or https://yourapp.com"
                            value={formData.agentUrl}
                            onChange={handleChange}
                            className="w-full bg-secondary border border-border rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-subtext/50 text-maintext"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[11px] font-extrabold text-maintext uppercase tracking-wider">
                                Category
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full bg-secondary border border-border rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none cursor-pointer text-maintext"
                            >
                                <option>Business OS</option>
                                <option>Data & Intelligence</option>
                                <option>Sales & Marketing</option>
                                <option>HR & Finance</option>
                                <option>Design & Creative</option>
                                <option>Medical & Health AI</option>
                                <option>general</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-extrabold text-maintext uppercase tracking-wider">
                                Pricing Model
                            </label>
                            <select
                                name="pricing"
                                value={formData.pricing}
                                onChange={handleChange}
                                className="w-full bg-secondary border border-border rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none cursor-pointer text-maintext"
                            >
                                <option value="Free">Free</option>
                                <option value="Prime (₹100/mo)">Prime (₹100/mo)</option>
                                <option value="Pro (₹1000/yr)">Pro (₹1000/yr)</option>
                            </select>
                        </div>
                    </div>

                    {/* Notice */}
                    <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-5 flex gap-4">
                        <AlertCircle className="w-6 h-6 text-primary shrink-0 mt-1" />
                        <div>
                            <p className="text-sm font-bold text-maintext mb-1">This app will be created as a Draft.</p>
                            <p className="text-xs text-subtext leading-relaxed">
                                Draft apps are NOT visible on the A-Series Marketplace. You can publish the app later from the App Details page.
                            </p>
                        </div>
                    </div>
                </form>

                {/* Footer */}
                <div className="px-8 py-6 border-t border-border flex items-center justify-between bg-secondary">
                    <button
                        onClick={onClose}
                        className="text-sm font-bold text-subtext hover:text-maintext transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="bg-primary text-white px-8 py-4 rounded-2xl text-sm font-bold hover:shadow-lg hover:shadow-primary/20 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
                    >
                        {isSubmitting ? 'Creating...' : 'Create App'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateAppModal;
