import React, { useState, useEffect } from 'react';
import { X, Play, ArrowRight, Video, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import { AppRoute, apis } from '../../types';
import axios from 'axios';
import AIGeneratedVideoSim from './AIGeneratedVideoSim';

const LandingLiveDemoModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [agents, setAgents] = useState([]);

    useEffect(() => {
        const fetchAgents = async () => {
            try {
                const res = await axios.get(apis.agents);
                const data = Array.isArray(res.data) ? res.data : [];
                // Map backend fields to frontend expectations
                const mappedAgents = data.map(a => ({
                    ...a,
                    id: a._id,
                    name: a.agentName,
                    title: a.category || "AI Assistant", // Fallback
                    thumbnail: a.avatar,
                    input: a.input || "User Input",
                    output: a.output || "AI Response",
                    videoType: a.videoType || (a.url ? "uploaded" : "ai-generated"),
                    videoUrl: a.url
                }));
                setAgents(mappedAgents);
            } catch (err) {
                console.error("Failed to fetch demo agents", err);
            }
        };
        fetchAgents();
    }, []);

    const filteredAgents = agents.filter(agent =>
        (agent.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (agent.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (agent.category || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleWatch = (agent) => {
        setSelectedAgent(agent);
    };

    const handleSubscribe = (agent) => {
        onClose();
        navigate(AppRoute.SIGNUP);
    };

    const closeVideo = () => setSelectedAgent(null);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center md:p-6 overflow-hidden">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/70 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-6xl bg-white md:rounded-3xl overflow-hidden shadow-2xl flex flex-col h-full md:h-auto md:max-h-[92vh]"
                    >
                        {/* Header */}
                        <div className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border bg-white sticky top-0 z-20">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <Video className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-maintext">
                                        A-Series Agent Catalog
                                    </h2>
                                    <p className="text-sm text-subtext hidden md:block">
                                        Explore 30+ specialized AI agents for your business.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 flex-1 max-w-md">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-subtext" />
                                    <input
                                        type="text"
                                        placeholder="Search agents..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:border-primary/30 transition-colors"
                                    />
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-xl border border-border hover:bg-surface text-subtext transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Agents Grid */}
                        <div className="p-4 md:p-8 bg-secondary/30 overflow-y-auto flex-1 custom-scrollbar min-h-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredAgents.map((agent) => (
                                    <motion.div
                                        layout
                                        key={agent.id}
                                        className="group bg-white border border-border hover:border-primary/30 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
                                    >
                                        <div className="aspect-[16/10] relative overflow-hidden bg-black">
                                            <img
                                                src={agent.thumbnail}
                                                alt={agent.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                                                <button
                                                    onClick={() => handleWatch(agent)}
                                                    className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 hover:scale-110 transition-transform"
                                                >
                                                    <Play className="w-6 h-6 fill-white ml-1" />
                                                </button>
                                            </div>
                                            <div className="absolute top-3 left-3 px-2 py-1 rounded-md bg-black/50 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white uppercase tracking-wider">
                                                {agent.category}
                                            </div>
                                        </div>
                                        <div className="p-4 flex flex-col flex-1">
                                            <div className="mb-4">
                                                <h3 className="text-base font-bold text-maintext mb-0.5">
                                                    {agent.name}
                                                </h3>
                                                <p className="text-[11px] font-semibold text-primary uppercase tracking-wider mb-2">
                                                    {agent.title}
                                                </p>
                                                <p className="text-xs text-subtext line-clamp-2 leading-relaxed">
                                                    {agent.description}
                                                </p>
                                            </div>
                                            <div className="mt-auto grid grid-cols-2 gap-2">
                                                <button
                                                    onClick={() => handleWatch(agent)}
                                                    className="flex items-center justify-center gap-2 py-2 rounded-xl border border-border text-xs font-bold text-maintext hover:bg-surface transition-all"
                                                >
                                                    <Play className="w-3.5 h-3.5" /> Watch
                                                </button>
                                                <button
                                                    onClick={() => handleSubscribe(agent)}
                                                    className="flex items-center justify-center gap-2 py-2 rounded-xl bg-primary text-xs font-bold text-white hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                                                >
                                                    Subscribe
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Video / Simulation Overlay */}
                        <AnimatePresence>
                            {selectedAgent && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    className="absolute inset-0 z-30 bg-white flex flex-col h-full"
                                >
                                    <div className="p-4 md:p-6 flex items-center justify-between border-b border-border bg-white relative z-10">
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={closeVideo}
                                                className="p-2 rounded-xl hover:bg-surface text-subtext transition-colors flex items-center gap-2 font-bold text-sm"
                                            >
                                                <ArrowRight className="w-5 h-5 rotate-180" />
                                                Back to Grid
                                            </button>
                                            <div className="w-px h-6 bg-border hidden md:block" />
                                            <h3 className="text-lg font-bold text-maintext hidden md:block">
                                                {selectedAgent.name} – Live Demo
                                            </h3>
                                        </div>
                                        <button
                                            onClick={closeVideo}
                                            className="p-2 rounded-xl border border-border hover:bg-surface text-subtext transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="flex-1 overflow-hidden relative">
                                        {selectedAgent.videoType === 'uploaded' ? (
                                            <div className="w-full h-full bg-black flex items-center justify-center p-0 md:p-8">
                                                <div className="w-full max-w-5xl aspect-video rounded-2xl overflow-hidden bg-neutral-900 shadow-2xl">
                                                    <video
                                                        controls
                                                        autoPlay
                                                        className="w-full h-full object-contain"
                                                        poster={selectedAgent.thumbnail}
                                                    >
                                                        <source src={selectedAgent.videoUrl} type="video/mp4" />
                                                        Your browser does not support the video tag.
                                                    </video>
                                                </div>
                                            </div>
                                        ) : (
                                            <AIGeneratedVideoSim agent={selectedAgent} />
                                        )}
                                    </div>

                                    <div className="p-6 md:p-8 bg-white border-t border-border flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative z-10">
                                        <div className="text-center md:text-left">
                                            <h4 className="text-xl font-bold text-maintext mb-1">
                                                Integrate {selectedAgent.name} Today
                                            </h4>
                                            <p className="text-subtext max-w-xl">
                                                Ready to experience the power of {selectedAgent.title}?
                                                Join 5,000+ businesses automating with A-Series.
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleSubscribe(selectedAgent)}
                                            className="w-full md:w-auto px-10 py-4 bg-primary rounded-2xl font-bold text-lg text-white shadow-xl shadow-primary/30 hover:translate-y-[-2px] transition-all flex items-center justify-center gap-2"
                                        >
                                            Start Subscription <ArrowRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default LandingLiveDemoModal;
