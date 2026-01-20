import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, CreditCard, Activity, Loader2, Copy, Check } from 'lucide-react';
import apiService from '../../services/apiService';

const Financials = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [copiedId, setCopiedId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const stats = await apiService.getAdminRevenueStats();
                setData(stats);
            } catch (err) {
                console.error("Failed to load financials", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleCopy = (id, text) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    if (loading) {
        return (
            <div className="h-64 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    const overview = data?.overview || { totalGross: 0, totalVendorPayouts: 0, totalPlatformNet: 0 };
    const apps = data?.appPerformance || [];

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(amount || 0);
    };

    const Card = ({ id, title, amount, subtitle, icon: Icon, colorClass, borderClass, bgClass, iconBgClass }) => (
        <div
            onClick={() => handleCopy(id, formatCurrency(amount))}
            className={`
                group relative overflow-hidden
                ${bgClass} ${borderClass} rounded-2xl p-6 shadow-sm 
                cursor-pointer transition-all duration-300 ease-out
                hover:-translate-y-1 hover:shadow-xl hover:scale-[1.02]
                active:scale-95 active:bg-opacity-90
            `}
        >
            <div className="flex items-start justify-between mb-4 relative z-10">
                <div>
                    <p className={`text-[11px] font-bold ${colorClass === 'text-white' ? 'text-blue-100' : 'text-subtext'} uppercase tracking-wider transition-colors`}>{title}</p>
                    <h3 className={`text-3xl font-bold ${colorClass === 'text-white' ? 'text-white' : colorClass} mt-1 transition-all`}>
                        {copiedId === id ? (
                            <span className="flex items-center gap-2 text-sm animate-in fade-in zoom-in">
                                <Check className="w-5 h-5" /> Copied!
                            </span>
                        ) : (
                            formatCurrency(amount)
                        )}
                    </h3>
                </div>
                <div className={`
                    w-10 h-10 ${iconBgClass} rounded-xl flex items-center justify-center 
                    transition-all duration-500 ease-out 
                    group-hover:rotate-12 group-hover:scale-110 group-hover:bg-opacity-80
                `}>
                    <Icon className={`w-5 h-5 ${colorClass === 'text-white' ? 'text-white' : colorClass.replace('text-', 'text-')}`} />
                </div>
            </div>
            <p className={`text-xs ${colorClass === 'text-white' ? 'text-blue-100/70' : 'text-subtext'} font-medium relative z-10 group-hover:translate-x-1 transition-transform`}>{subtitle}</p>

            {/* Hover Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-r ${colorClass === 'text-white' ? 'from-white/10 to-transparent' : 'from-primary/5 to-transparent'} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
        </div>
    );

    return (
        <div className="space-y-8 font-sans">
            <div>
                <h2 className="text-2xl font-bold text-maintext">Revenue Overview</h2>
                <p className="text-subtext text-sm">Platform-wide financial performance</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card
                    id="gross"
                    title="Total Gross Revenue"
                    amount={overview.totalGross}
                    subtitle="Before platform fees & payouts"
                    icon={TrendingUp}
                    colorClass="text-maintext"
                    bgClass="bg-card"
                    borderClass="border border-border"
                    iconBgClass="bg-blue-500/10 text-blue-600 dark:text-blue-400"
                />

                <Card
                    id="payouts"
                    title="Total Vendor Payouts"
                    amount={overview.totalVendorPayouts}
                    subtitle="Disbursed to vendors (50%)"
                    icon={CreditCard}
                    colorClass="text-green-600 dark:text-green-400"
                    bgClass="bg-card"
                    borderClass="border border-border"
                    iconBgClass="bg-green-500/10 text-green-600 dark:text-green-400"
                />

                <Card
                    id="net"
                    title="Net Platform Earnings"
                    amount={overview.totalPlatformNet}
                    subtitle="Gross Revenue - Vendor Payouts"
                    icon={DollarSign}
                    colorClass="text-primary"
                    bgClass="bg-blue-500/10"
                    borderClass="border border-primary/20"
                    iconBgClass="bg-primary/10 text-primary"
                />
            </div>

            {/* App-wise Performance Table */}
            <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
                <div className="p-6 border-b border-border">
                    <h3 className="text-lg font-bold text-maintext">App-wise Performance</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-secondary text-[10px] text-subtext font-bold uppercase tracking-wider">
                                <th className="px-8 py-5">App Name</th>
                                <th className="px-8 py-5 text-right">Total Revenue</th>
                                <th className="px-8 py-5 text-right">Vendor Earnings</th>
                                <th className="px-8 py-5 text-right">Platform Fees (50%)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {apps.length > 0 ? (
                                apps.map((app) => (
                                    <tr key={app.id} className="hover:bg-secondary transition-colors">
                                        <td className="px-8 py-5 font-bold text-maintext">{app.name}</td>
                                        <td className="px-8 py-5 text-right font-medium text-subtext">{formatCurrency(app.totalRevenue)}</td>
                                        <td className="px-8 py-5 text-right font-bold text-green-600 dark:text-green-400">{formatCurrency(app.vendorEarnings)}</td>
                                        <td className="px-8 py-5 text-right font-bold text-primary">{formatCurrency(app.platformFees)}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                                                <Activity className="w-6 h-6 text-subtext/50" />
                                            </div>
                                            <p className="text-sm text-subtext italic">No transaction data available yet.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Financials;
