"use client";

import { useState, useRef, useEffect } from "react";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";
import { DocumentIcon } from "@heroicons/react/24/solid";
import { resumeService } from "@/services/api";
import { getErrorMessage } from "@/utils/errorMessage";

const scanMessages = [
    "Analyzing Document...",
    "Extracting Core Skills...",
    "Evaluating Experience Level...",
    "Matching with Live Vacancies...",
    "Finalizing Job Results...",
];

const ResumeUpload = ({ onUploadSuccess, onUploadStart, isAnalyzing }) => {
    const [file, setFile] = useState(null);
    const [error, setError] = useState("");
    const [isDragOver, setIsDragOver] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [scanIdx, setScanIdx] = useState(0);
    const fileInputRef = useRef(null);

    // Cycle through scan messages during upload
    useEffect(() => {
        let iv;
        if (isAnalyzing) {
            setScanIdx(0);
            iv = setInterval(() => setScanIdx((p) => (p < scanMessages.length - 1 ? p + 1 : p)), 2500);
        }
        return () => clearInterval(iv);
    }, [isAnalyzing]);

    // Create object URL for PDF preview
    useEffect(() => {
        if (file?.type === "application/pdf") {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setPreviewUrl(null);
        }
    }, [file]);

    const handleFile = (e) => {
        const f = e.target.files[0];
        if (!f) return;
        const valid = [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/msword",
            "text/plain"
        ];
        if (valid.includes(f.type) || f.name.endsWith('.txt')) {
            setFile(f);
            setError("");
            handleUpload(f);
        } else {
            setError("Please upload a PDF or DOCX file.");
            setFile(null);
        }
    };

    const handleUpload = async (uploadFile) => {
        if (!uploadFile) return;
        if (onUploadStart) onUploadStart();
        setError("");
        
        try {
            const res = await resumeService.uploadResume(uploadFile);
            const data = res.data;
            localStorage.setItem("latestJobResults", JSON.stringify(data));
            if (typeof onUploadSuccess === "function") onUploadSuccess(data);
        } catch (err) {
            setError(getErrorMessage(err, "upload"));
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        const f = e.dataTransfer.files[0];
        if (f) handleFile({ target: { files: [f] } });
    };

    if (isAnalyzing) {
        return (
            <div className="w-full flex flex-col items-center justify-center min-h-[300px] border-2 border-dashed border-border-color rounded-xl bg-surface shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-10">
                <div className="relative rounded-lg overflow-hidden mb-6 transition-all duration-500 bg-surface shadow-md border border-border-color w-48 h-64 scale-105">
                    {previewUrl ? (
                        <iframe
                            src={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                            className="w-full h-full pointer-events-none scale-[1.1] origin-top bg-surface"
                            tabIndex={-1}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-surface">
                            <DocumentIcon className="w-12 h-12 text-primary" />
                        </div>
                    )}
                    {/* Scan animation overlay */}
                    <div className="absolute inset-0 z-10 bg-primary/5" />
                    <div className="absolute left-0 right-0 w-full h-1 z-20 animate-scan bg-primary" style={{ boxShadow: "0 0 8px 2px rgba(37,99,235,0.5)" }} />
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-2">{scanMessages[scanIdx]}</h3>
                <p className="text-primary text-sm font-medium animate-pulse">AI is parsing your skills…</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                className={`relative rounded-xl p-10 flex flex-col items-center justify-center min-h-[300px] cursor-pointer transition-all border-2 border-dashed ${
                    isDragOver ? "border-primary bg-primary/5" : "border-border-color bg-surface hover:bg-gray-50"
                }`}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFile}
                    className="hidden"
                    accept=".pdf,.docx,.doc"
                />

                <div className="flex flex-col items-center text-center">
                    <CloudArrowUpIcon className="w-12 h-12 text-slate-300 mb-4 stroke-[1.5]" />
                    
                    <h3 className="text-xl font-bold mb-2 text-text-primary">
                        Drag & drop your resume
                    </h3>
                    <p className="text-sm text-text-secondary mb-8">
                        PDF or DOCX up to 5MB
                    </p>
                    
                    <button
                        onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                        className="px-6 py-2 rounded-lg text-sm font-medium transition-colors bg-[#eff4fc] text-[#2563EB] hover:bg-blue-100"
                    >
                        Browse File
                    </button>
                </div>
            </div>

            {error && (
                <p className="mt-4 text-center text-sm font-medium text-error bg-red-50 py-2 rounded-lg">{error}</p>
            )}
        </div>
    );
};

export default ResumeUpload;
