import { useState } from "react";

export default function HistorySidebar({
    history,
    isOpen,
    onToggle,
    onLoadHistory,
    onDeleteHistory,
}) {
    const [hoveredId, setHoveredId] = useState(null);

    const getDocIcon = (docType) => {
        switch (docType) {
            case "business_plan":
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                );
            case "pitch_deck":
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                );
            case "strategy":
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                );
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Unknown date";
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now - date;
        const diffInMins = Math.floor(diffInMs / 60000);
        const diffInHours = Math.floor(diffInMs / 3600000);
        const diffInDays = Math.floor(diffInMs / 86400000);

        if (diffInMins < 1) return "Just now";
        if (diffInMins < 60) return `${diffInMins} min ago`;
        if (diffInHours < 24) return `${diffInHours}h ago`;
        if (diffInDays < 7) return `${diffInDays}d ago`;
        return date.toLocaleDateString();
    };

    const getDocTypeLabel = (docType) => {
        const labels = {
            business_plan: "Business Plan",
            pitch_deck: "Pitch Deck",
            strategy: "Strategy Doc",
        };
        return labels[docType] || docType;
    };

    const handleDelete = (e, id) => {
        e.stopPropagation();
        e.preventDefault();
        if (window.confirm("Are you sure you want to delete this document?")) {
            onDeleteHistory(id);
        }
    };

    return (
        <>
            {/* Toggle Button (Mobile) */}
            <button
                onClick={onToggle}
                className={`fixed top-4 right-4 z-50 lg:hidden bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all ${isOpen ? "hidden" : "block"
                    }`}
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </button>

            {/* Sidebar */}
            <div
                className={`fixed lg:relative right-0 top-0 h-full bg-white border-l border-gray-200 shadow-2xl lg:shadow-none transition-all duration-300 z-40 ${isOpen ? "w-80 lg:w-96" : "w-0"
                    } overflow-hidden`}
            >
                <div className="h-full flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">History</h2>
                                <p className="text-xs text-gray-600">
                                    {history.length} {history.length === 1 ? "document" : "documents"}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onToggle}
                            className="p-2 hover:bg-white rounded-lg transition-colors"
                        >
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* History List */}
                    <div className="flex-1 overflow-auto p-4 space-y-3">
                        {history.length === 0 ? (
                            <div className="text-center py-12 px-4">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <p className="text-gray-600 font-medium mb-2">No documents yet</p>
                                <p className="text-sm text-gray-500">
                                    Your generated documents will appear here
                                </p>
                            </div>
                        ) : (
                            history.map((item) => (
                                <div
                                    key={item._id}
                                    onMouseEnter={() => setHoveredId(item._id)}
                                    onMouseLeave={() => setHoveredId(null)}
                                    className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
                                    onClick={() => onLoadHistory(item)}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-start space-x-3 flex-1 min-w-0">
                                            <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0 group-hover:bg-blue-200 transition-colors">
                                                {getDocIcon(item.docType)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                                                    {item.businessName || "Untitled Document"}
                                                </h4>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {formatDate(item.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={(e) => handleDelete(e, item._id)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all flex-shrink-0 ml-2"
                                            title="Delete document"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {getDocTypeLabel(item.docType)}
                                        </span>
                                        {item.industry && (
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                                {item.industry}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={onToggle}
                />
            )}
        </>
    );
}
