import React from 'react';
import { Play, Star, Download } from 'lucide-react';
import { useSetRecoilState, useRecoilState } from 'recoil';
import { demoModalState } from '../../userStore/demoStore';
import { toggleState } from '../../userStore/userData';

const LiveDemoCard = ({ agent, onSubscribe }) => {
    const setDemoModal = useSetRecoilState(demoModalState);
    const [subToggle, setSubToggle] = useRecoilState(toggleState);

    const handleWatchDemo = () => {
        setDemoModal({
            isOpen: true,
            selectedAgent: agent,
        });
    };

    const handleSubscribe = () => {
        onSubscribe(agent._id);
        setSubToggle({ ...subToggle, subscripPgTgl: true });
    };

    return (
        <div className="group bg-card border border-border hover:border-primary/50 rounded-2xl p-5 hover:shadow-xl transition-all duration-300 flex flex-col h-full shadow-sm">
            {/* Thumbnail Area */}
            <div
                className="relative aspect-video mb-4 rounded-xl overflow-hidden bg-surface cursor-pointer group/thumb"
                onClick={handleWatchDemo}
            >
                <img
                    src={agent.thumbnail || agent.avatar}
                    alt={agent.agentName}
                    className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/20 group-hover/thumb:bg-black/40 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg transform group-hover/thumb:scale-110 transition-transform">
                        <Play className="w-6 h-6 text-primary fill-primary ml-1" />
                    </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/60 px-2 py-1 rounded text-[10px] text-white font-medium backdrop-blur-sm">
                    {agent.duration || "1:00"} demo
                </div>
            </div>

            <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-maintext truncate pr-2">
                    {agent.agentName}
                </h3>
                <div className="bg-surface border border-border px-2 py-1 rounded-lg flex items-center gap-1 shrink-0">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-bold text-maintext">4.9</span>
                </div>
            </div>

            <span className="text-xs text-primary uppercase tracking-wider font-semibold mb-3">
                {agent.category}
            </span>

            <p className="text-sm text-subtext mb-6 flex-1 line-clamp-2">
                {agent.description}
            </p>

            {/* Actions */}
            <div className="flex flex-col gap-2">
                <button
                    onClick={handleWatchDemo}
                    className="w-full py-2.5 rounded-xl font-semibold bg-primary text-white hover:opacity-90 shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
                >
                    <Play className="w-4 h-4 fill-white" /> Watch Demo
                </button>
                <button
                    onClick={handleSubscribe}
                    className="w-full py-2.5 rounded-xl font-semibold bg-card text-primary border border-primary/20 hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
                >
                    <Download className="w-4 h-4" /> Subscribe
                </button>
            </div>
        </div>
    );
};

export default LiveDemoCard;
