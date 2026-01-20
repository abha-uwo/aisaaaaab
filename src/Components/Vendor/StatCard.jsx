import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatCard = ({ label, value, prefix = '', suffix = '', trend = null }) => {
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md hover:border-blue-100 group">
            <div className="flex justify-between items-start mb-4">
                <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">{label}</span>
                {trend !== null && (
                    <div className={`flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${trend > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        {trend > 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                        <span>{Math.abs(trend)}%</span>
                    </div>
                )}
            </div>
            <div className="text-3xl font-black text-gray-900 group-hover:text-blue-600 transition-colors">
                {prefix}{value}{suffix}
            </div>
        </div>
    );
};

export default StatCard;
