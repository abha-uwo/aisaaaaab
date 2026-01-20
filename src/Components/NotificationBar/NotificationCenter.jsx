import React, { useState, useEffect } from 'react';
import { Bell, X, CheckCircle, AlertCircle, Info, Clock, ExternalLink } from 'lucide-react';
import apiService from '../../services/apiService';
import { motion, AnimatePresence } from 'motion/react';

const NotificationCenter = ({ isOpen, onClose }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const data = await apiService.getNotifications();
            setNotifications(data);
        } catch (err) {
            console.error("Failed to fetch notifications:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
        }
    }, [isOpen]);

    const handleMarkAsRead = async (id) => {
        try {
            await apiService.markNotificationRead(id);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (err) {
            console.error(err);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex justify-end">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />

            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="relative w-full max-w-md bg-card h-screen shadow-2xl flex flex-col"
            >
                {/* Header */}
                <div className="p-6 border-b border-border flex items-center justify-between bg-card sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary">
                            <Bell className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-maintext">Notifications</h2>
                            <p className="text-xs text-subtext">Stay updated on your app reviews</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full transition-colors">
                        <X className="w-6 h-6 text-subtext" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Clock className="w-8 h-8 text-subtext animate-spin" />
                        </div>
                    ) : notifications.length > 0 ? (
                        <AnimatePresence mode='popLayout'>
                            {notifications.map((notif) => (
                                <motion.div
                                    key={notif._id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`p-5 rounded-2xl border transition-all ${notif.isRead ? 'bg-card border-border opacity-70' : 'bg-primary/5 border-primary/10 shadow-sm'
                                        }`}
                                    onClick={() => !notif.isRead && handleMarkAsRead(notif._id)}
                                >
                                    <div className="flex gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${notif.type === 'success' ? 'bg-green-100 text-green-600' :
                                            notif.type === 'error' ? 'bg-red-100 text-red-600' : 'bg-primary/10 text-primary'
                                            }`}>
                                            {notif.type === 'success' ? <CheckCircle className="w-5 h-5" /> :
                                                notif.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                                        </div>
                                        <div className="flex-1">
                                            <p className={`text-sm leading-relaxed ${notif.isRead ? 'text-subtext' : 'text-maintext font-medium'}`}>
                                                {notif.message}
                                            </p>
                                            <div className="flex items-center justify-between mt-3 text-[10px] font-bold text-subtext uppercase tracking-widest">
                                                <span>{new Date(notif.createdAt).toLocaleDateString()} at {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                {!notif.isRead && <span className="w-2 h-2 bg-primary rounded-full"></span>}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    ) : (
                        <div className="py-20 text-center">
                            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 border border-border">
                                <Bell className="w-8 h-8 text-subtext" />
                            </div>
                            <h3 className="font-bold text-maintext">No notifications yet</h3>
                            <p className="text-sm text-subtext mt-1">We'll notify you here when your apps are reviewed.</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-border bg-secondary/50">
                    <button
                        onClick={() => setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))}
                        className="w-full py-3 text-sm font-bold text-primary hover:bg-card rounded-xl transition-all border border-transparent hover:border-border"
                    >
                        Mark all as read
                    </button>
                </div>
            </motion.div>
        </div >
    );
};

export default NotificationCenter;
