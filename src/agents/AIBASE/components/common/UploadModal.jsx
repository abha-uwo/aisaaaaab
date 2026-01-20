import React, { useState, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { X, Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import Button from './Button';

const MAX_FILE_SIZE_MB = 50;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const UploadModal = ({ isOpen, onClose, onUpload, isUploading }) => {
    const [files, setFiles] = useState([]);
    const [error, setError] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    // Reset when modal opens/closes
    useEffect(() => {
        if (!isOpen) {
            setFiles([]);
            setError(null);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const validateFile = (selectedFile) => {
        // Check size
        if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
            return `File "${selectedFile.name}" exceeds ${MAX_FILE_SIZE_MB}MB limit.`;
        }
        // Check for duplicates
        if (files.some(f => f.name === selectedFile.name && f.size === selectedFile.size)) {
            return `File "${selectedFile.name}" is already added.`;
        }
        return null;
    };

    const addFiles = (newFiles) => {
        setError(null);
        const validFiles = [];
        let errorMsg = null;

        Array.from(newFiles).forEach(file => {
            const validationError = validateFile(file);
            if (validationError) {
                errorMsg = validationError;
            } else {
                validFiles.push(file);
            }
        });

        if (errorMsg) {
            setError(errorMsg);
            toast.error(errorMsg);
        }

        if (validFiles.length > 0) {
            setFiles(prev => [...prev, ...validFiles]);
        }
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            addFiles(e.target.files);
        }
        // Reset input so same file can be selected again if removed
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            addFiles(e.dataTransfer.files);
        }
    };

    const removeFile = (indexToRemove) => {
        setFiles(prev => prev.filter((_, index) => index !== indexToRemove));
        setError(null);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleSubmit = () => {
        if (files.length > 0 && !isUploading) {
            onUpload(files);
        }
    };

    const reset = () => {
        setFiles([]);
        setError(null);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex justify-between items-center mb-6 shrink-0">
                    <h3 className="text-lg font-semibold text-gray-900">Upload Knowledge</h3>
                    <button
                        onClick={reset}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        disabled={isUploading}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto min-h-0 space-y-4">

                    {/* Drop Zone */}
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        className={`
                            border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
                            ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'}
                            ${error ? 'border-red-300 bg-red-50' : ''}
                        `}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleFileSelect}
                            multiple
                        />

                        <div className="flex flex-col items-center gap-2 text-gray-500">
                            <Upload className="w-10 h-10 mb-2 text-gray-400" />
                            <p className="font-medium">Click to browse or drag files here</p>
                            <p className="text-xs text-center text-gray-500 max-w-[200px] leading-relaxed">
                                Supported: All formats (PDF, DOCX, PPT, Excel, Images, Video)
                                <span className="block font-medium text-primary mt-1">(Max 50MB per file)</span>
                            </p>
                        </div>
                    </div>

                    {/* File List */}
                    {files.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-700">Selected Files ({files.length})</p>
                            <div className="grid gap-2">
                                {files.map((f, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 group">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0 text-primary">
                                                <FileText className="w-4 h-4" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">{f.name}</p>
                                                <p className="text-xs text-gray-500">{(f.size / 1024 / 1024).toFixed(2)} MB</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeFile(index)}
                                            className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2 text-sm">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            {error}
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="mt-6 flex justify-end gap-3 shrink-0 pt-4 border-t border-gray-100">
                    <Button variant="secondary" onClick={reset} disabled={isUploading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={files.length === 0 || isUploading}
                        className="min-w-[100px]"
                    >
                        {isUploading ? 'Uploading...' : `Upload ${files.length > 0 ? `(${files.length})` : ''}`}
                    </Button>
                </div>

            </div>
        </div>
    );
};

export default UploadModal;
