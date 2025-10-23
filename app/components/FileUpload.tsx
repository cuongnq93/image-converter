import { useCallback, useRef, useState } from 'react';
import type { ImageMetadata } from '../types/image.types';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  metadata: ImageMetadata | null;
  onReset: () => void;
}

/**
 * File upload component with drag & drop support
 * Enhanced UX with visual feedback
 */
export function FileUpload({
  onFileSelect,
  selectedFile,
  metadata,
  onReset,
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);
      const file = event.dataTransfer.files[0];
      if (file) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const handleDragEnter = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  }, []);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 lg:p-4 transition-all duration-300">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-base sm:text-lg lg:text-lg font-semibold text-gray-900">
          Upload Image
        </h2>
        {selectedFile && (
          <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Ready
          </span>
        )}
      </div>

      {!selectedFile ? (
        <div
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          className={`
            relative border-2 border-dashed rounded-xl p-8 sm:p-12 lg:p-16 text-center cursor-pointer
            transition-all duration-300 ease-in-out transform
            ${isDragging
              ? 'border-blue-500 bg-blue-50 scale-[1.02] shadow-xl'
              : 'border-gray-300 hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50/50 hover:to-indigo-50/50 hover:shadow-lg'
            }
          `}
        >
          {isDragging && (
            <div className="absolute inset-0 flex items-center justify-center bg-blue-50/90 rounded-xl">
              <div className="text-center">
                <svg className="mx-auto h-16 w-16 sm:h-20 sm:w-20 text-blue-500 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-lg sm:text-xl font-semibold text-blue-600 mt-4 sm:mt-6">
                  Drop your image here!
                </p>
              </div>
            </div>
          )}
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center">
            <svg
              className={`w-8 h-8 sm:w-10 sm:h-10 transition-colors ${isDragging ? 'text-blue-600' : 'text-blue-600'}`}
              stroke="currentColor"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2">
            Upload Your Image
          </h3>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-3 sm:mb-4 font-medium">
            Click to browse or drag and drop
          </p>
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-gray-200 rounded-lg text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
            JPEG, PNG, WebP, AVIF, GIF, BMP
          </div>
          <p className="text-xs text-gray-400">
            Maximum file size: 10MB • All processing happens in your browser
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4 animate-fade-in">
          {/* Preview with Loading Effect */}
          <div className="relative rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-inner">
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="Preview"
              className="w-full h-auto max-h-64 sm:max-h-96 object-contain transition-transform duration-300 hover:scale-105"
            />
            <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded-lg px-1.5 sm:px-2 py-0.5 sm:py-1">
              <span className="text-xs text-white font-medium">
                {metadata && `${metadata.width} × ${metadata.height}`}
              </span>
            </div>
          </div>

          {/* Metadata Cards */}
          {metadata && (
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-2 sm:p-3 border border-blue-100">
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs text-gray-600 font-medium">File Name</span>
                </div>
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {metadata.name}
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-2 sm:p-3 border border-purple-100">
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                  </svg>
                  <span className="text-xs text-gray-600 font-medium">File Size</span>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  {formatFileSize(metadata.size)}
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-2 sm:p-3 border border-green-100">
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs text-gray-600 font-medium">Dimensions</span>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  {metadata.width} × {metadata.height}
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-2 sm:p-3 border border-orange-100">
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-xs text-gray-600 font-medium">Format</span>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  {metadata.type.split('/')[1].toUpperCase()}
                </p>
              </div>
            </div>
          )}

          {/* Reset Button with Icon */}
          <button
            onClick={onReset}
            className="w-full py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-all duration-200 hover:shadow-md flex items-center justify-center gap-2 group cursor-pointer"
          >
            <svg className="w-5 h-5 transition-transform group-hover:rotate-180 duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Choose Different Image
          </button>
        </div>
      )}
    </div>
  );
}
