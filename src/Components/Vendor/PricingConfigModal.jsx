import React, { useState, useEffect } from 'react';
import { X, Check, DollarSign, AlertCircle, Info, ChevronDown, Sparkles } from 'lucide-react';

const PricingConfigModal = ({ isOpen, onClose, onSave, initialData }) => {
    const [selectedPlans, setSelectedPlans] = useState([]);
    const [currency, setCurrency] = useState('USD');
    const [prices, setPrices] = useState({});
    const [intervals, setIntervals] = useState({});
    const [error, setError] = useState('');

    useEffect(() => {
        if (initialData) {
            setSelectedPlans(initialData.selectedPlans || []);
            setCurrency(initialData.currency || 'USD');
            setPrices(initialData.prices || {});
            setIntervals(initialData.intervals || {});
        }
    }, [initialData, isOpen]);

    const togglePlan = (plan) => {
        if (selectedPlans.includes(plan)) {
            setSelectedPlans(selectedPlans.filter(p => p !== plan));
            // Cleanup state
            const newPrices = { ...prices };
            delete newPrices[plan];
            setPrices(newPrices);
            const newIntervals = { ...intervals };
            delete newIntervals[plan];
            setIntervals(newIntervals);
        } else {
            setSelectedPlans([...selectedPlans, plan]);
            // Default interval for paid plans
            if (plan !== 'Free') {
                setIntervals(prev => ({ ...prev, [plan]: 'Monthly' }));
            }
        }
    };

    const handlePriceChange = (plan, value) => {
        setPrices({ ...prices, [plan]: value });
    };

    const handleIntervalChange = (plan, value) => {
        setIntervals({ ...intervals, [plan]: value });
    };

    const validate = () => {
        setError('');
        if (selectedPlans.length === 0) {
            setError('Please select at least one plan.');
            return false;
        }
        for (const plan of selectedPlans) {
            if (plan !== 'Free') {
                if (!prices[plan]) {
                    setError(`Please enter a price for the ${plan} plan.`);
                    return false;
                }
                if (!intervals[plan]) {
                    setError(`Please select a billing interval for the ${plan} plan.`);
                    return false;
                }
            }
        }
        return true;
    };

    const handleSave = () => {
        if (validate()) {
            onSave({
                selectedPlans,
                currency,
                prices,
                intervals
            });
            onClose();
        }
    };

    if (!isOpen) return null;

    const planOptions = ['Free', 'Basic', 'Pro'];
    const currencyOptions = ['INR', 'USD', 'EUR', 'GBP'];
    const presetPrices = ['99', '199', '299', '399', '499', '999'];

    const getPlanNote = (plan) => {
        switch (plan) {
            case 'Free': return "Limited access for 1 week";
            case 'Basic': return "10k messages • Basic support. Need more? Get Pro.";
            case 'Pro': return "Unlimited messages • Priority support • Custom branding";
            default: return "";
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col overflow-hidden">

                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white z-10 shrink-0">
                    <div>
                        <h3 className="text-xl font-black text-blue-900 tracking-tight">Configure Subscription</h3>
                        <p className="text-xs text-gray-500 font-medium mt-0.5">Set up your app's pricing tiers</p>
                    </div>
                    <button type="button" onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                    {/* 1. Plan Selection */}
                    <div className="space-y-4">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Select Subscription Plan(s)</label>
                        <div className="flex gap-4">
                            {planOptions.map(plan => {
                                const isSelected = selectedPlans.includes(plan);
                                return (
                                    <button
                                        type="button"
                                        key={plan}
                                        onClick={() => togglePlan(plan)}
                                        className={`flex-1 py-4 px-2 rounded-2xl text-sm font-bold border lg:text-base transition-all duration-200 transform active:scale-95 ${isSelected
                                            ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md shadow-blue-100 ring-2 ring-blue-500/20'
                                            : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200 hover:bg-gray-50 hover:text-gray-700'
                                            }`}
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            {plan}
                                            {isSelected && <Check size={16} strokeWidth={3} className="text-blue-600" />}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Feature Notes */}
                        {selectedPlans.length > 0 && (
                            <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200 shadow-sm animate-in fade-in zoom-in-95 duration-200">
                                <div className="space-y-3">
                                    {selectedPlans.map(plan => (
                                        <div key={plan} className="flex items-start gap-3 text-sm">
                                            <div className="text-amber-900 font-bold leading-relaxed flex items-center gap-2">
                                                <Sparkles size={16} className="text-amber-600 shrink-0" />
                                                <span>
                                                    <span className="font-black uppercase tracking-wide text-[11px] bg-amber-100 px-1.5 py-0.5 rounded text-amber-800 mr-2">{plan}</span>
                                                    {getPlanNote(plan)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 3. Currency Selection */}
                    <div className="space-y-4">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Select Currency</label>
                        <div className="relative group">
                            <select
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                                className="w-full appearance-none bg-white border border-gray-200 rounded-2xl py-4 px-5 text-gray-900 font-bold focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer shadow-sm hover:border-gray-300"
                            >
                                <option value="INR">India (INR)</option>
                                <option value="USD">United States (USD)</option>
                                <option value="EUR">Europe (EUR)</option>
                                <option value="GBP">United Kingdom (GBP)</option>
                            </select>
                            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-blue-500 transition-colors" size={18} />
                        </div>
                    </div>

                    {/* 4. Price & Interval Config */}
                    {selectedPlans.filter(p => p !== 'Free').length > 0 && (
                        <div className="space-y-6 pt-2">
                            {selectedPlans.filter(p => p !== 'Free').map(plan => (
                                <div key={plan} className="bg-white rounded-3xl p-6 border border-blue-100 shadow-sm space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-black text-gray-800 text-lg flex items-center gap-2">
                                            <span className="w-2 h-6 bg-blue-500 rounded-full block"></span>
                                            {plan} Plan
                                        </h4>
                                        <div className="flex bg-gray-100/80 p-1 rounded-xl">
                                            {['Monthly', 'Yearly'].map(intv => (
                                                <button
                                                    type="button"
                                                    key={intv}
                                                    onClick={() => handleIntervalChange(plan, intv)}
                                                    className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all duration-200 ${intervals[plan] === intv
                                                        ? 'bg-blue-600 text-white shadow-sm ring-1 ring-black/5'
                                                        : 'text-gray-400 hover:text-gray-600'
                                                        }`}
                                                >
                                                    {intv}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 font-bold text-lg group-focus-within:text-blue-500 transition-colors">
                                            {currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '₹'}
                                        </div>

                                        {/* Smart Input with Suggestions */}
                                        <div className="relative">
                                            <input
                                                type="number"
                                                id={`price-input-${plan}`}
                                                value={prices[plan] || ''}
                                                onChange={(e) => handlePriceChange(plan, e.target.value)}
                                                placeholder="0.00"
                                                className="w-full pl-10 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl text-lg font-bold text-gray-900 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-gray-300 peer"
                                                autoComplete="off"
                                            />

                                            {/* Suggestions List - Appears on hover/focus */}
                                            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl z-20 hidden peer-focus:block hover:block p-1 animate-in fade-in slide-in-from-top-2">
                                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 py-2">
                                                    Recommended Prices
                                                </div>
                                                <div className="grid grid-cols-3 gap-1">
                                                    {presetPrices.map(price => (
                                                        <button
                                                            type="button"
                                                            key={price}
                                                            onMouseDown={(e) => {
                                                                e.preventDefault(); // Prevent blur
                                                                handlePriceChange(plan, price);
                                                            }}
                                                            className="py-2 px-2 text-sm font-bold text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors text-center"
                                                        >
                                                            {price}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="flex items-center gap-3 text-red-600 bg-red-50/80 border border-red-100 p-4 rounded-xl text-sm font-bold animate-shake">
                            <AlertCircle size={18} className="shrink-0" />
                            {error}
                        </div>
                    )}

                </div>

                {/* Footer - Fixed at bottom */}
                <div className="p-5 border-t border-gray-100 bg-white z-50 rounded-b-2xl flex-none shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3.5 rounded-xl font-bold text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors border border-transparent hover:border-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2.5 text-base"
                        >
                            <Check size={20} strokeWidth={3} />
                            Confirm Subscription Pricing
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PricingConfigModal;
