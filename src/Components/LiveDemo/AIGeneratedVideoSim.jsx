import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Terminal, Cpu, Database, ChevronRight, CheckCircle2, Layout, Activity } from 'lucide-react';

const AIGeneratedVideoSim = ({ agent }) => {
    const [step, setStep] = useState(0);
    const [outputLines, setOutputLines] = useState([]);

    // Simulation Steps
    const steps = [
        { label: "Initializing Neural Interface", icon: Cpu },
        { label: "Connecting to Knowledge Base", icon: Database },
        { label: "Processing Input Parameters", icon: Terminal },
        { label: "Generating Strategic Output", icon: Activity },
        { label: "Finalizing Response", icon: CheckCircle2 },
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
        }, 2500);

        const outputTimer = setInterval(() => {
            if (outputLines.length < 10) {
                setOutputLines(prev => [...prev, `> [${agent.name}] analyzing: ${Math.random().toString(36).substring(7)}...`]);
            }
        }, 1200);

        return () => {
            clearInterval(timer);
            clearInterval(outputTimer);
        };
    }, [agent.name, outputLines.length, steps.length]);

    return (
        <div className="w-full h-full bg-[#0a0a0c] text-white font-mono p-4 md:p-8 flex flex-col gap-6 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />

            {/* Simulation Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
                        <Bot className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold tracking-tight text-white/90">{agent.name} Simulation</h3>
                        <p className="text-[10px] text-white/40 uppercase tracking-[0.2em]">{agent.title}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <span className="text-[10px] text-white/60">LIVE AI PROCESSING</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 relative z-10 overflow-hidden">
                {/* Left: Input Analysis */}
                <div className="flex flex-col gap-4">
                    <div className="flex-1 rounded-2xl bg-white/5 border border-white/10 p-5 flex flex-col overflow-hidden">
                        <div className="flex items-center gap-2 mb-4 text-primary">
                            <Terminal className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-wider">Input Feed</span>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-3">
                            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                                <p className="text-[10px] text-white/30 uppercase mb-1">Detected Inputs:</p>
                                <p className="text-sm text-white/80 leading-relaxed italic">"{agent.input}"</p>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                {outputLines.map((line, i) => (
                                    <motion.p
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        key={i}
                                        className="text-[11px] text-white/40"
                                    >
                                        {line}
                                    </motion.p>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="h-24 rounded-2xl bg-primary/10 border border-primary/20 p-4 flex items-center justify-between">
                        <div className="flex gap-4">
                            {steps.map((s, idx) => (
                                <div key={idx} className="flex flex-col items-center gap-1.5">
                                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${step >= idx ? 'bg-primary border-primary text-white' : 'bg-white/5 border-white/10 text-white/20'}`}>
                                        <s.icon className="w-4 h-4" />
                                    </div>
                                    <div className={`h-1 w-4 rounded-full ${step > idx ? 'bg-primary' : 'bg-white/5'}`} />
                                </div>
                            ))}
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] text-white/40 uppercase">Step {step + 1}/{steps.length}</p>
                            <p className="text-xs font-bold text-primary">{steps[step].label}</p>
                        </div>
                    </div>
                </div>

                {/* Right: Output Visualization */}
                <div className="rounded-2xl bg-white/5 border border-white/10 p-6 flex flex-col overflow-hidden">
                    <div className="flex items-center gap-2 mb-6 text-primary">
                        <Layout className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Generated System Output</span>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.02 }}
                            className="flex-1 flex flex-col gap-6"
                        >
                            {step < 3 ? (
                                <div className="flex-1 flex items-center justify-center border border-white/5 rounded-2xl bg-white/[0.01] relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
                                    <div className="text-center relative z-10 px-6">
                                        <Bot className="w-12 h-12 text-primary mx-auto mb-4 animate-bounce" />
                                        <p className="text-sm text-white/60 mb-1">Synthesizing {agent.name} Logic...</p>
                                        <div className="w-48 h-1 bg-white/5 mx-auto rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ x: '-100%' }}
                                                animate={{ x: '100%' }}
                                                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                                className="w-full h-full bg-primary"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col gap-4">
                                    <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 shadow-inner">
                                        <p className="text-[10px] text-primary uppercase tracking-[0.2em] font-bold mb-3">Response Ready</p>
                                        <p className="text-lg text-white/90 leading-relaxed font-sans font-medium">
                                            {agent.output}
                                        </p>
                                    </div>

                                    <div className="flex-1 grid grid-cols-2 gap-4">
                                        <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-4">
                                            <div className="h-1.5 w-12 bg-primary/40 rounded-full mb-3" />
                                            <div className="h-3 w-full bg-white/5 rounded-md mb-2" />
                                            <div className="h-3 w-[80%] bg-white/5 rounded-md" />
                                        </div>
                                        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 flex flex-col items-center justify-center">
                                            <Activity className="w-8 h-8 text-primary/50 mb-2" />
                                            <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Efficiency +34%</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    <div className="mt-6 flex items-center justify-between text-white/20 text-[10px] uppercase tracking-widest">
                        <span>© A-SERIES BIOMETRIC SECURE</span>
                        <span>UWO-LINK ENABLED</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIGeneratedVideoSim;
