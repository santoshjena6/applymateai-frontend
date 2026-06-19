"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CloudArrowUpIcon, DocumentIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { uploadResume } from "@/services/resumeService";

const ResumeUpload = ({ onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [scanMessageIndex, setScanMessageIndex] = useState(0);
    const fileInputRef = useRef(null);
    const router = useRouter();

    const [previewUrl, setPreviewUrl] = useState(null);

    const scanMessages = [
        "Analyzing Document...",
        "Extracting Core Skills...",
        "Evaluating Experience Level...",
        "Matching with Live Vacancies...",
        "Finalizing Job Results..."
    ];

    useEffect(() => {
        let interval;
        if (loading) {
            setScanMessageIndex(0);
            interval = setInterval(() => {
                setScanMessageIndex(prev => prev < scanMessages.length - 1 ? prev + 1 : prev);
            }, 2500);
        }
        return () => clearInterval(interval);
    }, [loading, scanMessages.length]);

    useEffect(() => {
        if (file && file.type === "application/pdf") {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setPreviewUrl(null);
        }
    }, [file]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.type === "application/pdf" ||
                selectedFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
                selectedFile.type === "application/msword") {
                setFile(selectedFile);
                setError("");
            } else {
                setError("Please upload a PDF or DOCX file.");
                setFile(null);
            }
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setLoading(true);
        setError("");

        try {
            const data = await uploadResume(file);
            localStorage.setItem("latestJobResults", JSON.stringify(data));

            if (typeof onUploadSuccess === "function") {
                onUploadSuccess(data);
            } else {
                router.push("/jobs");
            }
        } catch (err) {
            setError("Failed to upload resume. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div
                onClick={() => !loading && fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-[2rem] p-12 transition-all cursor-pointer group flex flex-col items-center justify-center min-h-[400px]
          ${file ? 'border-blue-200 bg-blue-50/20' : 'border-slate-100 bg-white hover:border-blue-200 hover:bg-slate-50/50'}
          ${loading ? 'opacity-90 cursor-not-allowed border-blue-400 bg-blue-50/40 shadow-inner' : ''}
        `}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                />

                <div className="flex flex-col items-center text-center w-full">
                    {file ? (
                        <div className={`relative rounded-xl overflow-hidden shadow-lg border border-slate-200 bg-white transition-all duration-500 mb-8 ${loading ? 'w-48 h-64 shadow-blue-500/20 shadow-2xl scale-110' : 'w-32 h-44 group-hover:scale-105'}`}>
                            {previewUrl ? (
                                <iframe
                                    src={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                                    className="w-full h-full pointer-events-none scale-[1.2] origin-top bg-white"
                                    tabIndex={-1}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-blue-50">
                                    <DocumentIcon className="w-12 h-12 text-blue-600" />
                                </div>
                            )}

                            {loading && (
                                <>
                                    <div className="absolute inset-0 bg-blue-600/10 mix-blend-multiply z-10"></div>
                                    <div className="absolute left-0 right-0 w-full h-[4px] bg-blue-500 shadow-[0_0_20px_6px_rgba(59,130,246,0.7)] z-20 animate-scan"></div>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-8 bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all shadow-sm">
                            <CloudArrowUpIcon className="w-10 h-10" />
                        </div>
                    )}

                    <div className="mt-8 text-center w-full">
                        <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase mb-2">
                            {loading ? scanMessages[scanMessageIndex] : (file ? file.name : "Upload Your Resume")}
                        </h3>
                        <p className={`text-[10px] font-black uppercase tracking-widest leading-relaxed max-w-xs mx-auto transition-colors ${loading ? 'text-blue-600 animate-pulse' : 'text-slate-400'}`}>
                            {loading
                                ? "AI Engine is processing your profile"
                                : (file
                                    ? "Ready to find your match. Click the button below to analyze."
                                    : "Drag and drop or click to upload your PDF or DOCX resume.")
                            }
                        </p>
                    </div>
                </div>
            </div>

            {error && (
                <p className="mt-4 text-center text-rose-500 text-xs font-bold uppercase tracking-widest italic">
                    {error}
                </p>
            )}

            {file && !loading && (
                <div className="mt-8 flex justify-center">
                    <button
                        onClick={handleUpload}
                        className="px-10 py-4 bg-blue-600 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex items-center"
                    >
                        Find Matching Jobs
                    </button>
                </div>
            )}
        </div>
    );
};

export default ResumeUpload;
