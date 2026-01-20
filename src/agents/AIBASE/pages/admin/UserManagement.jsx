import React, { useState } from 'react';
import { FileText, Settings, LayoutDashboard, Upload } from 'lucide-react';
import Button from '../../components/common/Button';
import api from '../../services/api';

const UserManagement = () => {
    const [activeTab, setActiveTab] = useState('dashboard');

    // User Management logic removed as per request

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-maintext">Admin Panel</h1>
                <p className="text-subtext mt-1">System overview and control center.</p>
            </div>

            {/* Tabs Navigation */}
            <div className="flex border-b border-border">
                <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`px-6 py-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'dashboard' ? 'border-primary text-primary' : 'border-transparent text-subtext hover:text-maintext'}`}
                >
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                </button>
                <button
                    onClick={() => setActiveTab('knowledge-base')}
                    className={`px-6 py-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'knowledge-base' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-subtext hover:text-maintext'}`}
                >
                    <FileText className="w-4 h-4" /> Knowledge Base
                </button>
                <button
                    onClick={() => setActiveTab('settings')}
                    className={`px-6 py-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'settings' ? 'border-primary text-primary' : 'border-transparent text-subtext hover:text-maintext'}`}
                >
                    <Settings className="w-4 h-4" /> Settings
                </button>
            </div>

            {/* Tab: Knowledge Base */}
            {activeTab === 'knowledge-base' && (
                <div className="space-y-4">
                    <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-maintext">Company Knowledge Base (RAG)</h2>
                                <p className="text-subtext text-sm">Upload documents to train the AI on company data.</p>
                            </div>
                        </div>

                        <div className="bg-white border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center hover:border-primary/50 transition-colors group">
                            <Upload className="w-12 h-12 text-subtext group-hover:text-primary mb-4 transition-colors" />
                            <h3 className="text-lg font-medium text-maintext">Drag and drop files here</h3>
                            <p className="text-sm text-subtext mb-6">Limit 200MB per file • PDF, TXT, DOCX</p>

                            <input
                                type="file"
                                id="admin-file-upload"
                                className="hidden"
                                onChange={async (e) => {
                                    const file = e.target.files[0];
                                    if (!file) return;

                                    const formData = new FormData();
                                    formData.append('file', file);

                                    try {
                                        alert(`Uploading ${file.name}...`);
                                        const response = await api.post('/knowledge/upload', formData, {
                                            headers: { 'Content-Type': 'multipart/form-data' }
                                        });
                                        if (response.data.success) {
                                            alert(`✅ Successfully indexed ${file.name}`);
                                        }
                                    } catch (error) {
                                        alert("❌ Upload failed");
                                    }
                                }}
                            />
                            <Button onClick={() => document.getElementById('admin-file-upload').click()}>
                                Browse Files
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Tab: Dashboard (Placeholder) */}
            {activeTab === 'dashboard' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
                        <h3 className="text-subtext text-sm font-medium uppercase tracking-wider">System Status</h3>
                        <p className="text-2xl font-bold text-green-500 mt-2">Operational</p>
                    </div>
                </div>
            )}

            {/* Tab: Settings (Placeholder) */}
            {activeTab === 'settings' && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
                    <p className="text-subtext">Settings configuration coming soon...</p>
                </div>
            )}

        </div>
    );
};

export default UserManagement;
