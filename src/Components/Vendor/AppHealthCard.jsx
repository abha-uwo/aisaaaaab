import React from 'react';
import StatusBadge from './StatusBadge';
import { ShieldCheck, Calendar, Info, Activity } from 'lucide-react';

const AppHealthCard = ({ healthStatus, lastReview, complianceStatus }) => {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
            <div className="p-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
            <div className="p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="flex items-center space-x-6">
                        <div className={`p-4 rounded-2xl ${healthStatus === 'All Good' ? 'bg-green-50 text-green-600 border border-green-100' : healthStatus === 'Needs Attention' ? 'bg-yellow-50 text-yellow-600 border border-yellow-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                            <Activity size={32} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-gray-900 leading-tight">Systems Operational</h3>
                            <div className="flex items-center mt-3 space-x-3">
                                <StatusBadge status={healthStatus} />
                                <span className="text-xs text-gray-300">•</span>
                                <div className="flex items-center space-x-1.5 px-2 py-0.5 bg-gray-50 border border-gray-100 rounded-full">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                                    <span className="text-[10px] font-bold text-gray-500 uppercase">Production v2.4</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-16 border-t md:border-t-0 md:border-l border-gray-50 pt-8 md:pt-0 md:pl-16">
                        <div className="flex items-center space-x-4">
                            <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                                <Calendar size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-widest font-black text-gray-400 mb-1">Last Review</p>
                                <p className="text-sm font-bold text-gray-800">{lastReview}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                                <Info size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-widest font-black text-gray-400 mb-1">Compliance</p>
                                <div className="flex items-center space-x-2">
                                    <div className={`w-2 h-2 rounded-full ${complianceStatus === 'Compliant' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`}></div>
                                    <p className="text-sm font-bold text-gray-800 tracking-tight">{complianceStatus}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppHealthCard;
