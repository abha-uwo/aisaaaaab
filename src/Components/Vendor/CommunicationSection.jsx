import React from 'react';
import { Megaphone, MessageCircle, ArrowRight } from 'lucide-react';

const CommunicationSection = ({ announcements }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600 mr-3">
                            <Megaphone size={18} />
                        </div>
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">Platform Updates</h3>
                    </div>
                    <button className="text-[10px] font-bold text-blue-600 hover:underline uppercase tracking-widest">View All</button>
                </div>
                <div className="space-y-4">
                    {announcements.map((announcement) => (
                        <div key={announcement.id} className="group cursor-pointer flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100">
                            <div>
                                <p className="text-sm font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{announcement.title}</p>
                                <p className="text-[10px] text-gray-400 font-medium mt-1 uppercase tracking-wider">{announcement.date}</p>
                            </div>
                            <ArrowRight size={14} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-all" />
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl shadow-lg p-8 flex flex-col justify-center items-center text-center text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity transform translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 duration-500">
                    <MessageCircle size={120} />
                </div>
                <h3 className="text-xl font-black mb-3 relative z-10 text-white">Need Support?</h3>
                <p className="text-indigo-100 text-sm mb-8 leading-relaxed relative z-10">Our team is available 24/7 to assist you with technical or financial queries.</p>
                <button className="w-full bg-white text-indigo-600 font-bold py-3 rounded-xl hover:bg-blue-50 transition-all shadow-md relative z-10 active:scale-95 leading-none">
                    Chat with Support
                </button>
            </div>
        </div>
    );
};

export default CommunicationSection;
