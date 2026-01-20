import React from 'react';
import { Download, History, TrendingUp } from 'lucide-react';

const RevenueSection = ({ revenueData }) => {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <TrendingUp size={18} className="text-blue-600" />
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">Financial Overview</h3>
                </div>
                <div className="flex space-x-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                        <Download size={18} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                        <History size={18} />
                    </button>
                </div>
            </div>

            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="p-5 bg-white border border-gray-100 rounded-xl hover:shadow-sm transition-all">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Gross Sales</p>
                        <p className="text-2xl font-black text-gray-900 mt-2">${revenueData.grossRevenue}</p>
                    </div>
                    <div className="p-5 bg-white border border-gray-100 rounded-xl hover:shadow-sm transition-all">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Platform Fee</p>
                        <p className="text-2xl font-bold text-gray-400 mt-2">{revenueData.platformFee}%</p>
                    </div>
                    <div className="p-5 bg-indigo-50/50 border border-indigo-100 rounded-xl hover:shadow-sm transition-all">
                        <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Net Earnings</p>
                        <p className="text-2xl font-black text-indigo-600 mt-2">${revenueData.vendorEarnings}</p>
                    </div>
                    <div className="p-5 bg-gray-50/50 border border-transparent rounded-xl flex flex-col justify-between">
                        <div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Status</p>
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold tracking-tighter uppercase ${revenueData.payoutStatus === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                {revenueData.payoutStatus}
                            </span>
                        </div>
                        <div className="mt-4">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Next Payout</p>
                            <p className="text-xs font-bold text-gray-700">{revenueData.nextPayoutDate}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RevenueSection;
