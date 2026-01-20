import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Tag, Repeat } from 'lucide-react';

const TaskModal = ({ isOpen, onClose, onSave, task = null }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Personal',
        date: '',
        time: '',
        recurring: 'none',
        isUrgent: false
    });

    useEffect(() => {
        if (task) {
            const dt = new Date(task.datetime);
            setFormData({
                title: task.title,
                description: task.description || '',
                category: task.category,
                date: dt.toISOString().split('T')[0],
                time: dt.toTimeString().slice(0, 5),
                recurring: task.recurring || 'none',
                isUrgent: task.isUrgent || false
            });
        } else {
            // Reset or Default
            setFormData({
                title: '',
                description: '',
                category: 'Personal',
                date: new Date().toISOString().split('T')[0],
                time: '12:00',
                recurring: 'none',
                isUrgent: false
            });
        }
    }, [task, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        // Combine date and time
        const dateTime = new Date(`${formData.date}T${formData.time}`);
        onSave({ ...formData, datetime: dateTime });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-[#1A1A1A] w-full max-w-md rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col max-h-[90vh]">
                <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                        {task ? 'Edit Task' : 'New Task'}
                    </h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-white/10">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            className="w-full p-2 rounded-lg bg-gray-50 dark:bg-[#2A2A2A] border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary outline-none"
                            placeholder="e.g., Take Medicine"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            className="w-full p-2 rounded-lg bg-gray-50 dark:bg-[#2A2A2A] border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary outline-none h-20 resize-none"
                            placeholder="Details..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> Date</label>
                            <div className="flex gap-2">
                                {/* Day */}
                                <select
                                    className="flex-1 p-2 rounded-lg bg-gray-50 dark:bg-[#2A2A2A] border border-gray-200 dark:border-gray-700 outline-none text-center appearance-none"
                                    value={parseInt(formData.date.split('-')[2])}
                                    onChange={(e) => {
                                        const [y, m, d] = formData.date.split('-');
                                        setFormData({ ...formData, date: `${y}-${m}-${e.target.value.toString().padStart(2, '0')}` });
                                    }}
                                >
                                    {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>

                                {/* Month */}
                                <select
                                    className="flex-[1.5] p-2 rounded-lg bg-gray-50 dark:bg-[#2A2A2A] border border-gray-200 dark:border-gray-700 outline-none text-center appearance-none"
                                    value={parseInt(formData.date.split('-')[1])}
                                    onChange={(e) => {
                                        const [y, m, d] = formData.date.split('-');
                                        setFormData({ ...formData, date: `${y}-${e.target.value.toString().padStart(2, '0')}-${d}` });
                                    }}
                                >
                                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m, i) => (
                                        <option key={i} value={i + 1}>{m}</option>
                                    ))}
                                </select>

                                {/* Year */}
                                <select
                                    className="flex-[1.2] p-2 rounded-lg bg-gray-50 dark:bg-[#2A2A2A] border border-gray-200 dark:border-gray-700 outline-none text-center appearance-none"
                                    value={parseInt(formData.date.split('-')[0])}
                                    onChange={(e) => {
                                        const [y, m, d] = formData.date.split('-');
                                        setFormData({ ...formData, date: `${e.target.value}-${m}-${d}` });
                                    }}
                                >
                                    {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(y => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1"><Clock className="w-3 h-3" /> Time</label>
                            <div className="flex gap-2">
                                {/* Hour */}
                                <select
                                    className="flex-1 p-2 rounded-lg bg-gray-50 dark:bg-[#2A2A2A] border border-gray-200 dark:border-gray-700 outline-none text-center appearance-none"
                                    value={(() => {
                                        const h = parseInt((formData.time || '12:00').split(':')[0]);
                                        return h % 12 || 12;
                                    })()}
                                    onChange={(e) => {
                                        const [h, m] = (formData.time || '12:00').split(':');
                                        const currentH = parseInt(h);
                                        const isPM = currentH >= 12;
                                        let newH = parseInt(e.target.value);

                                        if (isPM && newH !== 12) newH += 12;
                                        if (!isPM && newH === 12) newH = 0;
                                        else if (isPM && newH === 12) newH = 12; // 12 PM stays 12

                                        setFormData({ ...formData, time: `${newH.toString().padStart(2, '0')}:${m}` });
                                    }}
                                >
                                    {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
                                        <option key={h} value={h}>{h}</option>
                                    ))}
                                </select>

                                <span className="flex items-center text-gray-400 font-bold">:</span>

                                {/* Minute */}
                                <select
                                    className="flex-1 p-2 rounded-lg bg-gray-50 dark:bg-[#2A2A2A] border border-gray-200 dark:border-gray-700 outline-none text-center appearance-none"
                                    value={(formData.time || '12:00').split(':')[1]}
                                    onChange={(e) => {
                                        const [h] = (formData.time || '12:00').split(':');
                                        setFormData({ ...formData, time: `${h}:${e.target.value}` });
                                    }}
                                >
                                    {Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0')).map(m => (
                                        <option key={m} value={m}>{m}</option>
                                    ))}
                                </select>

                                {/* AM/PM */}
                                <select
                                    className="flex-1 p-2 rounded-lg bg-gray-50 dark:bg-[#2A2A2A] border border-gray-200 dark:border-gray-700 outline-none text-center appearance-none"
                                    value={parseInt((formData.time || '12:00').split(':')[0]) >= 12 ? 'PM' : 'AM'}
                                    onChange={(e) => {
                                        let [h, m] = (formData.time || '12:00').split(':');
                                        let hour = parseInt(h);
                                        const isPM = e.target.value === 'PM';

                                        if (isPM && hour < 12) hour += 12;
                                        if (!isPM && hour >= 12) hour -= 12;

                                        setFormData({ ...formData, time: `${hour.toString().padStart(2, '0')}:${m}` });
                                    }}
                                >
                                    <option value="AM">AM</option>
                                    <option value="PM">PM</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1"><Tag className="w-3 h-3" /> Category</label>
                            <select
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                className="w-full p-2 rounded-lg bg-gray-50 dark:bg-[#2A2A2A] border border-gray-200 dark:border-gray-700 outline-none"
                            >
                                <option value="Personal">👤 Personal</option>
                                <option value="Work">💼 Work</option>
                                <option value="Office">🏢 Office</option>
                                <option value="Meeting">🤝 Meeting</option>
                                <option value="Health">❤️ Health</option>
                                <option value="Education">🎓 Education</option>
                                <option value="Finance">💰 Finance</option>
                                <option value="Shopping">🛒 Shopping</option>
                                <option value="Traveling">✈️ Traveling</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1"><Repeat className="w-3 h-3" /> Repeat</label>
                            <select
                                value={formData.recurring}
                                onChange={e => setFormData({ ...formData, recurring: e.target.value })}
                                className="w-full p-2 rounded-lg bg-gray-50 dark:bg-[#2A2A2A] border border-gray-200 dark:border-gray-700 outline-none"
                            >
                                <option value="none">No Repeat</option>
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                                <option value="yearly">Yearly</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="urgent"
                            checked={formData.isUrgent}
                            onChange={e => setFormData({ ...formData, isUrgent: e.target.checked })}
                            className="w-4 h-4 rounded border-gray-300 text-red-500 focus:ring-red-500"
                        />
                        <label htmlFor="urgent" className="text-sm font-medium text-gray-700 dark:text-gray-300">Urgent Mode (Persistent Alarm)</label>
                    </div>

                    <button type="submit" className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors mt-2">
                        Save Task
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TaskModal;
