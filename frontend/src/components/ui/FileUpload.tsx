"use client";

import React, { useRef, useState, DragEvent } from "react";
import { Upload, X, File, Image } from "lucide-react";

interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSizeMB?: number;
  onUpload: (files: File[]) => void;
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  accept = "image/*",
  multiple = true,
  maxFiles = 5,
  maxSizeMB = 10,
  onUpload,
  className = "",
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const validateAndAdd = (files: FileList | File[]) => {
    setError(null);
    const fileArray = Array.from(files);

    if (selectedFiles.length + fileArray.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed.`);
      return;
    }

    const oversized = fileArray.find((f) => f.size > maxSizeMB * 1024 * 1024);
    if (oversized) {
      setError(`File "${oversized.name}" exceeds ${maxSizeMB}MB limit.`);
      return;
    }

    const updated = [...selectedFiles, ...fileArray];
    setSelectedFiles(updated);
    onUpload(updated);
  };

  const removeFile = (index: number) => {
    const updated = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updated);
    onUpload(updated);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      validateAndAdd(e.dataTransfer.files);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
          isDragging
            ? "border-brand-500 bg-brand-50"
            : "border-gray-200 hover:border-brand-300 hover:bg-slate-50"
        }`}
      >
        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-xs font-bold text-gray-700">
          Drag & drop files or{" "}
          <span className="text-brand-600 underline">browse</span>
        </p>
        <p className="text-[10px] text-gray-400 mt-1">
          Max {maxFiles} files, up to {maxSizeMB}MB each
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => e.target.files && validateAndAdd(e.target.files)}
        className="hidden"
      />

      {error && (
        <p className="text-[11px] text-rose-600 font-semibold">{error}</p>
      )}

      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          {selectedFiles.map((file, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-gray-100"
            >
              <div className="flex items-center gap-2">
                {file.type.startsWith("image/") ? (
                  <Image className="w-4 h-4 text-indigo-500" />
                ) : (
                  <File className="w-4 h-4 text-gray-400" />
                )}
                <div>
                  <p className="text-[11px] font-bold text-gray-900 truncate max-w-[200px]">
                    {file.name}
                  </p>
                  <p className="text-[10px] text-gray-400">{formatSize(file.size)}</p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(idx);
                }}
                className="p-1 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
