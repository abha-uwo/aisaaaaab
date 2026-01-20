import React, { useState, useEffect } from 'react';
import { TrendingUp, CreditCard, DollarSign, Loader2, ArrowUpRight } from 'lucide-react';
import apiService from '../../services/apiService';

const RevenueOverview = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchRevenue = async () => {
        try {
            setLoading(true);
            const res = await apiService.getVendorRevenue();
            setData(res);
        } catch (err) {
            console.error("Failed to fetch revenue:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRevenue();
    }, []);

    if (loading) {
        return (
            <div className="h-96 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        );
    }

    const { overview, appPerformance } = data || { overview: { totalGross: 0, totalNet: 0, totalFees: 0, totalPayouts: 0 }, appPerformance: [] };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-3xl font-extrabold text-[#1E293B] tracking-tight">Revenue Overview</h1>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white border border-[#E0E4E8] rounded-[32px] p-8 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-[11px] font-bold text-subtext uppercase tracking-[2px] mb-2">Total Gross Revenue</p>
                        <h2 className="text-4xl font-black text-[#1E293B] mb-2">${overview.totalGross.toFixed(2)}</h2>
                        <p className="text-xs text-[#64748B] font-medium">Before platform fees</p>
                    </div>
                    <div className="absolute top-6 right-8 text-primary/10 group-hover:text-primary/20 transition-colors">
                        <TrendingUp className="w-12 h-12" />
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="bg-white border border-[#E0E4E8] rounded-[32px] p-8 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-[11px] font-bold text-subtext uppercase tracking-[2px] mb-2">Total Payouts Received</p>
                        <h2 className="text-4xl font-black text-[#22C55E] mb-2">${overview.totalPayouts.toFixed(2)}</h2>
                        <p className="text-xs text-[#64748B] font-medium">Deposited to bank account</p>
                    </div>
                    <div className="absolute top-6 right-8 text-[#22C55E]/10 group-hover:text-[#22C55E]/20 transition-colors">
                        <CreditCard className="w-12 h-12" />
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-[#22C55E]/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="bg-white border border-blue-500/20 rounded-[32px] p-8 shadow-xl relative overflow-hidden ring-1 ring-blue-500/10">
                    <div className="absolute top-0 right-0 p-8 text-blue-500/10">
                        <DollarSign className="w-20 h-20 -mr-6 -mt-6" />
                    </div>
                    <div className="absolute left-0 top-0 w-1.5 h-full bg-blue-500" />
                    <div className="relative z-10">
                        <p className="text-[11px] font-bold text-blue-600 uppercase tracking-[2px] mb-2">Net Earnings</p>
                        <h2 className="text-4xl font-black text-blue-600 mb-2">${overview.totalNet.toFixed(2)}</h2>
                        <p className="text-xs text-blue-600/60 font-medium">Gross Revenue - 50% Platform Fees</p>
                    </div>
                </div>
            </div>

            {/* Performance Table */}
            <div className="bg-white border border-[#E0E4E8] rounded-[40px] shadow-sm overflow-hidden">
                <div className="p-8 border-b border-[#E0E4E8] flex items-center justify-between bg-[#F8F9FB]/50">
                    <h3 className="text-xl font-bold text-[#1E293B]">App-wise Performance</h3>
                    <div className="px-4 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-black rounded-full border border-blue-100 uppercase tracking-widest">
                        Real-time Data
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#F8F9FB] border-b border-[#E0E4E8]">
                            <tr>
                                <th className="px-10 py-5 text-[10px] font-bold text-subtext uppercase tracking-[2px]">App Name</th>
                                <th className="px-10 py-5 text-[10px] font-bold text-subtext uppercase tracking-[2px] text-center">Total Revenue</th>
                                <th className="px-10 py-5 text-[10px] font-bold text-subtext uppercase tracking-[2px] text-center">Platform Fees (50%)</th>
                                <th className="px-10 py-5 text-[10px] font-bold text-subtext uppercase tracking-[2px] text-right">Net Earnings</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {appPerformance.length > 0 ? (
                                appPerformance.map((app) => (
                                    <tr key={app.id} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="px-10 py-5">
                                            <div className="font-bold text-[#1E293B] group-hover:text-primary transition-colors">{app.name}</div>
                                        </td>
                                        <td className="px-10 py-5 text-center font-bold text-[#1E293B]">
                                            ${app.totalRevenue.toFixed(2)}
                                        </td>
                                        <td className="px-10 py-5 text-center font-medium text-red-500">
                                            -${app.platformFees.toFixed(2)}
                                        </td>
                                        <td className="px-10 py-5 text-right font-black text-[#22C55E]">
                                            ${app.netEarnings.toFixed(2)}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="py-20 text-center">
                                        <div className="flex flex-col items-center justify-center opacity-40">
                                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                                <TrendingUp className="w-8 h-8 text-slate-400" />
                                            </div>
                                            <p className="text-sm font-bold text-subtext uppercase tracking-widest">No app data available yet</p>
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

export default RevenueOverview;
