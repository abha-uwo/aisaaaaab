import React from 'react';
import { X, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AgentModal = ({ isOpen, onClose, agent }) => {
    if (!isOpen || !agent) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white w-full max-w-6xl h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-border"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <img
                                    src={agent.avatar || "https://api.dicebear.com/7.x/bottts/svg?seed=" + agent.id}
                                    alt={agent.name}
                                    className="w-8 h-8 rounded-lg object-cover"
                                    onError={(e) => { e.target.src = `https://api.dicebear.com/7.x/bottts/svg?seed=${agent.id}` }}
                                />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-maintext">{agent.agentName || agent.name}</h3>
                                <p className="text-xs text-subtext line-clamp-1">{agent.description}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <a
                                href={agent.url}
                                target="_blank"
                                rel="noreferrer"
                                className="p-2 text-subtext hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                title="Open in new window"
                            >
                                <ExternalLink className="w-5 h-5" />
                            </a>
                            <button
                                onClick={onClose}
                                className="p-2 text-subtext hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Content (Iframe) */}
                    <div className="flex-1 bg-secondary relative">
                        <iframe
                            src={agent.url}
                            title={agent.name}
                            className="w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default AgentModal;
