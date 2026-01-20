import React from 'react';
import { X, CheckCircle2, Download } from 'lucide-react';
import { useRecoilState } from 'recoil';
import { demoModalState } from '../../userStore/demoStore';
import { toggleState } from '../../userStore/userData';
import { motion, AnimatePresence } from 'motion/react';
import VideoPlayer from './VideoPlayer';

const LiveDemoModal = ({ onSubscribe }) => {
    const [modalState, setModalState] = useRecoilState(demoModalState);
    const [subToggle, setSubToggle] = useRecoilState(toggleState);
    const { isOpen, selectedAgent } = modalState;

    const handleClose = () => {
        setModalState({ ...modalState, isOpen: false });
    };

    const handleSubscribe = () => {
        if (selectedAgent) {
            onSubscribe(selectedAgent._id);
            setSubToggle({ ...subToggle, subscripPgTgl: true });
            handleClose();
        }
    };

    if (!selectedAgent) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center md:p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-4xl bg-white md:rounded-3xl overflow-hidden shadow-2xl flex flex-col h-full md:h-auto md:max-h-[90vh]"
                    >
                        {/* Header */}
                        <div className="p-4 md:p-6 flex items-center justify-between border-b border-border bg-white sticky top-0 z-10">
                            <div>
                                <h2 className="text-xl md:text-2xl font-bold text-maintext">
                                    {selectedAgent.agentName}
                                </h2>
                                <span className="text-xs text-primary font-semibold uppercase tracking-wider">
                                    {selectedAgent.category}
                                </span>
                            </div>
                            <button
                                onClick={handleClose}
                                className="p-2 rounded-xl border border-border hover:bg-surface text-subtext transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="overflow-y-auto flex-1">
                            {/* Demo Video Player section */}
                            <div className="p-0 md:p-6 bg-black md:bg-transparent">
                                <VideoPlayer
                                    src={selectedAgent.videoUrl}
                                    poster={selectedAgent.thumbnail}
                                    scenes={selectedAgent.scenes}
                                />
                            </div>

                            {/* Info Sections */}
                            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-lg font-bold text-maintext mb-4">What this agent does</h3>
                                    <ul className="space-y-3">
                                        {(selectedAgent.features || [
                                            "Automates repetitive tasks with high precision",
                                            "Integrates seamlessly with your existing workflow",
                                            "Provides real-time analytics and insights",
                                            "24/7 autonomous operation without supervision"
                                        ]).map((feature, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-sm text-subtext">
                                                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-maintext mb-4">Best for</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {(selectedAgent.tags || ["Productivity", "Small Business", "Automation", "Scaling"]).map((tag, idx) => (
                                            <span
                                                key={idx}
                                                className="px-3 py-1.5 bg-surface border border-border text-subtext rounded-full text-xs font-medium"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="mt-8 p-6 bg-primary/5 rounded-2xl border border-primary/10">
                                        <p className="text-sm text-primary font-medium mb-1">Subscription Price</p>
                                        <p className="text-2xl font-bold text-maintext">$29<span className="text-sm font-normal text-subtext">/month</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer CTA */}
                        <div className="p-4 md:p-6 border-t border-border bg-white sticky bottom-0 z-10 flex flex-col md:flex-row gap-4">
                            <button
                                onClick={handleSubscribe}
                                className="flex-1 py-3.5 rounded-2xl font-bold bg-primary text-white hover:opacity-90 shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
                            >
                                <Download className="w-5 h-5" /> Subscribe Now
                            </button>
                            <button
                                onClick={handleClose}
                                className="py-3.5 px-8 rounded-2xl font-bold bg-white text-subtext border border-border hover:bg-surface transition-all"
                            >
                                Close
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default LiveDemoModal;
