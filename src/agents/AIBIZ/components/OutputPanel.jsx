const formatOutput = (text = "") => {
    return text
        .replace(/^### (.*$)/gim, "<h3 class='text-xl font-bold text-gray-900 mt-6 mb-3'>$1</h3>")
        .replace(/^## (.*$)/gim, "<h2 class='text-2xl font-bold text-gray-900 mt-8 mb-4'>$1</h2>")
        .replace(/^# (.*$)/gim, "<h1 class='text-3xl font-bold text-gray-900 mt-8 mb-4'>$1</h1>")
        .replace(/\*\*(.*?)\*\*/gim, "<strong class='font-semibold text-gray-900'>$1</strong>")
        .replace(/\n---\n/gim, "<hr class='my-6 border-gray-300' />")
        .replace(/\n/gim, "<br />");
};

export default function OutputPanel({ output, loading, hasGenerated }) {
    const handleDownload = () => {
        if (!output) return;

        const blob = new Blob([output], { type: "text/plain" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "AIBIZ_Document.txt";
        a.click();

        URL.revokeObjectURL(url);
    };

    return (
        <div className="h-full flex flex-col">
            {/* AIBIZ HEADER */}
            <div className="flex items-center space-x-4 mb-8 pb-6 border-b border-gray-200">
                <img
                    src="/AIBIZ.png"
                    alt="AIBIZ Logo"
                    className="w-16 h-16 rounded-2xl shadow-lg object-contain"
                    onError={(e) => {
                        // Fallback to gradient icon if image fails to load
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                    }}
                />
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl hidden items-center justify-center shadow-lg">
                    <svg
                        className="w-10 h-10 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                    </svg>
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        AIBIZ<span className="text-sm align-super text-blue-600">™</span>
                    </h2>
                    <p className="text-gray-600 text-sm">
                        AI Business Document Generator
                    </p>
                </div>
            </div>

            {/* EMPTY STATE */}
            {!hasGenerated && (
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center max-w-md px-4">
                        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg
                                className="w-10 h-10 text-blue-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 10V3L4 14h7v7l9-11h-7z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                            How can I help you today?
                        </h3>
                        <p className="text-gray-600 text-lg">
                            Fill the form and generate your business document.
                        </p>
                    </div>
                </div>
            )}

            {/* LOADING */}
            {loading && (
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                            <svg
                                className="animate-spin h-8 w-8 text-blue-600"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                        </div>
                        <p className="text-lg font-medium text-gray-900 mb-2">
                            Generating your document...
                        </p>
                        <p className="text-gray-600">
                            This may take a few moments
                        </p>
                    </div>
                </div>
            )}

            {/* OUTPUT */}
            {!loading && output && (
                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-auto">
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 lg:p-8 shadow-inner">
                            <div className="flex items-start space-x-3 mb-4">
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <span className="text-white font-bold text-sm">AI</span>
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-900 mb-1">AIBIZ</p>
                                    <div
                                        className="prose prose-sm max-w-none text-gray-800 leading-relaxed"
                                        dangerouslySetInnerHTML={{
                                            __html: formatOutput(output),
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* DOWNLOAD BUTTON */}
                    <div className="pt-6 border-t border-gray-200 mt-6">
                        <button
                            onClick={handleDownload}
                            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                />
                            </svg>
                            <span>Download Document</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
