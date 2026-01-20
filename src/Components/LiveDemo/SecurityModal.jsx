import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, FileText, Scale, Eye, AlertTriangle, X } from 'lucide-react';
import ReportModal from '../ReportModal/ReportModal';

const SecurityModal = ({ isOpen, onClose }) => {
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    const sections = [
        {
            id: 1,
            title: "1. Data Privacy & Protection",
            icon: <Lock className="w-5 h-5 text-primary" />,
            content: (
                <div className="space-y-4">
                    <p className="text-subtext">A-Series™ is committed to safeguarding user data in accordance with applicable data protection laws, including but not limited to GDPR and CCPA.</p>
                    ...
                    <p className="text-sm text-subtext">A-Series™ may collect personal and technical information including account details, usage metadata, device identifiers, and file access permissions.</p>
                    ...
                    <p className="text-sm text-subtext">A-Series™ does not sell personal data. Data may be shared with trusted third-party service providers strictly for operational requirements.</p>
                    ...
                    <p className="text-sm text-subtext">Users retain the right to access, rectify, or request deletion of their data by contacting contact@a-series.in.</p>
                </div>
            )
        },
        {
            id: 2,
            title: "2. Account Security Responsibilities",
            icon: <Shield className="w-5 h-5 text-primary" />,
            content: (
                <div className="space-y-3 text-subtext">
                    <p><strong>2.1</strong> Users are responsible for maintaining the confidentiality of their credentials.</p>
                    <p><strong>2.2</strong> A-Series™ employs encryption and secure session handling. Users must report unauthorized access immediately.</p>
                </div>
            )
        },
        {
            id: 3,
            title: "3. Acceptable Use & Prohibited Conduct",
            icon: <AlertTriangle className="w-5 h-5 text-primary" />,
            content: (
                <div className="space-y-3">
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {[
                            "Illegal or unauthorized use",
                            "Reverse engineering models",
                            "Uploading malicious content",
                            "Bypassing security controls"
                        ].map((item, i) => (
                            <li key={i} className="flex items-center gap-2 text-xs text-subtext bg-surface p-2 rounded-lg border border-border">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            )
        },
        {
            id: 4,
            title: "4. AI Usage & Content Disclaimer",
            icon: <Scale className="w-5 h-5 text-primary" />,
            content: (
                <div className="space-y-3">
                    <div className="bg-surface/50 p-3 rounded-lg border border-border">
                        <p className="text-xs text-subtext"><strong>4.1 Accuracy:</strong> AI outputs are provided on an “as-is” basis and may contain inaccuracies.</p>
                    </div>
                    <div className="bg-surface/50 p-3 rounded-lg border border-border">
                        <p className="text-xs text-subtext"><strong>4.2 Reliability:</strong> A-Series™ is not responsible for outcomes arising from reliance on AI-generated content.</p>
                    </div>
                </div>
            )
        },
        {
            id: 5,
            title: "5. File Upload & Document Security",
            icon: <FileText className="w-5 h-5 text-primary" />,
            content: (
                <div className="space-y-2 text-subtext text-sm">
                    <p>Uploaded files are processed solely for functionality (analysis, RAG). Executable or malicious files may be rejected.</p>
                </div>
            )
        },
        {
            id: 6,
            title: "6. Cookies & Tracking",
            icon: <Eye className="w-5 h-5 text-primary" />,
            content: <p className="text-subtext text-sm">A-Series™ uses cookies for functionality and security. Users may manage cookies via browser settings.</p>
        },
        {
            id: 7,
            title: "7. Third-Party Services",
            icon: <div className="w-5 h-5 flex items-center justify-center font-bold text-primary text-xs border border-primary/20 rounded-md">3P</div>,
            content: <p className="text-subtext text-sm">Integrations with cloud providers and AI services are governed by contracts and limited to operational necessity.</p>
        },
        {
            id: 8,
            title: "8. Intellectual Property",
            icon: <div className="w-5 h-5 flex items-center justify-center font-bold text-primary text-xs border border-primary/20 rounded-md">©</div>,
            content: <p className="text-subtext text-sm">All rights, licenses, and ownership remain with A-Series™ and UWO™. No transfer of ownership is implied.</p>
        },
        {
            id: 9,
            title: "9. Enforcement",
            icon: <AlertTriangle className="w-5 h-5 text-primary" />,
            content: <p className="text-subtext text-sm">We monitor for compliance and reserve the right to suspend or terminate accounts for violations or security threats.</p>
        },
        {
            id: 10,
            title: "10. Policy Updates",
            icon: <FileText className="w-5 h-5 text-primary" />,
            content: <p className="text-subtext text-sm">Modifications may occur at any time. Continued use of the platform constitutes acceptance of updated terms.</p>
        },
        {
            id: 11,
            title: "11. Contact",
            icon: <FileText className="w-5 h-5 text-primary" />,
            content: <p className="text-subtext text-sm">For concerns or rights requests, contact <span className="text-primary font-bold">contact@a-series.in</span>.</p>
        },
        {
            id: 12,
            title: "12. Incident Support",
            icon: <AlertTriangle className="w-5 h-5 text-blue-500" />,
            content: (
                <div className="space-y-4">
                    <p className="text-subtext text-xs">Report security violations or technical issues immediately.</p>
                    <div className="flex flex-wrap gap-2">
                        <button onClick={() => setIsReportModalOpen(true)} className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold border border-blue-200 hover:bg-blue-100 transition-colors">
                            📧 Open Form
                        </button>
                        <a href="tel:+918358990909" className="px-3 py-1.5 bg-primary/5 text-primary rounded-lg text-[10px] font-bold border border-primary/20 hover:bg-primary/10 transition-colors">
                            📞 +91 83589 90909
                        </a>
                    </div>
                </div>
            )
        }
    ];

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-4xl bg-card rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-border flex items-center justify-between bg-surface/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                        <Shield className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-maintext">Security & Guidelines</h2>
                                        <p className="text-[10px] text-subtext uppercase tracking-widest font-bold">Comprehensive Platform Policy</p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-black/5 rounded-full text-subtext transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar space-y-8">
                                <div className="bg-secondary/50 border border-border rounded-xl p-6 shadow-sm">
                                    <p className="text-sm text-subtext leading-relaxed">
                                        This section governs the acceptable use, data protection practices, and security standards applicable to <span className="text-maintext font-semibold">A-Series™</span>, operated by <span className="text-maintext font-semibold">UWO™</span>.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {sections.map((section, index) => (
                                        <motion.div
                                            key={section.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="bg-card border border-border rounded-2xl p-5 hover:border-primary/30 transition-all flex flex-col"
                                        >
                                            <div className="flex items-center gap-3 mb-3 border-b border-border/30 pb-2">
                                                {section.icon}
                                                <h3 className="text-sm font-bold text-maintext">{section.title}</h3>
                                            </div>
                                            <div className="flex-1">
                                                {section.content}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="bg-surface border border-border rounded-2xl p-6">
                                    <h3 className="font-bold text-maintext mb-2 flex items-center gap-2 text-sm">
                                        🧠 Legal Summary
                                    </h3>
                                    <p className="text-subtext text-xs italic">
                                        "These Guidelines establish the framework for lawful use, data protection, AI governance, and operational security within the A-Series platform."
                                    </p>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-6 bg-surface border-t border-border flex justify-end">
                                <button
                                    onClick={onClose}
                                    className="px-10 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                                >
                                    Close Guidelines
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            <ReportModal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} />
        </>
    );
};

export default SecurityModal;
