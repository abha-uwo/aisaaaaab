import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { Send, Bot, User, Upload, FileText, Loader2, MessageSquare, Plus, Trash2, Paperclip, Search } from 'lucide-react';
import Button from '../../components/common/Button';
import UploadModal from '../../components/common/UploadModal';
import api from '../../services/api';

const Chat = () => {
    const [messages, setMessages] = useState([
        { id: 1, role: 'assistant', text: 'Hello! I am your AI-Base Knowledge Assistant. I can help you with general queries and questions from your uploaded documents.' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [conversationId, setConversationId] = useState(null);
    const [history, setHistory] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const loadHistory = async (query = '') => {
        try {
            const endpoint = query ? `/chat/history?search=${encodeURIComponent(query)}` : '/chat/history';
            const response = await api.get(endpoint);
            if (response.data.success) {
                setHistory(response.data.data);
            }
        } catch (error) {
            console.error("Failed to load history", error);
        }
    };

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            loadHistory(searchQuery);
        }, 500); // 500ms debounce
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const loadConversation = async (id) => {
        try {
            const response = await api.get(`/chat/${id}`);
            if (response.data.success) {
                const conv = response.data.data;
                setConversationId(conv._id);
                // Map backend messages to UI format
                // Backend: { role: 'user', text: '...' }
                // UI: { id: ..., role: 'user', text: '...' }
                setMessages(conv.messages.map((m, i) => ({
                    id: i,
                    role: m.role,
                    text: m.text
                })));
            }
        } catch (error) {
            console.error("Failed to load conversation", error);
        }
    };

    const startNewChat = () => {
        setConversationId(null);
        setActiveDocContext(null);
        setActiveFileName(null);
        setMessages([{ id: Date.now(), role: 'assistant', text: 'Hello! I am your AI-Base Knowledge Assistant. I can help you with general queries and questions from your uploaded documents.' }]);
    };

    const handleDeleteChat = async (id, e) => {
        e.stopPropagation();
        if (!window.confirm('Delete this conversation?')) return;

        try {
            await api.delete(`/chat/${id}`);
            toast.success('Conversation deleted');
            // If deleting current chat, reset
            if (conversationId === id) {
                startNewChat();
            }
            loadHistory();
        } catch (error) {
            console.error("Failed to delete chat", error);
            toast.error("Failed to delete conversation");
        }
    };

    // Initial load handled by search useEffect
    // useEffect(() => {
    //     loadHistory();
    // }, []);

    // Auto-scroll to bottom
    const messagesEndRef = useRef(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const [activeDocContext, setActiveDocContext] = useState(null);
    const [activeFileName, setActiveFileName] = useState(null);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input;
        setInput('');

        // Add user message
        setMessages(prev => [...prev, { id: Date.now(), role: 'user', text: userMessage }]);
        setIsLoading(true);

        try {
            // Call the real backend API with conversationId if exists
            // Pass activeDocContext if we have a file loaded in chat
            const response = await api.post('/chat', {
                message: userMessage,
                conversationId: conversationId,
                activeDocContent: activeDocContext
            });

            // Add AI response
            if (response.data.success) {
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    role: 'assistant',
                    text: response.data.data
                }]);

                // If this was a new conversation, set the ID
                if (!conversationId && response.data.conversationId) {
                    setConversationId(response.data.conversationId);
                    loadHistory(); // Refresh sidebar to show new chat
                }
            }
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                role: 'assistant',
                text: error.response?.data?.message || error.message || "Sorry, I encountered an error connecting to the knowledge base. Please try again."
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const [isUploading, setIsUploading] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    const handleModalUpload = async (filesOrFile) => {
        const files = Array.isArray(filesOrFile) ? filesOrFile : [filesOrFile];
        if (!files || files.length === 0) return;

        setIsUploading(true);
        const formData = new FormData();
        files.forEach(file => {
            formData.append('file', file);
        });

        try {
            setMessages(prev => [...prev, {
                id: Date.now(),
                role: 'assistant',
                text: `Uploading ${files.length} file(s)...`
            }]);

            const response = await api.post('/chat/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.success) {
                const results = Array.isArray(response.data.data) ? response.data.data : [response.data.data];

                // Combine texts from all files
                const contextParts = results
                    .filter(r => r.parsedText)
                    .map(r => `--- Start of ${r.filename} ---\n${r.parsedText}\n--- End of ${r.filename} ---`);

                const combinedText = contextParts.join('\n\n');

                if (combinedText) {
                    setActiveDocContext(combinedText);
                    const name = results.length === 1 ? results[0].filename : `${results.length} files`;
                    setActiveFileName(name);
                }

                setMessages(prev => {
                    const newMsgs = [...prev];
                    const msgText = `✅ Loaded ${results.length} file(s) into context. I am ready to answer questions about them.`;
                    newMsgs[newMsgs.length - 1].text = msgText;
                    return newMsgs;
                });
                toast.success('Files loaded for chat!');
                setIsUploadModalOpen(false);
            }
        } catch (error) {
            console.error("Upload failed", error);
            const errMsg = error.response?.data?.message || 'Please try again.';
            toast.error(`Upload failed: ${errMsg}`);
            setMessages(prev => {
                const newMsgs = [...prev];
                newMsgs[newMsgs.length - 1].text = `❌ Failed to upload files. ${errMsg}`;
                return newMsgs;
            });
        } finally {
            setIsUploading(false);
        }
    };

    // Paste Handler
    useEffect(() => {
        const handlePaste = (e) => {
            // Only handle paste if no active input focus (optional, but good for UX) 
            // - actually user might want to paste image while typing text.
            if (e.clipboardData && e.clipboardData.files.length > 0) {
                e.preventDefault();
                const pastedFiles = Array.from(e.clipboardData.files);
                // Filter large files
                const validFiles = pastedFiles.filter(f => f.size <= 50 * 1024 * 1024);

                if (validFiles.length < pastedFiles.length) {
                    toast.error("Some files were skipped (limit 50MB)");
                }

                if (validFiles.length > 0) {
                    handleModalUpload(validFiles);
                }
            }
        };

        window.addEventListener('paste', handlePaste);
        return () => window.removeEventListener('paste', handlePaste);
    }, []);

    return (
        <div className="flex h-full gap-4 p-4">

            {/* Conversation History Sidebar */}
            <div className="w-80 bg-white rounded-2xl shadow-sm border border-border flex flex-col overflow-hidden hidden md:flex">
                <div className="p-4 border-b border-border bg-surface/50">
                    <h3 className="font-semibold text-maintext flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-primary" />
                        Conversations
                    </h3>
                </div>

                <div className="px-4 pb-2">
                    <Button
                        size="sm"
                        variant="secondary"
                        className="w-full justify-start gap-2 mb-3"
                        onClick={startNewChat}
                    >
                        <Plus className="w-4 h-4" />
                        New Chat
                    </Button>

                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-subtext group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Search chats..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-3 py-2.5 bg-surface rounded-xl text-sm border-none focus:ring-1 focus:ring-primary/50 placeholder-subtext transition-all"
                        />
                    </div>
                </div>

                <div className="flex-1 p-4 overflow-y-auto space-y-2">
                    <p className="text-xs font-semibold text-subtext uppercase tracking-wider mb-2">Recent</p>
                    {history.length === 0 && (
                        <p className="text-xs text-subtext italic p-2">No past conversations.</p>
                    )}
                    {history.map((chat) => (
                        <div
                            key={chat._id}
                            onClick={() => loadConversation(chat._id)}
                            className={`p-3 hover:bg-surface rounded-xl cursor-pointer transition-colors group flex items-start justify-between gap-2 ${conversationId === chat._id ? 'bg-surface border border-primary/20' : ''}`}
                        >
                            <div className="min-w-0">
                                <p className={`text-sm font-medium truncate transition-colors ${conversationId === chat._id ? 'text-primary' : 'text-maintext group-hover:text-primary'}`}>
                                    {chat.title}
                                </p>
                                <p className="text-xs text-subtext mt-1">
                                    {new Date(chat.lastMessageAt).toLocaleDateString()}
                                </p>
                            </div>
                            <button
                                onClick={(e) => handleDeleteChat(chat._id, e)}
                                className="opacity-0 group-hover:opacity-100 p-1 text-subtext hover:text-red-500 hover:bg-red-50 rounded transition-all"
                                title="Delete Chat"
                            >
                                <Trash2 className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-border flex flex-col overflow-hidden px-4 md:px-0">

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'assistant' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-600'}`}>
                                {msg.role === 'assistant' ? <Bot className="w-6 h-6" /> : <User className="w-6 h-6" />}
                            </div>
                            <div className={`max-w-[80%] p-4 rounded-2xl ${msg.role === 'assistant' ? 'bg-surface text-maintext rounded-tl-none' : 'bg-primary text-white rounded-tr-none'}`}>
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                                <Bot className="w-6 h-6" />
                            </div>
                            <div className="bg-surface p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin text-subtext" />
                                <span className="text-sm text-subtext">Thinking...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Active Context Indicator */}
                {activeFileName && (
                    <div className="px-4 py-2 bg-blue-50 border-t border-blue-100 flex items-center justify-between">
                        <span className="text-xs text-blue-700 flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            Active Context: <strong>{activeFileName}</strong>
                        </span>
                        <button
                            onClick={() => { setActiveDocContext(null); setActiveFileName(null); }}
                            className="text-xs text-blue-500 hover:text-blue-700 underline"
                        >
                            Clear
                        </button>
                    </div>
                )}

                {/* Input Area */}
                <div className="p-4 border-t border-border bg-white">
                    <form onSubmit={handleSend} className="relative flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setIsUploadModalOpen(true)}
                            className="p-3 text-subtext hover:text-primary hover:bg-surface rounded-xl transition-colors"
                            title="Upload files (Max 50MB)"
                            disabled={isUploading || isLoading}
                        >
                            {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Paperclip className="w-5 h-5" />}
                        </button>

                        <div className="relative flex-1">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask anything..."
                                className="w-full pl-6 pr-14 py-4 bg-surface border-none rounded-2xl focus:ring-2 focus:ring-primary/20 text-maintext placeholder-subtext shadow-inner"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md shadow-primary/25"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </form>
                    <div className="text-center mt-2 flex flex-col gap-1">
                        <p className="text-xs text-subtext">Supported: All files (Max 50MB) • AI-Base can make mistakes.</p>
                    </div>
                </div>

            </div>

            <UploadModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                onUpload={handleModalUpload}
                isUploading={isUploading}
            />
        </div>
    );
};

export default Chat;
